<template>
  <div class="h-12 border-b border-bg-tertiary px-4 flex items-center justify-between">
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <!-- Channel Icon -->
      <svg 
        v-if="type === 'text'"
        class="w-6 h-6 text-text-muted shrink-0" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
      </svg>
      
      <svg 
        v-else-if="type === 'voice'"
        class="w-6 h-6 text-text-muted shrink-0" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
      </svg>
      
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-text-primary truncate">
          {{ title }}
        </h3>
        <p v-if="description" class="text-xs text-text-muted truncate">
          {{ description }}
        </p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('threads')"
        title="Konular"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z"/>
        </svg>
      </button>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('pins')"
        title="Sabitlenmiş Mesajlar"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
        </svg>
      </button>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('members')"
        title="Üyeler"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      </button>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('search')"
        title="Ara"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  type: 'text' | 'voice' | 'dm'
}

defineProps<Props>()

const emit = defineEmits<{
  'pins': []
  'threads': []
  'members': []
  'search': []
}>()
</script>
