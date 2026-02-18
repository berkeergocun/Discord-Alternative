<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex"
      @keydown.esc="close"
      tabindex="-1"
      ref="modalRef"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="close" />

      <!-- Modal panel -->
      <div class="relative z-10 flex w-full h-full">
        <!-- Sol kenar boşluk (tıklayınca kapanır) -->
        <div class="flex-shrink-0 w-[calc((100%-740px)/2)] min-w-0" @click="close" />

        <!-- Sol sidebar -->
        <div class="w-[232px] flex-shrink-0 bg-bg-secondary py-[60px] flex flex-col">
          <div class="px-2 flex-1 overflow-y-auto">
            <!-- Kullanıcı Ayarları Başlık -->
            <div class="px-2.5 mb-1">
              <span class="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Kullanıcı Ayarları
              </span>
            </div>

            <button
              v-for="item in userMenuItems"
              :key="item.id"
              @click="activeSection = item.id"
              :class="[
                'w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors mb-0.5',
                activeSection === item.id
                  ? 'bg-blurple/20 text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              ]"
            >
              {{ item.label }}
            </button>

            <!-- Divider -->
            <div class="my-2 mx-2.5 border-t border-bg-primary" />

            <!-- Uygulama Ayarları -->
            <div class="px-2.5 mb-1 mt-2">
              <span class="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                Uygulama Ayarları
              </span>
            </div>

            <button
              v-for="item in appMenuItems"
              :key="item.id"
              @click="activeSection = item.id"
              :class="[
                'w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors mb-0.5',
                activeSection === item.id
                  ? 'bg-blurple/20 text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              ]"
            >
              {{ item.label }}
            </button>

            <!-- Divider -->
            <div class="my-2 mx-2.5 border-t border-bg-primary" />

            <!-- Çıkış Yap -->
            <button
              @click="handleLogout"
              class="w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center justify-between mb-0.5"
            >
              <span>Çıkış Yap</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>

            <!-- Versiyon -->
            <div class="px-2.5 mt-4">
              <span class="text-xs text-text-muted">Sürüm 1.0.0</span>
            </div>
          </div>
        </div>

        <!-- İçerik alanı -->
        <div class="flex-1 bg-bg-primary overflow-y-auto py-[60px] px-10 min-w-0 max-w-[740px]">
          <!-- Kapat butonu -->
          <button
            @click="close"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary/80 hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Hesabım -->
          <template v-if="activeSection === 'account'">
            <h2 class="text-xl font-semibold text-text-primary mb-5">Hesabım</h2>

            <!-- Profil kartı -->
            <div class="rounded-lg overflow-hidden mb-4 bg-bg-secondary">
              <!-- Banner -->
              <div class="h-24 bg-gradient-to-r from-blurple to-indigo-500" />

              <!-- Avatar + bilgi -->
              <div class="px-4 pb-4">
                <div class="flex items-end justify-between -mt-8 mb-3">
                  <div class="relative">
                    <div v-if="user?.avatar" class="w-20 h-20 rounded-full overflow-hidden border-4 border-bg-secondary">
                      <img :src="user.avatar" :alt="user.username" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-20 h-20 rounded-full border-4 border-bg-secondary bg-blurple flex items-center justify-center text-white font-bold text-2xl">
                      {{ user?.username?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <div class="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-bg-secondary" />
                  </div>
                  <button class="px-4 py-1.5 bg-blurple hover:bg-blurple-dark text-white text-sm font-medium rounded transition-colors">
                    Profili Düzenle
                  </button>
                </div>

                <div class="bg-bg-tertiary rounded-lg p-4 space-y-4">
                  <!-- Kullanıcı adı -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs text-text-secondary uppercase font-semibold mb-1">Kullanıcı Adı</div>
                      <div class="text-text-primary text-sm">{{ user?.username || '—' }}</div>
                    </div>
                    <button class="px-3 py-1 text-xs font-medium text-white bg-bg-tertiary hover:bg-bg-primary rounded transition-colors">
                      Düzenle
                    </button>
                  </div>

                  <div class="border-t border-bg-primary" />

                  <!-- E-posta -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs text-text-secondary uppercase font-semibold mb-1">E-posta</div>
                      <div class="text-text-primary text-sm">
                        {{ user?.email ? maskEmail(user.email) : '—' }}
                      </div>
                    </div>
                    <button class="px-3 py-1 text-xs font-medium text-white bg-bg-tertiary hover:bg-bg-primary rounded transition-colors">
                      Düzenle
                    </button>
                  </div>

                  <div class="border-t border-bg-primary" />

                  <!-- Telefon -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs text-text-secondary uppercase font-semibold mb-1">Telefon Numarası</div>
                      <div class="text-text-secondary text-sm">Henüz eklenmedi</div>
                    </div>
                    <button class="px-3 py-1 text-xs font-medium text-white bg-bg-tertiary hover:bg-bg-primary rounded transition-colors">
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Şifre & Kimlik Doğrulama -->
            <div class="mb-4">
              <h3 class="text-xs font-semibold text-text-secondary uppercase mb-2">Şifre ve Kimlik Doğrulama</h3>
              <div class="bg-bg-secondary rounded-lg p-4 space-y-3">
                <button class="w-full text-left flex items-center justify-between group">
                  <div>
                    <div class="text-sm text-text-primary font-medium">Şifre</div>
                    <div class="text-xs text-text-secondary">●●●●●●●●</div>
                  </div>
                  <span class="text-xs text-blurple group-hover:underline">Şifreyi Değiştir</span>
                </button>
              </div>
            </div>

            <!-- Hesabı Kaldır -->
            <div class="border-t border-bg-secondary pt-4">
              <h3 class="text-xs font-semibold text-red-400 uppercase mb-2">Hesap Kaldırma</h3>
              <p class="text-xs text-text-secondary mb-3">
                Hesabınızı devre dışı bırakmak veya kalıcı olarak silmek, bu işlemi geri alamazsınız.
              </p>
              <div class="flex gap-3">
                <button class="px-4 py-2 text-sm font-medium text-white bg-transparent border border-text-secondary hover:bg-bg-secondary rounded transition-colors">
                  Hesabı Devre Dışı Bırak
                </button>
                <button class="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors">
                  Hesabı Sil
                </button>
              </div>
            </div>
          </template>

          <!-- Profil -->
          <template v-else-if="activeSection === 'profile'">
            <h2 class="text-xl font-semibold text-text-primary mb-5">Profil</h2>
            <div class="bg-bg-secondary rounded-lg p-4">
              <p class="text-text-secondary text-sm">Profil ayarları yakında gelecek.</p>
            </div>
          </template>

          <!-- Gizlilik & Güvenlik -->
          <template v-else-if="activeSection === 'privacy'">
            <h2 class="text-xl font-semibold text-text-primary mb-5">Gizlilik ve Güvenlik</h2>
            <div class="bg-bg-secondary rounded-lg p-4 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-text-primary font-medium">Doğrudan Mesajlar</div>
                  <div class="text-xs text-text-secondary mt-0.5">Sunuculardaki herkesten DM almasına izin ver</div>
                </div>
                <div class="w-10 h-6 rounded-full bg-green-500 flex items-center justify-end px-1 cursor-pointer">
                  <div class="w-4 h-4 rounded-full bg-white" />
                </div>
              </div>
              <div class="border-t border-bg-tertiary" />
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-text-primary font-medium">Arkadaş İstekleri</div>
                  <div class="text-xs text-text-secondary mt-0.5">Herkesten arkadaş isteği almasına izin ver</div>
                </div>
                <div class="w-10 h-6 rounded-full bg-green-500 flex items-center justify-end px-1 cursor-pointer">
                  <div class="w-4 h-4 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </template>

          <!-- Görünüm -->
          <template v-else-if="activeSection === 'appearance'">
            <h2 class="text-xl font-semibold text-text-primary mb-5">Görünüm</h2>
            <div class="bg-bg-secondary rounded-lg p-4">
              <div class="text-sm text-text-primary font-medium mb-3">Tema</div>
              <div class="flex gap-3">
                <button class="flex-1 py-3 rounded-lg border-2 border-blurple bg-bg-primary text-center">
                  <div class="text-sm text-text-primary font-medium">Koyu</div>
                </button>
                <button class="flex-1 py-3 rounded-lg border-2 border-transparent bg-bg-tertiary text-center hover:border-bg-secondary transition-colors">
                  <div class="text-sm text-text-secondary font-medium">Işık</div>
                </button>
              </div>
            </div>
          </template>

          <!-- Bildirimler -->
          <template v-else-if="activeSection === 'notifications'">
            <h2 class="text-xl font-semibold text-text-primary mb-5">Bildirimler</h2>
            <div class="bg-bg-secondary rounded-lg p-4 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-text-primary font-medium">Masaüstü Bildirimleri</div>
                  <div class="text-xs text-text-secondary mt-0.5">Tarayıcı bildirimleri etkinleştir</div>
                </div>
                <div class="w-10 h-6 rounded-full bg-bg-tertiary flex items-center px-1 cursor-pointer">
                  <div class="w-4 h-4 rounded-full bg-text-secondary" />
                </div>
              </div>
              <div class="border-t border-bg-tertiary" />
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-text-primary font-medium">Ses Bildirimleri</div>
                  <div class="text-xs text-text-secondary mt-0.5">Yeni mesaj sesini etkinleştir</div>
                </div>
                <div class="w-10 h-6 rounded-full bg-green-500 flex items-center justify-end px-1 cursor-pointer">
                  <div class="w-4 h-4 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </template>

          <!-- Diğer bölümler için fallback -->
          <template v-else>
            <h2 class="text-xl font-semibold text-text-primary mb-5">
              {{ allMenuItems.find(i => i.id === activeSection)?.label || 'Ayarlar' }}
            </h2>
            <div class="bg-bg-secondary rounded-lg p-4">
              <p class="text-text-secondary text-sm">Bu bölüm yakında gelecek.</p>
            </div>
          </template>
        </div>

        <!-- Sağ kenar boşluk -->
        <div class="flex-1 min-w-[40px]" @click="close" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { user, logout } = useAuth()

const modalRef = ref<HTMLElement>()
const activeSection = ref('account')

const userMenuItems = [
  { id: 'account', label: 'Hesabım' },
  { id: 'profile', label: 'Profil' },
  { id: 'privacy', label: 'Gizlilik ve Güvenlik' },
  { id: 'authorized-apps', label: 'Yetkili Uygulamalar' },
]

const appMenuItems = [
  { id: 'appearance', label: 'Görünüm' },
  { id: 'accessibility', label: 'Erişilebilirlik' },
  { id: 'voice', label: 'Ses ve Video' },
  { id: 'notifications', label: 'Bildirimler' },
  { id: 'keybinds', label: 'Kısayollar' },
  { id: 'language', label: 'Dil' },
]

const allMenuItems = [...userMenuItems, ...appMenuItems]

const close = () => emit('close')

const handleLogout = async () => {
  close()
  await logout()
}

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const masked = local.slice(0, 2) + '***'
  return `${masked}@${domain}`
}

// Modal açıldığında focus al (ESC için)
watch(() => props.isOpen, (val) => {
  if (val) {
    nextTick(() => modalRef.value?.focus())
    activeSection.value = 'account'
  }
})
</script>
