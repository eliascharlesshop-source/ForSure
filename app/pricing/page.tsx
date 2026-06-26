'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/subscription-context'
import { PRODUCTS } from '@/lib/products'
import { TIER_PERMISSIONS, type SubscriptionTier } from '@/lib/tier-permissions'
import { Check, X, Zap, Building2, Rocket, ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import AnimateOnScroll from '@/components/animate-on-scroll'

const BILLING_TOGGLE_DISCOUNT = 0.17 // 17% off annual

interface PlanMeta {
  id: SubscriptionTier
  productId: string
  icon: React.ReactNode
  color: string
  badgeText?: string
  annualSuffix?: string
}

const PLAN_META: PlanMeta[] = [
  {
    id: 'starter',
    productId: 'starter',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-sky-400',
  },
  {
    id: 'professional',
    productId: 'professional',
    icon: <Rocket className="h-5 w-5" />,
    color: 'text-primary',
    badgeText: 'Most Popular',
  },
  {
    id: 'enterprise',
    productId: 'enterprise',
    icon: <Building2 className="h-5 w-5" />,
    color: 'text-violet-400',
  },
]

const FEATURE_ROWS: { label: string; key: keyof typeof TIER_PERMISSIONS.starter; tooltip?: string }[] = [
  { label: 'Saved projects', key: 'maxProjects', tooltip: '-1 means unlimited' },
  { label: 'AI chat assistant', key: 'aiChat' },
  { label: 'Secondary AI chat', key: 'secondaryChat' },
  { label: 'Version history & branching', key: 'versionHistory' },
  { label: 'Team collaboration', key: 'teamCollaboration' },
  { label: 'Design Mode (whiteboard)', key: 'designMode' },
  { label: 'Advanced visualization', key: 'advancedVisualization' },
  { label: 'Import / export projects', key: 'importExport' },
  { label: 'Template browser', key: 'templateBrowser' },
  { label: 'Team members', key: 'maxTeamMembers' },
  { label: 'Analytics & reporting', key: 'analytics' },
  { label: 'API access', key: 'apiAccess' },
  { label: 'SSO / SAML', key: 'sso' },
  { label: 'Priority support', key: 'prioritySupport' },
]

function featureValue(val: boolean | number): React.ReactNode {
  if (typeof val === 'boolean') {
    return val ? (
      <Check className="h-4 w-4 text-primary mx-auto" />
    ) : (
      <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
    )
  }
  if (val === -1) return <span className="text-primary text-sm font-medium">Unlimited</span>
  return <span className="text-sm text-foreground">{val}</span>
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const { isAuthenticated } = useAuth()
  const { tier: currentTier } = useSubscription()
  const router = useRouter()

  const handleSelectPlan = (productId: string) => {
    if (!isAuthenticated) {
      router.push('/register')
      return
    }
    router.push(`/checkout?plan=${productId}`)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-20 pb-10 text-center px-4">
        <AnimateOnScroll type="fade">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance mb-5">
            Plans &amp; Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-balance leading-relaxed">
            Start for free. Scale as your team grows. Every paid plan includes a&nbsp;14-day free trial.
          </p>
        </AnimateOnScroll>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${annual ? 'bg-primary' : 'bg-muted'}`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${annual ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
            <span className="ml-1.5 text-xs text-primary font-mono">save 17%</span>
          </span>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {PLAN_META.map((meta, i) => {
            const product = PRODUCTS.find(p => p.id === meta.productId)
            if (!product) return null
            const isPopular = !!meta.badgeText
            const monthlyPrice = product.priceInCents / 100
            const displayPrice = annual
              ? (monthlyPrice * (1 - BILLING_TOGGLE_DISCOUNT)).toFixed(2)
              : monthlyPrice.toFixed(2)
            const isCurrent = currentTier === meta.id

            return (
              <AnimateOnScroll key={meta.id} type="slideUp">
                <div
                  className={`relative flex flex-col rounded-2xl border transition-all duration-200 h-full
                    ${isPopular
                      ? 'border-primary bg-primary/5 shadow-[0_0_40px_rgba(140,255,230,0.08)]'
                      : 'border-border/60 bg-card hover:border-primary/40'
                    }`}
                >
                  {/* Popular badge */}
                  {meta.badgeText && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-secondary text-xs font-semibold">
                        <Rocket className="h-3 w-3" />
                        {meta.badgeText}
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Plan header */}
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="font-semibold text-base">{product.name}</span>
                      {isCurrent && (
                        <Badge variant="outline" className="ml-auto text-xs border-primary/40 text-primary">
                          Current plan
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-bold tracking-tight">${displayPrice}</span>
                      <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
                    </div>
                    {annual && (
                      <p className="text-xs text-muted-foreground mb-4">
                        Billed annually — <span className="line-through opacity-60">${monthlyPrice.toFixed(2)}/mo</span>
                      </p>
                    )}

                    {/* CTA */}
                    <Button
                      onClick={() => handleSelectPlan(meta.productId)}
                      disabled={isCurrent}
                      className={`w-full mt-4 mb-7 ${isPopular ? '' : 'variant-outline'}`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      {isCurrent ? 'Current plan' : isAuthenticated ? 'Upgrade' : 'Get started'}
                      {!isCurrent && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>

                    {/* Feature list */}
                    <ul className="space-y-3 flex-1">
                      {product.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-foreground/80">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>

        {/* Free tier note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Not ready to commit?{' '}
          <Link href="/register" className="text-primary hover:underline underline-offset-4">
            Start with the Free tier
          </Link>{' '}
          — no credit card required.
        </p>
      </section>

      {/* Feature comparison table */}
      <section className="container max-w-5xl mx-auto px-4 pb-20">
        <AnimateOnScroll type="fade">
          <h2 className="text-2xl font-bold text-center mb-10">Compare all features</h2>
        </AnimateOnScroll>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-muted/40 border-b border-border/60">
            <div className="p-4 text-sm font-medium text-muted-foreground">Feature</div>
            {PLAN_META.map(meta => {
              const product = PRODUCTS.find(p => p.id === meta.productId)
              return (
                <div key={meta.id} className={`p-4 text-center ${meta.id === 'professional' ? 'bg-primary/5' : ''}`}>
                  <span className={`text-sm font-semibold ${meta.color}`}>{product?.name}</span>
                </div>
              )
            })}
          </div>

          {/* Rows */}
          {FEATURE_ROWS.map((row, ri) => (
            <div
              key={row.key}
              className={`grid grid-cols-4 border-b border-border/40 last:border-0 ${ri % 2 === 0 ? '' : 'bg-muted/20'}`}
            >
              <div className="p-4 text-sm text-foreground/80 flex items-center gap-1.5">
                {row.label}
                {row.tooltip && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50" />}
              </div>
              {PLAN_META.map(meta => {
                const perms = TIER_PERMISSIONS[meta.id]
                const val = perms[row.key]
                return (
                  <div key={meta.id} className={`p-4 text-center ${meta.id === 'professional' ? 'bg-primary/5' : ''}`}>
                    {featureValue(val as boolean | number)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Enterprise CTA */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <AnimateOnScroll type="fade">
            <h2 className="text-2xl font-bold mb-3">Need something bigger?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Our Enterprise plan includes dedicated support, SSO, custom integrations, and unlimited everything. Talk to us.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button asChild>
                <Link href="/contact">Contact Sales <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
