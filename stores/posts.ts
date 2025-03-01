import { defineStore } from 'pinia'
import type { Post } from '~/types'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        // Implement API call here
        // const { data } = await useFetch('/api/posts')
        // this.posts = data
      } catch (err) {
        this.error = 'Failed to fetch posts'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchPost(id: string) {
      this.loading = true
      this.error = null
      try {
        // Implement API call here
        // const { data } = await useFetch(`/api/posts/${id}`)
        // this.currentPost = data
      } catch (err) {
        this.error = 'Failed to fetch post'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createPost(post: Omit<Post, 'id'>) {
      this.loading = true
      this.error = null
      try {
        // Implement API call here
        // const { data } = await useFetch('/api/posts', {
        //   method: 'POST',
        //   body: post
        // })
        // this.posts.push(data)
      } catch (err) {
        this.error = 'Failed to create post'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async updatePost(post: Post) {
      this.loading = true
      this.error = null
      try {
        // Implement API call here
        // const { data } = await useFetch(`/api/posts/${post.id}`, {
        //   method: 'PUT',
        //   body: post
        // })
        // const index = this.posts.findIndex(p => p.id === post.id)
        // if (index !== -1) {
        //   this.posts[index] = data
        // }
      } catch (err) {
        this.error = 'Failed to update post'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async deletePost(id: string) {
      this.loading = true
      this.error = null
      try {
        // Implement API call here
        // await useFetch(`/api/posts/${id}`, {
        //   method: 'DELETE'
        // })
        // this.posts = this.posts.filter(p => p.id !== id)
      } catch (err) {
        this.error = 'Failed to delete post'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}) 