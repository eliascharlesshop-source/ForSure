'use client'

import type React from 'react'
import Link from 'next/link'
import { Lock, ArrowRight, Rocket, Building2, Zap } from 'lucide-react'
import { useSubscription } from '@/contexts/subscription-context'
import type { TierPermissions } from '@/lib/tier-permissions'
import { getUpgradeTarget, TIER_LABELS } from '@/lib/tier-permissions'
import { Button } from '@/components/ui/forsure-button'

const TIER_ICONS = {
  starter: <Zap className="h-4 w-4" />,
  professional: <Rocket className="h-4 w-4" />,
  enterprise: <Building2 className="h-4 w-4" />,
}

interface FeatureGateProps {
  /** The permission key that must be truthy (boolean) or positive (number) to show children */
  feature: keyof TierPermissions
  /** Optional label shown in the upgrade prompt */
  featureLabel?: string
  /** Show an inline lock icon instead of a full overlay — useful for buttons/chips */
  inline?: boolean
  children: React.ReactNode
  /** Override the entire fallback UI */
  fallback?: React.ReactNode
}

export function FeatureGate({
  feature,
  featureLabel,
  inline = false,
  children,
  fallback,
}: FeatureGateProps) {
  const { can, tier, tierLabel } = useSubscription()

  if (can(feature)) return <>{children}</>

  const upgrade = getUpgradeTarget(tier)

  if (fallback) return <>{fallback}</>

  if (inline) {
    return (
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        title={`Upgrade to unlock ${featureLabel ?? feature.toString()}`}
      >
        <Lock className="h-3 w-3" />
        <span>{featureLabel ?? 'Locked'}</span>
      </Link>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[220px] rounded-xl border border-dashed border-primary/20 bg-muted/30 p-8 text-center select-none">
      {/* Blurred content hint */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 backdrop-blur-[2px] bg-background/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 border border-primary/20">
          <Lock className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-semibold text-base mb-1">
            {featureLabel ? `${featureLabel} is locked` : 'Feature locked'}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            You&apos;re on the <span className="text-foreground font-medium">{tierLabel}</span> plan. Upgrade to unlock this feature.
          </p>
        </div>

        {upgrade && (
          <Button asChild size="sm">
            <Link href="/pricing">
              <span className="flex items-center gap-1.5">
                {TIER_ICONS[upgrade] ?? null}
                Upgrade to {TIER_LABELS[upgrade]}
                <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
              </span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
