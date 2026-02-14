<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col gap-1 p-2">
        <div v-for="category in categories" :key="category.id">
          <CategoryHeader
            :name="category.name"
            :isCollapsed="collapsedCategories.includes(category.id)"
            @toggle="toggleCategory(category.id)"
          />
          
          <div v-if="!collapsedCategories.includes(category.id)" class="space-y-0.5 mt-0.5">
            <ChannelItem
              v-for="channel in category.channels"
              :key="channel.id"
              :channel="channel"
              :isActive="activeChannelId === channel.id"
              @click="emit('channel-select', channel.id)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <ChannelListSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'announcement' | 'forum' | 'stage'
  isLocked?: boolean
  isNsfw?: boolean
  unreadCount?: number
  hasUnread?: boolean
  activeUsers?: number
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

defineProps<Props>()

const emit = defineEmits<{
  'channel-select': [channelId: string]
}>()

const collapsedCategories = ref<string[]>([])

const toggleCategory = (categoryId: string) => {
  const index = collapsedCategories.value.indexOf(categoryId)
  if (index > -1) {
    collapsedCategories.value.splice(index, 1)
  } else {
    collapsedCategories.value.push(categoryId)
  }
}
</script>
