<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col p-2">
        <!-- Friends Tab -->
        <div 
          class="flex items-center gap-3 px-2 py-1.5 mx-1 rounded cursor-pointer hover:bg-bg-tertiary/40 transition-colors mb-2"
          @click="emit('friends')"
        >
          <div class="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span class="text-base font-medium text-text-primary">Arkadaşlar</span>
        </div>
        
        <!-- DM Section Header -->
        <div class="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide">
          Direkt Mesajlar
        </div>
        
        <!-- DM List -->
        <div class="space-y-0.5">
          <!-- loading -->
          <div v-if="isLoading" class="px-2 py-4 text-center text-text-muted text-sm">
            Yükleniyor...
          </div>
          <!-- error -->
          <div v-else-if="error" class="px-2 py-3 text-center text-xs text-red-400">
            {{ error }}
            <button class="block mx-auto mt-1 text-blurple underline" @click="fetchDMs">Tekrar dene</button>
          </div>
          <!-- empty -->
          <div v-else-if="dms.length === 0" class="px-2 py-4 text-center text-text-muted text-sm">
            Henüz direkt mesajın yok.
          </div>
          <!-- list -->
          <DMItem
            v-else
            v-for="dm in visibleDms"
            :key="dm.id"
            :dm="dm"
            :isActive="activeDmId === dm.id"
            @click="handleDmSelect(dm.id)"
            @close="hideDm(dm.id)"
          />
        </div>
      </div>
    </template>
    <template #fallback>
      <DMListSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { messageService } from '~/lib/api'

const props = defineProps<{
  activeDmId?: string | null
}>()

const emit = defineEmits<{
  friends: []
  'dm-select': [id: string]
}>()

// -------- Tip tanımları --------
interface DmChannel {
  id: string
  type: 'dm' | 'group'
  name?: string
  avatar?: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  lastMessage?: string
  timestamp?: Date
  unreadCount?: number
  recipientId?: string
}

const dms = ref<DmChannel[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// ─── Gizlenen DM ID'leri (localStorage'da kalıcı) ─────────────────────────
const HIDDEN_KEY = 'discord_hidden_dms'
const hiddenIds = ref<Set<string>>(
  new Set(JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem(HIDDEN_KEY) ?? '[]') : '[]'))
)

const visibleDms = computed(() => dms.value.filter(d => !hiddenIds.value.has(d.id)))

function hideDm(id: string) {
  hiddenIds.value = new Set([...hiddenIds.value, id])
  localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hiddenIds.value]))
  // Aktif kanal gizleniyorsa /channels/@me ana sayfasına yönlendir
  if (props.activeDmId === id) {
    navigateTo('/channels/@me')
  }
}

// Backend'den DM kanallarını al
async function fetchDMs() {
  isLoading.value = true
  error.value = null
  try {
    const res = await messageService.getDMChannels()
    if (res.success && Array.isArray(res.data)) {
      dms.value = (res.data as any[]).map(normalizeChannel)
    } else {
      error.value = res.error ?? 'DM listesi alınamadı'
    }
  } catch (e: any) {
    error.value = e.message ?? 'Bağlantı hatası'
  } finally {
    isLoading.value = false
  }
}

/** API'den gelen ham kanal nesnesini DMItem formatına dönüştür */
function normalizeChannel(ch: any): DmChannel {
  // Backend'den gelen alan adları: _id, type, recipients?, lastMessage?, ...
  const recipients: any[] = ch.recipients ?? ch.participants ?? []
  const other = recipients[0] // DM'de karşı taraf

  return {
    id: ch._id ?? ch.id,
    type: ch.type === 'group' ? 'group' : 'dm',
    name: ch.name
      ?? other?.displayName
      ?? other?.username
      ?? `Kanal ${(ch._id ?? ch.id)?.slice(-4)}`,
    avatar: ch.iconUrl ?? other?.avatarUrl ?? other?.avatar,
    status: other?.status ?? 'offline',
    lastMessage: ch.lastMessage?.content ?? undefined,
    timestamp: ch.lastMessage?.createdAt
      ? new Date(ch.lastMessage.createdAt)
      : ch.updatedAt
        ? new Date(ch.updatedAt)
        : undefined,
    unreadCount: ch.unreadCount ?? 0,
    recipientId: other?._id ?? other?.id,
  }
}

// WebSocket'ten gelen yeni mesajları yakala → son mesaj & sırayı güncelle
const { on, off } = useWebSocket()

function onNewMessage(data: any) {
  const channelId = data.channelId ?? data.message?.channelId
  if (!channelId) return
  const idx = dms.value.findIndex(d => d.id === channelId)
  if (idx === -1) return

  // Gizliyse yeniden göster
  if (hiddenIds.value.has(channelId)) {
    hiddenIds.value = new Set([...hiddenIds.value].filter(id => id !== channelId))
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hiddenIds.value]))
  }

  const dm = { ...dms.value[idx] }
  dm.lastMessage = data.message?.content ?? dm.lastMessage
  dm.timestamp = new Date(data.message?.createdAt ?? Date.now())
  // Aktif kanal değilse unread artır
  if (props.activeDmId !== channelId) {
    dm.unreadCount = (dm.unreadCount ?? 0) + 1
  }
  // Listenin başına taşı
  dms.value.splice(idx, 1)
  dms.value.unshift(dm)
}

onMounted(() => {
  fetchDMs()
  on('message.create', onNewMessage)
})

onUnmounted(() => {
  off('message.create', onNewMessage)
})

// Aktif kanal değiştiğinde unread sıfırla
watch(() => props.activeDmId, (newId) => {
  if (!newId) return
  const dm = dms.value.find(d => d.id === newId)
  if (dm) dm.unreadCount = 0
})

function handleDmSelect(id: string) {
  emit('dm-select', id)
}
</script>
