<script setup lang="ts">
import { DialogContent, DialogClose } from 'radix-vue'
import { cn } from '~/lib/utils'
import { X } from 'lucide-vue-next'
import DialogPortal from './DialogPortal.vue'
import DialogOverlay from './DialogOverlay.vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent
      :class="
        cn(
          'dialog-content-center fixed left-1/2 top-1/2 z-[201] w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'bg-bg-secondary rounded-lg shadow-xl',
          'opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200 ease-out',
          props.class
        )
      "
    >
      <slot />
      
      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X :size="20" :stroke-width="2" class="text-text-muted hover:text-text-primary" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
