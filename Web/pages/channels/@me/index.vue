<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- Friends/DM View -->
      <template #content>
        <FriendsView />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
// Check auth
const { isAuthenticated, isLoading } = useAuth()

// Redirect if not authenticated
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}
</script>
