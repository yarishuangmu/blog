export default defineNuxtRouteMiddleware(async (to) => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  
  // 如果用户未登录，重定向到登录页面
  if (!user.value) {
    return navigateTo('/auth/login?redirect=' + to.fullPath)
  }

  // 获取用户角色信息
  const { data: profile, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.value.id)
    .single()

  // 如果获取角色信息失败或用户不是管理员，重定向到首页
  if (error || profile?.role !== 'admin') {
    return navigateTo('/')
  }
}) 