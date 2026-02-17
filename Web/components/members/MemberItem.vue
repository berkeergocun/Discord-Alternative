<template>
  <div 
    class="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-bg-tertiary/40 transition-colors group"
    @click="emit('click')"
  >
    <Avatar
      :src="member.avatar"
      :alt="member.username"
      :fallback="member.username[0]"
      :status="member.status"
      size="sm"
    />
    
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-sm font-medium text-text-primary truncate">
          {{ member.displayName || member.username }}
        </span>
        
        <Badge v-if="member.bot" variant="bot" size="sm">
          BOT
        </Badge>
        
        <!-- Mobile indicator -->
        <svg 
          v-if="member.mobile"
          class="w-3 h-3 text-text-muted shrink-0"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
        </svg>
      </div>
      
      <!-- Custom Status or Activity -->
      <div v-if="member.customStatus || member.activity" class="text-xs text-text-muted truncate mt-0.5">
        {{ member.customStatus || member.activity }}
      </div>
    </div>
  </div>
</template>

