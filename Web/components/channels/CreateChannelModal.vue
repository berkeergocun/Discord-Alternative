<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Kanal Oluştur</DialogTitle>
        <DialogDescription>
          {{ categoryName }} kategorisine yeni bir kanal ekleyin.
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-4 px-6">
        <!-- Channel Type Selection -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-text-muted uppercase tracking-wide">
            Kanal Tipi
          </label>
          <div class="space-y-2">
            <button
              v-for="type in channelTypes"
              :key="type.value"
              :class="cn(
                'w-full flex items-center gap-3 p-3 rounded-md border transition-colors text-left',
                selectedType === type.value
                  ? 'border-blurple bg-blurple/10'
                  : 'border-bg-tertiary hover:border-bg-floating hover:bg-bg-tertiary/50'
              )"
              @click="selectedType = type.value"
            >
              <component 
                :is="type.icon" 
                :size="20" 
                :stroke-width="2.5"
                :class="selectedType === type.value ? 'text-blurple' : 'text-text-muted'"
              />
              <div class="flex-1">
                <div class="font-semibold text-text-primary text-sm">{{ type.label }}</div>
                <div class="text-xs text-text-muted">{{ type.description }}</div>
              </div>
              <div 
                v-if="selectedType === type.value"
                class="w-5 h-5 rounded-full bg-blurple flex items-center justify-center"
              >
                <Check :size="14" :stroke-width="3" class="text-white" />
              </div>
              <div 
                v-else
                class="w-5 h-5 rounded-full border-2 border-text-muted"
              />
            </button>
          </div>
        </div>
        
        <!-- Channel Name Input -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-text-muted uppercase tracking-wide">
            Kanal Adı
          </label>
          <div class="relative">
            <component 
              :is="channelTypes.find(t => t.value === selectedType)?.icon"
              :size="20"
              :stroke-width="2.5"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              v-model="channelName"
              type="text"
              placeholder="yeni-kanal"
              class="w-full pl-10 pr-3 py-2.5 bg-bg-tertiary text-text-primary rounded border border-bg-tertiary focus:border-blurple outline-none transition-colors"
              @input="formatChannelName"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <button
          class="px-4 py-2 text-sm font-medium text-text-primary hover:underline"
          @click="isOpen = false"
        >
          İptal
        </button>
        <button
          :disabled="!channelName.trim()"
          class="px-4 py-2 text-sm font-medium bg-blurple text-white rounded hover:bg-blurple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="createChannel"
        >
          Kanal Oluştur
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Hash, Volume2, Megaphone, MessageSquare, Radio, Check } from 'lucide-vue-next'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'

interface Props {
  open?: boolean
  categoryName?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  categoryName: ''
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'create': [type: string, name: string]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const channelTypes = [
  {
    value: 'text',
    label: 'Metin Kanalı',
    description: 'Mesaj, resim, emoji ve diğer içerikleri gönderin',
    icon: Hash
  },
  {
    value: 'voice',
    label: 'Ses Kanalı',
    description: 'Sesli sohbet, video ve ekran paylaşımı yapın',
    icon: Volume2
  },
  {
    value: 'announcement',
    label: 'Duyuru Kanalı',
    description: 'Önemli duyurular için özel kanal',
    icon: Megaphone
  },
  {
    value: 'forum',
    label: 'Forum Kanalı',
    description: 'Konular hakkında organize tartışmalar başlatın',
    icon: MessageSquare
  },
  {
    value: 'stage',
    label: 'Sahne Kanalı',
    description: 'Dinleyicilerle moderasyonlu konuşmalar yapın',
    icon: Radio
  }
]

const selectedType = ref<string>('text')
const channelName = ref('')

const formatChannelName = () => {
  // Convert to lowercase and replace spaces with hyphens
  channelName.value = channelName.value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
}

const createChannel = () => {
  if (channelName.value.trim()) {
    emit('create', selectedType.value, channelName.value.trim())
    // Reset form
    channelName.value = ''
    selectedType.value = 'text'
    isOpen.value = false
  }
}

// Reset form when modal closes
watch(isOpen, (value) => {
  if (!value) {
    channelName.value = ''
    selectedType.value = 'text'
  }
})
</script>
