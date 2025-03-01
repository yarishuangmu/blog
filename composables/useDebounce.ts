import { ref } from 'vue'

export interface DebounceOptions {
  wait?: number
  immediate?: boolean
}

export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  options: DebounceOptions = {}
) => {
  const timeout = ref<NodeJS.Timeout | null>(null)
  const wait = options.wait ?? 300
  const immediate = options.immediate ?? false

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeout.value = null
      if (!immediate) {
        fn(...args)
      }
    }

    const callNow = immediate && !timeout.value

    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    timeout.value = setTimeout(later, wait)

    if (callNow) {
      fn(...args)
    }
  }

  const cancel = () => {
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
  }

  return {
    debounced,
    cancel,
  }
} 