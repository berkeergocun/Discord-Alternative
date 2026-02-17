<template>
  <Suspense>
    <template #default>
      <div class="bg-bg-secondary flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div class="p-4 space-y-4">
          <div v-for="section in memberSections" :key="section.role">
            <MemberSection
              :role="section.role"
              :count="section.members.length"
              :color="section.color"
            />
            
            <div class="space-y-1 mt-2">
              <MemberItem
                v-for="member in section.members"
                :key="member.id"
                :member="member"
                @click="emit('member-click', member.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <MemberListSkeleton />
    </template>
  </Suspense>
</template>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2E3035;
}
</style>
