<template>
  <div class="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide">
    <span 
      :style="{ color: color || '#B5BAC1' }"
      class="flex-1"
    >
      {{ role }} — {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  role: string
  count: number
  color?: string
}

defineProps<Props>()
</script>
