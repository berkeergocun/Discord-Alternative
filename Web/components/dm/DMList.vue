<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col p-2">
        <!-- Friends Tab -->
        <div 
          class="flex items-center gap-3 px-2 py-1.5 mx-1 rounded cursor-pointer hover:bg-bg-tertiary/40 transition-colors mb-2"
          @click="emit('friends')"
        >
          <div class="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <span class="text-base font-medium text-text-primary">Arkadaşlar</span>
        </div>
        
        <!-- DM Section Header -->
        <div class="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide">
          Direkt Mesajlar
        </div>
        
        <!-- DM List -->
        <div class="space-y-0.5">
          <DMItem
            v-for="dm in dms"
            :key="dm.id"
            :dm="dm"
            :isActive="activeDmId === dm.id"
            @click="emit('dm-select', dm.id)"
          />
        </div>
      </div>
    </template>
    <template #fallback>
      <DMListSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
interface DM {
  id: string
  type: 'dm' | 'group'
  name?: string
  avatar?: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  userId?: string
  owner?: string
  members?: string[]
  lastMessage?: string
  timestamp?: Date
  unreadCount?: number
}

interface Props {
  dms?: DM[]
  activeDmId?: string
}

withDefaults(defineProps<Props>(), {
  dms: () => [],
  activeDmId: ''
})

const emit = defineEmits<{
  'friends': []
  'dm-select': [dmId: string]
}>()
</script>
