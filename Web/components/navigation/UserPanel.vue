<template>
  <div class="h-[52px] bg-bg-tertiary px-2 py-2 flex items-center gap-2">
    <!-- User Avatar and Info -->
    <div class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:bg-bg-secondary/50 rounded p-1 -ml-1 transition-colors">
      <Avatar
        :src="user.avatar"
        :alt="user.username"
        :fallback="user.username[0]"
        :status="user.status"
        size="sm"
      />
      
      <div class="flex flex-col min-w-0 flex-1">
        <span class="text-sm font-semibold text-text-primary truncate">
          {{ user.displayName || user.username }}
        </span>
        <span v-if="user.customStatus" class="text-xs text-text-secondary truncate">
          {{ user.customStatus }}
        </span>
      </div>
    </div>
    
    <!-- Control Buttons -->
    <div class="flex items-center gap-1">
      <!-- Mute/Unmute -->
      <button
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors"
        :class="{ 'text-accent-red': isMuted }"
        @click="toggleMute"
      >
        <svg v-if="!isMuted" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C10.3 2 9 3.3 9 5V12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12V5C15 3.3 13.7 2 12 2Z"/>
          <path d="M19 11C19 10.4 18.6 10 18 10C17.4 10 17 10.4 17 11C17 13.8 14.8 16 12 16C9.2 16 7 13.8 7 11C7 10.4 6.6 10 6 10C5.4 10 5 10.4 5 11C5 14.5 7.6 17.4 11 17.9V21H13V17.9C16.4 17.4 19 14.5 19 11Z"/>
        </svg>
        <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3L21 21M9 9V12C9 13.7 10.3 15 12 15C12.2 15 12.5 15 12.7 14.9M15 12V5C15 3.3 13.7 2 12 2C10.3 2 9 3.3 9 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M17 11C17 10.4 17.4 10 18 10C18.6 10 19 10.4 19 11C19 14.5 16.4 17.4 13 17.9V21H11V17.9C8.2 17.5 6 15.1 5.2 12M7 11C7 11.3 7 11.7 7.1 12"/>
        </svg>
      </button>
      
      <!-- Deafen/Undeafen -->
      <button
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors"
        :class="{ 'text-accent-red': isDeafened }"
        @click="toggleDeafen"
      >
        <svg v-if="!isDeafened" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18V12C3 7.6 6.6 4 11 4H13C17.4 4 21 7.6 21 12V18C21 19.1 20.1 20 19 20H18V14H20V12C20 8.1 16.9 5 13 5H11C7.1 5 4 8.1 4 12V14H6V20H5C3.9 20 3 19.1 3 18Z"/>
        </svg>
        <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3L21 21M6 14V12C6 8.1 9.1 5 13 5C14.5 5 15.9 5.5 17 6.4M18 9.3C18.6 10.4 19 11.7 19 13V15H17V13C17 12.3 16.9 11.6 16.7 11M4 14H6V20H5C3.9 20 3 19.1 3 18V12C3 11.3 3.1 10.7 3.3 10M18 20H19C20.1 20 21 19.1 21 18V12C21 11.6 20.9 11.2 20.8 10.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
        </svg>
      </button>
      
      <!-- Settings -->
      <button
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-secondary"
        @click="emit('settings')"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string
  username: string
  displayName?: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
}

interface Props {
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  'settings': []
  'voice-settings': []
}>()

const isMuted = ref(false)
const isDeafened = ref(false)

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (!isMuted.value && isDeafened.value) {
    isDeafened.value = false
  }
}

const toggleDeafen = () => {
  isDeafened.value = !isDeafened.value
  if (isDeafened.value && !isMuted.value) {
    isMuted.value = true
  }
}
</script>
