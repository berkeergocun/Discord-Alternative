<template>
  <div class="min-h-screen flex flex-col relative">
    <AuthCosmicBackground />
    <header class="relative z-10 pt-6 pl-6 md:pl-10">
      <AuthLogo />
    </header>
    <main class="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6">
      <slot />
    </main>
  </div>
</template>
