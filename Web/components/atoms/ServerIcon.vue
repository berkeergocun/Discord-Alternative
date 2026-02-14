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
    
    <!-- Active indicator (always present) -->
    <div 
      :class="[
        'absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-full transition-all duration-200',
        isActive ? 'h-10 -translate-x-[3px]' : 'h-0 group-hover:h-5 -translate-x-[3px]'
      ]"
    />
    
    <!-- Notification badge -->
    <div 
      v-if="hasNotification && !isActive"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[3px] w-2 h-2 bg-white rounded-full"
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
