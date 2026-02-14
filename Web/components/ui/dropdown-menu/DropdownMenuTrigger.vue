<script setup lang="ts">
import { DropdownMenuTrigger, type DropdownMenuTriggerProps } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<DropdownMenuTriggerProps & { class?: string }>(), {
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
