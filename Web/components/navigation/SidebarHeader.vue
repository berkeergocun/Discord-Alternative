<template>
  <div class="shrink-0">
    <!-- Server Header with Banner (if server type) -->
    <div v-if="type === 'server' && server" class="border-b border-bg-tertiary">
      <!-- Server Name Header (Always Visible) -->
      <div 
        class="h-12 px-4 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary/50 transition-colors bg-transparent"
        @click="toggleBanner"
      >
        <h2 class="font-semibold text-text-primary truncate flex-1">{{ title }}</h2>
        
        <!-- Dropdown icon -->
        <ChevronDown 
          :size="20"
          :stroke-width="2.5"
          :class="[
            'text-text-secondary transition-transform',
            isBannerOpen ? 'rotate-180' : ''
          ]"
        />
      </div>
      
      <!-- Collapsible Banner -->
      <div 
        v-show="isBannerOpen"
        class="relative h-24 overflow-hidden"
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
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-bg-secondary/60" />
        
        <!-- Server Description -->
        <div class="relative h-full flex items-end p-3">
          <p v-if="server.description" class="text-white/90 text-xs truncate drop-shadow font-medium">
            {{ server.description }}
          </p>
        </div>
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
        <Search :size="20" :stroke-width="2.5" class="text-text-secondary" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Search } from 'lucide-vue-next'

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

const props = defineProps<Props>()

const emit = defineEmits<{
  'menu-click': []
  'search': [query: string]
}>()

const isBannerOpen = ref(true)

const handleClick = () => {
  emit('menu-click')
}

const toggleBanner = () => {
  if (props.type === 'server') {
    isBannerOpen.value = !isBannerOpen.value
  } else {
    handleClick()
  }
}
</script>
