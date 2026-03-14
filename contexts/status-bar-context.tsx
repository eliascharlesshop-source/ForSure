'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface StatusBarContextType {
  visible: boolean
  setVisible: (visible: boolean) => void
  toggleVisible: () => void
}

const StatusBarContext = createContext<StatusBarContextType | undefined>(
  undefined
)

export function useStatusBar() {
  const context = useContext(StatusBarContext)
  if (context === undefined) {
    throw new Error('useStatusBar must be used within a StatusBarProvider')
  }
  return context
}

interface StatusBarProviderProps {
  children: ReactNode
}

export function StatusBarProvider({ children }: StatusBarProviderProps) {
  const [visible, setVisible] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('forsure-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (typeof settings.showStatusBar === 'boolean') {
          setVisible(settings.showStatusBar)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  // Save to localStorage when visibility changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('forsure-settings')
    let settings = {}
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings)
      } catch (error) {
        console.error('Error parsing settings:', error)
      }
    }

    settings = { ...settings, showStatusBar: visible }
    localStorage.setItem('forsure-settings', JSON.stringify(settings))
  }, [visible])

  const toggleVisible = () => {
    setVisible(prev => !prev)
  }

  return (
    <StatusBarContext.Provider value={{ visible, setVisible, toggleVisible }}>
      {children}
    </StatusBarContext.Provider>
  )
}
