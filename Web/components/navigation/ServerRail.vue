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
          <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </div>
        
        <!-- Explore Button -->
        <div 
          class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-bg-secondary hover:bg-accent-green transition-all duration-200 flex items-center justify-center cursor-pointer group"
          @click="emit('explore')"
        >
          <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
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
