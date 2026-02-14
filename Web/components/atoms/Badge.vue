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

export interface BadgeProps {
  variant?: 'default' | 'notification' | 'bot' | 'admin' | 'role'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'md'
})

const variantClasses = {
  default: 'bg-bg-secondary text-text-secondary rounded-full',
  notification: 'bg-accent-red text-white rounded-full',
  bot: 'bg-blurple text-white rounded text-[10px] px-1',
  admin: 'bg-accent-red text-white rounded text-[10px] px-1',
  role: 'bg-bg-secondary text-text-primary rounded px-1.5',
}

const sizeClasses = {
  sm: 'text-[10px] min-w-[16px] h-4 px-1',
  md: 'text-xs min-w-[20px] h-5 px-1.5',
  lg: 'text-sm min-w-[24px] h-6 px-2',
}
</script>
