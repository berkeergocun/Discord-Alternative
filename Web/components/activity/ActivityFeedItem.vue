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

