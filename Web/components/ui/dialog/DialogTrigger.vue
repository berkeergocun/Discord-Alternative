<script setup lang="ts">
import { DialogTrigger } from 'radix-vue'
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false
})
</script>

<template>
  <DialogTrigger
    :as-child="props.asChild"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </DialogTrigger>
</template>
