<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  as?: string | object
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button'
})
</script>

<template>
  <DropdownMenuTrigger
    v-bind="props"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
