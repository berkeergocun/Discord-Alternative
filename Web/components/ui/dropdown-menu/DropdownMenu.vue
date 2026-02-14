<script setup lang="ts">
import { DropdownMenuRoot } from 'radix-vue'

interface Props {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <DropdownMenuRoot v-bind="$attrs">
    <slot />
  </DropdownMenuRoot>
</template>
