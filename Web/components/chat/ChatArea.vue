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
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <MessageList
            :messages="messages"
            :isLoading="isLoading"
            @load-more="emit('load-more')"
            @reply="emit('reply', $event)"
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
          @send="emit('send', $event)"
          @cancel-reply="emit('cancel-reply')"
          @typing="emit('typing')"
        />
      </div>
    </template>
    <template #fallback>
      <ChatAreaSkeleton />
    </template>
  </Suspense>
</template>


<script setup lang="ts">
const props = withDefaults(defineProps<{
  channelName?: string
  channelDescription?: string
  channelType?: 'text' | 'voice' | 'dm' | 'group'
  showMemberList?: boolean
  showUserProfile?: boolean
  showGroupProfile?: boolean
  inputPlaceholder?: string
  staticMessages?: any[]
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

const replyTo = ref<{ author: { username: string }; content: string } | null>(null)
const typingUsers = ref<string[]>([])
const isLoading = ref(false)

// Statik mesajlar (sonra backend'den gelecek)
const messages = computed(() => props.staticMessages ?? [
  {
    id: '1',
    content: 'Merhaba! Nasılsın?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    author: { id: 'u1', username: 'Ali Yılmaz', displayName: 'Ali Yılmaz' },
  },
  {
    id: '2',
    content: 'İyiyim teşekkür ederim! Sen nasılsın?',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    author: { id: 'u2', username: 'sen', displayName: 'Sen' },
  },
  {
    id: '3',
    content: 'Proje için yardımına ihtiyacım var, müsait misin?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    author: { id: 'u1', username: 'Ali Yılmaz', displayName: 'Ali Yılmaz' },
  },
  {
    id: '4',
    content: 'Tabii ki! Ne konuda?',
    timestamp: new Date(Date.now() - 23 * 60 * 1000),
    author: { id: 'u2', username: 'sen', displayName: 'Sen' },
  },
  {
    id: '5',
    content: 'API entegrasyonu hakkında bazı sorularım vardı, bu konuda deneyimin var mı?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    author: { id: 'u1', username: 'Ali Yılmaz', displayName: 'Ali Yılmaz' },
  },
  {
    id: '6',
    content: 'Evet, birkaç proje yaptım bu konuda. Söyle bakalım.',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    author: { id: 'u2', username: 'sen', displayName: 'Sen' },
  },
])

function handleSend(msg: string) {
  emit('send', msg)
}

function handleReply(messageId: string) {
  const msg = messages.value.find(m => m.id === messageId)
  if (msg) {
    replyTo.value = { author: { username: msg.author.username }, content: msg.content }
  }
}

function handleCancelReply() {
  replyTo.value = null
  emit('cancel-reply')
}
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
