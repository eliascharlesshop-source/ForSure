'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/forsure-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Badge } from '@/components/ui/forsure-badge'
import { Input } from '@/components/ui/forsure-input'
import { cn } from '@/lib/utils'

interface LiveExampleProps {
  title: string
  description?: string
  code: string
  sandboxId?: string
  children: React.ReactNode
}

export function LiveExample({ title, description, code, sandboxId, children }: LiveExampleProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'sandbox'>('preview')
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const openSandbox = () => {
    if (sandboxId) {
      window.open(`https://codesandbox.io/s/${sandboxId}`, '_blank')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {sandboxId && (
              <Button variant="outline" size="sm" onClick={openSandbox}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in CodeSandbox
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeTab === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </Button>
          <Button
            variant={activeTab === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('code')}
          >
            Code
          </Button>
          {sandboxId && (
            <Button
              variant={activeTab === 'sandbox' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('sandbox')}
            >
              Sandbox
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'preview' && (
          <div className="min-h-[200px] p-6 border rounded-md bg-background">
            {children}
          </div>
        )}
        
        {activeTab === 'code' && (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copiedCode ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        )}
        
        {activeTab === 'sandbox' && sandboxId && (
          <div className="aspect-video">
            <iframe
              src={`https://codesandbox.io/embed/${sandboxId}?view=preview&theme=dark`}
              className="w-full h-full rounded-md border"
              title="CodeSandbox Preview"
              loading="lazy"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ComponentShowcaseProps {
  component: string
  title: string
  description: string
  props?: Record<string, any>
  variants?: Array<{
    name: string
    props: Record<string, any>
    code: string
  }>
  sandboxId?: string
}

export function ComponentShowcase({ 
  component, 
  title, 
  description, 
  props = {}, 
  variants = [], 
  sandboxId 
}: ComponentShowcaseProps) {
  const [activeVariant, setActiveVariant] = useState(0)
  const [dynamicProps, setDynamicProps] = useState(props)

  const currentVariant = variants[activeVariant] || { props, code: '' }

  useEffect(() => {
    setDynamicProps(currentVariant.props)
  }, [activeVariant, currentVariant.props])

  const renderComponent = () => {
    switch (component) {
      case 'Button':
        return (
          <div className="flex gap-4 flex-wrap">
            <Button {...dynamicProps}>Default Button</Button>
            <Button variant="brand" {...dynamicProps}>Brand Button</Button>
            <Button variant="outline" {...dynamicProps}>Outline Button</Button>
          </div>
        )
      case 'Card':
        return (
          <div className="max-w-md">
            <Card {...dynamicProps}>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a card component with some content inside.</p>
              </CardContent>
            </Card>
          </div>
        )
      case 'Badge':
        return (
          <div className="flex gap-2 flex-wrap">
            <Badge {...dynamicProps}>Default</Badge>
            <Badge variant="success" {...dynamicProps}>Success</Badge>
            <Badge variant="warning" {...dynamicProps}>Warning</Badge>
            <Badge variant="destructive" {...dynamicProps}>Error</Badge>
          </div>
        )
      case 'Input':
        return (
          <div className="max-w-md space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...dynamicProps}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...dynamicProps}
            />
          </div>
        )
      default:
        return <div>Component not found</div>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {variants.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {variants.map((variant, index) => (
            <Button
              key={index}
              variant={activeVariant === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveVariant(index)}
            >
              {variant.name}
            </Button>
          ))}
        </div>
      )}

      <LiveExample
        title={`${title} - ${variants[activeVariant]?.name || 'Default'}`}
        code={currentVariant.code}
        sandboxId={sandboxId}
      >
        {renderComponent()}
      </LiveExample>

      {Object.keys(dynamicProps).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Props</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(dynamicProps).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium">{key}</label>
                <div className="flex items-center gap-2">
                  {typeof value === 'boolean' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDynamicProps(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    >
                      {value ? 'true' : 'false'}
                    </Button>
                  ) : typeof value === 'string' ? (
                    <Input
                      value={value}
                      onChange={(e) => setDynamicProps(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">{String(value)}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function ComponentGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}

export function DesignSystemOverview() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">ForSure Design System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive design system built with React, TypeScript, and Tailwind CSS. 
          Accessible, responsive, and customizable components for modern web applications.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">View on GitHub</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-semibold">Design Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Centralized design tokens for consistent styling across your application.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold">Accessibility First</h3>
              <p className="text-sm text-muted-foreground">
                WCAG 2.2 AA compliant components with built-in accessibility features.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Flexible theming system with easy customization and extension options.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
