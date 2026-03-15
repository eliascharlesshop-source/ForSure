'use client'

import { useState, useEffect } from 'react'

export type DesignDevMode = 'design' | 'dev'

interface UseDesignDevModeOptions {
  defaultMode?: DesignDevMode
  storageKey?: string
  onChange?: (mode: DesignDevMode) => void
}

export function useDesignDevMode(options: UseDesignDevModeOptions = {}) {
  const {
    defaultMode = 'design',
    storageKey = 'forsure-design-dev-mode',
    onChange
  } = options

  // Initialize mode from localStorage or default
  const [mode, setMode] = useState<DesignDevMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored && (stored === 'design' || stored === 'dev')) {
        return stored as DesignDevMode
      }
    }
    return defaultMode
  })

  // Update localStorage when mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, mode)
    }
    onChange?.(mode)
  }, [mode, storageKey, onChange])

  const toggleMode = () => {
    setMode(prev => prev === 'design' ? 'dev' : 'design')
  }

  const setDesignMode = () => setMode('design')
  const setDevMode = () => setMode('dev')

  return {
    mode,
    setMode,
    toggleMode,
    setDesignMode,
    setDevMode,
    isDesignMode: mode === 'design',
    isDevMode: mode === 'dev'
  }
}
