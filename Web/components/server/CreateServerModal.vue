<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[420px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
      <DialogHeader class="text-center px-6 pt-6 pb-2">
        <DialogTitle class="text-2xl font-bold text-text-primary">
          Sunucunu Oluştur
        </DialogTitle>
        <DialogDescription class="text-sm text-text-muted mt-1.5">
          Sunucun, arkadaşlarınla takıldığınız yerdir. Kendi sunucunu oluştur ve konuşmaya başla.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        <!-- Kendim Oluşturayım -->
        <button
          type="button"
          class="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-floating border border-transparent hover:border-bg-floating transition-all duration-200 text-left group/row"
          @click="emit('create-custom')"
        >
          <div class="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            <Home class="w-5 h-5 text-accent-green" />
          </div>
          <span class="flex-1 font-medium text-text-primary">Kendim Oluşturayım</span>
          <ChevronRight class="w-5 h-5 text-text-muted shrink-0 group-hover/row:text-text-primary transition-colors" />
        </button>

        <!-- Templates section -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide px-1">
            BİR ŞABLON KULLANARAK BAŞLA
          </p>
          <div class="space-y-1">
            <button
              v-for="template in templates"
              :key="template.id"
              type="button"
              class="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-floating border border-transparent hover:border-bg-floating transition-all duration-200 text-left group/row"
              @click="emit('create-from-template', template.id)"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  template.bgClass
                ]"
              >
                <component :is="template.icon" :class="['w-5 h-5', template.iconClass]" />
              </div>
              <span class="flex-1 font-medium text-text-primary">{{ template.label }}</span>
              <ChevronRight class="w-5 h-5 text-text-muted shrink-0 group-hover/row:text-text-primary transition-colors" />
            </button>
          </div>
        </div>

        <!-- Join server section -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-text-muted uppercase tracking-wide px-1">
            Zaten davetin var mı?
          </p>
          <button
            type="button"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-bg-tertiary hover:bg-bg-floating border border-bg-floating text-text-primary font-medium text-sm transition-colors"
            @click="emit('join-server')"
          >
            Bir Sunucuya Katıl
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Home, Gamepad2, Heart, Brain, GraduationCap, ChevronRight } from 'lucide-vue-next'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'

interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'create-custom': []
  'create-from-template': [templateId: string]
  'join-server': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const templates = [
  {
    id: 'gaming',
    label: 'Oyun',
    icon: Gamepad2,
    bgClass: 'bg-[#5865F2]/20',
    iconClass: 'text-[#5865F2]'
  },
  {
    id: 'friends',
    label: 'Arkadaşlar',
    icon: Heart,
    bgClass: 'bg-pink-500/20',
    iconClass: 'text-pink-500'
  },
  {
    id: 'study',
    label: 'Çalışma Grubu',
    icon: Brain,
    bgClass: 'bg-amber-500/20',
    iconClass: 'text-amber-500'
  },
  {
    id: 'school',
    label: 'Okul Kulübü',
    icon: GraduationCap,
    bgClass: 'bg-sky-500/20',
    iconClass: 'text-sky-500'
  }
]
</script>
