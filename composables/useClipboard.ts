import { ref } from 'vue'

export interface ClipboardOptions {
  resetAfter?: number
}

export const useClipboard = (options: ClipboardOptions = {}) => {
  const copied = ref(false)
  const error = ref<string | null>(null)
  let resetTimeout: NodeJS.Timeout | null = null

  const resetState = () => {
    copied.value = false
    error.value = null
  }

  const copy = async (text: string) => {
    try {
      if (resetTimeout) {
        clearTimeout(resetTimeout)
      }

      resetState()

      if (navigator.clipboard && window.isSecureContext) {
        // Use modern Clipboard API when available and in secure context
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          textArea.remove()
        } catch (err) {
          textArea.remove()
          throw new Error('Failed to copy text to clipboard')
        }
      }

      copied.value = true

      if (options.resetAfter) {
        resetTimeout = setTimeout(() => {
          resetState()
        }, options.resetAfter)
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to copy text to clipboard'
      return false
    }
  }

  const copyFromElement = async (element: HTMLElement) => {
    return copy(element.innerText)
  }

  const copyFromInput = async (input: HTMLInputElement | HTMLTextAreaElement) => {
    return copy(input.value)
  }

  return {
    copied,
    error,
    copy,
    copyFromElement,
    copyFromInput,
    resetState,
  }
} 