import { useAuthStore } from '~/stores/auth'
import { useSupabaseUser } from '~/composables/useSupabaseUser'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Public pages that don't require authentication
  const publicPages = ['/', '/login', '/register']
  const requiresAuth = !publicPages.includes(to.path)

  if (requiresAuth) {
    // Try to fetch user data if not already available
    if (!authStore.user) {
      await authStore.fetchUser()
    }

    // If still no user after fetch attempt, redirect to login
    if (!authStore.user) {
      return navigateTo('/login')
    }
  }
}) 