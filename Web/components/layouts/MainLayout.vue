<template>
  <div class="flex h-full w-full">
    <!-- Server Rail -->
    <ServerRail />
    
    <!-- Sidebar -->
    <Sidebar>
      <slot name="sidebar" />
    </Sidebar>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex min-w-0 relative">
      <!-- Main content -->
      <slot name="content" />
      
      <!-- Right panel (user/group profile) -->
      <slot name="right" />
    </div>
  </div>
</template>
