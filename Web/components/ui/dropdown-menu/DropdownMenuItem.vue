<script setup lang="ts">
import { DropdownMenuItem } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  inset?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenuItem
    :disabled="props.disabled"
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-sm outline-none',
        'transition-colors',
        'text-text-primary hover:bg-bg-tertiary/40',
        'focus:bg-bg-tertiary/40 focus:text-text-primary',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
