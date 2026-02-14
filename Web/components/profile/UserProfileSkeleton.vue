<template>
  <div class="w-80 bg-bg-secondary flex flex-col h-full overflow-y-auto custom-scrollbar">
    <!-- Banner -->
    <div class="relative h-20 bg-bg-tertiary shrink-0"></div>

    <!-- Profile Content -->
    <div class="px-4 pb-4">
      <!-- Avatar Skeleton -->
      <div class="relative -mt-12 mb-4">
        <div class="w-20 h-20 rounded-full bg-bg-tertiary animate-skeleton border-8 border-bg-secondary"></div>
      </div>

      <!-- User Info Skeleton -->
      <div class="bg-bg-primary rounded-lg p-4 space-y-3">
        <div>
          <div class="h-6 w-32 bg-bg-tertiary rounded animate-skeleton mb-2"></div>
          <div class="h-4 w-24 bg-bg-tertiary rounded animate-skeleton"></div>
        </div>

        <div class="border-t border-bg-tertiary"></div>

        <div class="space-y-1">
          <div class="h-3 w-20 bg-bg-tertiary rounded animate-skeleton"></div>
          <div class="h-4 w-full bg-bg-tertiary rounded animate-skeleton"></div>
        </div>

        <div class="space-y-1">
          <div class="h-3 w-24 bg-bg-tertiary rounded animate-skeleton"></div>
          <div class="h-4 w-32 bg-bg-tertiary rounded animate-skeleton"></div>
        </div>
      </div>

      <!-- Action Buttons Skeleton -->
      <div class="mt-4 space-y-2">
        <div class="h-10 w-full bg-bg-tertiary rounded animate-skeleton"></div>
        <div class="h-10 w-full bg-bg-tertiary rounded animate-skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 4px;
}
</style>
