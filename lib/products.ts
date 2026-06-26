export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started',
    priceInCents: 2999, // $29.99/month
    features: [
      'Up to 5 projects',
      'Basic task management',
      'Team collaboration (up to 3 members)',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing teams',
    priceInCents: 7999, // $79.99/month
    features: [
      'Unlimited projects',
      'Advanced task management',
      'Team collaboration (up to 10 members)',
      'Priority email support',
      'Custom templates',
      'Analytics & reporting',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    priceInCents: 29999, // $299.99/month
    features: [
      'Unlimited everything',
      'Advanced security',
      'Team collaboration (unlimited members)',
      '24/7 phone & email support',
      'Custom integration',
      'Dedicated account manager',
      'Advanced analytics',
      'SSO & SAML',
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}
