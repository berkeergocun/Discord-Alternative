<template>
  <div class="flex flex-col gap-1 p-2">
    <div v-for="i in 3" :key="i" class="space-y-1">
      <!-- Category header skeleton -->
      <div class="h-6 bg-bg-tertiary rounded w-24 animate-skeleton mb-2" />
      
      <!-- Channel items skeleton -->
      <div v-for="j in 5" :key="j" class="h-8 bg-bg-tertiary rounded animate-skeleton" />
    </div>
  </div>
</template>
