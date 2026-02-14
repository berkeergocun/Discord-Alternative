<template>
  <div class="w-80 bg-bg-secondary flex flex-col h-full overflow-y-auto custom-scrollbar">
    <!-- Banner -->
    <div class="relative h-20 bg-bg-tertiary shrink-0"></div>

    <!-- Profile Content -->
    <div class="px-4 pb-4">
      <!-- Group Icon (overlapping banner) -->
      <div class="relative -mt-10 mb-4">
        <div class="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center border-8 border-bg-secondary">
          <svg class="w-8 h-8 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
      </div>

      <!-- Group Name -->
      <div class="bg-bg-primary rounded-lg p-4 mb-4">
        <h3 class="text-lg font-bold text-text-primary mb-1">{{ groupName }}</h3>
        <p class="text-sm text-text-secondary">{{ memberCount }} üye</p>
      </div>

      <!-- Members Section -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-semibold text-text-primary uppercase">Üyeler — {{ memberCount }}</h4>
        </div>

        <!-- Owner -->
        <div v-if="owner" class="space-y-2">
          <p class="text-xs font-semibold text-text-muted uppercase px-2">Kurucu</p>
          <div
            class="flex items-center gap-3 px-2 py-2 rounded hover:bg-bg-tertiary/40 cursor-pointer transition-colors"
            @click="emit('member-click', owner.id)"
          >
            <div class="relative">
              <Avatar
                :src="owner.avatar"
                :alt="owner.displayName || owner.username"
                :fallback="(owner.displayName || owner.username)?.[0] || '?'"
                :status="owner.status"
                size="md"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">
                {{ owner.displayName || owner.username }}
              </p>
              <p v-if="owner.activity" class="text-xs text-text-muted truncate">
                {{ owner.activity }}
              </p>
            </div>
          </div>
        </div>

        <!-- Members -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-text-muted uppercase px-2">Üyeler</p>
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center gap-3 px-2 py-2 rounded hover:bg-bg-tertiary/40 cursor-pointer transition-colors"
            @click="emit('member-click', member.id)"
          >
            <div class="relative">
              <Avatar
                :src="member.avatar"
                :alt="member.displayName || member.username"
                :fallback="(member.displayName || member.username)?.[0] || '?'"
                :status="member.status"
                size="md"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">
                {{ member.displayName || member.username }}
              </p>
              <p v-if="member.activity" class="text-xs text-text-muted truncate">
                {{ member.activity }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave Group -->
      <button
        class="w-full mt-4 px-3 py-2 text-left text-sm text-accent-red hover:bg-bg-tertiary rounded transition-colors flex items-center gap-3"
        @click="emit('leave-group')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        Gruptan Ayrıl
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Member {
  id: string
  username: string
  displayName?: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  activity?: string
}

interface Props {
  groupName: string
  memberCount: number
  owner?: Member
  members: Member[]
}

defineProps<Props>()

const emit = defineEmits<{
  'member-click': [memberId: string]
  'leave-group': []
}>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2A2B2E;
}
</style>
