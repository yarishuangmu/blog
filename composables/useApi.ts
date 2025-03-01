import { ref } from 'vue'

interface ApiOptions {
  baseURL?: string
  headers?: Record<string, string>
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
}

interface ApiError {
  message: string
  status?: number
  data?: any
}

export const useApi = (options: ApiOptions = {}) => {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const baseURL = options.baseURL || ''
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      }

      if (isJson) {
        error.data = await response.json()
      }

      throw error
    }

    return isJson ? response.json() : response.text()
  }

  const request = async <T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: config.method || 'GET',
        headers: {
          ...defaultHeaders,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      const data = await handleResponse(response)
      return data as T
    } catch (err: any) {
      error.value = {
        message: err.message || 'An error occurred',
        status: err.status,
        data: err.data,
      }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const get = <T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}) => {
    return request<T>(endpoint, { ...config, method: 'GET' })
  }

  const post = <T>(endpoint: string, data: any, config: Omit<RequestConfig, 'method'> = {}) => {
    return request<T>(endpoint, { ...config, method: 'POST', body: data })
  }

  const put = <T>(endpoint: string, data: any, config: Omit<RequestConfig, 'method'> = {}) => {
    return request<T>(endpoint, { ...config, method: 'PUT', body: data })
  }

  const patch = <T>(endpoint: string, data: any, config: Omit<RequestConfig, 'method'> = {}) => {
    return request<T>(endpoint, { ...config, method: 'PATCH', body: data })
  }

  const del = <T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'body'> = {}) => {
    return request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    del,
  }
} 