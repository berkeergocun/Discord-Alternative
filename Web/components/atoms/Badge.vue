<template>
  <div 
    :class="cn(
      'inline-flex items-center justify-center font-semibold',
      variantClasses[variant],
      sizeClasses[size],
      className
    )"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'notification' | 'mention' | 'online' | 'offline'
  size?: 'xs' | 'sm' | 'md'
  className?: string
}>(), {
  variant: 'default',
  size: 'sm',
})

const variantClasses: Record<string, string> = {
  default: 'bg-bg-tertiary text-text-primary rounded',
  notification: 'bg-red-500 text-white rounded-full min-w-[16px]',
  mention: 'bg-red-500 text-white rounded-full min-w-[16px]',
  online: 'bg-green-500 text-white rounded-full',
  offline: 'bg-gray-500 text-white rounded-full',
}

const sizeClasses: Record<string, string> = {
  xs: 'text-[10px] px-1 h-3',
  sm: 'text-xs px-1.5 h-4',
  md: 'text-xs px-2 h-5',
}
</script>
