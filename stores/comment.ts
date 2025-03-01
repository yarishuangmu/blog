import { defineStore } from 'pinia'
import type { Comment } from '~/types'
import type { Database } from '~/types/supabase'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as Comment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getPostComments: (state) => (postId: string) => 
      state.comments.filter(comment => comment.post_id === postId),
  },

  actions: {
    async fetchComments(postId: string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient()
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true })

        if (error) throw error
        this.comments = data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addComment(content: string, postId: string, authorId: string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient<Database>()
          .from('comments')
          .insert({
            content,
            post_id: postId,
            author_id: authorId,
          } as Database['public']['Tables']['comments']['Insert'])
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No comment created')

        this.comments.push(data)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async updateComment(id: string, content: string) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useSupabaseClient<Database>()
          .from('comments')
          .update({
            content,
            updated_at: new Date().toISOString(),
          } as Database['public']['Tables']['comments']['Update'])
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        if (!data) throw new Error('No comment updated')

        const index = this.comments.findIndex(comment => comment.id === id)
        if (index !== -1) {
          this.comments[index] = data
        }
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async deleteComment(id: string) {
      this.loading = true
      this.error = null
      try {
        const { error } = await useSupabaseClient()
          .from('comments')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.comments = this.comments.filter(comment => comment.id !== id)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
}) 