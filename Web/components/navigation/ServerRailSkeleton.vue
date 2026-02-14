<template>
  <div class="w-[72px] bg-bg-tertiary flex flex-col items-center py-3 gap-2 h-full">
    <!-- Home skeleton -->
    <div class="w-12 h-12 rounded-[24px] bg-bg-secondary animate-skeleton mb-2" />
    
    <!-- Separator -->
    <div class="w-8 h-[2px] bg-bg-secondary rounded-full my-1" />
    
    <!-- Server skeletons -->
    <div class="flex flex-col items-center gap-2">
      <div 
        v-for="i in 8" 
        :key="i"
        class="w-12 h-12 rounded-[24px] bg-bg-secondary animate-skeleton"
      />
    </div>
  </div>
</template>
