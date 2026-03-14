import { useState, useEffect } from 'react'
import { Sparkles, Zap } from 'lucide-react'
import FloatingLogo from '@/components/floating-logo'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
            onComplete()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
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
            <Sparkles className="h-6 w-6 text-primary animate-spin" />
            <h1 className="text-2xl font-bold text-white">
              Initializing ForSure
            </h1>
            <Zap className="h-6 w-6 text-primary animate-pulse" />
          </div>

          <p className="text-white/80 text-sm max-w-md mx-auto">
            Loading your prompting programming environment...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-secondary-dark/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-xs mt-2">{progress}% Complete</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
