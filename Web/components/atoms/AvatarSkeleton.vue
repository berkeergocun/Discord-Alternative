<template>
  <div 
    :class="cn(
      'rounded-full bg-bg-secondary animate-skeleton shrink-0',
      sizeClasses[size]
    )"
  />
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-32 h-32',
}
</script>
