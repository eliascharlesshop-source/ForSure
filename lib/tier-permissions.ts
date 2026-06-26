/**
 * Tier permissions system for ForSure.
 * Maps each subscription tier to the features it unlocks inside /app.
 */

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface TierPermissions {
  /** Max number of saved projects. -1 = unlimited */
  maxProjects: number
  /** Access to AI chat assistant */
  aiChat: boolean
  /** Access to the right-side secondary AI chat panel */
  secondaryChat: boolean
  /** Version history & branching */
  versionHistory: boolean
  /** Team collaboration features */
  teamCollaboration: boolean
  /** Design Mode (whiteboard dashboard) */
  designMode: boolean
  /** Advanced file structure visualization */
  advancedVisualization: boolean
  /** Import / export projects */
  importExport: boolean
  /** Template browser & saving */
  templateBrowser: boolean
  /** Max team members. -1 = unlimited */
  maxTeamMembers: number
  /** Analytics & reporting */
  analytics: boolean
  /** Custom integrations / API access */
  apiAccess: boolean
  /** SSO / SAML */
  sso: boolean
  /** Priority support badge */
  prioritySupport: boolean
}

export const TIER_PERMISSIONS: Record<SubscriptionTier, TierPermissions> = {
  free: {
    maxProjects: 2,
    aiChat: false,
    secondaryChat: false,
    versionHistory: false,
    teamCollaboration: false,
    designMode: false,
    advancedVisualization: false,
    importExport: false,
    templateBrowser: true,
    maxTeamMembers: 1,
    analytics: false,
    apiAccess: false,
    sso: false,
    prioritySupport: false,
  },
  starter: {
    maxProjects: 5,
    aiChat: true,
    secondaryChat: false,
    versionHistory: false,
    teamCollaboration: false,
    designMode: false,
    advancedVisualization: true,
    importExport: true,
    templateBrowser: true,
    maxTeamMembers: 3,
    analytics: false,
    apiAccess: false,
    sso: false,
    prioritySupport: false,
  },
  professional: {
    maxProjects: -1,
    aiChat: true,
    secondaryChat: true,
    versionHistory: true,
    teamCollaboration: true,
    designMode: true,
    advancedVisualization: true,
    importExport: true,
    templateBrowser: true,
    maxTeamMembers: 10,
    analytics: true,
    apiAccess: false,
    sso: false,
    prioritySupport: true,
  },
  enterprise: {
    maxProjects: -1,
    aiChat: true,
    secondaryChat: true,
    versionHistory: true,
    teamCollaboration: true,
    designMode: true,
    advancedVisualization: true,
    importExport: true,
    templateBrowser: true,
    maxTeamMembers: -1,
    analytics: true,
    apiAccess: true,
    sso: true,
    prioritySupport: true,
  },
}

export function getPermissions(tier: SubscriptionTier): TierPermissions {
  return TIER_PERMISSIONS[tier]
}

export function canAccess(
  tier: SubscriptionTier,
  feature: keyof TierPermissions
): boolean {
  const perms = getPermissions(tier)
  const val = perms[feature]
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val !== 0
  return false
}

/** Human-readable tier label */
export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

/** Upgrade path — where should a user go when they hit a paywall? */
export function getUpgradeTarget(tier: SubscriptionTier): SubscriptionTier | null {
  const order: SubscriptionTier[] = ['free', 'starter', 'professional', 'enterprise']
  const idx = order.indexOf(tier)
  return idx < order.length - 1 ? order[idx + 1] : null
}
