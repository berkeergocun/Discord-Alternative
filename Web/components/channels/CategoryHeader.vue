<template>
  <button
    class="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-text-muted hover:text-text-secondary uppercase tracking-wide cursor-pointer group transition-colors"
    @click="emit('toggle')"
  >
    <svg 
      class="w-3 h-3 transition-transform"
      :class="{ 'rotate-0': isCollapsed, 'rotate-90': !isCollapsed }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="9 18 15 12 9 6"/>
    </svg>
    <span class="flex-1 text-left">{{ name }}</span>
    
    <!-- Add channel button (shown on hover) -->
    <svg 
      class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      @click.stop="emit('add-channel')"
    >
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
</template>

