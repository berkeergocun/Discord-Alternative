<template>
  <div
    :class="cn(
      'group flex items-center gap-1.5 px-2 py-1.5 mx-1 rounded cursor-pointer transition-colors',
      isActive ? 'bg-bg-tertiary/60 text-text-primary' : 'text-text-muted hover:bg-bg-tertiary/40 hover:text-text-secondary'
    )"
    @click="emit('click')"
  >
    <!-- Channel Icon -->
    <div class="shrink-0 w-5 h-5 flex items-center justify-center">
      <!-- Text Channel -->
      <svg v-if="channel.type === 'text'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
      </svg>
      
      <!-- Voice Channel -->
      <svg v-else-if="channel.type === 'voice'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
      
      <!-- Announcement Channel -->
      <svg v-else-if="channel.type === 'announcement'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      
      <!-- Forum Channel -->
      <svg v-else-if="channel.type === 'forum'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z"/>
      </svg>
      
      <!-- Stage Channel -->
      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    </div>
    
    <!-- Channel Name -->
    <span class="flex-1 text-sm font-medium truncate">
      {{ channel.name }}
    </span>
    
    <!-- NSFW Badge -->
    <Badge v-if="channel.isNsfw" variant="role" size="sm" class="!bg-accent-red !text-white">
      NSFW
    </Badge>
    
    <!-- Lock Icon -->
    <svg 
      v-if="channel.isLocked"
      class="w-4 h-4 shrink-0"
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
    </svg>
    
    <!-- Active Users (Voice Channels) -->
    <div v-if="channel.type === 'voice' && channel.activeUsers && channel.activeUsers > 0" class="flex items-center gap-1">
      <div class="w-2 h-2 bg-status-online rounded-full" />
      <span class="text-xs">{{ channel.activeUsers }}</span>
    </div>
    
    <!-- Unread Badge -->
    <Badge 
      v-if="channel.unreadCount && channel.unreadCount > 0"
      variant="notification"
      size="sm"
    >
      {{ channel.unreadCount > 99 ? '99+' : channel.unreadCount }}
    </Badge>
    
    <!-- Unread Indicator -->
    <div 
      v-else-if="channel.hasUnread"
      class="w-2 h-2 bg-text-primary rounded-full"
    />
    
    <!-- Hover Actions -->
    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        class="w-4 h-4 hover:text-text-primary"
        @click.stop="emit('invite')"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>
      
      <button 
        class="w-4 h-4 hover:text-text-primary"
        @click.stop="emit('settings')"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'announcement' | 'forum' | 'stage'
  isLocked?: boolean
  isNsfw?: boolean
  unreadCount?: number
  hasUnread?: boolean
  activeUsers?: number
}

interface Props {
  channel: Channel
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false
})

const emit = defineEmits<{
  'click': []
  'invite': []
  'settings': []
}>()
</script>
