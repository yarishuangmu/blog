<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="h-16 px-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 移动端菜单按钮 -->
          <UButton
            v-if="isMobile"
            color="gray"
            variant="ghost"
            icon="i-heroicons-bars-3"
            @click="isSidebarOpen = !isSidebarOpen"
          />
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('nav.blog') }}</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <UButton
            color="gray"
            variant="ghost"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            @click="toggleDark()"
          />
        </div>
      </div>
    </header>

    <div class="pt-16 flex">
      <!-- 左侧边栏 -->
      <aside
        :class="[
          'fixed left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform',
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        ]"
      >
        <nav class="h-full p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.path">
              <NuxtLink
                :to="localePath(item.path)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{ 'bg-gray-100 dark:bg-gray-700': isCurrentPath(item.path) }"
              >
                <UIcon :name="item.icon" class="flex-shrink-0 w-5 h-5" />
                <span>{{ $t(item.title) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主要内容区 -->
      <main
        :class="[
          'flex-1 transition-all',
          isMobile ? 'ml-0' : 'ml-64',
          'mr-0 lg:mr-64'
        ]"
      >
        <div class="container mx-auto p-4">
          <slot />
        </div>
      </main>

      <!-- 右侧个人资料 -->
      <aside class="fixed right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 hidden lg:block">
        <div class="p-4">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
              <img
                src="https://avatars.githubusercontent.com/u/739984?v=4"
                alt="亚日双木"
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">亚日双木</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">射频测试工程师 / 测试开发工程师</p>
          </div>
          
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ $t('common.about_me') }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              职业射频测试工程师，测试开发工程师。熟练掌握 C++、JavaScript、Python 等编程语言，专长于射频测试领域，熟练使用 CMW500、网络分析仪、信号源等专业仪表。
            </p>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ $t('common.contact_info') }}</h4>
            <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p class="flex items-center gap-2">
                <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="flex-shrink-0 w-4 h-4" />
                <span>微信：tl_yari</span>
              </p>
              <p class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" class="flex-shrink-0 w-4 h-4" />
                <span>邮箱：liubing@ansiwei.net</span>
              </p>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ $t('common.social_links') }}</h4>
            <div class="flex justify-center gap-4">
              <UButton
                v-for="social in socialLinks"
                :key="social.icon"
                color="gray"
                variant="ghost"
                :icon="social.icon"
                :href="social.url"
                target="_blank"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// 响应式状态
const isSidebarOpen = ref(false)
const isMobile = ref(false)

// 暗色模式
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 菜单项
const menuItems = [
  { path: '/', title: 'nav.home', icon: 'i-heroicons-home' },
  { path: '/blog', title: 'nav.blog', icon: 'i-heroicons-document-text' },
  { path: '/about', title: 'nav.about', icon: 'i-heroicons-information-circle' },
  { path: '/contact', title: 'nav.contact', icon: 'i-heroicons-envelope' },
]

// 社交链接
const socialLinks = [
  { icon: 'i-heroicons-globe-alt', url: 'https://example.com' },
  { icon: 'i-heroicons-chat', url: 'https://twitter.com' },
  { icon: 'i-heroicons-code-bracket', url: 'https://github.com' },
]

// 检查当前路径
const isCurrentPath = (path: string) => {
  return route.path === localePath(path)
}

// 监听窗口大小变化
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
    if (!isMobile.value) {
      isSidebarOpen.value = false
    }
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 