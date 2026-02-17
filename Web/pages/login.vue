<template>
  <div class="fixed inset-0 bg-blurple overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-full h-full" 
           style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
      </div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 h-full flex items-center justify-center p-4">
      <div class="w-full max-w-[480px]">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-14 h-14 text-blurple" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        </div>

        <!-- Login card -->
        <div class="bg-bg-secondary rounded-lg shadow-2xl p-8">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-text-primary mb-2">Tekrar hoş geldin!</h1>
            <p class="text-text-secondary text-sm">Seni tekrar görmek çok güzel!</p>
          </div>

          <!-- Error message -->
          <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email input -->
            <div>
              <label class="block text-xs font-bold text-text-secondary uppercase mb-2">
                E-posta veya Telefon Numarası <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.email"
                type="text"
                class="w-full px-3 py-2.5 bg-bg-tertiary border-none rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blurple transition-all"
                placeholder="isim@ornek.com"
                required
              />
            </div>

            <!-- Password input -->
            <div>
              <label class="block text-xs font-bold text-text-secondary uppercase mb-2">
                Şifre <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                class="w-full px-3 py-2.5 bg-bg-tertiary border-none rounded text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blurple transition-all"
                placeholder="••••••••"
                required
              />
              <button type="button" class="text-xs text-link hover:underline mt-1">
                Şifreni mi unuttun?
              </button>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-blurple hover:bg-blurple-dark text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Giriş yapılıyor...</span>
              <span v-else>Giriş Yap</span>
            </button>

            <!-- Register link -->
            <div class="text-sm text-text-muted mt-2">
              Hesabın yok mu? 
              <NuxtLink to="/register" class="text-link hover:underline ml-1">
                Kayıt ol
              </NuxtLink>
            </div>
          </form>
        </div>

        <!-- QR Code login option -->
        <div class="mt-8 text-center">
          <button class="text-white/80 hover:text-white text-sm font-medium hover:underline transition-colors">
            QR Kodu ile giriş yap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const { login } = useAuth()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await login(form.email, form.password)
    
    if (result.success) {
      // Navigate to channels
      navigateTo('/channels/@me')
    } else {
      error.value = result.error || 'Giriş yapılırken bir hata oluştu'
    }
  } catch (e: any) {
    error.value = e.message || 'Giriş yapılırken bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script>
