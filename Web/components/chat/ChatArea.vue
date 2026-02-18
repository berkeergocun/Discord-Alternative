<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col h-full w-full bg-bg-chat">
        <!-- Channel Header -->
        <ChatHeader
          :title="channelName"
          :description="channelDescription"
          :type="channelType"
          :showMemberList="showMemberList"
          :showUserProfile="showUserProfile"
          :showGroupProfile="showGroupProfile"
          @pins="emit('pins')"
          @threads="emit('threads')"
          @members="emit('members')"
          @toggle-profile="emit('toggle-profile')"
          @search="emit('search')"
        />
        
        <!-- Messages Area -->
        <div ref="listEl" class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <MessageList
            :messages="messages"
            :isLoading="isLoading"
            @load-more="emit('load-more')"
            @reply="handleReply"
            @react="emit('react', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
        
        <!-- Typing Indicator -->
        <TypingIndicator v-if="typingUsers.length > 0" :users="typingUsers" />
        
        <!-- Input Area -->
        <ChatInput
          :placeholder="inputPlaceholder"
          :replyTo="replyTo"
          @send="handleSend"
          @cancel-reply="handleCancelReply"
          @typing="handleTyping"
        />
      </div>
    </template>
    <template #fallback>
      <ChatAreaSkeleton />
    </template>
  </Suspense>
</template>


<script setup lang="ts">
import { messageService } from '~/lib/api'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  channelId?: string          // gerçek kanal ID — yoksa statik mod
  channelName?: string
  channelDescription?: string
  channelType?: 'text' | 'voice' | 'dm' | 'group'
  showMemberList?: boolean
  showUserProfile?: boolean
  showGroupProfile?: boolean
  inputPlaceholder?: string
}>(), {
  channelName: 'direkt-mesaj',
  channelType: 'dm',
  inputPlaceholder: 'Mesaj yaz...',
  showUserProfile: false,
})

const emit = defineEmits<{
  pins: []
  threads: []
  members: []
  'toggle-profile': []
  search: []
  'load-more': []
  reply: [messageId: string]
  react: [data: { messageId: string; emoji: string }]
  edit: [messageId: string]
  delete: [messageId: string]
  send: [message: string]
  'cancel-reply': []
  typing: []
}>()

// ─── Auth ─────────────────────────────────────────────────────────────────────
const { user } = useAuth()

// ─── State ───────────────────────────────────────────────────────────────────
const messages = ref<any[]>([])
const isLoading = ref(false)
const replyTo = ref<{ id?: string; author: { username: string }; content: string } | null>(null)
const typingUsers = ref<string[]>([])
const listEl = ref<HTMLElement | null>(null)
let typingTimeout: ReturnType<typeof setTimeout> | null = null

// ─── Mesaj normalleştirme (api formatı → MessageList formatı) ─────────────────
function normalizeMsg(m: any) {
  const author = m.authorId ?? m.author ?? {}
  return {
    id: m._id ?? m.id,
    content: m.content,
    timestamp: new Date(m.createdAt ?? m.timestamp ?? Date.now()),
    edited: m.edited ?? false,
    replyTo: m.replyToId
      ? { author: m.replyToId.authorId?.username ?? '...', content: m.replyToId.content ?? '' }
      : undefined,
    attachments: m.attachments,
    reactions: m.reactions,
    author: {
      id: author._id ?? author.id ?? 'unknown',
      username: author.username ?? 'Kullanıcı',
      displayName: author.displayName ?? author.username ?? 'Kullanıcı',
      avatar: author.avatarUrl ?? author.avatar,
    },
  }
}

// ─── Mesaj yükle ─────────────────────────────────────────────────────────────
async function fetchMessages() {
  if (!props.channelId) return
  isLoading.value = true
  try {
    const res = await messageService.getMessages(props.channelId, 50)
    if (res.success && Array.isArray(res.data)) {
      // Eski mesajlar önce gelir — API'den ters sırayla gelebilir
      messages.value = [...(res.data as any[])].reverse().map(normalizeMsg)
    }
  } finally {
    isLoading.value = false
    nextTick(scrollToBottom)
  }
}

function scrollToBottom() {
  if (listEl.value) {
    listEl.value.scrollTop = listEl.value.scrollHeight
  }
}

// ─── Mesaj gönder ────────────────────────────────────────────────────────────
async function handleSend(content: string) {
  if (!props.channelId) {
    emit('send', content)
    return
  }
  const tempId = `temp-${Date.now()}`
  // Optimistik güncelleme
  messages.value.push({
    id: tempId,
    content,
    timestamp: new Date(),
    edited: false,
    replyTo: replyTo.value
      ? { author: replyTo.value.author.username, content: replyTo.value.content }
      : undefined,
    author: {
      id: user.value?.id ?? 'me',
      username: user.value?.username ?? 'Sen',
      displayName: user.value?.displayName ?? user.value?.username ?? 'Sen',
      avatar: user.value?.avatar,
    },
  })
  replyTo.value = null
  nextTick(scrollToBottom)

  const res = await messageService.sendMessage(
    props.channelId,
    content,
    replyTo.value?.id,
  )
  if (res.success && res.data) {
    // temp mesajı gerçek mesajla değiştir
    const idx = messages.value.findIndex(m => m.id === tempId)
    if (idx !== -1) messages.value[idx] = normalizeMsg(res.data)
  }
}

// ─── Reply ───────────────────────────────────────────────────────────────────
function handleReply(messageId: string) {
  const msg = messages.value.find(m => m.id === messageId)
  if (msg) {
    replyTo.value = { id: msg.id, author: { username: msg.author.username }, content: msg.content }
  }
  emit('reply', messageId)
}

function handleCancelReply() {
  replyTo.value = null
  emit('cancel-reply')
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function handleTyping() {
  if (!props.channelId) return
  messageService.sendTyping(props.channelId)
  emit('typing')
}

// ─── WebSocket: gerçek zamanlı mesajlar & typing ─────────────────────────────
const { on, off } = useWebSocket()

function onMessageCreate(data: any) {
  if (data.channelId !== props.channelId) return
  const msg = normalizeMsg(data.message)
  // Optimistik mesajla çakışma kontrolü
  const tempIdx = messages.value.findIndex(
    m => m.id?.startsWith('temp-') && m.content === msg.content
  )
  if (tempIdx !== -1) {
    messages.value[tempIdx] = msg
  } else {
    messages.value.push(msg)
  }
  nextTick(scrollToBottom)
}

function onTypingStart(data: any) {
  if (data.channelId !== props.channelId) return
  const uid = data.userId as string
  if (!user.value || uid === user.value.id) return
  if (!typingUsers.value.includes(uid)) {
    typingUsers.value.push(uid)
  }
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    typingUsers.value = typingUsers.value.filter(u => u !== uid)
  }, 10_000)
}

onMounted(() => {
  fetchMessages()
  on('message.create', onMessageCreate)
  on('typing.start', onTypingStart)
})

onUnmounted(() => {
  off('message.create', onMessageCreate)
  off('typing.start', onTypingStart)
  if (typingTimeout) clearTimeout(typingTimeout)
})

// Kanal değiştiğinde mesajları yeniden yükle
watch(() => props.channelId, (newId) => {
  if (newId) {
    messages.value = []
    fetchMessages()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 16px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 8px;
  border: 4px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2E3035;
}
</style>
