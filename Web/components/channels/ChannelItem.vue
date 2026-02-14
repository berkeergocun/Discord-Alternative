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
      <!-- Text Channel (Hashtag) - Simple clean style -->
      <svg v-if="channel.type === 'text'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="9" x2="20" y2="9"/>
        <line x1="4" y1="15" x2="20" y2="15"/>
        <line x1="10" y1="3" x2="8" y2="21"/>
        <line x1="16" y1="3" x2="14" y2="21"/>
      </svg>
      
      <!-- Voice Channel (Speaker) - Discord style -->
      <svg v-else-if="channel.type === 'voice'" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C10.3431 3 9 4.34315 9 6V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V6C15 4.34315 13.6569 3 12 3Z"/>
        <path d="M6.34315 10C6.34315 9.44772 5.89543 9 5.34315 9C4.79086 9 4.34315 9.44772 4.34315 10C4.34315 14.3 7.5 17.8 11.5 18.2V21H8C7.44772 21 7 21.4477 7 22C7 22.5523 7.44772 23 8 23H16C16.5523 23 17 22.5523 17 22C17 21.4477 16.5523 21 16 21H12.5V18.2C16.5 17.8 19.6569 14.3 19.6569 10C19.6569 9.44772 19.2091 9 18.6569 9C18.1046 9 17.6569 9.44772 17.6569 10C17.6569 13.5 15.5 16 12 16C8.5 16 6.34315 13.5 6.34315 10Z"/>
      </svg>
      
      <!-- Announcement Channel (Megaphone) - Clean outline -->
      <svg v-else-if="channel.type === 'announcement'" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5V19L8 14L13 19V5L8 10L3 5Z"/>
        <path d="M13 5V19L18 14V19C18 20.1 18.9 21 20 21C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3C18.9 3 18 3.9 18 5V10L13 5Z"/>
      </svg>
      
      <!-- Forum Channel (Messages) - Simple bubble stack -->
      <svg v-else-if="channel.type === 'forum'" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM18 14H6V12H18V14ZM18 11H6V9H18V11ZM18 8H6V6H18V8Z"/>
      </svg>
      
      <!-- Stage Channel (Broadcast) - Radio waves -->
      <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
      </svg>
    </div>
    
    <!-- Channel Name -->
    <span class="flex-1 text-sm font-medium truncate">
      {{ channel.name }}
    </span>
    
    <!-- Unread Badge (after name) -->
    <Badge 
      v-if="channel.unreadCount && channel.unreadCount > 0"
      variant="notification"
      size="sm"
      class="mr-1"
    >
      {{ channel.unreadCount > 99 ? '99+' : channel.unreadCount }}
    </Badge>
    
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
import { Hash, Volume2, Megaphone, MessageSquare, Radio } from 'lucide-vue-next'

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
