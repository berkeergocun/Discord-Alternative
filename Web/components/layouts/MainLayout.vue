<template>
  <div class="flex h-full w-full">
    <!-- Server Rail -->
    <ServerRail
      :servers="servers"
      :activeServerId="activeServerId"
      @server-change="handleServerChange"
      @add-server="handleAddServer"
      @explore="handleExplore"
    />
    
    <!-- Sidebar (Channels or DM List) -->
    <Sidebar
      :type="sidebarType"
      :headerTitle="sidebarTitle"
      :user="currentUser"
      @menu-click="handleMenuClick"
      @search="handleSearch"
      @settings="handleSettings"
      @voice-settings="handleVoiceSettings"
    >
      <!-- DM List or Channel List -->
      <DMList 
        v-if="activeServerId === '@me'" 
        :dms="dms"
        :activeDmId="activeDmId"
        @friends="handleFriendsView"
        @dm-select="handleDmSelect"
      />
      <ChannelList
        v-else
        :categories="currentChannels"
        :activeChannelId="activeChannelId"
        @channel-select="handleChannelSelect"
      />
    </Sidebar>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex min-w-0">
      <!-- Friends View (takes full width) -->
      <div v-if="activeView === 'friends'" class="flex-1 flex min-w-0">
        <FriendsView
          class="flex-1"
          :friends="friends"
          @start-dm="handleDmSelect"
        />
      </div>
      
      <!-- Chat Area (DM or Channel - takes remaining space) -->
      <div v-else-if="activeView === 'dm' || activeView === 'channel'" class="flex-1 flex min-w-0">
        <ChatArea
          class="flex-1 min-w-0"
          :channelName="activeView === 'dm' ? activeDmName : activeChannelName"
          :channelDescription="activeView === 'channel' ? activeChannelDescription : ''"
          :channelType="activeView === 'dm' ? 'dm' : activeChannelType"
          :messages="currentMessages"
          :isLoading="isLoadingMessages"
          :typingUsers="typingUsers"
          :replyTo="replyTo"
          @pins="handlePins"
          @threads="handleThreads"
          @members="toggleMemberList"
          @search="handleChannelSearch"
          @load-more="loadMoreMessages"
          @send="handleSendMessage"
          @reply="handleReply"
          @react="handleReact"
          @edit="handleEdit"
          @delete="handleDelete"
          @cancel-reply="replyTo = null"
          @typing="handleTyping"
        />
      </div>
      
      <!-- Member List (fixed width, right-aligned in channel view) -->
      <MemberList
        v-if="activeView === 'channel' && showMemberList"
        class="w-60 shrink-0"
        :members="currentMembers"
        :roles="currentRoles"
        @member-click="handleMemberClick"
      />
      
      <!-- Activity Feed (fixed width, right-aligned in friends view ONLY) -->
      <template v-if="activeView === 'friends'">
        <Suspense>
          <template #default>
            <div class="w-80 border-l border-bg-tertiary shrink-0">
              <ActivityFeed
                :activities="activeActivities"
                @activity-click="handleActivityClick"
              />
            </div>
          </template>
          <template #fallback>
            <div class="w-80 border-l border-bg-tertiary shrink-0">
              <ActivityFeedSkeleton />
            </div>
          </template>
        </Suspense>
      </template>
      
      <!-- User Profile (fixed width, right-aligned in DM view for 1-on-1) -->
      <template v-if="activeView === 'dm' && currentDmType === 'dm'">
        <Suspense>
          <template #default>
            <div class="shrink-0">
              <UserProfile
                :user="currentDmUser"
                :note="currentDmNote"
                @call="handleCall"
                @video-call="handleVideoCall"
                @add-friend="handleAddFriend"
                @block="handleBlock"
                @remove-friend="handleRemoveFriend"
                @note-change="handleNoteChange"
              />
            </div>
          </template>
          <template #fallback>
            <UserProfileSkeleton />
          </template>
        </Suspense>
      </template>
      
      <!-- Group Profile (fixed width, right-aligned in DM view for groups) -->
      <template v-if="activeView === 'dm' && currentDmType === 'group'">
        <GroupProfile
          :groupName="currentGroupName"
          :memberCount="currentGroupMemberCount"
          :owner="currentGroupOwner"
          :members="currentGroupMembers"
          @member-click="handleMemberClick"
          @leave-group="handleLeaveGroup"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { mockServers, mockChannels, mockDMs, mockFriends, mockMessages, mockMembers, mockRoles } = useMockData()

