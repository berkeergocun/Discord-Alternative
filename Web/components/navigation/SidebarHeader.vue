<template>
  <div class="shrink-0 relative">
    <!-- Server Header with Banner (if server type) -->
    <div v-if="type === 'server' && server" class="relative">
      <!-- Banner (Always Visible) -->
      <div class="relative h-32 overflow-hidden">
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
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-bg-secondary/80" />
        
        <!-- Server Name Header (Overlaid on banner) -->
        <div 
          class="absolute top-0 left-0 right-0 h-12 px-4 flex items-center justify-between cursor-pointer hover:bg-black/20 transition-colors"
          @click="toggleMenu"
          ref="headerRef"
        >
          <h2 class="font-semibold text-white truncate flex-1 drop-shadow-lg">{{ title }}</h2>
          
          <!-- Dropdown icon -->
          <ChevronDown 
            :size="20"
            :stroke-width="2.5"
            class="text-white/90 drop-shadow"
          />
        </div>
        
        <!-- Server Description -->
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <p v-if="server.description" class="text-white/95 text-xs truncate drop-shadow font-medium">
            {{ server.description }}
          </p>
        </div>
      </div>
      
      <div class="border-b border-bg-tertiary" />
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
    
    <!-- Server Menu Dropdown -->
    <ServerMenu
      :isOpen="isMenuOpen"
      :position="menuPosition"
      @close="isMenuOpen = false"
    />
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

const isMenuOpen = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const headerRef = ref<HTMLElement | null>(null)

const handleClick = () => {
  emit('menu-click')
}

const toggleMenu = () => {
  if (headerRef.value) {
    const rect = headerRef.value.getBoundingClientRect()
    menuPosition.value = {
      top: rect.bottom + 4,
      left: rect.left + 4
    }
  }
  isMenuOpen.value = !isMenuOpen.value
}
</script>
