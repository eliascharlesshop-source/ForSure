import type React from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { SecondaryNavbar } from './components/secondary-navbar'
import StatusBar from '@/components/status-bar'
import { StatusBarProvider } from '@/contexts/status-bar-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <StatusBarProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <SecondaryNavbar />
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
          <StatusBar />
        </div>
      </StatusBarProvider>
    </ProtectedRoute>
  )
}
