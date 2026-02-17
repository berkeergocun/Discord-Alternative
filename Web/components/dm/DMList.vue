<template>
  <Suspense>
    <template #default>
      <div class="flex flex-col p-2">
        <!-- Friends Tab -->
        <div 
          class="flex items-center gap-3 px-2 py-1.5 mx-1 rounded cursor-pointer hover:bg-bg-tertiary/40 transition-colors mb-2"
          @click="emit('friends')"
        >
          <div class="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span class="text-base font-medium text-text-primary">Arkadaşlar</span>
        </div>
        
        <!-- DM Section Header -->
        <div class="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide">
          Direkt Mesajlar
        </div>
        
        <!-- DM List -->
        <div class="space-y-0.5">
          <DMItem
            v-for="dm in dms"
            :key="dm.id"
            :dm="dm"
            :isActive="activeDmId === dm.id"
            @click="emit('dm-select', dm.id)"
          />
        </div>
      </div>
    </template>
    <template #fallback>
      <DMListSkeleton />
    </template>
  </Suspense>
</template>

