import { ComponentShowcase, ComponentGrid, DesignSystemOverview } from '@/components/interactive-docs'
import { Button } from '@/components/ui/forsure-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Badge } from '@/components/ui/forsure-badge'
import { Input } from '@/components/ui/forsure-input'
import { useState, useEffect } from 'react'

// Quantum-enhanced interactive components
import { QuantumLiveExample, QuantumComponentShowcase, QuantumComponentGrid, QuantumDesignSystemOverview } from '@/components/interactive-docs-quantum-new'

export default function InteractiveDocumentation() {
  return (
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
        <DesignSystemOverview />

        {/* Quantum Section */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚛️</span>
            </div>
            <h2 className="text-3xl font-bold">Quantum Computing Features</h2>
            <Badge variant="brand">New</Badge>
          </div>
          
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground">
              Experience the future of computing with our quantum-enhanced design system. 
              Advanced quantum computing capabilities including superposition, entanglement, and quantum circuit simulation.
            </p>
            
            {/* Quantum Live Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QuantumLiveExample
                title="Quantum Circuit Simulator"
                description="Interactive quantum circuit simulation with real-time state visualization and measurement outcomes."
                code={`// Create a Bell state circuit
quantumCircuit({
  name: 'bell-state',
  qubits: 2,
  gates: [
    { gate: 'H', target: 0 },
    { gate: 'CNOT', control: 0, target: 1 }
  ],
  measurements: [
    { qubit: 0, basis: 'computational' },
    { qubit: 1, basis: 'computational' }
  ]
})`}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Bell State |Φ+⟩</div>
                    <div className="flex justify-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-300">
                        <span className="text-blue-600 font-bold">|0⟩</span>
                      </div>
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-300">
                        <span className="text-blue-600 font-bold">|1⟩</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Superposition: (|00⟩ + |11⟩) / √2
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline">Simulate</Button>
                    <Button size="sm" variant="brand">Measure</Button>
                  </div>
                </div>
              </QuantumLiveExample>
              
              <QuantumLiveExample
                title="Quantum State Visualization"
                description="Real-time visualization of quantum states including superposition and entanglement patterns."
                code={`// Create superposition state
const superposition = createSuperposition([
  '|00⟩', '|01⟩', '|10⟩', '|11⟩'
], {
  amplitudes: [0.5, 0.5, 0.5, 0.5],
  normalization: 1.0,
  coherence: 0.98
})

// Create entanglement
const entanglement = createEntanglement([0, 1], {
  bellState: 'Φ+',
  maximallyEntangled: true,
  fidelity: 0.99
})`}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Quantum State Vector</div>
                    <div className="grid grid-cols-4 gap-2">
                      {['|00⟩', '|01⟩', '|10⟩', '|11⟩'].map((state, i) => (
                        <div key={i} className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center border border-purple-300">
                            <span className="text-xs font-bold text-purple-600">{state}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">0.5</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline">Reset</Button>
                    <Button size="sm" variant="brand">Apply Gate</Button>
                  </div>
                </div>
              </QuantumLiveExample>
            </div>
            
            {/* Quantum Component Showcase */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Quantum Components</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">⚛️</span>
                      </div>
                      Quantum Circuit Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Interactive quantum circuit builder with drag-and-drop gate placement and real-time simulation.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="brand">Try Demo</Button>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">🔬</span>
                      </div>
                      Quantum Simulator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      High-fidelity quantum circuit simulation with state vector evolution and measurement outcomes.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="brand">Run Demo</Button>
                      <Button size="sm" variant="outline">Documentation</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">📊</span>
                      </div>
                      Quantum Optimizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      AI-powered quantum circuit optimization with gate fusion, cancellation, and depth reduction.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="brand">Optimize</Button>
                      <Button size="sm" variant="outline">Benchmark</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                      Quantum Entanglement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visualize and create quantum entanglement states with real-time correlation tracking.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="brand">Entangle</Button>
                      <Button size="sm" variant="outline">Measure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Components</h2>
          
          <div className="space-y-16">
            {/* Button Component */}
            <ComponentShowcase
              component="Button"
              title="Button"
              description="A versatile button component with multiple variants, sizes, and states. Supports loading indicators, icons, and full accessibility features."
              props={{ variant: 'default', size: 'md' }}
              variants={[
                {
                  name: 'Variants',
                  props: { variant: 'default' },
                  code: `<Button variant="default">Default Button</Button>
<Button variant="brand">Brand Button</Button>
<Button variant="outline">Outline Button</Button>`
                },
                {
                  name: 'Sizes',
                  props: { size: 'lg' },
                  code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`
                },
                {
                  name: 'With Icons',
                  props: { variant: 'brand' },
                  code: `<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>
<Button loading>Loading...</Button>`
                }
              ]}
              sandboxId="forsure-button-demo"
            />

            {/* Card Component */}
            <ComponentShowcase
              component="Card"
              title="Card"
              description="Flexible card component for grouping related content. Supports multiple variants, interactive states, and customizable padding."
              props={{ variant: 'default' }}
              variants={[
                {
                  name: 'Variants',
                  props: { variant: 'elevated' },
                  code: `<Card variant="default">Default Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>`
                },
                {
                  name: 'Interactive',
                  props: { interactive: true },
                  code: `<Card interactive>
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    Hover over this card to see the interactive effect.
  </CardContent>
</Card>`
                }
              ]}
              sandboxId="forsure-card-demo"
            />

            {/* Badge Component */}
            <ComponentShowcase
              component="Badge"
              title="Badge"
              description="Small status indicators and labels with multiple variants, shapes, and semantic colors for different states."
              props={{ variant: 'default' }}
              variants={[
                {
                  name: 'Variants',
                  props: { variant: 'default' },
                  code: `<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>`
                },
                {
                  name: 'Shapes',
                  props: { shape: 'rounded' },
                  code: `<Badge shape="pill">Pill</Badge>
<Badge shape="rounded">Rounded</Badge>
<Badge shape="square">Square</Badge>`
                }
              ]}
              sandboxId="forsure-badge-demo"
            />

            {/* Input Component */}
            <ComponentShowcase
              component="Input"
              title="Input"
              description="Form input component with validation states, labels, error handling, and accessibility features built-in."
              props={{ variant: 'default' }}
              variants={[
                {
                  name: 'States',
                  props: { variant: 'default' },
                  code: `<Input label="Email" type="email" placeholder="Enter email" />
<Input label="Password" type="password" placeholder="Enter password" />
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  error="This field is required"
/>`
                },
                {
                  name: 'With Icons',
                  props: { variant: 'default' },
                  code: `<Input 
  label="Search"
  type="search"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>`
                }
              ]}
              sandboxId="forsure-input-demo"
            />
          </div>
        </section>

        {/* Design Tokens Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Design Tokens</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Brand Colors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#8CFFE6] rounded"></div>
                        <span className="text-sm">Primary (#8CFFE6)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0A4D68] rounded"></div>
                        <span className="text-sm">Secondary (#0A4D68)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Semantic Colors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <span className="text-sm">Success (#10B981)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Warning (#F59E0B)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded"></div>
                        <span className="text-sm">Error (#EF4444)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded"></div>
                        <span className="text-sm">Info (#3B82F6)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography & Spacing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Font Sizes</h4>
                    <div className="space-y-1">
                      <div className="text-xs">Text xs (12px)</div>
                      <div className="text-sm">Text sm (14px)</div>
                      <div className="text-base">Text base (16px)</div>
                      <div className="text-lg">Text lg (18px)</div>
                      <div className="text-xl">Text xl (20px)</div>
                      <div className="text-2xl">Text 2xl (24px)</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Spacing Scale</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>xs: 0.25rem (4px)</div>
                      <div>sm: 0.5rem (8px)</div>
                      <div>md: 1rem (16px)</div>
                      <div>lg: 1.5rem (24px)</div>
                      <div>xl: 2rem (32px)</div>
                      <div>2xl: 3rem (48px)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Install the package</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`npm install @forsure/design-system
# or
yarn add @forsure/design-system`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Import components</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`import { Button, Card } from '@forsure/design-system'`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CLI Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Generate components</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`forsure gen component -n my-button
forsure gen hook -n use-data-fetcher
forsure gen utility -n format-currency`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Quantum CLI commands</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`forsure quantum circuit -n bell-state
forsure quantum simulate --shots 1000
forsure quantum optimize --depth-reduction
forsure quantum measure --basis computational`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Design tokens</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`forsure design tokens --format css
forsure design tokens --format scss
forsure design tokens --watch`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Quantum features</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                      <code>{`forsure quantum scaffold --template quantum-app
forsure quantum migrate --framework ant-design
forsure quantum publish --registry npm`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
              <Button variant="ghost" size="sm">Quantum Docs</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icon components for examples
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)
