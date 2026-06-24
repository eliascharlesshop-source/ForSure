'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from 'next-themes'
import { useStatusBar } from '@/contexts/status-bar-context'
import {
  GitBranch,
  Clock,
  FileText,
  Settings,
  User,
  Database,
  Wifi,
  WifiOff,
  Circle,
  CheckCircle,
} from 'lucide-react'

export default function StatusBar() {
  const { visible } = useStatusBar()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [lineCount, setLineCount] = useState(1)
  const [columnCount, setColumnCount] = useState(1)
  const [wordCount, setWordCount] = useState(0)
  const [activeFile, setActiveFile] = useState<string>('')
  const pathname = usePathname()
  const { user } = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Extract file info from pathname
    if (pathname) {
      const segments = pathname.split('/')
      const fileName = segments[segments.length - 1]
      setActiveFile(fileName || 'root')
    }
  }, [pathname])

  useEffect(() => {
    // Get real document line count if available
    const updateLineCount = () => {
      const activeElement = document.activeElement
      if (
        activeElement &&
        (activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        const text =
          (activeElement as HTMLTextAreaElement)?.value ||
          activeElement.textContent ||
          ''
        const lines = text.split('\n').length
        const words = text.split(/\s+/).filter(word => word.length > 0).length

        // Get cursor position for textarea
        if (activeElement.tagName === 'TEXTAREA') {
          const textarea = activeElement as HTMLTextAreaElement
          const cursorPos = textarea.selectionStart
          const textBeforeCursor = text.substring(0, cursorPos)
          const currentLine = textBeforeCursor.split('\n').length
          const currentColumn = textBeforeCursor.split('\n').pop()?.length || 0

          setLineCount(currentLine)
          setColumnCount(currentColumn + 1)
        } else {
          setLineCount(lines)
          setColumnCount(1)
        }

        setWordCount(words)
      }
    }

    // Initial update
    updateLineCount()

    // Listen for input and selection events
    document.addEventListener('input', updateLineCount)
    document.addEventListener('selectionchange', updateLineCount)
    window.addEventListener('focus', updateLineCount)

    return () => {
      document.removeEventListener('input', updateLineCount)
      document.removeEventListener('selectionchange', updateLineCount)
      window.removeEventListener('focus', updateLineCount)
    }
  }, [])

  if (!visible) return null

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getBranchInfo = () => {
    // Simulate branch info
    const branches = [
      'main',
      'develop',
      'feature/new-ui',
      'hotfix/critical-bug',
    ]
    const randomBranch = branches[Math.floor(Math.random() * branches.length)]
    return randomBranch
  }

  const getLanguageMode = () => {
    if (pathname?.includes('/app')) return 'ForSure'
    if (pathname?.includes('/cli')) return 'Bash'
    if (pathname?.includes('/docs')) return 'Markdown'
    if (pathname?.includes('/settings')) return 'TypeScript'
    return 'TypeScript JSX'
  }

  const getEncoding = () => 'UTF-8'
  const getLineEnding = () => 'LF'
  const getIndentation = () => 'Spaces: 2'

  return (
    <div className="relative w-full border-t border-border text-xs bg-muted/80">
      {/* Fade overlay - left */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-muted/80 to-transparent pointer-events-none z-10 hidden sm:block" />
      
      {/* Fade overlay - right */}
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-muted/80 to-transparent pointer-events-none z-10 hidden sm:block" />

      {/* Scrollable container */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-3 py-1.5 text-muted-foreground select-none whitespace-nowrap min-w-min">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Branch info - hidden on extra small screens */}
            <div className="hidden sm:flex items-center gap-1">
              <GitBranch className="h-3 w-3 flex-shrink-0" />
              <span className="hidden md:inline">{getBranchInfo()}</span>
              <span className="hidden md:inline text-muted-foreground/60">•</span>
              <span className="hidden md:inline">v1.0.0</span>
            </div>

            {/* File info - hidden on small screens */}
            <div className="hidden sm:flex items-center gap-1">
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className="hidden md:inline">{activeFile}</span>
            </div>

            {/* Position info - always visible */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs">
                Ln {lineCount}
              </span>
              <span className="hidden sm:inline">
                Col {columnCount}
              </span>
            </div>

            {/* Language/encoding info - hidden on small screens */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 text-muted-foreground/70">
              <span>{getIndentation()}</span>
              <span>{getEncoding()}</span>
              <span>{getLineEnding()}</span>
              <span>{getLanguageMode()}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-3 bg-border/40" />

          {/* Center section - Status indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Autocomplete status - hidden on small screens */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>Autocomplete</span>
            </div>

            {/* Connection status - always visible */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500 flex-shrink-0" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500 flex-shrink-0" />
              )}
              <span className="hidden sm:inline">
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-3 bg-border/40" />

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* User info - hidden on small screens */}
            {user && (
              <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="hidden md:inline">
                  {user.email?.split('@')[0] || 'Demo User'}
                </span>
              </div>
            )}

            {/* Plan status - hidden on small screens */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              <Circle className="h-3 w-3 text-blue-500 flex-shrink-0" />
              <span>{user ? 'Pro Plan' : 'Free'}</span>
            </div>

            {/* Settings - hidden on small screens */}
            <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
              <Settings className="h-3 w-3 flex-shrink-0" />
              <span>Windsurf</span>
            </div>

            {/* Time - always visible */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
