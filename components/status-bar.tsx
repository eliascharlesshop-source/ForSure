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
    <div className="flex items-center justify-between px-2 py-1 bg-muted/80 border-t border-border text-xs text-muted-foreground select-none">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Branch info */}
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>{getBranchInfo()}</span>
          <span className="text-muted-foreground/60">•</span>
          <span>v1.0.0</span>
        </div>

        {/* File info */}
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{activeFile}</span>
        </div>

        {/* Position info */}
        <div className="flex items-center gap-1">
          <span>
            Ln {lineCount}, Col {columnCount}
          </span>
        </div>

        {/* Language/encoding info */}
        <div className="flex items-center gap-3 text-muted-foreground/70">
          <span>{getIndentation()}</span>
          <span>{getEncoding()}</span>
          <span>{getLineEnding()}</span>
          <span>{getLanguageMode()}</span>
        </div>
      </div>

      {/* Center section - Status indicators */}
      <div className="flex items-center gap-3">
        {/* Autocomplete status */}
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Autocomplete</span>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span>{isOnline ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{user.email?.split('@')[0] || 'Demo User'}</span>
          </div>
        )}

        {/* Plan status */}
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3 text-blue-500" />
          <span>{user ? 'Pro Plan' : 'Free - Upgrade Now'}</span>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-1">
          <Settings className="h-3 w-3" />
          <span>Windsurf - Settings</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  )
}
