<script setup lang="ts">
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: string }>()
</script>

<template>
  <DropdownMenuSeparator
    v-bind="props"
    :class="cn('my-1.5 h-px bg-bg-tertiary', props.class)"
  />
</template>
