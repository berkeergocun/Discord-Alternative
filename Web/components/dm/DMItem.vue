<template>
  <div
    :class="cn(
      'flex items-center gap-3 px-2 py-1.5 mx-1 rounded cursor-pointer transition-colors',
      isActive ? 'bg-bg-tertiary/60 text-text-primary' : 'hover:bg-bg-tertiary/40 text-text-secondary'
    )"
    @click="emit('click')"
  >
    <!-- Avatar -->
    <div class="relative shrink-0">
      <Avatar
        v-if="dm.type === 'dm'"
        :src="dm.avatar"
        :alt="dm.name || 'User'"
        :fallback="dm.name?.[0] || '?'"
        :status="dm.status"
        size="sm"
      />
      
      <!-- Group DM Avatar -->
      <div v-else class="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center">
        <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
    </div>
    
    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <span class="text-base font-medium truncate">
          {{ displayName }}
        </span>
        
        <span v-if="dm.timestamp" class="text-xs text-text-muted shrink-0">
          {{ formatTimestamp(dm.timestamp) }}
        </span>
      </div>
      
      <p v-if="dm.lastMessage" class="text-sm text-text-muted truncate">
        {{ dm.lastMessage }}
      </p>
    </div>
    
    <!-- Unread Badge -->
    <Badge 
      v-if="dm.unreadCount && dm.unreadCount > 0"
      variant="notification"
      size="sm"
      class="shrink-0"
    >
      {{ dm.unreadCount > 99 ? '99+' : dm.unreadCount }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

interface DM {
  id: string
  type: 'dm' | 'group'
  name?: string
  avatar?: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  lastMessage?: string
  timestamp?: Date | string
  unreadCount?: number
}

const props = defineProps<{
  dm: DM
  isActive?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const displayName = computed(() => props.dm.name || 'Bilinmeyen Kullanıcı')

function formatTimestamp(timestamp: Date | string | undefined): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return minutes <= 1 ? 'Şimdi' : `${minutes}dk`
  if (hours < 24) return `${hours}s`
  if (days < 7) return `${days}g`
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}
</script>
