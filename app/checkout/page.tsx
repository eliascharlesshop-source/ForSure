'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { PRODUCTS } from '@/lib/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Button } from '@/components/ui/forsure-button'
import { CheckCircle } from 'lucide-react'
import Checkout from '@/components/checkout'

export default function CheckoutPage() {
  const { user } = useAuth()
  const [selectedProductId, setSelectedProductId] = useState<string>('professional')

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the plan that best fits your needs. You can always upgrade or downgrade later.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PRODUCTS.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`cursor-pointer transition-transform hover:scale-105 ${
                selectedProductId === product.id ? 'ring-2 ring-foreground' : ''
              }`}
            >
              <Card
                className={`h-full flex flex-col ${
                  selectedProductId === product.id ? 'bg-foreground/5' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Checkout Component */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
              <CardDescription>
                User: {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Checkout productId={selectedProductId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
