<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- DM Chat View -->
      <template #content>
        <ChatArea />
      </template>
      
      <!-- DM Profile Sidebar -->
      <template #sidebar>
        <UserProfile />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const dmId = computed(() => route.params.dmId as string)

// Check auth
const { isAuthenticated, isLoading } = useAuth()

// Redirect if not authenticated
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

// TODO: Fetch DM data
// const { data: dmData } = await useFetch(`/api/channels/${dmId.value}`)
</script>
