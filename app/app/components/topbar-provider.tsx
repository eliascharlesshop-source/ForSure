'use client'

import React, { createContext, useContext, ReactNode, useCallback } from 'react'

interface TopbarContextType {
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
  onNewProject: () => void
  newProjectTrigger: number
}

const TopbarContext = createContext<TopbarContextType | undefined>(undefined)

export function TopbarProvider({
  children,
  mode,
  onModeChange,
  onNewProject: onNewProjectProp,
  newProjectTrigger,
}: {
  children: ReactNode
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
  onNewProject: () => void
  newProjectTrigger: number
}) {
  const onNewProject = useCallback(() => {
    onNewProjectProp()
  }, [onNewProjectProp])

  return (
    <TopbarContext.Provider value={{ mode, onModeChange, onNewProject, newProjectTrigger }}>
      {children}
    </TopbarContext.Provider>
  )
}

export function useTopbar() {
  const context = useContext(TopbarContext)
  if (!context) {
    throw new Error('useTopbar must be used within TopbarProvider')
  }
  return context
}
