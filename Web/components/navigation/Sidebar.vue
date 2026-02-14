<template>
  <Suspense>
    <template #default>
      <div class="w-60 bg-bg-secondary flex flex-col h-full">
        <!-- Sidebar Header -->
        <SidebarHeader
          :title="headerTitle"
          :type="type"
          @menu-click="emit('menu-click')"
          @search="emit('search', $event)"
        />
        
        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <slot />
        </div>
        
        <!-- User Panel -->
        <UserPanel
          :user="user"
          @settings="emit('settings')"
          @voice-settings="emit('voice-settings')"
        />
      </div>
    </template>
    <template #fallback>
      <SidebarSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
interface User {
  id: string
  username: string
  displayName?: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
}

interface Props {
  type: 'server' | 'dm'
  headerTitle: string
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  'menu-click': []
  'search': [query: string]
  'settings': []
  'voice-settings': []
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
  background: #2E3035;
}
</style>
