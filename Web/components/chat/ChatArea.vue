<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col h-full w-full bg-bg-chat">
        <!-- Channel Header -->
        <ChatHeader
          :title="channelName"
          :description="channelDescription"
          :type="channelType"
          :showMemberList="showMemberList"
          :showUserProfile="showUserProfile"
          :showGroupProfile="showGroupProfile"
          @pins="emit('pins')"
          @threads="emit('threads')"
          @members="emit('members')"
          @toggle-profile="emit('toggle-profile')"
          @search="emit('search')"
        />
        
        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <MessageList
            :messages="messages"
            :isLoading="isLoading"
            @load-more="emit('load-more')"
            @reply="emit('reply', $event)"
            @react="emit('react', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
        
        <!-- Typing Indicator -->
        <TypingIndicator v-if="typingUsers.length > 0" :users="typingUsers" />
        
        <!-- Input Area -->
        <ChatInput
          :placeholder="inputPlaceholder"
          :replyTo="replyTo"
          @send="emit('send', $event)"
          @cancel-reply="emit('cancel-reply')"
          @typing="emit('typing')"
        />
      </div>
    </template>
    <template #fallback>
      <ChatAreaSkeleton />
    </template>
  </Suspense>
</template>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 16px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 8px;
  border: 4px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2E3035;
}
</style>
