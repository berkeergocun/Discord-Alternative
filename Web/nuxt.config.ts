// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  ssr: false, // CSR mode as requested
  
  devServer: {
    host: '0.0.0.0', // Listen on all interfaces for Docker access
    port: 3000
  },
  
  app: {
    head: {
      title: 'Discord Alternative',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A Discord alternative built with Nuxt.js' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  
  typescript: {
    strict: true
  }
})
