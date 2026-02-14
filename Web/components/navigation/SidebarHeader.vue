<template>
  <div class="shrink-0 relative">
    <!-- Server Header with Banner (if server type) -->
    <div v-if="type === 'server' && server" class="relative">
      <!-- Banner (Always Visible) -->
      <div class="relative h-[120px] overflow-hidden">
        <!-- Banner Image/Color Background -->
        <div 
          class="absolute inset-0"
          :style="{ 
            backgroundColor: server.bannerColor || '#5865F2',
            backgroundImage: server.banner ? `url(${server.banner})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        />
        
        <!-- Dark Top Overlay for Header -->
        <div class="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />
        
        <!-- Server Name Header (Overlaid at top) -->
        <DropdownMenu>
          <DropdownMenuTrigger 
            class="absolute top-0 left-0 right-0 h-12 px-3 flex items-center justify-between cursor-pointer z-10 hover:backdrop-blur-sm hover:bg-black/20 transition-all w-full text-left"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <!-- Server Icon Small -->
              <div class="w-6 h-6 rounded-full bg-bg-tertiary/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold shrink-0">
                {{ server.name?.[0] || '?' }}
              </div>
              <h2 class="font-semibold text-white text-sm truncate drop-shadow-lg">{{ title }}</h2>
            </div>
            
            <!-- Dropdown icon -->
            <ChevronDown 
              :size="18"
              :stroke-width="2.5"
              class="text-white/90 drop-shadow shrink-0"
            />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent class="w-auto min-w-56 ml-1" :side-offset="8" align="start">
            <!-- Server Invite -->
            <DropdownMenuItem class="text-blurple hover:bg-blurple/10 focus:bg-blurple/10">
              <UserPlus :size="16" :stroke-width="2" />
              <span>Sunucuya Davet Et</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Server Settings -->
            <DropdownMenuItem>
              <Settings :size="16" :stroke-width="2" />
              <span>Sunucu Ayarları</span>
            </DropdownMenuItem>

            <!-- Create Channel -->
            <DropdownMenuItem>
              <Plus :size="16" :stroke-width="2" />
              <span>Kanal Oluştur</span>
            </DropdownMenuItem>

            <!-- Create Category -->
            <DropdownMenuItem>
              <FolderPlus :size="16" :stroke-width="2" />
              <span>Kategori Oluştur</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Create Event -->
            <DropdownMenuItem>
              <Calendar :size="16" :stroke-width="2" />
              <span>Etkinlik Oluştur</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Notification Settings -->
            <DropdownMenuItem>
              <Bell :size="16" :stroke-width="2" />
              <span>Bildirim Ayarları</span>
            </DropdownMenuItem>

            <!-- Privacy Settings -->
            <DropdownMenuItem>
              <Shield :size="16" :stroke-width="2" />
              <span>Gizlilik Ayarları</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Show All Channels -->
            <DropdownMenuItem>
              <Eye :size="16" :stroke-width="2" />
              <span>Tüm Kanalları Göster</span>
              <Check :size="16" :stroke-width="2" class="text-blurple ml-auto" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- Leave Server -->
            <DropdownMenuItem class="text-accent-red hover:bg-accent-red/10 focus:bg-accent-red/10 focus:text-accent-red">
              <LogOut :size="16" :stroke-width="2" />
              <span>Sunucudan Ayrıl</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div class="border-b border-bg-tertiary" />
    </div>
    
    <!-- Regular Header (for DM or no server) -->
    <div 
      v-else
      class="h-12 border-b border-bg-tertiary px-4 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
      @click="handleClick"
    >
      <h2 class="font-semibold text-text-primary truncate flex-1">{{ title }}</h2>
      
      <!-- Search icon for DM -->
      <button 
        class="p-1 hover:bg-bg-tertiary rounded"
        @click.stop="emit('search', '')"
      >
        <Search :size="20" :stroke-width="2.5" class="text-text-secondary" />
      </button>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Search, UserPlus, Settings, Plus, FolderPlus, Calendar, Bell, Shield, Eye, Check, LogOut } from 'lucide-vue-next'
import DropdownMenu from '~/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '~/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '~/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '~/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '~/components/ui/dropdown-menu/DropdownMenuSeparator.vue'

interface Server {
  id: string
  name: string
  icon?: string
  banner?: string
  bannerColor?: string
  description?: string
  boostLevel?: number
  boostCount?: number
  boostGoal?: number
}

interface Props {
  title: string
  type: 'server' | 'dm'
  server?: Server | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'menu-click': []
  'search': [query: string]
}>()

const handleClick = () => {
  emit('menu-click')
}
</script>
