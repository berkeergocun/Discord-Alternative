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

<script setup lang="ts">
import { cn } from '~/lib/utils'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  className?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  fallback: '?',
  alt: 'Avatar'
})

const hasError = ref(false)

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-32 h-32 text-2xl',
}

const statusSizeClasses = {
  xs: 'w-2 h-2',
  sm: 'w-3 h-3',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
  '2xl': 'w-6 h-6',
}

const statusClasses = {
  online: 'bg-status-online',
  idle: 'bg-status-idle',
  dnd: 'bg-status-dnd',
  offline: 'bg-status-offline',
}

const statusPosition = {
  xs: { bottom: '-1px', right: '-1px' },
  sm: { bottom: '-1px', right: '-1px' },
  md: { bottom: '0px', right: '0px' },
  lg: { bottom: '1px', right: '1px' },
  xl: { bottom: '2px', right: '2px' },
  '2xl': { bottom: '4px', right: '4px' },
}

const handleError = () => {
  hasError.value = true
}
</script>
