<template>
  <div class="flex-1 flex flex-col bg-bg-chat h-full">
    <!-- Header -->
    <div class="h-12 border-b border-bg-tertiary px-4 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <h3 class="text-base font-semibold text-text-primary">Arkadaşlar</h3>
      </div>
      
      <div class="h-6 w-px bg-bg-tertiary" />
      
      <!-- Tabs -->
      <div class="flex items-center gap-4">
        <button class="px-2 py-1 text-sm font-medium rounded transition-colors bg-bg-secondary text-text-primary">
          Çevrimiçi
        </button>
        <button class="px-2 py-1 text-sm font-medium rounded transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50">
          Tümü
        </button>
        <button class="px-2 py-1 text-sm font-medium rounded transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50">
          Bekleyen
        </button>
        <button class="px-2 py-1 text-sm font-medium rounded transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50">
          Engellenen
        </button>
      </div>
      
      <div class="flex-1" />
      
      <button class="hidden md:block px-3 py-1.5 bg-accent-green text-white text-sm font-medium rounded hover:bg-accent-green/90 transition-colors">
        Arkadaş Ekle
      </button>
    </div>
    
    <!-- Search Bar -->
    <div class="px-8 pt-4 pb-2">
      <input
        type="text"
        placeholder="Ara"
        class="w-full px-3 py-2 bg-bg-tertiary text-text-primary text-sm rounded border border-transparent focus:border-blurple outline-none placeholder:text-text-muted"
      />
    </div>
    
    <!-- Friends List -->
    <div class="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
      <div class="space-y-2">
        <!-- Friend Item Example -->
        <div class="flex items-center justify-between p-3 rounded-lg border-t border-bg-secondary hover:bg-bg-secondary/50 transition-colors">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="relative">
              <div class="w-8 h-8 rounded-full bg-blurple flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-accent-green rounded-full border-2 border-bg-chat"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-text-primary">
                  User123
                </span>
              </div>
              <p class="text-xs text-text-muted truncate">
                Çevrimiçi
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button class="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors" title="Mesaj Gönder">
              <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
            <button class="p-2 rounded-full hover:bg-bg-secondary transition-colors">
              <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- More friend items can be added here -->
        <div class="flex items-center justify-between p-3 rounded-lg border-t border-bg-secondary hover:bg-bg-secondary/50 transition-colors">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="relative">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                T
              </div>
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-bg-chat"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-text-primary">
                  TestUser
                </span>
              </div>
              <p class="text-xs text-text-muted truncate">
                Boşta
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button class="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors" title="Mesaj Gönder">
              <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
            <button class="p-2 rounded-full hover:bg-bg-secondary transition-colors">
              <svg class="w-5 h-5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
