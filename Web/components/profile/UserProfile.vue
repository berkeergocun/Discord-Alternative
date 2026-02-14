<template>
  <div class="w-80 bg-bg-secondary flex flex-col h-full overflow-y-auto custom-scrollbar">
    <!-- Banner -->
    <div class="relative h-32 bg-gradient-to-br from-blurple to-accent-purple shrink-0">
      <div 
        v-if="user.banner"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${user.banner})` }"
      />
      <div 
        v-else-if="user.bannerColor"
        class="absolute inset-0"
        :style="{ backgroundColor: user.bannerColor }"
      />
    </div>

    <!-- Profile Content -->
    <div class="px-4 pb-4">
      <!-- Avatar (overlapping banner) -->
      <div class="relative -mt-12 mb-4">
        <div class="relative inline-block">
          <Avatar
            :src="user.avatar"
            :alt="user.displayName || user.username"
            :fallback="(user.displayName || user.username)?.[0] || '?'"
            :status="user.status"
            size="xl"
            class="border-8 border-bg-secondary"
          />
        </div>
      </div>

      <!-- User Info -->
      <div class="bg-bg-primary rounded-lg p-4 space-y-3">
        <!-- Username -->
        <div>
          <h3 class="text-xl font-bold text-text-primary">
            {{ user.displayName || user.username }}
          </h3>
          <p class="text-sm text-text-secondary">{{ user.username }}</p>
        </div>

        <!-- Divider -->
        <div class="border-t border-bg-tertiary"></div>

        <!-- Custom Status -->
        <div v-if="user.customStatus" class="space-y-1">
          <h4 class="text-xs font-semibold text-text-primary uppercase">Hakkında</h4>
          <p class="text-sm text-text-secondary">{{ user.customStatus }}</p>
        </div>

        <!-- Member Since -->
        <div class="space-y-1">
          <h4 class="text-xs font-semibold text-text-primary uppercase">Discord'da</h4>
          <p class="text-sm text-text-secondary">{{ formatDate(user.createdAt) }}</p>
        </div>

        <!-- Roles/Badges -->
        <div v-if="user.badges && user.badges.length > 0" class="space-y-1">
          <h4 class="text-xs font-semibold text-text-primary uppercase">Rozetler</h4>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="badge in user.badges"
              :key="badge"
              class="w-6 h-6 rounded bg-bg-tertiary flex items-center justify-center"
              :title="badge"
            >
              <span class="text-xs">{{ getBadgeIcon(badge) }}</span>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="space-y-1">
          <h4 class="text-xs font-semibold text-text-primary uppercase">Not</h4>
          <textarea
            v-model="localNote"
            placeholder="Bu kullanıcı için bir not ekleyin"
            class="w-full px-3 py-2 bg-bg-tertiary text-text-primary text-sm rounded resize-none focus:outline-none focus:ring-1 focus:ring-blurple"
            rows="2"
            @blur="saveNote"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 space-y-2">
        <button
          class="w-full px-4 py-2 bg-accent-green text-white rounded hover:bg-accent-green/90 transition-colors font-medium text-sm"
          @click="emit('call')"
        >
          Sesli Arama
        </button>
        <button
          class="w-full px-4 py-2 bg-bg-primary text-text-primary rounded hover:bg-bg-tertiary transition-colors font-medium text-sm"
          @click="emit('video-call')"
        >
          Görüntülü Arama
        </button>
      </div>

      <!-- More Options -->
      <div class="mt-4 space-y-1">
        <button
          class="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-tertiary rounded transition-colors flex items-center gap-3"
          @click="emit('add-friend')"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Arkadaş Ekle
        </button>
        <button
          class="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-tertiary rounded transition-colors flex items-center gap-3"
          @click="emit('block')"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
          </svg>
          Engelle
        </button>
        <button
          class="w-full px-3 py-2 text-left text-sm text-accent-red hover:bg-bg-tertiary rounded transition-colors flex items-center gap-3"
          @click="emit('remove-friend')"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          Arkadaşlıktan Çıkar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string
  username: string
  displayName?: string
  avatar?: string
  banner?: string
  bannerColor?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  createdAt?: Date
  badges?: string[]
}

interface Props {
  user: User
  note?: string
}

const props = withDefaults(defineProps<Props>(), {
  note: ''
})

const emit = defineEmits<{
  'call': []
  'video-call': []
  'add-friend': []
  'block': []
  'remove-friend': []
  'note-change': [note: string]
}>()

const localNote = ref(props.note)

const formatDate = (date?: Date) => {
  if (!date) return 'Bilinmiyor'
  return date.toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getBadgeIcon = (badge: string) => {
  const icons: Record<string, string> = {
    'early_supporter': '🎖️',
    'verified': '✓',
    'staff': '🛡️',
    'partner': '🤝',
    'hypesquad': '⚡',
    'bug_hunter': '🐛',
    'premium': '💎'
  }
  return icons[badge] || '⭐'
}

const saveNote = () => {
  emit('note-change', localNote.value)
}

watch(() => props.note, (newNote) => {
  localNote.value = newNote
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2A2B2E;
}
</style>
