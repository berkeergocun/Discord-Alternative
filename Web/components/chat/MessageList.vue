<template>
  <div class="p-4 flex flex-col-reverse">
    <div v-if="isLoading" class="flex justify-center py-4">
      <div class="animate-spin w-8 h-8 border-4 border-blurple border-t-transparent rounded-full" />
    </div>
    
    <div v-for="(group, groupIndex) in messageGroups" :key="groupIndex" class="mb-4 last:mb-0">
      <MessageGroup
        :messages="group.messages"
        :author="group.author"
        @reply="emit('reply', $event)"
        @react="emit('react', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
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
  messages: Message[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  'load-more': []
  'reply': [messageId: string]
  'react': [data: { messageId: string, emoji: string }]
  'edit': [messageId: string]
  'delete': [messageId: string]
}>()

// Group consecutive messages from the same author within 7 minutes
const messageGroups = computed(() => {
  const groups: Array<{
    author: Message['author']
    messages: Message[]
  }> = []
  
  let currentGroup: typeof groups[0] | null = null
  
  for (const message of props.messages) {
    const shouldStartNewGroup = 
      !currentGroup || 
      currentGroup.author.id !== message.author.id ||
      (currentGroup.messages.length > 0 && 
       (message.timestamp.getTime() - currentGroup.messages[currentGroup.messages.length - 1].timestamp.getTime()) > 7 * 60 * 1000)
    
    if (shouldStartNewGroup) {
      currentGroup = {
        author: message.author,
        messages: [message]
      }
      groups.push(currentGroup)
    } else {
      currentGroup!.messages.push(message)
    }
  }
  
  return groups
})
</script>
