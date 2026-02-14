<template>
  <div class="group/message-group hover:bg-bg-secondary/30 -mx-4 px-4 py-0.5">
    <!-- First message with avatar and author -->
    <div class="flex gap-4">
      <Avatar
        :src="author.avatar"
        :alt="author.username"
        :fallback="author.username[0]"
        size="md"
        class="mt-0.5"
      />
      
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2 mb-0.5">
          <span class="text-sm font-semibold text-text-primary hover:underline cursor-pointer">
            {{ author.displayName || author.username }}
          </span>
          
          <Badge v-if="author.bot" variant="bot" size="sm">
            BOT
          </Badge>
          
          <span class="text-xs text-text-muted">
            {{ formatTimestamp(messages[0].timestamp) }}
          </span>
        </div>
        
        <Message
          v-for="(message, index) in messages"
          :key="message.id"
          :message="message"
          :showTimestamp="index > 0"
          @reply="emit('reply', message.id)"
          @react="(emoji) => emit('react', { messageId: message.id, emoji })"
          @edit="emit('edit', message.id)"
          @delete="emit('delete', message.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  author: {
    id: string
    username: string
    displayName?: string
    avatar?: string
    bot?: boolean
  }
  content: string
  timestamp: Date
  edited?: boolean
  reactions?: Array<{
    emoji: string
    count: number
    reacted: boolean
  }>
  attachments?: Array<{
    id: string
    url: string
    name: string
    type: 'image' | 'video' | 'file'
  }>
  replyTo?: {
    id: string
    author: string
    content: string
  }
}

interface Props {
  author: Message['author']
  messages: Message[]
}

defineProps<Props>()

const emit = defineEmits<{
  'reply': [messageId: string]
  'react': [data: { messageId: string, emoji: string }]
  'edit': [messageId: string]
  'delete': [messageId: string]
}>()

const formatTimestamp = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Şimdi'
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} dakika önce`
  }
  
  // Same day
  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }
  
  // Yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (yesterday.toDateString() === date.toDateString()) {
    return `Dün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // Full date
  return date.toLocaleDateString('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
