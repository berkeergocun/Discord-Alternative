<template>
  <div class="fixed inset-0 overflow-hidden">
    <ClientOnly>
      <LoadingScreen v-if="isInitialLoad" @loaded="handleLoaded" />
      <NuxtPage v-else class="h-full w-full" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const isInitialLoad = ref(true)

const handleLoaded = () => {
  isInitialLoad.value = false
}

// Prevent reload showing loading screen again
onMounted(() => {
  const hasLoaded = sessionStorage.getItem('app-loaded')
  if (hasLoaded === 'true') {
    isInitialLoad.value = false
  }
})
</script>
