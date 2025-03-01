import { defineStore } from 'pinia'
import type { Post } from '~/types'
import type { Database } from '~/types/supabase'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    publishedPosts: (state) => state.posts.filter(post => post.published),
    draftPosts: (state) => state.posts.filter(post => !post.published),
  },

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient()
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.posts = data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchPost(id: string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient()
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        this.currentPost = data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createPost(title: string, content: string, authorId: string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient<Database>()
          .from('posts')
          .insert({
            title,
            content,
            author_id: authorId,
            published: false,
          } as Database['public']['Tables']['posts']['Insert'])
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No post created')

        this.posts.unshift(data)
        this.currentPost = data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async updatePost(id: string, updates: Partial<Post>) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient<Database>()
          .from('posts')
          .update(updates as Database['public']['Tables']['posts']['Update'])
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No post updated')

        const index = this.posts.findIndex(post => post.id === id)
        if (index !== -1) {
          this.posts[index] = data
        }
        this.currentPost = data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async deletePost(id: string) {
      this.loading = true
      this.error = null
      try {
        const { error } = await useSupabaseClient()
          .from('posts')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.posts = this.posts.filter(post => post.id !== id)
        if (this.currentPost?.id === id) {
          this.currentPost = null
        }
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async togglePublish(id: string) {
      const post = this.posts.find(p => p.id === id)
      if (!post) {
        this.error = 'Post not found'
        return
      }

      await this.updatePost(id, { published: !post.published })
    },
  },
}) 