const currentUser = ref({
  id: 'me',
  username: 'kullanici',
  displayName: 'Kullanıcı',
  avatar: '',
  status: 'online' as const,
  customStatus: 'Discord Alternatifini kullanıyor'
})

const route = useRoute()

const servers = ref(mockServers)
const activeServerId = ref('@me')
const activeChannelId = ref('')
const activeDmId = ref('')
const activeView = ref<'friends' | 'dm' | 'channel'>('friends')
const showMemberList = ref(true)
const replyTo = ref(null)
const isLoadingMessages = ref(false)
const typingUsers = ref<string[]>([])

// Initialize from route
onMounted(() => {
  const serverId = route.params.serverId as string
  const channelId = route.params.channelId as string
  
  if (serverId) {
    activeServerId.value = serverId
    
    if (channelId) {
      if (serverId === '@me') {
        // DM conversation
        activeDmId.value = channelId
        activeView.value = 'dm'
      } else {
        // Server channel
        activeChannelId.value = channelId
        activeView.value = 'channel'
      }
    } else {
      // Just server or @me without channel
      if (serverId === '@me') {
        activeView.value = 'friends'
      } else {
        activeView.value = 'channel'
      }
    }
  }
})

// Watch route changes
watch(() => route.params, (params) => {
  const serverId = params.serverId as string
  const channelId = params.channelId as string
  
  if (serverId) {
    activeServerId.value = serverId
    
    if (channelId) {
      if (serverId === '@me') {
        activeDmId.value = channelId
        activeView.value = 'dm'
      } else {
        activeChannelId.value = channelId
        activeView.value = 'channel'
      }
    } else {
      if (serverId === '@me') {
        activeView.value = 'friends'
        activeDmId.value = ''
        activeChannelId.value = ''
      } else {
        activeView.value = 'channel'
        activeChannelId.value = ''
      }
    }
  }
}, { immediate: true })

// Computed properties
const sidebarType = computed(() => activeServerId.value === '@me' ? 'dm' : 'server')
const sidebarTitle = computed(() => {
  if (activeServerId.value === '@me') return 'Direkt Mesajlar'
  const server = servers.value.find(s => s.id === activeServerId.value)
  return server?.name || 'Sunucu'
})

const currentChannels = computed(() => {
  if (activeServerId.value === '@me') return []
  return mockChannels[activeServerId.value as keyof typeof mockChannels] || []
})

const dms = computed(() => mockDMs)
const friends = computed(() => mockFriends)

const activeActivities = computed(() => {
  return mockFriends
    .filter(f => f.activity && !f.bot && f.status !== 'offline')
    .map(f => ({
      userId: f.id,
      username: f.username,
      displayName: f.displayName,
      avatar: f.avatar,
      status: f.status,
      activity: f.activity,
      activityType: f.activityType,
      activityDetails: f.activityDetails,
      timestamp: f.timestamp
    }))
})

const currentMessages = computed(() => {
  if (activeView.value === 'dm' && activeDmId.value) {
    return mockMessages[activeDmId.value as keyof typeof mockMessages] || []
  }
  if (activeView.value === 'channel' && activeChannelId.value) {
    return mockMessages[activeChannelId.value as keyof typeof mockMessages] || []
  }
  return []
})

const activeDmName = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  if (!dm) return ''
  
  if (dm.type === 'dm') {
    return dm.name
  } else {
    return dm.name || dm.members?.map(m => m.username).join(', ') || 'Grup'
  }
})

const activeChannelName = computed(() => {
  for (const category of currentChannels.value) {
    const channel = category.channels.find(ch => ch.id === activeChannelId.value)
    if (channel) return channel.name
  }
  return ''
})

const activeChannelDescription = computed(() => {
  return 'Kanal açıklaması buraya gelecek'
})

const activeChannelType = computed(() => {
  for (const category of currentChannels.value) {
    const channel = category.channels.find(ch => ch.id === activeChannelId.value)
    if (channel) return channel.type
  }
  return 'text' as const
})

const currentMembers = computed(() => mockMembers)
const currentRoles = computed(() => mockRoles)

// DM User Profile
const currentDmType = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  return dm?.type || 'dm'
})

const currentDmUser = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  if (!dm || dm.type !== 'dm') return null
  
  const friend = mockFriends.find(f => f.id === dm.userId)
  if (!friend) return null
  
  return {
    id: friend.id,
    username: friend.username,
    displayName: friend.displayName,
    avatar: friend.avatar,
    banner: friend.banner,
    bannerColor: friend.bannerColor,
    status: friend.status,
    customStatus: friend.customStatus,
    createdAt: friend.createdAt,
    badges: friend.badges
  }
})

