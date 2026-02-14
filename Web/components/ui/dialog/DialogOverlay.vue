<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DialogOverlay
    :class="
      cn(
        'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm',
        'opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200 ease-out',
        props.class
      )
    "
  />
</template>
