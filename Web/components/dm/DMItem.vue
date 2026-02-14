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
        <svg class="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
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
  userId?: string
  owner?: string
  members?: string[]
  lastMessage?: string
  timestamp?: Date
  unreadCount?: number
}

interface Props {
  dm: DM
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

const emit = defineEmits<{
  'click': []
}>()

const displayName = computed(() => {
  if (props.dm.type === 'dm') {
    return props.dm.name || 'Kullanıcı'
  }
  
  // For groups, use the group name directly
  return props.dm.name || 'Grup'
})

const formatTimestamp = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Şimdi'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}dk`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}s`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}g`
  
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}
</script>
