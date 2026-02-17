<template>
  <div class="h-12 border-b border-bg-tertiary px-4 flex items-center justify-between">
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <!-- Channel Icon -->
      <Hash 
        v-if="type === 'text'"
        :size="24"
        :stroke-width="2.5"
        class="text-text-muted shrink-0"
      />
      
      <Volume2 
        v-else-if="type === 'voice'"
        :size="24"
        :stroke-width="2.5"
        class="text-text-muted shrink-0"
      />
      
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-text-primary truncate">
          {{ title }}
        </h3>
        <p v-if="description" class="text-xs text-text-muted truncate">
          {{ description }}
        </p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('threads')"
        title="Konular"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <line x1="9" y1="10" x2="15" y2="10"/>
          <line x1="12" y1="7" x2="12" y2="13"/>
        </svg>
      </button>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('pins')"
        title="Sabitlenmiş Mesajlar"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="17" x2="12" y2="22"/>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
        </svg>
      </button>
      
      <!-- Members button (for channels) -->
      <button 
        v-if="type !== 'dm'"
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('members')"
        :title="showMemberList ? 'Üyeleri Gizle' : 'Üyeleri Göster'"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </button>
      
      <!-- Profile toggle (for DMs) -->
      <button 
        v-if="type === 'dm'"
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('toggle-profile')"
        :title="(showUserProfile || showGroupProfile) ? 'Profili Gizle' : 'Profili Göster'"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('search')"
        title="Ara"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  type?: 'text' | 'voice' | 'dm' | 'group'
  showMemberList?: boolean
  showUserProfile?: boolean
  showGroupProfile?: boolean
}>(), {
  title: 'Kanal',
  type: 'text',
})

const emit = defineEmits<{
  pins: []
  threads: []
  members: []
  'toggle-profile': []
  search: []
}>()
</script>
