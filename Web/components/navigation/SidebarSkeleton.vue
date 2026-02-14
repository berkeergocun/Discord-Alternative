<template>
  <div class="w-60 bg-bg-secondary flex flex-col h-full">
    <!-- Header skeleton -->
    <div class="h-12 border-b border-bg-floating px-4 flex items-center">
      <div class="h-6 bg-bg-tertiary rounded w-32 animate-skeleton" />
    </div>
    
    <!-- Content skeleton -->
    <div class="flex-1 p-2 space-y-2">
      <div v-for="i in 10" :key="i" class="h-8 bg-bg-tertiary rounded animate-skeleton" />
    </div>
    
    <!-- User panel skeleton -->
    <div class="h-[52px] bg-bg-tertiary px-2 py-2 flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-bg-secondary animate-skeleton" />
      <div class="flex-1 space-y-1">
        <div class="h-3 bg-bg-secondary rounded w-20 animate-skeleton" />
        <div class="h-2 bg-bg-secondary rounded w-16 animate-skeleton" />
      </div>
    </div>
  </div>
</template>
