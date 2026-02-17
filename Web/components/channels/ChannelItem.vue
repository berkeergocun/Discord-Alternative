<template>
  <div
    :class="cn(
      'group flex items-center gap-1.5 px-2 py-1.5 mx-1 rounded cursor-pointer transition-colors',
      isActive ? 'bg-bg-tertiary/60 text-text-primary' : 'text-text-muted hover:bg-bg-tertiary/40 hover:text-text-secondary'
    )"
    @click="handleClick"
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
    
    <!-- Channel Name with inline badges -->
    <span class="flex-1 flex items-center gap-2 text-sm font-medium min-w-0">
      <span class="truncate">{{ channel.name }}</span>
      
      <!-- Unread Badge (inline with name) -->
      <Badge 
        v-if="channel.unreadCount && channel.unreadCount > 0"
        variant="notification"
        size="sm"
        class="ml-[5px]"
      >
        {{ channel.unreadCount > 99 ? '99+' : channel.unreadCount }}
      </Badge>
    </span>
    
    <!-- Voice Channel Capacity (right-aligned, hidden on hover) -->
    <div v-if="channel.type === 'voice' && channel.maxUsers" class="flex items-center gap-1 text-xs text-text-muted opacity-100 group-hover:opacity-0 transition-opacity">
      <span>{{ String(channel.activeUsers || 0).padStart(2, '0') }}/{{ String(channel.maxUsers).padStart(2, '0') }}</span>
    </div>
    
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
        title="Davet oluştur"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
      </button>
      
      <button 
        class="w-4 h-4 hover:text-text-primary"
        @click.stop="emit('settings')"
        title="Kanal ayarları"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

