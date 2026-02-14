<script setup lang="ts">
import { DropdownMenuSeparator } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DropdownMenuSeparator
    v-bind="props"
    :class="cn('my-1.5 h-px bg-bg-tertiary', props.class)"
  />
</template>
