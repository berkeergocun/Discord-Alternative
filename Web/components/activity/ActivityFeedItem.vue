<template>
  <div
    class="flex gap-3 px-4 py-3 hover:bg-bg-tertiary/40 cursor-pointer transition-colors group"
    @click="emit('click')"
  >
    <!-- Avatar with Status -->
    <div class="relative shrink-0">
      <Avatar
        :src="activity.avatar"
        :alt="activity.displayName || activity.username"
        :fallback="(activity.displayName || activity.username)?.[0] || '?'"
        size="lg"
      />
      <div
        :class="[
          'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-bg-secondary',
          statusColor
        ]"
      />
    </div>

    <!-- Activity Info -->
    <div class="flex-1 min-w-0">
      <!-- Username -->
      <div class="flex items-center gap-1.5 mb-0.5">
        <span class="text-sm font-semibold text-text-primary truncate">
          {{ activity.displayName || activity.username }}
        </span>
        <span v-if="activity.activityType === 'streaming'" class="px-1.5 py-0.5 text-xs font-semibold text-white bg-accent-purple rounded">
          CANLI
        </span>
      </div>

      <!-- Activity Details -->
      <div class="space-y-0.5">
        <div class="flex items-center gap-1.5">
          <!-- Activity Icon -->
          <svg v-if="activityIcon" class="w-3.5 h-3.5 text-text-muted shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path :d="activityIcon" />
          </svg>
          <span class="text-xs text-text-muted truncate">
            {{ activityText }}
          </span>
        </div>

        <!-- Activity Name -->
        <div v-if="activity.activity" class="text-xs font-medium text-text-secondary truncate">
          {{ activity.activity }}
        </div>

        <!-- Additional Details -->
        <div v-if="activity.activityDetails" class="text-xs text-text-muted truncate">
          {{ activity.activityDetails }}
        </div>

        <!-- Timestamp -->
        <div v-if="activity.timestamp" class="text-xs text-text-muted">
          {{ formatTimestamp(activity.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="w-8 h-8 flex items-center justify-center rounded hover:bg-bg-tertiary transition-colors"
        @click.stop="handleAction"
      >
        <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  userId: string
  username: string
  displayName: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  activity?: string
  activityType?: 'playing' | 'listening' | 'watching' | 'streaming'
  activityDetails?: string
  timestamp?: Date
}

interface Props {
  activity: Activity
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'click': []
  'action': [activity: Activity]
}>()

const statusColor = computed(() => {
  switch (props.activity.status) {
    case 'online':
      return 'bg-status-online'
    case 'idle':
      return 'bg-status-idle'
    case 'dnd':
      return 'bg-status-dnd'
    default:
      return 'bg-status-offline'
  }
})

const activityText = computed(() => {
  switch (props.activity.activityType) {
    case 'playing':
      return 'Oynuyor'
    case 'listening':
      return 'Dinliyor'
    case 'watching':
      return 'İzliyor'
    case 'streaming':
      return 'Yayın yapıyor'
    default:
      return props.activity.activity ? 'Aktif' : ''
  }
})

const activityIcon = computed(() => {
  switch (props.activity.activityType) {
    case 'playing':
      return 'M21 6v14H3V6h18zm-1 1H4v12h16V7zM9 8v8l7-4-7-4z' // Game controller/play
    case 'listening':
      return 'M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z' // Music note
    case 'watching':
      return 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' // Eye
    case 'streaming':
      return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' // Play in circle
    default:
      return ''
  }
})

const formatTimestamp = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes} dakika önce`
  if (hours < 24) return `${hours} saat önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

const handleAction = () => {
  emit('action', props.activity)
}
</script>
