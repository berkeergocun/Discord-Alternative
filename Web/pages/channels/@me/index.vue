<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- DM List Sidebar -->
      <template #sidebar>
        <DMList
          :active-dm-id="activeDmId"
          @dm-select="handleDmSelect"
          @friends="activeDmId = null"
        />
      </template>

      <!-- Friends/DM View -->
      <template #content>
        <FriendsView />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import DMList from '~/components/dm/DMList.vue'
import FriendsView from '~/components/friends/FriendsView.vue'
import MainLayout from '~/components/layouts/MainLayout.vue'

// Check auth
const { isAuthenticated, isLoading } = useAuth()
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

const activeDmId = ref<string | null>(null)

function handleDmSelect(id: string) {
  activeDmId.value = id
  navigateTo(`/channels/@me/${id}`)
}
</script>
