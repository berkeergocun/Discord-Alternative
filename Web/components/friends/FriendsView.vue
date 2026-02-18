<template>
  <div class="flex-1 flex flex-col bg-bg-chat h-full">
    <!-- Header -->
    <div class="h-12 border-b border-bg-tertiary px-4 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <h3 class="text-base font-semibold text-text-primary">Arkadaşlar</h3>
      </div>

      <div class="h-6 w-px bg-bg-tertiary" />

      <!-- Tabs -->
      <div class="flex items-center gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-2 py-1 text-sm font-medium rounded transition-colors',
            activeTab === tab.key
              ? 'bg-bg-secondary text-text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50',
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span v-if="tab.key === 'pending' && pendingCount > 0" class="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
            {{ pendingCount }}
          </span>
        </button>
      </div>

      <div class="flex-1" />

      <button
        class="hidden md:block px-3 py-1.5 bg-accent-green text-white text-sm font-medium rounded hover:bg-accent-green/90 transition-colors"
        @click="showAddFriend = !showAddFriend"
      >
        Arkadaş Ekle
      </button>
    </div>

    <!-- Add Friend bar -->
    <div v-if="showAddFriend" class="px-8 pt-3 pb-2 border-b border-bg-tertiary">
      <p class="text-xs text-text-muted uppercase font-semibold mb-2">Arkadaş Ekle</p>
      <div class="flex gap-2">
        <input
          v-model="addFriendUsername"
          type="text"
          placeholder="kullaniciadi veya user@example.com"
          class="flex-1 px-3 py-2 bg-bg-tertiary text-text-primary text-sm rounded border border-transparent focus:border-blurple outline-none placeholder:text-text-muted"
          @keyup.enter="sendFriendRequest"
        />
        <button
          class="px-4 py-2 bg-blurple text-white text-sm font-medium rounded hover:bg-blurple/90 transition-colors disabled:opacity-50"
          :disabled="!addFriendUsername.trim() || addFriendLoading"
          @click="sendFriendRequest"
        >
          {{ addFriendLoading ? '...' : 'Gönder' }}
        </button>
      </div>
      <p v-if="addFriendError" class="mt-1 text-xs text-red-400">{{ addFriendError }}</p>
      <p v-if="addFriendSuccess" class="mt-1 text-xs text-accent-green">{{ addFriendSuccess }}</p>
    </div>

    <!-- Search Bar -->
    <div class="px-8 pt-4 pb-2">
      <input
        v-model="search"
        type="text"
        placeholder="Ara"
        class="w-full px-3 py-2 bg-bg-tertiary text-text-primary text-sm rounded border border-transparent focus:border-blurple outline-none placeholder:text-text-muted"
      />
    </div>

    <!-- Friends List -->
    <div class="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
      <!-- Loading -->
      <div v-if="isLoading" class="py-12 text-center text-text-muted text-sm">Yükleniyor...</div>

      <!-- Section label -->
      <p v-else-if="displayList.length > 0" class="text-xs text-text-muted uppercase font-semibold mb-2">
        {{ activeTab === 'pending' ? `Bekleyen — ${displayList.length}` : `${currentTabLabel} — ${displayList.length}` }}
      </p>

      <!-- Empty -->
      <div v-else-if="!isLoading" class="py-12 text-center">
        <p class="text-text-muted text-sm">
          {{ activeTab === 'pending' ? 'Bekleyen istek yok.' : 'Bu listede kimse yok.' }}
        </p>
      </div>

      <!-- List -->
      <div class="space-y-0.5">
        <!-- Pending requests -->
        <template v-if="activeTab === 'pending'">
          <div
            v-for="req in displayList"
            :key="req.id"
            class="flex items-center justify-between p-3 rounded-lg border-t border-bg-secondary hover:bg-bg-secondary/50 transition-colors group"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="relative">
                <div class="w-8 h-8 rounded-full bg-blurple flex items-center justify-center text-white font-semibold text-sm">
                  {{ (req.name ?? req.username)?.[0]?.toUpperCase() ?? '?' }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-sm font-semibold text-text-primary">{{ req.name ?? req.username }}</span>
                <p class="text-xs text-text-muted">{{ req.direction === 'incoming' ? 'Gelen istek' : 'Giden istek' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button v-if="req.direction === 'incoming'" class="p-2 bg-bg-secondary rounded-full hover:bg-accent-green/20 text-accent-green transition-colors" title="Kabul Et" @click="acceptRequest(req.id)">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </button>
              <button class="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors" title="Reddet" @click="declineRequest(req.id)">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
          </div>
        </template>

        <!-- Friends -->
        <template v-else>
          <div
            v-for="friend in displayList"
            :key="friend.id"
            class="flex items-center justify-between p-3 rounded-lg border-t border-bg-secondary hover:bg-bg-secondary/50 transition-colors group"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="relative">
                <img
                  v-if="friend.avatar"
                  :src="friend.avatar"
                  :alt="friend.name"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div v-else class="w-8 h-8 rounded-full bg-blurple flex items-center justify-center text-white font-semibold text-sm">
                  {{ friend.name?.[0]?.toUpperCase() ?? '?' }}
                </div>
                <!-- Status dot -->
                <div :class="['absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-chat', statusDot(friend.status)]" />
              </div>

              <div class="flex-1 min-w-0">
                <span class="text-sm font-semibold text-text-primary">{{ friend.name }}</span>
                <p class="text-xs text-text-muted truncate">{{ statusLabel(friend.status) }}{{ friend.customStatus ? ` — ${friend.customStatus}` : '' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors"
                title="Mesaj Gönder"
                @click="openDM(friend)"
              >
                <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
              <button class="p-2 rounded-full hover:bg-bg-secondary transition-colors" title="Daha fazla">
                <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userService, messageService } from '~/lib/api'

// ─── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'online', label: 'Çevrimiçi' },
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Bekleyen' },
  { key: 'blocked', label: 'Engellenen' },
] as const

type Tab = typeof tabs[number]['key']
const activeTab = ref<Tab>('online')

const currentTabLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label ?? '')

// ─── State ───────────────────────────────────────────────────────────────────
const friends = ref<any[]>([])
const pendingRequests = ref<any[]>([])
const blockedUsers = ref<any[]>([])
const isLoading = ref(false)
const search = ref('')
const showAddFriend = ref(false)
const addFriendUsername = ref('')
const addFriendLoading = ref(false)
const addFriendError = ref('')
const addFriendSuccess = ref('')

// ─── Fetch ───────────────────────────────────────────────────────────────────
async function fetchFriends() {
  isLoading.value = true
  try {
    const res = await userService.getFriends()
    if (res.success && Array.isArray(res.data)) {
      friends.value = (res.data as any[]).map(normalizeFriend)
    }
  } finally {
    isLoading.value = false
  }
}

async function fetchPending() {
  try {
    const res = await userService.getPendingRequests()
    if (res.success && Array.isArray(res.data)) {
      pendingRequests.value = (res.data as any[]).map(r => ({
        id: r._id ?? r.id,
        direction: r.direction ?? (r.senderId ? 'incoming' : 'outgoing'),
        name: r.displayName ?? r.username ?? r.senderUsername ?? r.recipientUsername,
        username: r.username ?? r.senderUsername ?? r.recipientUsername,
      }))
    }
  } catch {/* ignore */}
}

function normalizeFriend(f: any) {
  return {
    id: f._id ?? f.id ?? f.friendId,
    userId: f.userId ?? f.friendId ?? f._id ?? f.id,
    name: f.displayName ?? f.username,
    username: f.username,
    avatar: f.avatarUrl ?? f.avatar,
    status: f.status ?? 'offline',
    customStatus: f.customStatus,
  }
}

// ─── Computed list ───────────────────────────────────────────────────────────
const pendingCount = computed(() => pendingRequests.value.length)

const displayList = computed(() => {
  if (activeTab.value === 'pending') {
    return pendingRequests.value.filter(r =>
      !search.value || r.name?.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  const filtered = friends.value.filter(f => {
    if (search.value && !f.name?.toLowerCase().includes(search.value.toLowerCase())) return false
    if (activeTab.value === 'online') return f.status !== 'offline'
    return true
  })
  return filtered
})

// ─── Actions ─────────────────────────────────────────────────────────────────
async function sendFriendRequest() {
  if (!addFriendUsername.value.trim()) return
  addFriendLoading.value = true
  addFriendError.value = ''
  addFriendSuccess.value = ''

  try {
    // API şu an userId gerektirir — önce kullanıcı ara (username ile)
    // Burada doğrudan username gönderiyoruz; backend desteklemiyorsa hata mesajı gösterilecek
    const res = await userService.sendFriendRequest(addFriendUsername.value.trim())
    if (res.success) {
      addFriendSuccess.value = 'Arkadaşlık isteği gönderildi!'
      addFriendUsername.value = ''
      fetchPending()
    } else {
      addFriendError.value = res.error ?? 'İstek gönderilemedi.'
    }
  } catch (e: any) {
    addFriendError.value = e.message ?? 'Bağlantı hatası.'
  } finally {
    addFriendLoading.value = false
  }
}

async function acceptRequest(requestId: string) {
  await userService.acceptFriendRequest(requestId)
  pendingRequests.value = pendingRequests.value.filter(r => r.id !== requestId)
  await fetchFriends()
  // Bekleyen istek kalmadıysa Tümü sekmesine geç
  if (pendingRequests.value.length === 0) {
    activeTab.value = 'all'
  }
}

async function declineRequest(requestId: string) {
  await userService.declineFriendRequest(requestId)
  pendingRequests.value = pendingRequests.value.filter(r => r.id !== requestId)
  await fetchPending()
}

async function openDM(friend: any) {
  // DM kanalı oluştur/bul ve yönlendir
  const res = await messageService.createDMChannel(friend.userId ?? friend.id)
  if (res.success && res.data) {
    const channelId = (res.data as any)._id ?? (res.data as any).id
    navigateTo(`/channels/@me/${channelId}`)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function statusDot(status: string) {
  return {
    online: 'bg-accent-green',
    idle: 'bg-yellow-400',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  }[status] ?? 'bg-gray-500'
}

function statusLabel(status: string) {
  return {
    online: 'Çevrimiçi',
    idle: 'Boşta',
    dnd: 'Rahatsız Etme',
    offline: 'Çevrimdışı',
  }[status] ?? 'Çevrimdışı'
}

// ─── Presence WebSocket ───────────────────────────────────────────────────────
const { on, off } = useWebSocket()

function onPresenceUpdate(data: any) {
  const friend = friends.value.find(f => f.id === data.userId || f.userId === data.userId)
  if (friend) {
    friend.status = data.status
    friend.customStatus = data.customStatus
  }
}

onMounted(() => {
  fetchFriends()
  fetchPending()
  on('presence.update', onPresenceUpdate)
})

onUnmounted(() => {
  off('presence.update', onPresenceUpdate)
})

watch(activeTab, (tab) => {
  if (tab === 'pending') fetchPending()
})
</script>

