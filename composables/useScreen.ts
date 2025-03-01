import { ref, onMounted, onUnmounted } from 'vue'

export interface ScreenSize {
  width: number
  height: number
}

export interface ScreenBreakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const defaultBreakpoints: ScreenBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const useScreen = (breakpoints: ScreenBreakpoints = defaultBreakpoints) => {
  const screenSize = ref<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isLargeDesktop = ref(false)

  const updateScreenSize = () => {
    screenSize.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    isMobile.value = screenSize.value.width < breakpoints.md
    isTablet.value = screenSize.value.width >= breakpoints.md && screenSize.value.width < breakpoints.lg
    isDesktop.value = screenSize.value.width >= breakpoints.lg && screenSize.value.width < breakpoints.xl
    isLargeDesktop.value = screenSize.value.width >= breakpoints.xl
  }

  const isBreakpoint = (breakpoint: keyof ScreenBreakpoints) => {
    return screenSize.value.width >= breakpoints[breakpoint]
  }

  const isSmaller = (breakpoint: keyof ScreenBreakpoints) => {
    return screenSize.value.width < breakpoints[breakpoint]
  }

  const isLarger = (breakpoint: keyof ScreenBreakpoints) => {
    return screenSize.value.width > breakpoints[breakpoint]
  }

  const isBetween = (min: keyof ScreenBreakpoints, max: keyof ScreenBreakpoints) => {
    return screenSize.value.width >= breakpoints[min] && screenSize.value.width < breakpoints[max]
  }

  const isPortrait = () => {
    return screenSize.value.height > screenSize.value.width
  }

  const isLandscape = () => {
    return screenSize.value.width > screenSize.value.height
  }

  let resizeTimeout: NodeJS.Timeout | null = null

  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(() => {
      updateScreenSize()
    }, 150)
  }

  onMounted(() => {
    updateScreenSize()
    window.addEventListener('resize', handleResize, { passive: true })
  })

  onUnmounted(() => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    window.removeEventListener('resize', handleResize)
  })

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isBreakpoint,
    isSmaller,
    isLarger,
    isBetween,
    isPortrait,
    isLandscape,
  }
} 