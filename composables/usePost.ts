import { storeToRefs } from 'pinia'
import type { Post } from '~/types'

export const usePost = () => {
  const postStore = usePostStore()
  const { posts, currentPost, loading, error } = storeToRefs(postStore)
  const { publishedPosts, draftPosts } = storeToRefs(postStore)

  const fetchPosts = async () => {
    await postStore.fetchPosts()
  }

  const fetchPost = async (id: string) => {
    await postStore.fetchPost(id)
  }

  const createPost = async (title: string, content: string, authorId: string) => {
    await postStore.createPost(title, content, authorId)
    if (!error.value) {
      navigateTo(`/admin/posts/${currentPost.value?.id}`)
    }
  }

  const updatePost = async (id: string, updates: Partial<Post>) => {
    await postStore.updatePost(id, updates)
  }

  const deletePost = async (id: string) => {
    await postStore.deletePost(id)
    if (!error.value) {
      navigateTo('/admin/posts')
    }
  }

  const togglePublish = async (id: string) => {
    await postStore.togglePublish(id)
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    publishedPosts,
    draftPosts,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    togglePublish,
  }
} 