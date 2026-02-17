<template>
  <div class="flex h-full w-full">
    <!-- Server Rail -->
    <ServerRail />
    
    <!-- Sidebar -->
    <Sidebar>
      <!-- Content slot for sidebar items -->
      <slot name="sidebar"></slot>
    </Sidebar>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex min-w-0 relative">
      <!-- Main content slot -->
      <slot></slot>
    </div>
  </div>
</template>
