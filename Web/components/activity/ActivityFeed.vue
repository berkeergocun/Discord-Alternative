<template>
  <div class="flex flex-col h-full bg-bg-secondary">
    <!-- Header -->
    <div class="h-12 flex items-center justify-between px-4 border-b border-bg-tertiary">
      <h2 class="text-sm font-semibold text-text-primary uppercase tracking-wide">
        Aktif Şimdi
      </h2>
    </div>

    <!-- Activity List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="activities.length === 0" class="flex flex-col items-center justify-center h-full px-8 text-center">
        <div class="w-20 h-20 mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
          <svg class="w-10 h-10 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        <p class="text-sm text-text-muted leading-relaxed">
          Arkadaşlarınız bir oyun oynarken veya bir aktiviteye katıldığında, burada göreceksiniz!
        </p>
      </div>

      <div v-else class="py-2">
        <ActivityFeedItem
          v-for="activity in activities"
          :key="activity.userId"
          :activity="activity"
          @click="handleActivityClick(activity)"
        />
      </div>
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
  activities?: Activity[]
}

withDefaults(defineProps<Props>(), {
  activities: () => []
})

const emit = defineEmits<{
  'activity-click': [activity: Activity]
}>()

const handleActivityClick = (activity: Activity) => {
  emit('activity-click', activity)
}
</script>
