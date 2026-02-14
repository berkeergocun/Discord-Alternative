<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50"
      @click="emit('close')"
    >
      <div
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
        class="absolute w-56 bg-bg-floating rounded shadow-xl py-1.5"
        @click.stop
      >
        <!-- Server Invite -->
        <button class="w-full px-3 py-2 text-left text-sm text-blurple hover:bg-blurple/10 transition-colors flex items-center gap-3">
          <UserPlus :size="16" :stroke-width="2" />
          Sunucuya Davet Et
        </button>

        <div class="h-px bg-bg-tertiary my-1.5" />

        <!-- Server Settings -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <Settings :size="16" :stroke-width="2" />
          Sunucu Ayarları
        </button>

        <!-- Create Channel -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <Plus :size="16" :stroke-width="2" />
          Kanal Oluştur
        </button>

        <!-- Create Category -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <FolderPlus :size="16" :stroke-width="2" />
          Kategori Oluştur
        </button>

        <div class="h-px bg-bg-tertiary my-1.5" />

        <!-- Create Event -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <Calendar :size="16" :stroke-width="2" />
          Etkinlik Oluştur
        </button>

        <div class="h-px bg-bg-tertiary my-1.5" />

        <!-- Notification Settings -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <Bell :size="16" :stroke-width="2" />
          Bildirim Ayarları
        </button>

        <!-- Privacy Settings -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center gap-3">
          <Shield :size="16" :stroke-width="2" />
          Gizlilik Ayarları
        </button>

        <div class="h-px bg-bg-tertiary my-1.5" />

        <!-- Show All Channels -->
        <button class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary/40 transition-colors flex items-center justify-between">
          <span class="flex items-center gap-3">
            <Eye :size="16" :stroke-width="2" />
            Tüm Kanalları Göster
          </span>
          <Check v-if="true" :size="16" :stroke-width="2" class="text-blurple" />
        </button>

        <div class="h-px bg-bg-tertiary my-1.5" />

        <!-- Leave Server -->
        <button class="w-full px-3 py-2 text-left text-sm text-accent-red hover:bg-accent-red/10 transition-colors flex items-center gap-3">
          <LogOut :size="16" :stroke-width="2" />
          Sunucudan Ayrıl
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { UserPlus, Settings, Plus, FolderPlus, Calendar, Bell, Shield, Eye, Check, LogOut } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  position: {
    top: number
    left: number
  }
}

defineProps<Props>()

const emit = defineEmits<{
  'close': []
}>()
</script>
