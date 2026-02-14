<template>
  <button
    class="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-text-muted hover:text-text-secondary uppercase tracking-wide cursor-pointer group transition-colors"
    @click="emit('toggle')"
  >
    <svg 
      class="w-3 h-3 transition-transform"
      :class="{ 'rotate-0': isCollapsed, 'rotate-90': !isCollapsed }"
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
    <span class="flex-1 text-left">{{ name }}</span>
    
    <!-- Add channel button (shown on hover) -->
    <svg 
      class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
      fill="currentColor" 
      viewBox="0 0 24 24"
      @click.stop="emit('add-channel')"
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
interface Props {
  name: string
  isCollapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  isCollapsed: false
})

const emit = defineEmits<{
  'toggle': []
  'add-channel': []
}>()
</script>
