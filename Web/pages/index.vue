<template>
  <div ref="root" class="landing min-h-screen flex flex-col">
    <!-- Background -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#16213e] to-[#0f3460]" />
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blurple/15 blur-[140px] opacity-50" />
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px] opacity-60" />
      <div class="absolute inset-0">
        <div
          v-for="i in 60"
          :key="i"
          class="absolute rounded-full bg-white"
          :style="starStyle(i)"
        />
      </div>
    </div>

    <!-- Header -->
    <header ref="header" class="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
      <AuthLogo />
      <nav class="flex items-center gap-4">
        <NuxtLink
          to="/login"
          class="text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          Giriş Yap
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="px-4 py-2 bg-white text-[#1a0b2e] text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
        >
          Kaydol
        </NuxtLink>
      </nav>
    </header>

    <!-- Hero -->
    <section class="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
      <h1 ref="heroTitle" class="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight">
        Oyunlarla dolu, eğlenceli grup sohbetleri
      </h1>
      <p ref="heroSub" class="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
        Arkadaşlarınla bir araya gel, kanallar oluştur, oyun oyna ve sohbet et. Okul kulübü, oyun grubu ya da dünya çapında bir sanat topluluğu olsun—burada herkes için yer var.
      </p>
      <div ref="heroBtns" class="mt-8 flex flex-col sm:flex-row gap-4">
        <NuxtLink
          to="/register"
          class="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1a0b2e] font-semibold rounded-full hover:bg-gray-200 transition-colors"
        >
          Kaydol
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:border-white/50 hover:bg-white/5 transition-colors"
        >
          Giriş Yap
        </NuxtLink>
      </div>
    </section>

    <!-- Feature sections -->
    <section class="relative z-10 px-4 md:px-10 py-16 space-y-24 max-w-6xl mx-auto">
      <div ref="feat1" class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Grup sohbetlerinde daha fazla eğlenceli hale getir
          </h2>
          <p class="mt-3 text-white/70">
            Metin, ses ve video kanallarıyla takımın veya arkadaş grubunla organize ol. Tek bir yerde kalın.
          </p>
        </div>
        <div class="rounded-2xl bg-bg-secondary/80 border border-white/10 p-6 aspect-video flex items-center justify-center feat-card">
          <div class="text-center text-white/50 text-sm">Sohbet arayüzü önizlemesi</div>
        </div>
      </div>

      <div ref="feat2" class="grid md:grid-cols-2 gap-12 items-center">
        <div class="order-2 md:order-1 rounded-2xl bg-accent-green/20 border border-accent-green/30 p-6 aspect-video flex items-center justify-center feat-card">
          <div class="text-center text-white/70 text-sm">Ses / ekran paylaşımı önizlemesi</div>
        </div>
        <div class="order-1 md:order-2">
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Aynı odadaymışsın gibi yayın yap
          </h2>
          <p class="mt-3 text-white/70">
            Sesli sohbetlere katıl, ekran paylaş; arkadaşların seni görmeden sohbet etmesin.
          </p>
        </div>
      </div>

      <div ref="feat3" class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Aradığın anda, aramana gerek kalmadan
          </h2>
          <p class="mt-3 text-white/70">
            Sunucular ve kanallarla her şey yerli yerinde. Sadece katıl ve konuşmaya başla.
          </p>
        </div>
        <div class="rounded-2xl bg-bg-secondary/80 border border-white/10 p-6 aspect-video flex items-center justify-center feat-card">
          <div class="text-center text-white/50 text-sm">Sunucu / kanal listesi önizlemesi</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section ref="cta" class="relative z-10 px-4 py-16 text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-white">
        Daha fazla aşağı kaydıramazsın, sohbet etmeye dönmek ister misin?
      </h2>
      <NuxtLink
        ref="ctaBtn"
        to="/login"
        class="mt-6 inline-flex items-center justify-center px-8 py-4 bg-blurple text-white font-semibold rounded-full hover:bg-blurple-dark transition-colors"
      >
        Uygulamayı Aç
      </NuxtLink>
    </section>

    <!-- Footer -->
    <footer ref="footer" class="relative z-10 border-t border-white/10 px-6 md:px-10 py-12">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <AuthLogo />
        <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
          <a href="#" class="hover:text-white transition-colors">Ürün</a>
          <a href="#" class="hover:text-white transition-colors">Şirket</a>
          <a href="#" class="hover:text-white transition-colors">Kaynaklar</a>
          <a href="#" class="hover:text-white transition-colors">Hizmet Koşulları</a>
          <a href="#" class="hover:text-white transition-colors">Gizlilik</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Discord Alternative - Arkadaşlarınla sohbet et',
  meta: [
    { name: 'description', content: 'Oyunlarla dolu, eğlenceli grup sohbetleri. Arkadaşlarınla bir araya gel, kanallar oluştur, oyun oyna ve sohbet et.' }
  ]
})

const root = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroBtns = ref<HTMLElement | null>(null)
const feat1 = ref<HTMLElement | null>(null)
const feat2 = ref<HTMLElement | null>(null)
const feat3 = ref<HTMLElement | null>(null)
const cta = ref<HTMLElement | null>(null)
const ctaBtn = ref<HTMLElement | null>(null)
const footer = ref<HTMLElement | null>(null)

function starStyle(i: number) {
  const seed = (i * 9301 + 49297) % 233280
  const x = (seed % 100) + '%'
  const y = ((seed * 2 % 233280) % 100) + '%'
  const size = (seed % 2) + 1
  const opacity = 0.2 + (seed % 50) / 100
  return { left: x, top: y, width: size + 'px', height: size + 'px', opacity }
}

onMounted(() => {
  const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp()
  if (!gsap || !ScrollTrigger || !root.value) return

  const ctx = gsap.context(() => {
    // Header: fade in
    if (header.value) {
      gsap.from(header.value, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.out' })
    }
    // Hero: stagger
    if (heroTitle.value) {
      gsap.from(heroTitle.value, { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' })
    }
    if (heroSub.value) {
      gsap.from(heroSub.value, { opacity: 0, y: 30, duration: 0.7, delay: 0.2, ease: 'power2.out' })
    }
    if (heroBtns.value) {
      gsap.from(heroBtns.value, { opacity: 0, y: 30, duration: 0.6, delay: 0.4, ease: 'power2.out' })
    }
    // Scroll-triggered sections
    const scrollOpts = { start: 'top 85%', end: 'bottom 15%', toggleActions: 'play none none reverse' }
    if (feat1.value) {
      gsap.from(feat1.value, { opacity: 0, y: 60, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: feat1.value, ...scrollOpts } })
    }
    if (feat2.value) {
      gsap.from(feat2.value, { opacity: 0, y: 60, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: feat2.value, ...scrollOpts } })
    }
    if (feat3.value) {
      gsap.from(feat3.value, { opacity: 0, y: 60, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: feat3.value, ...scrollOpts } })
    }
    if (cta.value) {
      gsap.from(cta.value, { opacity: 0, y: 50, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: cta.value, ...scrollOpts } })
    }
    if (footer.value) {
      gsap.from(footer.value, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: footer.value, ...scrollOpts } })
    }
  }, root)

  onUnmounted(() => ctx.revert())
})
</script>

<style scoped>
.landing {
  overflow-x: hidden;
}
</style>
