<template>
  <div class="flex flex-col h-full bg-bg-secondary">
    <!-- Header Skeleton -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-bg-tertiary">
      <div class="h-4 w-24 bg-bg-tertiary rounded animate-skeleton" />
    </div>

    <!-- Activity Items Skeleton -->
    <div class="py-2">
      <div
        v-for="i in 5"
        :key="i"
        class="flex gap-3 px-4 py-3"
      >
        <!-- Avatar Skeleton -->
        <div class="relative shrink-0">
          <div class="w-10 h-10 rounded-full bg-bg-tertiary animate-skeleton" />
        </div>

        <!-- Content Skeleton -->
        <div class="flex-1 space-y-2">
          <div class="h-3.5 w-32 bg-bg-tertiary rounded animate-skeleton" />
          <div class="h-3 w-40 bg-bg-tertiary rounded animate-skeleton" />
          <div class="h-3 w-24 bg-bg-tertiary rounded animate-skeleton" />
        </div>
      </div>
    </div>
  </div>
</template>
