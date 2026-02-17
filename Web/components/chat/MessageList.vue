<template>
  <div class="p-4 flex flex-col-reverse">
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

