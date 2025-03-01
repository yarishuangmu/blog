export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  
  // 添加路由守卫
  addRouteMiddleware(
    'auth',
    async (to) => {
      // 检查是否是管理页面
      if (to.path.startsWith('/admin')) {
        // 如果未登录，重定向到登录页
        if (!authStore.isAuthenticated) {
          return navigateTo(`/auth/login?redirect=${to.fullPath}`)
        }
        
        // 如果不是管理员，重定向到首页
        if (!authStore.isAdmin) {
          return navigateTo('/')
        }
      }
    },
    { global: true }
  )

  // 初始化时检查认证状态并设置监听器
  if (process.client) {
    authStore.checkAuth()
    authStore.setupAuthListener()
  }
}) 