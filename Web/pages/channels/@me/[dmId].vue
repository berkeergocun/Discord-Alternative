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
          :channel-id="dmId"
          :channel-name="channelInfo?.name ?? 'Direkt Mesaj'"
          channel-type="dm"
          :show-user-profile="showProfile"
          :input-placeholder="channelInfo?.name ? `@${channelInfo.name} mesaj gönder` : 'Mesaj yaz...'"
          @toggle-profile="showProfile = !showProfile"
        />
      </template>

      <!-- DM User Profile (sağ panel) -->
      <template v-if="showProfile" #right>
        <UserProfile
          :user="profileUser"
          @add-friend="() => {}"
          @block="() => {}"
        />
      </template>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import { messageService, userService } from '~/lib/api'
import DMList from '~/components/dm/DMList.vue'
import ChatArea from '~/components/chat/ChatArea.vue'
import UserProfile from '~/components/profile/UserProfile.vue'
import MainLayout from '~/components/layouts/MainLayout.vue'

const route = useRoute()
const dmId = computed(() => route.params.dmId as string)

// Auth kontrolü
const { isAuthenticated, isLoading: authLoading, user: currentUser } = useAuth()
if (!authLoading.value && !isAuthenticated.value) {
  navigateTo('/login')
}

// WebSocket başlat
const { connect, isConnected } = useWebSocket()
onMounted(() => {
  const token = localStorage.getItem('discord_access_token')
  if (token && !isConnected.value) connect(token)
})

const showProfile = ref(false)

// ─── Kanal bilgisi (isim, karşı kullanıcı) ────────────────────────────────────
interface ChannelInfo {
  name: string
  recipientId?: string
  recipientStatus?: string
  avatar?: string
}

const channelInfo = ref<ChannelInfo | null>(null)
const recipientProfile = ref<any>(null)

async function loadChannelInfo(channelId: string) {
  try {
    // 1) DM kanalları listesini çek, içinden bu kanalı bul
    const res = await messageService.getDMChannels()
    if (res.success && Array.isArray(res.data)) {
      const ch = (res.data as any[]).find(c => (c._id ?? c.id) === channelId)
      if (ch) {
        const recipients: any[] = ch.recipients ?? ch.participants ?? []
        const other = recipients.find((r: any) => (r._id ?? r.id) !== currentUser.value?.id)
          ?? recipients[0]
        channelInfo.value = {
          name: ch.name ?? other?.displayName ?? other?.username ?? `DM`,
          recipientId: other?._id ?? other?.id,
          recipientStatus: other?.status ?? 'offline',
          avatar: ch.iconUrl ?? other?.avatarUrl ?? other?.avatar,
        }
        // 2) Eğer recipientId varsa tam profili çek
        if (channelInfo.value.recipientId) {
          const profRes = await userService.getUserById(channelInfo.value.recipientId)
          if (profRes.success && profRes.data) {
            recipientProfile.value = profRes.data
          }
        }
      }
    }
  } catch (e) {
    console.warn('[dmId] kanal bilgisi alınamadı:', e)
  }
}

// ProfileUser: UserProfile bileşeni için normalize
const profileUser = computed(() => {
  if (recipientProfile.value) {
    const p = recipientProfile.value
    return {
      username: p.username,
      displayName: p.displayName ?? p.username,
      avatar: p.avatarUrl ?? p.avatar,
      status: p.status ?? channelInfo.value?.recipientStatus,
      bannerColor: p.bannerColor ?? '#5865F2',
      createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
      badges: p.badges,
    }
  }
  if (channelInfo.value) {
    return {
      username: channelInfo.value.name,
      displayName: channelInfo.value.name,
      avatar: channelInfo.value.avatar,
      status: channelInfo.value.recipientStatus ?? 'offline',
      bannerColor: '#5865F2',
    }
  }
  return undefined
})

onMounted(() => {
  if (dmId.value) loadChannelInfo(dmId.value)
})

watch(dmId, (newId) => {
  if (newId) {
    channelInfo.value = null
    recipientProfile.value = null
    loadChannelInfo(newId)
  }
})
</script>
