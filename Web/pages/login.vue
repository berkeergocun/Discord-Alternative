<template>
  <AuthLayout>
    <div
      ref="card"
      class="w-full max-w-[420px] md:max-w-[520px] flex flex-col md:flex-row rounded-2xl bg-[#2c2f33]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      <!-- Form -->
      <div class="flex-1 p-8 md:p-10">
        <h1 class="text-[1.75rem] font-bold text-white tracking-tight">
          Tekrar hoş geldin!
        </h1>
        <p class="mt-2 text-[15px] text-white/60">
          Seni tekrar gördüğümüze çok sevindik!
        </p>
        <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
          <div>
            <label for="login-email" class="block text-[13px] font-medium text-white/90 mb-2">
              E-posta veya Telefon Numarası <span class="text-white/50">*</span>
            </label>
            <input
              id="login-email"
              v-model="email"
              type="text"
              required
              autocomplete="username"
              class="input-auth"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label for="login-password" class="block text-[13px] font-medium text-white/90 mb-2">
              Şifre <span class="text-white/50">*</span>
            </label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="input-auth"
              placeholder="••••••••"
            />
            <NuxtLink
              to="#"
              class="mt-2 inline-block text-[13px] text-[#00AFF4] hover:text-[#00c8ff] transition-colors"
            >
              Şifreni mi unuttun?
            </NuxtLink>
          </div>
          <button type="submit" class="btn-auth btn-primary w-full">
            Giriş Yap
          </button>
        </form>
        <p class="mt-6 text-[13px] text-white/50">
          Bir hesaba mı ihtiyacın var?
          <NuxtLink to="/register" class="text-[#00AFF4] hover:underline font-medium ml-1">
            Kaydol
          </NuxtLink>
        </p>
      </div>
      <!-- QR -->
      <div class="md:w-[200px] flex-shrink-0 p-6 md:py-8 flex flex-col items-center justify-center bg-black/20 border-t md:border-t-0 md:border-l border-white/[0.06]">
        <div class="w-32 h-32 rounded-xl bg-white flex items-center justify-center shadow-inner">
          <span class="text-[11px] text-gray-400 font-medium">QR</span>
        </div>
        <p class="mt-4 text-[13px] font-semibold text-white text-center leading-snug">
          QR ile giriş
        </p>
        <p class="mt-1.5 text-[11px] text-white/50 text-center leading-relaxed px-1">
          Mobil uygulama ile tara
        </p>
        <NuxtLink to="#" class="mt-4 text-[12px] text-[#00AFF4] hover:underline">
          Geçiş anahtarı
        </NuxtLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Giriş Yap - Discord Alternative',
  meta: [{ name: 'description', content: 'Hesabına giriş yap' }]
})

const card = ref<HTMLElement | null>(null)
const email = ref('')
const password = ref('')

function handleLogin() {
  navigateTo('/channels/@me')
}

onMounted(() => {
  const { $gsap: gsap } = useNuxtApp()
  if (gsap && card.value) {
    gsap.from(card.value, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' })
  }
})
</script>
