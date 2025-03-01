import { storeToRefs } from 'pinia'

export const useComment = () => {
  const commentStore = useCommentStore()
  const { comments, loading, error } = storeToRefs(commentStore)
  const { getPostComments } = commentStore

  const fetchComments = async (postId: string) => {
    await commentStore.fetchComments(postId)
  }

  const addComment = async (content: string, postId: string, authorId: string) => {
    await commentStore.addComment(content, postId, authorId)
  }

  const updateComment = async (id: string, content: string) => {
    await commentStore.updateComment(id, content)
  }

  const deleteComment = async (id: string) => {
    await commentStore.deleteComment(id)
  }

  return {
    comments,
    loading,
    error,
    getPostComments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  }
} 