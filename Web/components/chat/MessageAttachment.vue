<template>
  <div class="max-w-lg">
    <!-- Image -->
    <div v-if="attachment.type === 'image'" class="rounded-lg overflow-hidden border border-bg-secondary">
      <img 
        :src="attachment.url" 
        :alt="attachment.name"
        class="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
        @click="emit('open')"
      />
    </div>
    
    <!-- Video -->
    <div v-else-if="attachment.type === 'video'" class="rounded-lg overflow-hidden border border-bg-secondary">
      <video 
        :src="attachment.url"
        controls
        class="w-full h-auto"
      />
    </div>
    
    <!-- File -->
    <div 
      v-else
      class="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-bg-secondary hover:border-text-muted transition-colors cursor-pointer"
      @click="emit('download')"
    >
      <div class="w-12 h-12 bg-blurple rounded flex items-center justify-center shrink-0">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-text-primary truncate">{{ attachment.name }}</p>
        <p class="text-xs text-text-muted">{{ formatFileSize(attachment.size) }}</p>
      </div>
      
      <svg class="w-6 h-6 text-text-muted shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Attachment {
  id: string
  url: string
  name: string
  type: 'image' | 'video' | 'file'
  size?: number
}

interface Props {
  attachment: Attachment
}

defineProps<Props>()

const emit = defineEmits<{
  'open': []
  'download': []
}>()

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'Unknown size'
  
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
</script>
