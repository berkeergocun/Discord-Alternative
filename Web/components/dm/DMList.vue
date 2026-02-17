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
            <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
            @click="handleDmSelect(dm.id)"
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
const emit = defineEmits<{
  friends: []
  'dm-select': [id: string]
}>()

const activeDmId = ref<string | null>(null)

// Statik DM listesi (sonra backend'den gelecek)
const dms = ref([
  {
    id: '1',
    type: 'dm' as const,
    name: 'Ali Yılmaz',
    status: 'online' as const,
    lastMessage: 'Merhaba! Nasılsın?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: '2',
    type: 'dm' as const,
    name: 'Ayşe Kaya',
    status: 'idle' as const,
    lastMessage: 'Proje hazır mı?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: '3',
    type: 'dm' as const,
    name: 'Mehmet Demir',
    status: 'dnd' as const,
    lastMessage: 'Toplantıya katılamayacağım.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: '4',
    type: 'group' as const,
    name: 'Proje Grubu',
    lastMessage: 'Yeni güncelleme geldi!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 5,
  },
  {
    id: '5',
    type: 'dm' as const,
    name: 'Zeynep Arslan',
    status: 'offline' as const,
    lastMessage: 'Yarın görüşürüz.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
  },
])

function handleDmSelect(id: string) {
  activeDmId.value = id
  emit('dm-select', id)
}
</script>
