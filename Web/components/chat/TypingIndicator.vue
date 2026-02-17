<template>
  <div class="px-4 py-1 text-sm text-text-secondary">
    <div class="flex items-center gap-2">
      <div class="flex gap-1">
        <div 
          v-for="i in 3" 
          :key="i"
          class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
          :style="{ animationDelay: `${i * 0.15}s` }"
        />
      </div>
      <span>
        <strong>{{ formattedUsers }}</strong> yazıyor...
      </span>
    </div>
  </div>
</template>

