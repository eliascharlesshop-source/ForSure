import React, { useEffect, useRef, useState } from 'react'

export interface UseAccessibilityOptions {
  announceChanges?: boolean
  reduceMotion?: boolean
  highContrast?: boolean
}

export interface UseAccessibilityReturn {
  screenReaderEnabled: boolean
  keyboardNavigation: boolean
  reducedMotion: boolean
  highContrast: boolean
  announce: (message: string) => void
  focusElement: (element: HTMLElement | null) => void
  trapFocus: (container: HTMLElement | null) => () => void
}

export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const { announceChanges = true } = options
  
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  
  const announcementRef = useRef<HTMLDivElement | null>(null)
  const focusTrapRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Check for screen reader
    const checkScreenReader = () => {
      const ariaLive = document.createElement('div')
      ariaLive.setAttribute('aria-live', 'polite')
      ariaLive.setAttribute('aria-atomic', 'true')
      ariaLive.style.position = 'absolute'
      ariaLive.style.left = '-10000px'
      ariaLive.style.width = '1px'
      ariaLive.style.height = '1px'
      ariaLive.style.overflow = 'hidden'
      document.body.appendChild(ariaLive)
      
      let detected = false
      const observer = new MutationObserver(() => {
        detected = true
      })
      
      observer.observe(ariaLive, { childList: true })
      ariaLive.textContent = 'test'
      
      setTimeout(() => {
        setScreenReaderEnabled(detected)
        document.body.removeChild(ariaLive)
        observer.disconnect()
      }, 100)
    }

    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches)
    }
    contrastQuery.addEventListener('change', handleContrastChange)

    // Check keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true)
      }
    }
    
    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    
    checkScreenReader()

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const announce = (message: string) => {
    if (!announceChanges || !screenReaderEnabled) return
    
    if (!announcementRef.current) {
      announcementRef.current = document.createElement('div')
      announcementRef.current.setAttribute('aria-live', 'polite')
      announcementRef.current.setAttribute('aria-atomic', 'true')
      announcementRef.current.style.position = 'absolute'
      announcementRef.current.style.left = '-10000px'
      announcementRef.current.style.width = '1px'
      announcementRef.current.style.height = '1px'
      announcementRef.current.style.overflow = 'hidden'
      document.body.appendChild(announcementRef.current)
    }

    announcementRef.current.textContent = message
    
    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = ''
      }
    }, 1000)
  }

  const focusElement = (element: HTMLElement | null) => {
    if (element) {
      element.focus()
      announce(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`)
    }
  }

  const trapFocus = (container: HTMLElement | null) => {
    if (!container) return () => {}

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // Focus first element
    if (firstElement) {
      firstElement.focus()
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  return {
    screenReaderEnabled,
    keyboardNavigation,
    reducedMotion,
    highContrast,
    announce,
    focusElement,
    trapFocus,
  }
}

export interface UseKeyboardNavigationOptions {
  onEnter?: () => void
  onSpace?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  disabled?: boolean
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const {
    onEnter,
    onSpace,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    disabled = false,
  } = options

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        onEnter?.()
        break
      case ' ':
        e.preventDefault()
        onSpace?.()
        break
      case 'Escape':
        e.preventDefault()
        onEscape?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        onArrowDown?.()
        break
      case 'ArrowLeft':
        e.preventDefault()
        onArrowLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        onArrowRight?.()
        break
      case 'Tab':
        onTab?.()
        break
    }
  }

  return {
    onKeyDown: handleKeyDown,
    role: 'button' as const,
    tabIndex: disabled ? -1 : 0,
    'aria-disabled': disabled,
  }
}
