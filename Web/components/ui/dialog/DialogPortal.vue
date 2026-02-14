<script setup lang="ts">
import { DialogPortal } from 'radix-vue'

interface Props {
  to?: string | HTMLElement
}

defineProps<Props>()
</script>

<template>
  <DialogPortal :to="to">
    <slot />
  </DialogPortal>
</template>
