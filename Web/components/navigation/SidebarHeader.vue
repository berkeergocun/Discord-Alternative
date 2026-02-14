<template>
  <div class="shrink-0">
    <!-- Server Banner (if server type) -->
    <div 
      v-if="type === 'server' && server"
      class="relative h-32 overflow-hidden cursor-pointer"
      @click="handleClick"
    >
      <!-- Banner Image/Color -->
      <div 
        class="absolute inset-0"
        :style="{ 
          backgroundColor: server.bannerColor || '#5865F2',
          backgroundImage: server.banner ? `url(${server.banner})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-secondary/80" />
      
      <!-- Server Info -->
      <div class="relative h-full flex flex-col justify-end p-3">
        <div class="flex items-center gap-2 mb-1">
          <h2 class="font-bold text-white text-lg truncate drop-shadow-lg">{{ title }}</h2>
          <svg 
            class="w-5 h-5 text-white/80 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
        <p v-if="server.description" class="text-white/80 text-xs truncate drop-shadow">
          {{ server.description }}
        </p>
      </div>
    </div>
    
    <!-- Regular Header (for DM or no server) -->
    <div 
      v-else
      class="h-12 border-b border-bg-tertiary px-4 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
      @click="handleClick"
    >
      <h2 class="font-semibold text-text-primary truncate flex-1">{{ title }}</h2>
      
      <!-- Search icon for DM -->
      <button 
        class="p-1 hover:bg-bg-tertiary rounded"
        @click.stop="emit('search', '')"
      >
        <svg class="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Server {
  id: string
  name: string
  icon?: string
  banner?: string
  bannerColor?: string
  description?: string
}

interface Props {
  title: string
  type: 'server' | 'dm'
  server?: Server | null
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
