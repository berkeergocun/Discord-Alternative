<template>
  <div class="p-4 flex flex-col">
    <div v-if="isLoading" class="flex justify-center py-4">
      <div class="animate-spin w-8 h-8 border-4 border-blurple border-t-transparent rounded-full" />
    </div>
    
    <div v-for="(group, groupIndex) in messageGroups" :key="groupIndex" class="mb-6 last:mb-0">
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
interface MessageAuthor {
  id: string
  username: string
  displayName?: string
  avatar?: string
  bot?: boolean
}

interface Message {
  id: string
  content: string
  timestamp: Date
  author: MessageAuthor
  replyTo?: { author: string; content: string }
  attachments?: any[]
  reactions?: { emoji: string; count: number; reacted: boolean }[]
  edited?: boolean
}

interface MessageGroup {
  author: MessageAuthor
  messages: Message[]
}

const props = withDefaults(defineProps<{
  messages: Message[]
  isLoading?: boolean
}>(), {
  messages: () => [],
  isLoading: false,
})

const emit = defineEmits<{
  'load-more': []
  reply: [messageId: string]
  react: [data: { messageId: string; emoji: string }]
  edit: [messageId: string]
  delete: [messageId: string]
}>()

const messageGroups = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = []
  for (const message of props.messages) {
    const last = groups[groups.length - 1]
    if (last && last.author.id === message.author.id) {
      last.messages.push(message)
    } else {
      groups.push({ author: message.author, messages: [message] })
    }
  }
  return groups
})
</script>
