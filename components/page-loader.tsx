'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

interface PageLoaderProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function PageLoader({ isVisible, onComplete }: PageLoaderProps) {
  const [shouldRender, setShouldRender] = useState(isVisible)
  const [isExiting, setIsExiting] = useState(false)
  const { theme: currentTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isDark = mounted && (currentTheme === 'dark' || (currentTheme === 'system' && resolvedTheme === 'dark'))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible && shouldRender) {
      setIsExiting(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsExiting(false)
        onComplete?.()
      }, 300)
      return () => clearTimeout(timer)
    } else if (isVisible && !shouldRender) {
      setShouldRender(true)
    }
  }, [isVisible, shouldRender, onComplete])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      } ${isDark ? 'bg-background' : 'bg-white'}`}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Animated Logo */}
        <div className="relative w-20 h-20">
          <div
            className={`absolute inset-0 rounded-full blur-lg ${
              isDark ? 'bg-primary/20' : 'bg-primary/10'
            } scale-125 animate-pulse`}
          />
          <Image
            src="/fs-logo.png"
            alt="ForSure Logo"
            width={80}
            height={80}
            className="h-20 w-20 relative z-10"
            style={{
              filter: isDark
                ? 'drop-shadow(0 0 12px rgba(140, 255, 230, 0.3))'
                : 'drop-shadow(0 0 8px rgba(140, 255, 230, 0.2))',
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Loading ForSure</h2>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
