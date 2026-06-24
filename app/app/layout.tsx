import type React from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { AppTopbar } from './components/app-topbar'
import StatusBar from '@/components/status-bar'
import { StatusBarProvider } from '@/contexts/status-bar-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <StatusBarProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <AppTopbar />
          <div className="flex-1 flex flex-col overflow-hidden p-[5px]">{children}</div>
          <StatusBar />
        </div>
      </StatusBarProvider>
    </ProtectedRoute>
  )
}
