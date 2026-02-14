<template>
  <div 
    v-if="server"
    class="relative h-24 shrink-0 overflow-hidden"
    :style="{ backgroundColor: server.bannerColor || '#5865F2' }"
  >
    <!-- Banner Image (if available) -->
    <div 
      v-if="server.banner"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${server.banner})` }"
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
    
    <!-- Server Info -->
    <div class="relative h-full flex items-end px-4 pb-3">
      <div class="flex items-center gap-3">
        <!-- Server Icon -->
        <div class="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 border-4 border-bg-secondary">
          {{ server.name?.[0] || '?' }}
        </div>
        
        <!-- Server Details -->
        <div class="flex-1 min-w-0">
          <h1 class="text-white font-bold text-xl truncate drop-shadow-md">
            {{ server.name }}
          </h1>
          <p v-if="server.description" class="text-white/90 text-sm truncate drop-shadow">
            {{ server.description }}
          </p>
        </div>
      </div>
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
  hasNotification?: boolean
  unreadCount?: number
}

interface Props {
  server?: Server | null
}

defineProps<Props>()
</script>
