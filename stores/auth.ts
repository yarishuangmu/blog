import { defineStore } from 'pinia'
import type { Database } from '~/types/supabase'

interface Profile {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

type ProfileResponse = Database['public']['Tables']['profiles']['Row']

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Profile | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async fetchUser() {
      this.loading = true
      this.error = null
      try {
        const client = useSupabaseClient()
        const { data: { session } } = await client.auth.getSession()
        
        if (!session) {
          this.user = null
          return null
        }

        const { data: profile, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error

        this.user = profile as Profile
        return profile
      } catch (error: any) {
        this.error = error.message
        this.user = null
        return null
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        
        // 1. 先进行登录
        const { data: { session }, error: loginError } = await client.auth.signInWithPassword({
          email,
          password
        })

        if (loginError) throw loginError
        if (!session) throw new Error('登录失败')

        // 2. 获取用户信息
        const { data: profile, error: profileError } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError
        if (!profile) throw new Error('用户信息不存在')

        const userProfile = profile as ProfileResponse

        // 3. 检查是否是管理员
        if (userProfile.role !== 'admin') {
          // 如果不是管理员，先登出
          await client.auth.signOut()
          throw new Error('无权限访问：需要管理员权限')
        }

        // 4. 保存用户信息
        this.user = userProfile as Profile

      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const client = useSupabaseClient()
        await client.auth.signOut()
        this.user = null
        // 登出后重定向到登录页
        await navigateTo('/auth/login')
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      try {
        await this.fetchUser()
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    },

    // 监听认证状态变化
    async setupAuthListener() {
      const client = useSupabaseClient()
      client.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
          await this.fetchUser()
        } else if (event === 'SIGNED_OUT') {
          this.user = null
        }
      })
    }
  },

  // 使用 Pinia 持久化插件
  persist: true,
}) 