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
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
