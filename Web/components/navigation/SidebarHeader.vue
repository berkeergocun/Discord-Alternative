<template>
  <div 
    class="h-12 border-b border-bg-tertiary px-4 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
    @click="handleClick"
  >
    <h2 class="font-semibold text-text-primary truncate flex-1">{{ title }}</h2>
    
    <!-- Dropdown icon for server -->
    <svg 
      v-if="type === 'server'"
      class="w-5 h-5 text-text-secondary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7 10l5 5 5-5z"/>
    </svg>
    
    <!-- Search icon for DM -->
    <button 
      v-else
      class="p-1 hover:bg-bg-tertiary rounded"
      @click.stop="emit('search', '')"
    >
      <svg class="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  type: 'server' | 'dm'
}

defineProps<Props>()

const emit = defineEmits<{
  'menu-click': []
  'search': [query: string]
}>()

const handleClick = () => {
  emit('menu-click')
}
</script>
