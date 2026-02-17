<template>
  <Suspense>
    <template #default>
      <div 
        :class="cn(
          'relative rounded-full overflow-hidden bg-bg-secondary flex items-center justify-center shrink-0',
          sizeClasses[size],
          className
        )"
      >
        <img 
          v-if="src" 
          :src="src" 
          :alt="alt"
          class="w-full h-full object-cover"
          @error="handleError"
        />
        <span v-else class="text-text-secondary font-medium">
          {{ fallback }}
        </span>
        
        <!-- Status indicator -->
        <div 
          v-if="status"
          :class="cn(
            'absolute rounded-full border-2 border-bg-secondary',
            statusSizeClasses[size],
            statusClasses[status]
          )"
          :style="statusPosition[size]"
        />
      </div>
    </template>
    <template #fallback>
      <AvatarSkeleton :size="size" />
    </template>
  </Suspense>
</template>

