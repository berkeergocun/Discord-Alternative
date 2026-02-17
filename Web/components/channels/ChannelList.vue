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

