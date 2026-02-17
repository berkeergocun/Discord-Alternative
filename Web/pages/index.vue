<template>
  <div class="fixed inset-0 bg-bg-tertiary flex items-center justify-center">
    <LoadingScreen />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

onMounted(async () => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Wait a bit for auth to initialize
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (isAuthenticated.value) {
    navigateTo('/channels/@me')
  } else {
    navigateTo('/login')
  }
})
</script>

