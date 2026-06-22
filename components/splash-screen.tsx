import { useState, useEffect } from 'react'
import FloatingLogo from '@/components/floating-logo'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-secondary dark:bg-secondary-dark flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <FloatingLogo
            src="/fs-logo.png"
            alt="ForSure Logo"
            width={120}
            height={120}
            className="h-30 w-30 mx-auto animate-pulse"
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-secondary-dark/70 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/30">
            <span className="text-primary font-mono text-xs">
              ForSure v1.0.0
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              Initializing ForSure
            </h1>
          </div>

          <p className="text-white/80 text-sm max-w-md mx-auto">
            Loading your prompting programming environment...
          </p>
        </div>


      </div>
    </div>
  )
}
