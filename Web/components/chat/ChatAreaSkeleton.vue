<template>
  <div class="flex flex-col h-full bg-bg-chat">
    <!-- Header skeleton -->
    <div class="h-12 border-b border-bg-floating px-4 flex items-center gap-3">
      <div class="h-6 bg-bg-secondary rounded w-32 animate-skeleton" />
      <div class="h-4 bg-bg-secondary rounded w-48 animate-skeleton" />
    </div>
    
    <!-- Messages skeleton -->
    <div class="flex-1 p-4 space-y-4">
      <div v-for="i in 8" :key="i" class="flex gap-3">
        <div class="w-10 h-10 rounded-full bg-bg-secondary animate-skeleton shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-bg-secondary rounded w-32 animate-skeleton" />
          <div class="h-3 bg-bg-secondary rounded w-full animate-skeleton" />
          <div class="h-3 bg-bg-secondary rounded w-3/4 animate-skeleton" />
        </div>
      </div>
    </div>
    
    <!-- Input skeleton -->
    <div class="p-4">
      <div class="h-11 bg-bg-secondary rounded-lg animate-skeleton" />
    </div>
  </div>
</template>
