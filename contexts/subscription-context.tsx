'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  type SubscriptionTier,
  type TierPermissions,
  getPermissions,
  canAccess,
  TIER_LABELS,
} from '@/lib/tier-permissions'

interface SubscriptionContextType {
  tier: SubscriptionTier
  permissions: TierPermissions
  isLoading: boolean
  /** Check if the user can access a specific feature */
  can: (feature: keyof TierPermissions) => boolean
  /** Human-readable tier name */
  tierLabel: string
  /** True if the user has an active paid subscription */
  isPaid: boolean
  /** Refetch the subscription from the server */
  refresh: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [tier, setTier] = useState<SubscriptionTier>('free')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setTier('free')
      return
    }

    setIsLoading(true)
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('fs_access_token') : null
      const res = await fetch('/api/v1/subscriptions/current', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (res.ok) {
        const { data } = await res.json()
        const rawTier = (data?.tier as string | undefined)?.toLowerCase()
        const validTiers: SubscriptionTier[] = ['free', 'starter', 'professional', 'enterprise']
        setTier(validTiers.includes(rawTier as SubscriptionTier) ? (rawTier as SubscriptionTier) : 'free')
      } else {
        setTier('free')
      }
    } catch {
      setTier('free')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const permissions = getPermissions(tier)

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        permissions,
        isLoading,
        can: (feature) => canAccess(tier, feature),
        tierLabel: TIER_LABELS[tier],
        isPaid: tier !== 'free',
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}
