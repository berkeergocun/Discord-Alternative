<template>
  <div
    :class="cn(
      'group/dmitem relative flex items-center gap-3 px-2 py-1.5 mx-1 rounded cursor-pointer transition-colors',
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
    
    <!-- Unread Badge ya da Kapat butonu -->
    <div class="shrink-0 flex items-center justify-center w-5 h-5">
      <!-- Unread sayısı (kapat butonu yokken) -->
      <Badge
        v-if="dm.unreadCount && dm.unreadCount > 0"
        variant="notification"
        size="sm"
        class="group-hover/dmitem:hidden"
      >
        {{ dm.unreadCount > 99 ? '99+' : dm.unreadCount }}
      </Badge>

      <!-- Kapat (X) butonu — hover'da görünür -->
      <button
        class="hidden group-hover/dmitem:flex items-center justify-center w-4 h-4 rounded-sm text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
        title="Kapat"
        @click.stop="emit('close')"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
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
  close: []
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
