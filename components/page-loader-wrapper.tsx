'use client'

import { useState, useEffect } from 'react'
import PageLoader from '@/components/page-loader'

export function PageLoaderWrapper() {
  const [isContentReady, setIsContentReady] = useState(false)

  useEffect(() => {
    // Show loader briefly as page indicator, then fade to content
    const timer = setTimeout(() => {
      setIsContentReady(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return <PageLoader isVisible={!isContentReady} />
}
