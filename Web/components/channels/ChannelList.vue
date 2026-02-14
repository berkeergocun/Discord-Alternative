<template>
  <div>
    <Suspense>
      <template #default>
        <div class="flex flex-col gap-1 p-2">
          <div v-for="category in categories" :key="category.id">
            <CategoryHeader
              :name="category.name"
              :isCollapsed="collapsedCategories.includes(category.id)"
              @toggle="toggleCategory(category.id)"
              @add-channel="openCreateChannelModal(category)"
            />
            
            <div v-if="!collapsedCategories.includes(category.id)" class="space-y-0.5 mt-0.5">
              <ChannelItem
                v-for="channel in category.channels"
                :key="channel.id"
                :channel="channel"
                :isActive="activeChannelId === channel.id"
                @click="emit('channel-select', channel.id)"
                @join-voice="emit('join-voice', channel.id)"
              />
            </div>
          </div>
        </div>
      </template>
      <template #fallback>
        <ChannelListSkeleton />
      </template>
    </Suspense>
    
    <!-- Create Channel Modal (outside Suspense) -->
    <CreateChannelModal
      v-model:open="isModalOpen"
      :category-name="selectedCategory?.name || ''"
      @create="handleCreateChannel"
    />
  </div>
</template>

<script setup lang="ts">
import CreateChannelModal from './CreateChannelModal.vue'

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'announcement' | 'forum' | 'stage'
  isLocked?: boolean
  isNsfw?: boolean
  unreadCount?: number
  hasUnread?: boolean
  activeUsers?: number
  maxUsers?: number
}

interface Category {
  id: string
  name: string
  channels: Channel[]
}

interface Props {
  categories: Category[]
  activeChannelId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'channel-select': [channelId: string]
  'join-voice': [channelId: string]
  'create-channel': [categoryId: string, type: string, name: string]
}>()

const collapsedCategories = ref<string[]>([])
const isModalOpen = ref(false)
const selectedCategory = ref<Category | null>(null)

const toggleCategory = (categoryId: string) => {
  const index = collapsedCategories.value.indexOf(categoryId)
  if (index > -1) {
    collapsedCategories.value.splice(index, 1)
  } else {
    collapsedCategories.value.push(categoryId)
  }
}

const openCreateChannelModal = (category: Category) => {
  selectedCategory.value = category
  isModalOpen.value = true
}

const handleCreateChannel = (type: string, name: string) => {
  if (selectedCategory.value) {
    emit('create-channel', selectedCategory.value.id, type, name)
  }
}
</script>
