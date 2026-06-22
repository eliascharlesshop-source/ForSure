'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect when main content is ready to be displayed
 * Monitors for DOM readiness and visibility of key content elements
 */
export function useContentReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // If document is already interactive or complete, content is ready
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      // Small delay to ensure React has hydrated
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 300)
      return () => clearTimeout(timer)
    }

    // Wait for DOM to be interactive
    const handleReadyStateChange = () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        // Add small delay to ensure styles are applied
        const timer = setTimeout(() => {
          setIsReady(true)
        }, 300)
        return () => clearTimeout(timer)
      }
    }

    document.addEventListener('readystatechange', handleReadyStateChange)
    return () => document.removeEventListener('readystatechange', handleReadyStateChange)
  }, [])

  return isReady
}
