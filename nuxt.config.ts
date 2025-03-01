// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // 确保 SSR 开启
  ssr: true,

  // 优化实验性功能
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    crossOriginPrefetch: true
  },

  // 优化 Nitro 引擎配置
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
    compressPublicAssets: true
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  tailwindcss: {
    exposeConfig: true,
    config: {
      content: [
        './node_modules/@nuxt/ui/**/*.{js,vue,ts}'
      ]
    }
  },

  ui: {
    global: true
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: {
      login: '/auth/login',
      callback: '/confirm'
    }
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'zh',
        name: '中文',
        file: 'zh.json'
      }
    ],
    langDir: 'locales',
    lazy: false
  },

  vite: {
    define: {
      'process.env.NODE_DEBUG': 'false'
    }
  },

  compatibilityDate: '2025-03-01'
})