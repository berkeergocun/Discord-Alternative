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
          :key="tab"
          :class="cn(
            'px-2 py-1 text-sm font-medium rounded transition-colors',
            activeTab === tab
              ? 'bg-bg-secondary text-text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50'
          )"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      
      <div class="flex-1" />
      
      <!-- Toggle Activity Feed Button -->
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('toggle-activity')"
        :title="showActivityFeed ? 'Aktiviteleri Gizle' : 'Aktiviteleri Göster'"
      >
        <Users :size="24" :stroke-width="2" />
      </button>
      
      <button class="hidden md:block px-3 py-1.5 bg-accent-green text-white text-sm font-medium rounded hover:bg-accent-green/90 transition-colors">
        Arkadaş Ekle
      </button>
    </div>
    
    <!-- Search Bar -->
    <div class="px-4 pt-3 pb-2">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Ara"
        class="w-full px-3 py-2 bg-bg-tertiary text-text-primary text-sm rounded border border-transparent focus:border-blurple outline-none placeholder:text-text-muted"
      />
    </div>
    
    <!-- Friends List -->
    <div class="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
      <div class="space-y-4">
        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          class="flex items-center justify-between p-4 rounded-lg border-t border-bg-secondary hover:bg-bg-secondary/50 transition-colors"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <Avatar
              :src="friend.avatar"
              :alt="friend.username"
              :fallback="friend.username[0]"
              :status="friend.status"
              size="lg"
            />
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-text-primary">
                  {{ friend.displayName || friend.username }}
                </span>
                <Badge v-if="friend.bot" variant="bot" size="sm">
                  BOT
                </Badge>
              </div>
              <p class="text-sm text-text-muted truncate">
                {{ getStatusText(friend) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-bg-tertiary hover:bg-bg-floating text-text-secondary hover:text-text-primary transition-colors"
              @click="emit('start-dm', getDmForFriend(friend.id))"
              title="Mesaj Gönder"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
            
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-bg-tertiary hover:bg-bg-floating text-text-secondary hover:text-text-primary transition-colors"
              title="Daha Fazla"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredFriends.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <p class="text-text-secondary">Hiç arkadaş bulunamadı</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Users } from 'lucide-vue-next'

interface Friend {
  id: string
  username: string
  displayName?: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  activity?: string
  bot?: boolean
}

interface Props {
  friends: Friend[]
  showActivityFeed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActivityFeed: true
})

const emit = defineEmits<{
  'start-dm': [dmId: string]
  'toggle-activity': []
}>()

const tabs = ['Çevrimiçi', 'Tümü', 'Bekleyen', 'Engellenen']
const activeTab = ref('Çevrimiçi')
const searchQuery = ref('')

const filteredFriends = computed(() => {
  let filtered = props.friends

  // Filter by tab
  if (activeTab.value === 'Çevrimiçi') {
    filtered = filtered.filter(f => f.status !== 'offline')
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(f =>
      f.username.toLowerCase().includes(query) ||
      f.displayName?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getStatusText = (friend: Friend) => {
  if (friend.bot) return 'Bot'
  
  switch (friend.status) {
    case 'online':
      return friend.activity || 'Çevrimiçi'
    case 'idle':
      return 'Boşta'
    case 'dnd':
      return 'Rahatsız Etmeyin'
    case 'offline':
      return 'Çevrimdışı'
    default:
      return ''
  }
}

const getDmForFriend = (friendId: string) => {
  // Find or create DM ID for this friend
  return `dm${friendId.replace('user', '')}`
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
