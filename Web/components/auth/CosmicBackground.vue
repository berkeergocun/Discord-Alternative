<template>
  <div class="auth-bg fixed inset-0 overflow-hidden -z-10">
    <!-- Gradient base -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#16213e] to-[#0f3460]" />
    <!-- Blurred orbs -->
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blurple/20 blur-[120px] opacity-60" />
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/15 blur-[100px] opacity-70" />
    <div class="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] opacity-50" />
    <!-- Stars -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="i in 80"
        :key="i"
        class="absolute rounded-full bg-white animate-twinkle"
        :style="starStyle(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
function starStyle(i: number) {
  const seed = (i * 9301 + 49297) % 233280
  const x = (seed % 100) + '%'
  const y = ((seed * 2 % 233280) % 100) + '%'
  const size = (seed % 3) + 1
  const opacity = 0.3 + (seed % 70) / 100
  const delay = (seed % 3000) + 'ms'
  return {
    left: x,
    top: y,
    width: size + 'px',
    height: size + 'px',
    opacity,
    animationDelay: delay
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}
</style>
