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

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}>(), {
  size: 'md',
})

const sizeClasses: Record<string, string> = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-xl',
}

const statusSizeClasses: Record<string, string> = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
}

const statusClasses: Record<string, string> = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500',
}

const statusPosition: Record<string, object> = {
  xs: { bottom: '-1px', right: '-1px' },
  sm: { bottom: '0', right: '0' },
  md: { bottom: '0', right: '0' },
  lg: { bottom: '0', right: '0' },
  xl: { bottom: '2px', right: '2px' },
}

const hasError = ref(false)
const actualSrc = computed(() => hasError.value ? undefined : props.src)

function handleError() {
  hasError.value = true
}
</script>
