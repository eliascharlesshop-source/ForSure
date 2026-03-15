import React, { useEffect, useRef, useState } from 'react'
import { breakpoints } from '@/lib/design-tokens'

export interface UseResponsiveOptions {
  breakpoint?: keyof typeof breakpoints
  debounceMs?: number
}

export interface UseResponsiveReturn {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  currentBreakpoint: keyof typeof breakpoints
  orientation: 'portrait' | 'landscape'
}

export function useResponsive(options: UseResponsiveOptions = {}): UseResponsiveReturn {
  const { debounceMs = 100 } = options
  
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        currentBreakpoint: 'lg' as const,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isWide: false,
        orientation: 'landscape' as const,
      }
    }
    
    const width = window.innerWidth
    const height = window.innerHeight
    const currentBreakpoint = getCurrentBreakpoint(width)
    const orientation: 'portrait' | 'landscape' = width > height ? 'landscape' : 'portrait'
    
    return {
      width,
      height,
      currentBreakpoint,
      isMobile: width < parseInt(breakpoints.sm),
      isTablet: width >= parseInt(breakpoints.sm) && width < parseInt(breakpoints.lg),
      isDesktop: width >= parseInt(breakpoints.lg) && width < parseInt(breakpoints.xl),
      isWide: width >= parseInt(breakpoints.xl),
      orientation,
    }
  })

  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        const currentBreakpoint = getCurrentBreakpoint(width)
        const orientation: 'portrait' | 'landscape' = width > height ? 'landscape' : 'portrait'
        
        setDimensions({
          width,
          height,
          currentBreakpoint,
          isMobile: width < parseInt(breakpoints.sm),
          isTablet: width >= parseInt(breakpoints.sm) && width < parseInt(breakpoints.lg),
          isDesktop: width >= parseInt(breakpoints.lg) && width < parseInt(breakpoints.xl),
          isWide: width >= parseInt(breakpoints.xl),
          orientation,
        })
      }, debounceMs)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [debounceMs])

  return dimensions
}

function getCurrentBreakpoint(width: number): keyof typeof breakpoints {
  const bp = breakpoints
  if (width >= parseInt(bp['3xl'])) return '3xl'
  if (width >= parseInt(bp['2xl'])) return '2xl'
  if (width >= parseInt(bp.xl)) return 'xl'
  if (width >= parseInt(bp.lg)) return 'lg'
  if (width >= parseInt(bp.md)) return 'md'
  if (width >= parseInt(bp.sm)) return 'sm'
  return 'xs'
}

export interface UseBreakpointOptions {
  breakpoint: keyof typeof breakpoints
  match?: 'up' | 'down' | 'exact'
}

export function useBreakpoint(options: UseBreakpointOptions): boolean {
  const { breakpoint, match = 'up' } = options
  const { currentBreakpoint, width } = useResponsive()

  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)
  const targetIndex = breakpointOrder.indexOf(breakpoint)

  if (match === 'exact') {
    return currentBreakpoint === breakpoint
  }

  if (match === 'up') {
    return currentIndex >= targetIndex
  }

  if (match === 'down') {
    return currentIndex <= targetIndex
  }

  return false
}

export interface UseMediaQueryOptions {
  query: string
  debounceMs?: number
}

export function useMediaQuery(options: UseMediaQueryOptions): boolean {
  const { query, debounceMs = 100 } = options
  const [matches, setMatches] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setMatches(mediaQuery.matches)
      }, debounceMs)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, debounceMs])

  return matches
}
