<script setup lang="ts">
import { DialogTitle } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DialogTitle
    :class="cn('text-lg font-semibold text-text-primary', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
