<template>
  <div class="h-full w-full">
    <MainLayout>
      <!-- DM List Sidebar -->
      <template #sidebar>
        <DMList
          :active-dm-id="dmId"
          @dm-select="(id) => navigateTo(`/channels/@me/${id}`)"
          @friends="navigateTo('/channels/@me')"
        />
      </template>

      <!-- DM Chat Area -->
      <template #content>
        <ChatArea
          :channel-name="activeDm?.name ?? 'Direkt Mesaj'"
          channel-type="dm"
          :show-user-profile="showProfile"
          :input-placeholder="`@${activeDm?.name ?? 'Kullanıcı'} mesaj gönder`"
          @toggle-profile="showProfile = !showProfile"
        />
      </template>

      <!-- DM User Profile (sağ panel) -->
      <template v-if="showProfile" #right>
        <UserProfile
          :user="activeDm ? {
            username: activeDm.username ?? activeDm.name,
            displayName: activeDm.name,
            status: activeDm.status,
            bannerColor: '#5865F2',
            createdAt: new Date('2022-01-01'),
          } : undefined"
          @add-friend="() => {}"
          @block="() => {}"
        />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import DMList from '~/components/dm/DMList.vue'
import ChatArea from '~/components/chat/ChatArea.vue'
import UserProfile from '~/components/profile/UserProfile.vue'
import MainLayout from '~/components/layouts/MainLayout.vue'

const route = useRoute()
const dmId = computed(() => route.params.dmId as string)

// Check auth
const { isAuthenticated, isLoading } = useAuth()
if (!isLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

const showProfile = ref(false)

// Statik DM kullanıcıları (DMList ile aynı veri)
const staticDms = [
  { id: '1', name: 'Ali Yılmaz', username: 'aliyilmaz', status: 'online' as const },
  { id: '2', name: 'Ayşe Kaya', username: 'aysekaya', status: 'idle' as const },
  { id: '3', name: 'Mehmet Demir', username: 'mehmetdemir', status: 'dnd' as const },
  { id: '4', name: 'Proje Grubu', username: 'projegrubu', status: 'online' as const },
  { id: '5', name: 'Zeynep Arslan', username: 'zeyneparslan', status: 'offline' as const },
]

const activeDm = computed(() => staticDms.find(d => d.id === dmId.value) ?? null)
</script>
