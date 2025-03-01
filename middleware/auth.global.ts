export default defineNuxtRouteMiddleware(async (to) => {
  // 只在客户端执行
  if (process.server) return

  const authStore = useAuthStore()

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
}) 