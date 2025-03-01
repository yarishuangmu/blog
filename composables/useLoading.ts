export const useLoading = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const withLoading = async <T>(
    fn: () => Promise<T>,
    errorMessage = 'An error occurred'
  ): Promise<T | undefined> => {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e: any) {
      error.value = e.message || errorMessage
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    withLoading,
  }
} 