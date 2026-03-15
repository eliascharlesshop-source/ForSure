import { useState } from 'react'
import { Button } from '@/components/ui/forsure-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Badge } from '@/components/ui/forsure-badge'
import { ErrorBoundary } from '@/components/error-boundary'

// Mock components for demonstration
const ComponentShowcase = ({ component, title, description, props, variants }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="space-y-4">
        <Button variant="default">Default {component}</Button>
        <Button variant="brand">Brand {component}</Button>
        <Button variant="outline">Outline {component}</Button>
      </div>
    </CardContent>
  </Card>
)

const ConsolidatedLiveExample = ({ 
  quantumOptimized, 
  cognitiveOptimized, 
  neuralOptimized, 
  aiOptimized,
  children 
}: any) => (
  <Card className="border-2 border-dashed border-purple-300">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Badge variant="outline">Quantum</Badge>
        <Badge variant="outline">Cognitive</Badge>
        <Badge variant="outline">Neural</Badge>
        <Badge variant="outline">AI</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
)

export default function InteractiveDocumentation() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-brand-secondary font-bold text-sm">FS</span>
              </div>
              <span className="font-semibold">ForSure Design System</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Components</Button>
              <Button variant="ghost" size="sm">Tokens</Button>
              <Button variant="ghost" size="sm">Guidelines</Button>
              <Button variant="brand" size="sm">Get Started</Button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ForSure Interactive Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Experience the unified power of Quantum Computing, Cognitive Intelligence, Neural Networks, and AI in a single, consolidated design system.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="success" className="text-sm px-4 py-2">
                ⚛️ Quantum Optimized
              </Badge>
              <Badge variant="success" className="text-sm px-4 py-2">
                🧠 Cognitive Enhanced
              </Badge>
              <Badge variant="success" className="text-sm px-4 py-2">
                🔗 Neural Powered
              </Badge>
              <Badge variant="success" className="text-sm px-4 py-2">
                🤖 AI Driven
              </Badge>
            </div>
          </section>

          {/* Live Examples Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Live Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ConsolidatedLiveExample
                quantumOptimized={true}
                cognitiveOptimized={true}
                neuralOptimized={true}
                aiOptimized={true}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">⚛️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quantum Circuit Builder</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Interactive quantum circuit builder with drag-and-drop gate placement.
                  </p>
                  <Button size="sm" variant="brand">Try Demo</Button>
                </div>
              </ConsolidatedLiveExample>

              <ConsolidatedLiveExample
                quantumOptimized={true}
                cognitiveOptimized={true}
                neuralOptimized={true}
                aiOptimized={true}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🔬</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quantum Simulator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-fidelity quantum circuit simulation with state vector evolution.
                  </p>
                  <Button size="sm" variant="brand">Run Demo</Button>
                </div>
              </ConsolidatedLiveExample>

              <ConsolidatedLiveExample
                quantumOptimized={true}
                cognitiveOptimized={true}
                neuralOptimized={true}
                aiOptimized={true}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Neural Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Real-time neural network performance analytics and optimization.
                  </p>
                  <Button size="sm" variant="brand">View Analytics</Button>
                </div>
              </ConsolidatedLiveExample>
            </div>
          </section>

          {/* Components Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Components</h2>
            
            <div className="space-y-16">
              <ComponentShowcase
                component="Button"
                title="Button"
                description="A versatile button component with multiple variants, sizes, and states."
                props={{ variant: 'default', size: 'md' }}
                variants={[]}
              />
              
              <ComponentShowcase
                component="Card"
                title="Card"
                description="Flexible card component for grouping related content."
                props={{ variant: 'default' }}
                variants={[]}
              />
              
              <ComponentShowcase
                component="Badge"
                title="Badge"
                description="Small status indicators and labels."
                props={{ variant: 'default' }}
                variants={[]}
              />
            </div>
          </section>

          {/* Design Tokens Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Design Tokens</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Color System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-primary rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Brand Primary</p>
                    <p className="text-xs text-muted-foreground">#8CFFE6</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-secondary rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Brand Secondary</p>
                    <p className="text-xs text-muted-foreground">#0A4D68</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Success</p>
                    <p className="text-xs text-muted-foreground">#10B981</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Warning</p>
                    <p className="text-xs text-muted-foreground">#F59E0B</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-destructive rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Destructive</p>
                    <p className="text-xs text-muted-foreground">#EF4444</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium">Muted</p>
                    <p className="text-xs text-muted-foreground">#6B7280</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
                  <span className="text-brand-secondary font-bold text-xs">FS</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  © 2024 ForSure Design System. All rights reserved.
                </span>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">GitHub</Button>
                <Button variant="ghost" size="sm">Documentation</Button>
                <Button variant="ghost" size="sm">Storybook</Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