const currentDmNote = ref('')

// Group Profile
const currentGroupName = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  return dm?.type === 'group' ? dm.name : ''
})

const currentGroupMemberCount = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  return dm?.type === 'group' ? (dm.members?.length || 0) : 0
})

const currentGroupOwner = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  if (!dm || dm.type !== 'group' || !dm.owner) return null
  
  const owner = mockFriends.find(f => f.id === dm.owner)
  if (!owner) return null
  
  return {
    id: owner.id,
    username: owner.username,
    displayName: owner.displayName,
    avatar: owner.avatar,
    status: owner.status,
    activity: owner.activity
  }
})

const currentGroupMembers = computed(() => {
  const dm = mockDMs.find(d => d.id === activeDmId.value)
  if (!dm || dm.type !== 'group' || !dm.members) return []
  
  return dm.members
    .filter((memberId: string) => memberId !== dm.owner)
    .map((memberId: string) => {
      const friend = mockFriends.find(f => f.id === memberId)
      if (!friend) return null
      
      return {
        id: friend.id,
        username: friend.username,
        displayName: friend.displayName,
        avatar: friend.avatar,
        status: friend.status,
        activity: friend.activity
      }
    })
    .filter(Boolean)
})

// Event handlers
const handleServerChange = (serverId: string) => {
  activeServerId.value = serverId
  activeChannelId.value = ''
  activeDmId.value = ''
  
  if (serverId === '@me') {
    activeView.value = 'friends'
    navigateTo('/channels/@me')
  } else {
    activeView.value = 'channel'
    navigateTo(`/channels/${serverId}`)
  }
}

const handleChannelSelect = (channelId: string) => {
  activeChannelId.value = channelId
  activeView.value = 'channel'
  navigateTo(`/channels/${activeServerId.value}/${channelId}`)
}

const handleDmSelect = (dmId: string) => {
  activeDmId.value = dmId
  activeView.value = 'dm'
  navigateTo(`/channels/@me/${dmId}`)
}

const handleFriendsView = () => {
  activeView.value = 'friends'
  activeDmId.value = ''
  activeChannelId.value = ''
  navigateTo('/channels/@me')
}

const handleAddServer = () => {
  console.log('Add server')
}

const handleExplore = () => {
  console.log('Explore servers')
}

const handleMenuClick = () => {
  console.log('Menu clicked')
}

const handleSearch = (query: string) => {
  console.log('Search:', query)
}

const handleSettings = () => {
  console.log('Open settings')
}

const handleVoiceSettings = () => {
  console.log('Voice settings')
}

const handlePins = () => {
  console.log('Show pins')
}

const handleThreads = () => {
  console.log('Show threads')
}

const toggleMemberList = () => {
  showMemberList.value = !showMemberList.value
}

const handleChannelSearch = () => {
  console.log('Channel search')
}

const loadMoreMessages = () => {
  console.log('Load more messages')
}

const handleSendMessage = (message: string) => {
  console.log('Send message:', message)
  currentMessages.value.push({
    id: `msg${Date.now()}`,
    author: currentUser.value,
    content: message,
    timestamp: new Date()
  })
}

const handleReply = (messageId: string) => {
  const message = currentMessages.value.find(m => m.id === messageId)
  if (message) {
    replyTo.value = message as any
  }
}

const handleReact = (data: { messageId: string, emoji: string }) => {
  console.log('React:', data)
}

const handleEdit = (messageId: string) => {
  console.log('Edit message:', messageId)
}

const handleDelete = (messageId: string) => {
  console.log('Delete message:', messageId)
}

const handleTyping = () => {
  console.log('User is typing')
}

const handleMemberClick = (memberId: string) => {
  console.log('Member clicked:', memberId)
}

const handleActivityClick = (activity: any) => {
  // Start a DM with the user when clicking their activity
  const dm = mockDMs.find(d => d.userId === activity.userId)
  if (dm) {
    handleDmSelect(dm.id)
  }
}

const handleCall = () => {
  console.log('Start voice call')
}

const handleVideoCall = () => {
  console.log('Start video call')
}

const handleAddFriend = () => {
  console.log('Add friend')
}

const handleBlock = () => {
  console.log('Block user')
}

const handleRemoveFriend = () => {
  console.log('Remove friend')
}

const handleNoteChange = (note: string) => {
  currentDmNote.value = note
  console.log('Note updated:', note)
}

const handleLeaveGroup = () => {
  console.log('Leave group')
}
</script>
