<template>
  <div class="fixed inset-0 overflow-hidden">
    <ClientOnly>
      <LoadingScreen v-if="isInitialLoad" @loaded="handleLoaded" />
      <NuxtPage v-else class="h-full w-full" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { initAuth, isLoading: authLoading, isAuthenticated } = useAuth()
const { connect: connectWS } = useWebSocket()
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

  // WebSocket'i auth başarılıysa başlat
  if (isAuthenticated.value) {
    const token = localStorage.getItem('discord_access_token')
    if (token) connectWS(token)
  }
})

// Token geldiğinde WebSocket bağla (login sonrası)
watch(isAuthenticated, (authed) => {
  if (authed) {
    const token = localStorage.getItem('discord_access_token')
    if (token) connectWS(token)
  }
})
</script>
