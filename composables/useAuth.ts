import { storeToRefs } from 'pinia'
import type { User } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { user, loading, error } = storeToRefs(authStore)
  const { isAuthenticated, isAdmin } = storeToRefs(authStore)

  const login = async (email: string, password: string) => {
    await authStore.login(email, password)
    if (!error.value) {
      navigateTo('/admin')
    }
  }

  const register = async (name: string, email: string, password: string) => {
    await authStore.register(name, email, password)
    if (!error.value) {
      navigateTo('/login')
    }
  }

  const logout = async () => {
    await authStore.logout()
    if (!error.value) {
      navigateTo('/')
    }
  }

  const checkAuth = async () => {
    await authStore.checkAuth()
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  }
} 