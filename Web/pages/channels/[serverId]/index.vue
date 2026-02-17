<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- Server Overview -->
      <template #content>
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-text-primary mb-2">
              Sunucuya Hoş Geldin!
            </h1>
            <p class="text-text-secondary">
              Sol taraftan bir kanal seç
            </p>
          </div>
        </div>
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const serverId = computed(() => route.params.serverId as string)

// Check auth
const { isAuthenticated, isLoading } = useAuth()

// Redirect if not authenticated
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

// TODO: Fetch server data
// const { data: serverData } = await useFetch(`/api/guilds/${serverId.value}`)
</script>
