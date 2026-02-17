<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- Channel Chat View -->
      <template #content>
        <ChatArea />
      </template>
      
      <!-- Member List Sidebar -->
      <template #sidebar>
        <MemberList />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const serverId = computed(() => route.params.serverId as string)
const channelId = computed(() => route.params.channelId as string)

// Check auth
const { isAuthenticated, isLoading } = useAuth()

// Redirect if not authenticated
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

// TODO: Fetch channel data
// const { data: channelData } = await useFetch(`/api/guilds/${serverId.value}/channels/${channelId.value}`)
</script>
