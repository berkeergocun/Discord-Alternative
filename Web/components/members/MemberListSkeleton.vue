<template>
  <div class="w-60 bg-bg-secondary flex flex-col h-full">
    <div class="p-4 space-y-4">
      <div v-for="i in 3" :key="i" class="space-y-2">
        <!-- Role header skeleton -->
        <div class="h-4 bg-bg-tertiary rounded w-24 animate-skeleton" />
        
        <!-- Member items skeleton -->
        <div v-for="j in 5" :key="j" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-bg-tertiary animate-skeleton shrink-0" />
          <div class="flex-1 space-y-1">
            <div class="h-3 bg-bg-tertiary rounded w-24 animate-skeleton" />
            <div class="h-2 bg-bg-tertiary rounded w-16 animate-skeleton" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
