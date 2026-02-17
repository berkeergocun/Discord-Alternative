<template>
  <div class="fixed inset-0 overflow-hidden">
    <ClientOnly>
      <LoadingScreen v-if="isInitialLoad" @loaded="handleLoaded" />
      <NuxtPage v-else class="h-full w-full" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { initAuth, isLoading: authLoading } = useAuth()
const isInitialLoad = ref(true)

const handleLoaded = () => {
  isInitialLoad.value = false
}

// Handle loading screen
onMounted(async () => {
  // Check if app was already loaded in this session
  const hasLoaded = sessionStorage.getItem('app-loaded')
  
  if (hasLoaded === 'true') {
    // Skip loading screen
    isInitialLoad.value = false
  } else {
    // Mark as loaded for this session
    sessionStorage.setItem('app-loaded', 'true')
  }

  // Initialize auth
  await initAuth()
})
</script>
