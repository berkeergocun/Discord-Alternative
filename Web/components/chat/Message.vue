<template>
  <div 
    class="group/message relative py-0.5"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Reply Preview -->
    <div v-if="message.replyTo" class="flex items-center gap-2 mb-1 text-xs text-text-muted">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
      </svg>
      <span class="font-medium">{{ message.replyTo.author }}</span>
      <span class="truncate">{{ message.replyTo.content }}</span>
    </div>
    
    <!-- Message Content -->
    <div class="flex items-start gap-2">
      <!-- Timestamp for grouped messages -->
      <span 
        v-if="showTimestamp"
        class="text-xs text-text-muted opacity-0 group-hover/message:opacity-100 transition-opacity w-12 text-right shrink-0"
      >
        {{ message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }}
      </span>
      
      <div class="flex-1 min-w-0">
        <!-- Text Content -->
        <div class="text-sm text-text-primary break-words whitespace-pre-wrap">
          {{ message.content }}
          <span v-if="message.edited" class="text-xs text-text-muted ml-1">(düzenlendi)</span>
        </div>
        
        <!-- Attachments -->
        <div v-if="message.attachments && message.attachments.length > 0" class="mt-2 space-y-2">
          <MessageAttachment
            v-for="attachment in message.attachments"
            :key="attachment.id"
            :attachment="attachment"
          />
        </div>
        
        <!-- Reactions -->
        <div v-if="message.reactions && message.reactions.length > 0" class="flex flex-wrap gap-1 mt-2">
          <button
            v-for="reaction in message.reactions"
            :key="reaction.emoji"
            :class="cn(
              'flex items-center gap-1 px-2 py-1 rounded border transition-colors text-sm',
              reaction.reacted 
                ? 'bg-blurple/20 border-blurple text-blurple' 
                : 'bg-bg-secondary border-bg-secondary hover:border-text-muted'
            )"
            @click="emit('react', reaction.emoji)"
          >
            <span>{{ reaction.emoji }}</span>
            <span class="text-xs">{{ reaction.count }}</span>
          </button>
          
          <button
            class="flex items-center justify-center w-8 h-8 rounded border border-bg-secondary hover:border-text-muted transition-colors"
            @click="emit('react', '👍')"
          >
            <svg class="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Message Actions (shown on hover) -->
      <div 
        v-if="isHovered"
        class="flex items-center gap-0.5 bg-bg-floating border border-bg-secondary rounded-md p-0.5 absolute top-0 right-0 -translate-y-1/2"
      >
        <button
          class="w-7 h-7 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-text-primary"
          @click="emit('react', '👍')"
          title="Reaksiyon ekle"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-3.5-6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-7 1.5c.826 0 1.5.674 1.5 1.5h5c0-.826.674-1.5 1.5-1.5H8.5z"/>
          </svg>
        </button>
        
        <button
          class="w-7 h-7 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-text-primary"
          @click="emit('reply')"
          title="Yanıtla"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
          </svg>
        </button>
        
        <button
          class="w-7 h-7 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-text-primary"
          @click="emit('edit')"
          title="Düzenle"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        
        <button
          class="w-7 h-7 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-muted hover:text-accent-red"
          @click="emit('delete')"
          title="Sil"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  message: {
    id: string
    content: string
    timestamp: Date
    replyTo?: { author: string; content: string }
    attachments?: any[]
    reactions?: { emoji: string; count: number; reacted: boolean }[]
    edited?: boolean
  }
  showTimestamp?: boolean
}>(), {
  showTimestamp: false,
})

const emit = defineEmits<{
  reply: []
  react: [emoji: string]
  edit: []
  delete: []
}>()

const isHovered = ref(false)
</script>
