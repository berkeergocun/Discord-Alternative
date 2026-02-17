<template>
  <div class="w-[72px] bg-bg-tertiary flex flex-col items-center py-3 gap-2 h-full overflow-y-auto">
    <!-- Home/DM Button -->
    <div class="mb-2">
      <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-blurple transition-all duration-200 flex items-center justify-center cursor-pointer">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </div>
    </div>
    
    <!-- Separator -->
    <div class="w-8 h-[2px] bg-bg-secondary rounded-full my-1" />
    
    <!-- Server List (Static Examples) -->
    <div class="flex flex-col items-center gap-2 flex-1">
      <!-- Example Server 1 -->
      <div class="relative">
        <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-indigo-500 transition-all duration-200 flex items-center justify-center cursor-pointer text-white font-semibold">
          S1
        </div>
      </div>
      
      <!-- Example Server 2 -->
      <div class="relative">
        <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-green-500 transition-all duration-200 flex items-center justify-center cursor-pointer text-white font-semibold">
          S2
        </div>
        <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
      </div>
      
      <!-- Example Server 3 -->
      <div class="relative">
        <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-purple-500 transition-all duration-200 flex items-center justify-center cursor-pointer text-white font-semibold">
          S3
        </div>
      </div>
    </div>
    
    <!-- Add Server Button -->
    <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-bg-secondary hover:bg-accent-green transition-all duration-200 flex items-center justify-center cursor-pointer group">
      <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
    
    <!-- Explore Button -->
    <div class="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-bg-secondary hover:bg-accent-green transition-all duration-200 flex items-center justify-center cursor-pointer group">
      <svg class="w-6 h-6 text-accent-green group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>
      </svg>
    </div>
  </div>
</template>
