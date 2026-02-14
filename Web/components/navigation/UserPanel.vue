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
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path v-if="!isMuted" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path v-else d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      </button>
      
      <!-- Deafen/Undeafen -->
      <button
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors"
        :class="{ 'text-accent-red': isDeafened }"
        @click="toggleDeafen"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path v-if="!isDeafened" d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
          <path v-else d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4v1h-4.18C14.4 20.84 13.3 21 12 21c-1.3 0-2.4-.16-3.82-.82L7.3 21.3c1.23.82 2.7 1.32 4.7 1.32s3.47-.5 4.7-1.32l-.88-1.12C17.6 19.84 18.7 19.68 20 19.68V19c0-1.66-1.34-3-3-3h-2v-6h4c0-4.97-4.03-9-9-9z"/>
        </svg>
      </button>
      
      <!-- Settings -->
      <button
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-secondary"
        @click="emit('settings')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
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
