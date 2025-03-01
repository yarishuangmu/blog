import { ref, watch } from 'vue'

export interface StorageOptions {
  prefix?: string
  driver?: 'localStorage' | 'sessionStorage'
}

export const useStorage = (options: StorageOptions = {}) => {
  const prefix = options.prefix || 'app'
  const driver = options.driver || 'localStorage'
  const storage = window[driver]

  const getKey = (key: string) => `${prefix}:${key}`

  const get = <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = storage.getItem(getKey(key))
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  }

  const set = <T>(key: string, value: T): void => {
    try {
      storage.setItem(getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  const remove = (key: string): void => {
    storage.removeItem(getKey(key))
  }

  const clear = (withPrefix = true): void => {
    if (withPrefix) {
      const keys = Object.keys(storage)
      const prefixLength = prefix.length + 1
      keys.forEach(key => {
        if (key.slice(0, prefixLength) === `${prefix}:`) {
          storage.removeItem(key)
        }
      })
    } else {
      storage.clear()
    }
  }

  const useStorageRef = <T>(key: string, defaultValue?: T) => {
    const storageValue = get<T>(key, defaultValue)
    const value = ref<T | null>(storageValue)

    watch(value, (newValue) => {
      if (newValue === null) {
        remove(key)
      } else {
        set(key, newValue)
      }
    }, { deep: true })

    return value
  }

  const has = (key: string): boolean => {
    return storage.getItem(getKey(key)) !== null
  }

  const keys = (withPrefix = true): string[] => {
    const keys = Object.keys(storage)
    if (!withPrefix) return keys

    const prefixLength = prefix.length + 1
    return keys.filter(key => key.slice(0, prefixLength) === `${prefix}:`)
      .map(key => key.slice(prefixLength))
  }

  const length = (withPrefix = true): number => {
    return keys(withPrefix).length
  }

  return {
    get,
    set,
    remove,
    clear,
    useStorageRef,
    has,
    keys,
    length,
  }
} 