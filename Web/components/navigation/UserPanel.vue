<template>
  <div class="h-[52px] bg-bg-tertiary px-2 py-2 flex items-center gap-2">
    <!-- User Avatar and Info -->
    <div class="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:bg-bg-secondary/50 rounded p-1 -ml-1 transition-colors">
      <div class="relative">
        <div v-if="user?.avatar" class="w-8 h-8 rounded-full overflow-hidden">
          <img :src="user.avatar" :alt="user.username" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-8 h-8 rounded-full bg-blurple flex items-center justify-center text-white font-semibold text-sm">
          {{ user?.username?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg-tertiary"></div>
      </div>
      
      <div class="flex flex-col min-w-0 flex-1">
        <span class="text-sm font-semibold text-text-primary truncate">
          {{ user?.displayName || user?.username || 'Kullanıcı' }}
        </span>
        <span class="text-xs text-text-secondary truncate">
          Çevrimiçi
        </span>
      </div>
    </div>
    
    <!-- Control Buttons -->
    <div class="flex items-center gap-1">
      <!-- Mute/Unmute -->
      <button class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-secondary" title="Mikrofonu Sustur">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C10.3 2 9 3.3 9 5V12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12V5C15 3.3 13.7 2 12 2Z"/>
          <path d="M19 11C19 10.4 18.6 10 18 10C17.4 10 17 10.4 17 11C17 13.8 14.8 16 12 16C9.2 16 7 13.8 7 11C7 10.4 6.6 10 6 10C5.4 10 5 10.4 5 11C5 14.5 7.6 17.4 11 17.9V21H13V17.9C16.4 17.4 19 14.5 19 11Z"/>
        </svg>
      </button>
      
      <!-- Deafen/Undeafen -->
      <button class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-secondary" title="Sesi Kapat">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18V12C3 7.6 6.6 4 11 4H13C17.4 4 21 7.6 21 12V18C21 19.1 20.1 20 19 20H18V14H20V12C20 8.1 16.9 5 13 5H11C7.1 5 4 8.1 4 12V14H6V20H5C3.9 20 3 19.1 3 18Z"/>
        </svg>
      </button>
      
      <!-- Settings -->
      <button
        @click="showSettings = true"
        class="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded transition-colors text-text-secondary"
        title="Kullanıcı Ayarları"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Settings Modal -->
  <SettingsModal :is-open="showSettings" @close="showSettings = false" />
</template>

<script setup lang="ts">
import SettingsModal from './SettingsModal.vue'

const { user } = useAuth()
const showSettings = ref(false)
</script>