'use client'

import type React from 'react'
import { useState } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { AppTopbar } from './components/app-topbar'
import StatusBar from '@/components/status-bar'
import { StatusBarProvider } from '@/contexts/status-bar-context'
import { TopbarProvider } from './components/topbar-provider'
import { useDesignDevMode } from '@/hooks/use-design-dev-mode'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useDesignDevMode({
    storageKey: 'forsure-studio-mode',
  })
  
  const [newProjectTrigger, setNewProjectTrigger] = useState(false)

  const handleNewProject = () => {
    setNewProjectTrigger(!newProjectTrigger)
  }

  return (
    <ProtectedRoute>
      <StatusBarProvider>
        <TopbarProvider
          mode={mode}
          onModeChange={setMode}
          onNewProject={handleNewProject}
          newProjectTrigger={newProjectTrigger ? 1 : 0}
        >
          <div className="h-screen flex flex-col overflow-hidden">
            <AppTopbar />
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
            <StatusBar />
          </div>
        </TopbarProvider>
      </StatusBarProvider>
    </ProtectedRoute>
  )
}
