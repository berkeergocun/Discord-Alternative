<template>
  <div class="w-60 bg-bg-secondary flex flex-col h-full">
    <!-- Sidebar Header -->
    <SidebarHeader />
    
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
      <slot />
    </div>
    
    <!-- User Panel -->
    <UserPanel />
  </div>
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
