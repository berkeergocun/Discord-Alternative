<template>
  <AuthLayout>
    <div
      ref="card"
      class="w-full max-w-[440px] rounded-2xl bg-[#2c2f33]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 overflow-y-auto max-h-[90vh]"
    >
      <h1 class="text-[1.75rem] font-bold text-white tracking-tight">
        Bir hesap oluştur
      </h1>
      <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
        <div>
          <label for="reg-email" class="block text-[13px] font-medium text-white/90 mb-2">
            E-posta <span class="text-white/50">*</span>
          </label>
          <input
            id="reg-email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="input-auth"
            placeholder="ornek@email.com"
          />
        </div>
        <div>
          <label for="reg-displayname" class="block text-[13px] font-medium text-white/90 mb-2">
            Görünen Ad
          </label>
          <input
            id="reg-displayname"
            v-model="form.displayName"
            type="text"
            autocomplete="name"
            class="input-auth"
            placeholder="Arkadaşların nasıl görsün?"
          />
        </div>
        <div>
          <label for="reg-username" class="block text-[13px] font-medium text-white/90 mb-2">
            Kullanıcı Adı <span class="text-white/50">*</span>
          </label>
          <input
            id="reg-username"
            v-model="form.username"
            type="text"
            required
            autocomplete="username"
            class="input-auth"
            placeholder="kullanici_adi"
          />
        </div>
        <div>
          <label for="reg-password" class="block text-[13px] font-medium text-white/90 mb-2">
            Şifre <span class="text-white/50">*</span>
          </label>
          <input
            id="reg-password"
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            class="input-auth"
            placeholder="En az 8 karakter"
          />
        </div>
        <div>
          <label class="block text-[13px] font-medium text-white/90 mb-2">
            Doğum Tarihi <span class="text-white/50">*</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <select v-model="form.day" required class="input-auth py-2.5">
              <option value="" disabled>Gün</option>
              <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
            </select>
            <select v-model="form.month" required class="input-auth py-2.5">
              <option value="" disabled>Ay</option>
              <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
            </select>
            <select v-model="form.year" required class="input-auth py-2.5">
              <option value="" disabled>Yıl</option>
              <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>
        <label class="flex items-start gap-3 cursor-pointer group">
          <input
            v-model="form.optIn"
            type="checkbox"
            class="mt-0.5 w-4 h-4 rounded border-white/30 bg-[#1e1f22] text-[#5865F2] focus:ring-2 focus:ring-[#5865F2]/50 focus:ring-offset-0 focus:ring-offset-transparent"
          />
          <span class="text-[13px] text-white/60 group-hover:text-white/70 transition-colors leading-relaxed">
            (İsteğe bağlı) Güncellemeler ve ipuçları için e-posta almak istiyorum.
          </span>
        </label>
        <p class="text-[12px] text-white/50 leading-relaxed">
          "Hesap Oluştur"a tıklayarak
          <a href="#" class="text-[#00AFF4] hover:underline">Hizmet Koşulları</a>
          ve
          <a href="#" class="text-[#00AFF4] hover:underline">Gizlilik Politikası</a>'nı kabul etmiş olursun.
        </p>
        <button type="submit" class="btn-auth btn-gradient w-full">
          Hesap Oluştur
        </button>
      </form>
      <p class="mt-6 text-[13px] text-white/50 text-center">
        Zaten hesabın var mı?
        <NuxtLink to="/login" class="text-[#00AFF4] hover:underline font-medium ml-1">
          Giriş yap
        </NuxtLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Kayıt Ol - Discord Alternative',
  meta: [{ name: 'description', content: 'Yeni hesap oluştur' }]
})

const card = ref<HTMLElement | null>(null)
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const currentYear = new Date().getFullYear()
const yearRange = Array.from({ length: 81 }, (_, i) => currentYear - 80 + i).reverse()

const form = ref({
  email: '',
  displayName: '',
  username: '',
  password: '',
  day: '' as number | '',
  month: '' as number | '',
  year: '' as number | '',
  optIn: false
})

function handleRegister() {
  navigateTo('/channels/@me')
}

onMounted(() => {
  const { $gsap: gsap } = useNuxtApp()
  if (gsap && card.value) {
    gsap.from(card.value, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' })
  }
})
</script>
