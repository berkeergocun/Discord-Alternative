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
      <!-- Text Channel (Hashtag) -->
      <svg v-if="channel.type === 'text'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.88 4.12 13.76 12l-7.88 7.88L8 22l10-10L8 2zm13.76 0L11.76 12l7.88 7.88L18 22 8 12l10-10z" fill="none"/>
        <path d="M10.5 3h-1L8 9H4v2h3.5l-.75 4H3v2h3.25L5 21h1l1.25-4H11l-1.25 4h1l1.25-4H16v-2h-4.25l.75-4H17V9h-4.75L13.5 3h-1l-1.25 6H7.5l1-6zm.25 8-.75 4H6.25l.75-4h3.75z"/>
      </svg>
      
      <!-- Voice Channel (Speaker) -->
      <svg v-else-if="channel.type === 'voice'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.999 3.077c-4.08 0-7.385 3.306-7.385 7.385 0 4.08 3.305 7.385 7.385 7.385 4.08 0 7.385-3.305 7.385-7.385 0-4.079-3.305-7.385-7.385-7.385zm3.693 7.385c0 2.04-1.653 3.693-3.693 3.693s-3.693-1.653-3.693-3.693 1.653-3.693 3.693-3.693 3.693 1.653 3.693 3.693zM6.462 19.847c0-3.054 2.483-5.538 5.537-5.538 3.054 0 5.538 2.484 5.538 5.538h1.846c0-4.08-3.305-7.384-7.384-7.384-4.08 0-7.385 3.304-7.385 7.384h1.848z"/>
      </svg>
      
      <!-- Announcement Channel (Megaphone) -->
      <svg v-else-if="channel.type === 'announcement'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.99 3.99v7.5c0 .83.67 1.5 1.5 1.5H7v5.51c0 .83.67 1.49 1.5 1.49h3c.83 0 1.5-.67 1.5-1.5v-5.5h1.51c.83 0 1.5-.67 1.5-1.5v-7.5c0-.83-.67-1.5-1.5-1.5h-9c-.84 0-1.51.67-1.51 1.5zm10.51 0c0 2.76 2.24 5 5 5v-5c-2.76 0-5-2.24-5-5h-2.5v5zm0 7.5h-2.5v5.5h2.5v-5.5z"/>
      </svg>
      
      <!-- Forum Channel (Chat Bubbles) -->
      <svg v-else-if="channel.type === 'forum'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      
      <!-- Stage Channel (Podium) -->
      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
