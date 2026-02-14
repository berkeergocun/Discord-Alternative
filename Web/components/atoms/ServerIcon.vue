<template>
  <div 
    :class="cn(
      'relative group cursor-pointer transition-all duration-200 shrink-0',
      className
    )"
    @click="handleClick"
  >
    <div 
      :class="cn(
        'w-12 h-12 rounded-[24px] group-hover:rounded-[16px] transition-all duration-200 overflow-hidden flex items-center justify-center',
        isActive ? 'rounded-[16px] bg-blurple' : 'bg-bg-secondary hover:bg-blurple hover:text-white',
        hasNotification && !isActive && 'bg-bg-secondary'
      )"
    >
      <img 
        v-if="src" 
        :src="src" 
        :alt="name"
        class="w-full h-full object-cover"
        @error="handleError"
      />
      <!-- Home icon by Icons8 https://icons8.com/icon/73/home -->
      <svg
        v-else-if="name === 'Home'"
        class="w-6 h-6 shrink-0"
        :class="isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span 
        v-else 
        :class="cn(
          'font-semibold text-sm',
          isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
        )"
      >
        {{ abbreviation }}
      </span>
    </div>
    
    <!-- Active/hover indicator bar: fade in on hover, no height expansion -->
    <div 
      :class="[
        'absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white -translate-x-[3px] transition-opacity duration-200',
        isActive ? 'h-6 opacity-100' : 'h-5 opacity-0 group-hover:opacity-100'
      ]"
      style="border-radius: 9999px;"
    />
    
    <!-- Unread count badge -->
    <div 
      v-if="unreadCount && unreadCount > 0"
      class="absolute -top-1 -right-1 min-w-[20px] h-5 bg-accent-red text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'

export interface ServerIconProps {
  src?: string
  name: string
  isActive?: boolean
  hasNotification?: boolean
  unreadCount?: number
  className?: string
}

const props = withDefaults(defineProps<ServerIconProps>(), {
  isActive: false,
  hasNotification: false,
  unreadCount: 0
})

const emit = defineEmits<{
  click: []
}>()

const hasError = ref(false)

const abbreviation = computed(() => {
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleError = () => {
  hasError.value = true
}

const handleClick = () => {
  emit('click')
}
</script>
