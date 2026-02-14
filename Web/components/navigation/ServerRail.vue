<template>
  <Suspense>
    <template #default>
      <div class="w-[72px] bg-bg-tertiary flex flex-col items-center py-3 gap-2 h-full overflow-y-auto">
        <!-- Home/DM Button -->
        <div class="mb-2">
          <ServerIcon
            name="Home"
            :isActive="activeServerId === '@me'"
            @click="() => navigateToServer('@me')"
          />
        </div>
        
        <!-- Separator -->
        <div class="w-8 h-[2px] bg-bg-secondary rounded-full my-1" />
        
        <!-- Server List -->
        <div class="flex flex-col items-center gap-2 flex-1">
          <ServerIcon
            v-for="server in servers"
            :key="server.id"
            :src="server.icon"
            :name="server.name"
            :isActive="activeServerId === server.id"
            :hasNotification="server.hasNotification"
            :unreadCount="server.unreadCount"
            @click="() => navigateToServer(server.id)"
          />
        </div>
        
        <!-- Add Server Button -->
        <div 
          class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-bg-secondary hover:bg-accent-green transition-all duration-200 flex items-center justify-center cursor-pointer group"
          @click="emit('add-server')"
        >
          <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        
        <!-- Explore Button -->
        <div 
          class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-bg-secondary hover:bg-accent-green transition-all duration-200 flex items-center justify-center cursor-pointer group"
          @click="emit('explore')"
        >
          <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </template>
    <template #fallback>
      <ServerRailSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
interface Server {
  id: string
  name: string
  icon?: string
  hasNotification?: boolean
  unreadCount?: number
}

interface Props {
  servers: Server[]
  activeServerId?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeServerId: '@me'
})

const emit = defineEmits<{
  'add-server': []
  'explore': []
  'server-change': [serverId: string]
}>()

const navigateToServer = (serverId: string) => {
  emit('server-change', serverId)
}
</script>
