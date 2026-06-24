'use client'

import { usePathname } from 'next/navigation'
import UnifiedNav from '@/components/unified-nav'

export function NavWrapper() {
  const pathname = usePathname()
  
  // Hide nav on /app routes (they have their own AppTopbar)
  if (pathname?.startsWith('/app')) {
    return null
  }
  
  return <UnifiedNav context="public" />
}
