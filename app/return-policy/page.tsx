'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/forsure-button'
import { Input } from '@/components/ui/forsure-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

interface ReturnPolicyData {
  returnPeriod: number | 'custom'
  customDays?: number
  periodType: 'delivery' | 'purchase'
  returnCost: 'free' | 'shipping' | 'fixed' | 'variable'
  fixedFee?: number
  hasExceptions: boolean
  exceptedProducts?: string[]
  returnLogistics: 'instant' | 'request' | 'not_applicable' | 'customer'
  hasPhysicalLocation: boolean
  policyUrl: string
}

export default function ReturnPolicyPage() {
  const [formData, setFormData] = useState<ReturnPolicyData>({
    returnPeriod: 30,
    periodType: 'delivery',
    returnCost: 'free',
    hasExceptions: false,
    returnLogistics: 'instant',
    hasPhysicalLocation: false,
    policyUrl: '',
  })

  const [exceptionProducts, setExceptionProducts] = useState<string[]>([])
  const [newException, setNewException] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleReturnPeriodChange = (value: string) => {
    if (value === 'custom') {
      setFormData({ ...formData, returnPeriod: 'custom', customDays: 45 })
    } else {
      setFormData({ ...formData, returnPeriod: parseInt(value), customDays: undefined })
    }
  }

  const handleReturnCostChange = (value: string) => {
    setFormData({ ...formData, returnCost: value as any })
  }

  const addException = () => {
    if (newException.trim()) {
      setExceptionProducts([...exceptionProducts, newException])
      setNewException('')
    }
  }

  const removeException = (index: number) => {
    setExceptionProducts(exceptionProducts.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Return Policy</h1>
          <p className="text-muted-foreground">Configure your store's refund, return, and exchange policy</p>
        </div>

        <AnimateOnScroll type="slideUp">
          <div className="grid gap-6">
            {/* Return Period Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return Period</CardTitle>
                <CardDescription>
                  Specify the time period customers have to return items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-semibold">Duration</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[7, 14, 30, 60, 90].map(days => (
                      <button
                        key={days}
                        onClick={() => setFormData({ ...formData, returnPeriod: days })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.returnPeriod === days
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-primary/20 hover:border-primary/40 text-foreground'
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                    <button
                      onClick={() => handleReturnPeriodChange('custom')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.returnPeriod === 'custom'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-primary/20 hover:border-primary/40 text-foreground'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {formData.returnPeriod === 'custom' && (
                    <div className="mt-4 p-4 bg-background/50 rounded-lg">
                      <Label htmlFor="custom-days" className="text-sm mb-2 block">
                        Number of days
                      </Label>
                      <Input
                        id="custom-days"
                        type="number"
                        min="1"
                        max="365"
                        value={formData.customDays || 45}
                        onChange={(e) =>
                          setFormData({ ...formData, customDays: parseInt(e.target.value) })
                        }
                        className="w-full sm:w-32"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Period Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, periodType: 'delivery' })}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.periodType === 'delivery'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-primary/20 hover:border-primary/40 text-foreground'
                      }`}
                    >
                      Days of Delivery
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, periodType: 'purchase' })}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.periodType === 'purchase'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-primary/20 hover:border-primary/40 text-foreground'
                      }`}
                    >
                      Days of Purchase
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Cost Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return Shipping Cost</CardTitle>
                <CardDescription>
                  Who bears the cost of return shipping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={() => handleReturnCostChange('free')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.returnCost === 'free'
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="font-semibold">Free Returns</div>
                    <div className="text-sm text-muted-foreground">You pay for return shipping</div>
                  </button>

                  <button
                    onClick={() => handleReturnCostChange('shipping')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.returnCost === 'shipping'
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="font-semibold">Customer Pays Shipping</div>
                    <div className="text-sm text-muted-foreground">Customers pay actual return shipping cost</div>
                  </button>

                  <button
                    onClick={() => handleReturnCostChange('fixed')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.returnCost === 'fixed'
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="font-semibold">Fixed Return Fee</div>
                    <div className="text-sm text-muted-foreground">Flat fee per return</div>
                  </button>

                  {formData.returnCost === 'fixed' && (
                    <div className="mt-3 p-4 bg-background/50 rounded-lg">
                      <Label htmlFor="fixed-fee" className="text-sm mb-2 block">
                        Return fee (USD)
                      </Label>
                      <Input
                        id="fixed-fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.fixedFee || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, fixedFee: parseFloat(e.target.value) })
                        }
                        placeholder="5.00"
                        className="w-full sm:w-32"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Exceptions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Exceptions</CardTitle>
                <CardDescription>
                  Mark products that are not eligible for returns or exchanges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="exception-product" className="text-sm mb-2 block">
                      Product category or SKU
                    </Label>
                    <Input
                      id="exception-product"
                      placeholder="e.g., Digital Products, Gift Cards"
                      value={newException}
                      onChange={(e) => setNewException(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addException()}
                    />
                  </div>
                  <Button onClick={addException} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {exceptionProducts.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    {exceptionProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                      >
                        <span className="text-sm font-medium">{product}</span>
                        <button
                          onClick={() => removeException(index)}
                          className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Return Logistics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Return Logistics</CardTitle>
                <CardDescription>
                  How customers arrange returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setFormData({ ...formData, returnLogistics: 'instant' })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.returnLogistics === 'instant'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="font-semibold">Instant Shipping Label</div>
                  <div className="text-sm text-muted-foreground">Automatically generate return labels</div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, returnLogistics: 'request' })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.returnLogistics === 'request'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="font-semibold">Label on Request</div>
                  <div className="text-sm text-muted-foreground">Provide labels when customers request them</div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, returnLogistics: 'not_applicable' })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.returnLogistics === 'not_applicable'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="font-semibold">Not Applicable</div>
                  <div className="text-sm text-muted-foreground">Service or digital products</div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, returnLogistics: 'customer' })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.returnLogistics === 'customer'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="font-semibold">Customer Responsible</div>
                  <div className="text-sm text-muted-foreground">Customers arrange their own shipping</div>
                </button>
              </CardContent>
            </Card>

            {/* Physical Location Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Physical Locations</CardTitle>
                <CardDescription>
                  Accept in-store returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => setFormData({ ...formData, hasPhysicalLocation: !formData.hasPhysicalLocation })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.hasPhysicalLocation
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.hasPhysicalLocation ? 'border-primary bg-primary' : 'border-primary/40'
                      }`}
                    >
                      {formData.hasPhysicalLocation && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    Your store accepts in-store returns
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Policy URL Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Full Policy Document</CardTitle>
                <CardDescription>
                  Link to your complete refund and return policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="policy-url">Policy URL</Label>
                  <Input
                    id="policy-url"
                    type="url"
                    placeholder="https://yourstore.com/return-policy"
                    value={formData.policyUrl}
                    onChange={(e) => setFormData({ ...formData, policyUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Customers will be directed here to read your full policy details
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card className="bg-background/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Policy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Window:</span>
                    <span className="font-semibold">
                      {formData.returnPeriod === 'custom' ? `${formData.customDays} days` : `${formData.returnPeriod} days`}{' '}
                      from {formData.periodType === 'delivery' ? 'delivery' : 'purchase'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Cost:</span>
                    <span className="font-semibold">
                      {formData.returnCost === 'free'
                        ? 'Free (Merchant Paid)'
                        : formData.returnCost === 'shipping'
                        ? 'Customer Pays Actual Shipping'
                        : formData.returnCost === 'fixed'
                        ? `Fixed Fee: $${formData.fixedFee || '0.00'}`
                        : 'Variable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Labels:</span>
                    <span className="font-semibold">
                      {formData.returnLogistics === 'instant'
                        ? 'Instant'
                        : formData.returnLogistics === 'request'
                        ? 'On Request'
                        : formData.returnLogistics === 'not_applicable'
                        ? 'Not Applicable'
                        : 'Customer Arranged'}
                    </span>
                  </div>
                  {exceptionProducts.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Excepted Items:</span>
                      <span className="font-semibold">{exceptionProducts.length} category/categories</span>
                    </div>
                  )}
                  {formData.hasPhysicalLocation && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">In-Store Returns:</span>
                      <span className="font-semibold">Accepted</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="flex-1"
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Policy'}
              </Button>
              {formData.policyUrl && (
                <Button asChild variant="outline">
                  <a href={formData.policyUrl} target="_blank" rel="noopener noreferrer">
                    View Full Policy
                  </a>
                </Button>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
