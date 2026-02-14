<template>
  <div class="flex flex-col p-2 space-y-2">
    <div class="h-10 bg-bg-tertiary rounded animate-skeleton" />
    <div class="h-4 bg-bg-tertiary rounded w-32 animate-skeleton" />
    <div v-for="i in 8" :key="i" class="h-12 bg-bg-tertiary rounded animate-skeleton" />
  </div>
</template>
