<template>
  <div class="px-4 py-1 text-sm text-text-secondary">
    <div class="flex items-center gap-2">
      <div class="flex gap-1">
        <div 
          v-for="i in 3" 
          :key="i"
          class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
          :style="{ animationDelay: `${i * 0.15}s` }"
        />
      </div>
      <span>
        <strong>{{ formattedUsers }}</strong> yazıyor...
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  users: string[]
}>()

const formattedUsers = computed(() => {
  if (!props.users.length) return ''
  if (props.users.length === 1) return props.users[0]
  if (props.users.length === 2) return `${props.users[0]} ve ${props.users[1]}`
  return `${props.users.slice(0, -1).join(', ')} ve ${props.users[props.users.length - 1]}`
})
</script>
