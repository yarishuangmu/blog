import { ref, onMounted, onUnmounted } from 'vue'

export interface ScrollPosition {
  x: number
  y: number
}

export interface ScrollToOptions {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  inline?: ScrollLogicalPosition
}

export const useScroll = () => {
  const scrollPosition = ref<ScrollPosition>({ x: 0, y: 0 })
  const isScrolling = ref(false)
  let scrollTimeout: NodeJS.Timeout | null = null

  const updateScrollPosition = () => {
    scrollPosition.value = {
      x: window.scrollX,
      y: window.scrollY,
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    isScrolling.value = true
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  const scrollTo = (
    target: string | number | HTMLElement | ScrollPosition,
    options: ScrollToOptions = {}
  ) => {
    if (typeof target === 'string') {
      const element = document.querySelector(target)
      if (element) {
        element.scrollIntoView({
          behavior: options.behavior || 'smooth',
          block: options.block || 'start',
          inline: options.inline || 'nearest',
        })
      }
    } else if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: options.behavior || 'smooth',
      })
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: options.block || 'start',
        inline: options.inline || 'nearest',
      })
    } else {
      window.scrollTo({
        left: target.x,
        top: target.y,
        behavior: options.behavior || 'smooth',
      })
    }
  }

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior })
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior,
    })
  }

  const isElementVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  }

  const isElementPartiallyVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    )
  }

  onMounted(() => {
    updateScrollPosition()
    window.addEventListener('scroll', updateScrollPosition, { passive: true })
  })

  onUnmounted(() => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    window.removeEventListener('scroll', updateScrollPosition)
  })

  return {
    scrollPosition,
    isScrolling,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    isElementVisible,
    isElementPartiallyVisible,
  }
} 