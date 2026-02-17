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

