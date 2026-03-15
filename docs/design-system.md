# ForSure Design System

A comprehensive design system and component library built for the ForSure ecosystem, providing reusable components, design tokens, and utilities for building consistent and accessible user interfaces.

## 🚀 Features

- **Design Tokens**: Centralized design system with colors, typography, spacing, and more
- **Component Library**: Extensive collection of accessible, reusable React components
- **TypeScript Support**: Full TypeScript integration with comprehensive type definitions
- **Accessibility First**: WCAG 2.2 AA compliant components with built-in accessibility features
- **Responsive Design**: Mobile-first approach with responsive utilities and hooks
- **CLI Tools**: Command-line interface for component generation and project management
- **Theme System**: Flexible theming with light/dark mode support
- **Animation System**: Consistent animations and transitions

## 📦 Installation

```bash
npm install @forsure/design-system
# or
yarn add @forsure/design-system
# or
pnpm add @forsure/design-system
```

## 🎨 Design Tokens

The design system is built on a comprehensive token system that ensures consistency across all components.

### Colors

```typescript
import { colors } from '@forsure/design-system/tokens'

// Brand colors
colors.brand.primary      // '#8CFFE6'
colors.brand.secondary    // '#0A4D68'

// Semantic colors
colors.semantic.success    // '#10B981'
colors.semantic.warning    // '#F59E0B'
colors.semantic.error      // '#EF4444'
colors.semantic.info       // '#3B82F6'
```

### Typography

```typescript
import { typography } from '@forsure/design-system/tokens'

typography.fontSize.base    // ['1rem', { lineHeight: '1.5rem' }]
typography.fontWeight.semibold // '600'
typography.fontFamily.sans   // ['Inter', 'system-ui', 'sans-serif']
```

### Spacing

```typescript
import { spacing } from '@forsure/design-system/tokens'

spacing.sm  // '0.5rem'
spacing.md  // '1rem'
spacing.lg  // '1.5rem'
spacing.xl  // '2rem'
```

## 🧩 Components

### Button

A versatile button component with multiple variants and sizes.

```typescript
import { Button } from '@forsure/design-system'

function Example() {
  return (
    <div className="space-x-4">
      <Button variant="default">Default Button</Button>
      <Button variant="brand">Brand Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button size="lg" leftIcon={<PlusIcon />}>
        Large Button
      </Button>
      <Button loading>Loading...</Button>
    </div>
  )
}
```

#### Button Variants

- `default` - Standard primary button
- `brand` - Brand-colored button
- `outline` - Outlined button
- `ghost` - Minimal button with hover state
- `link` - Link-style button
- `destructive` - Danger/action button

#### Button Sizes

- `sm` - Small button (32px height)
- `md` - Medium button (40px height)
- `lg` - Large button (48px height)
- `xl` - Extra large button (56px height)
- `icon` - Square icon button (40px)

### Card

Flexible card component for grouping related content.

```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@forsure/design-system'

function Example() {
  return (
    <Card variant="elevated" interactive>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
```

### Badge

Small status indicators and labels.

```typescript
import { Badge } from '@forsure/design-system'

function Example() {
  return (
    <div className="space-x-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  )
}
```

### Input

Form input with validation states and accessibility features.

```typescript
import { Input } from '@forsure/design-system'

function Example() {
  return (
    <Input
      label="Email Address"
      type="email"
      placeholder="Enter your email"
      required
      error="This field is required"
      helperText="We'll never share your email."
    />
  )
}
```

## 🎯 Hooks

### useResponsive

Responsive design utilities for handling breakpoints and screen sizes.

```typescript
import { useResponsive, useBreakpoint } from '@forsure/design-system'

function Example() {
  const { isMobile, isDesktop, currentBreakpoint } = useResponsive()
  const isTabletUp = useBreakpoint({ breakpoint: 'md', match: 'up' })

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isDesktop && <DesktopLayout />}
      <p>Current breakpoint: {currentBreakpoint}</p>
    </div>
  )
}
```

### useAccessibility

Accessibility utilities for screen readers and keyboard navigation.

```typescript
import { useAccessibility, useKeyboardNavigation } from '@forsure/design-system'

function Example() {
  const { announce, trapFocus, screenReaderEnabled } = useAccessibility()
  const keyboardProps = useKeyboardNavigation({
    onEnter: () => console.log('Activated'),
    onEscape: () => console.log('Cancelled'),
  })

  return (
    <div {...keyboardProps}>
      <button onClick={() => announce('Button clicked')}>
        Accessible Button
      </button>
    </div>
  )
}
```

## 🛠️ Utilities

### UI Utilities

Helper functions for common UI tasks.

```typescript
import { 
  cn, 
  getColorValue, 
  getContrastRatio, 
  getAccessibleColor,
  debounce 
} from '@forsure/design-system/utils'

// Class name merging
const className = cn('base-class', { 'active': isActive }, 'additional-class')

// Color utilities
const primaryColor = getColorValue('brand.primary')
const textColor = getAccessibleColor(primaryColor)
const contrast = getContrastRatio(primaryColor, '#ffffff')

// Performance utilities
const debouncedSearch = debounce(searchFunction, 300)
```

## 🎨 Theming

The design system supports flexible theming with CSS variables.

### CSS Variables

```css
:root {
  --brand-primary: #8CFFE6;
  --brand-secondary: #0A4D68;
  --spacing-md: 1rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

[data-theme="dark"] {
  --brand-primary: #A7F7E7;
  --brand-secondary: #05161A;
}
```

### Theme Provider

```typescript
import { ThemeProvider } from '@forsure/design-system'

function App() {
  return (
    <ThemeProvider theme="dark">
      <YourApp />
    </ThemeProvider>
  )
}
```

## 🚀 CLI Tools

The ForSure CLI provides powerful tools for development and maintenance.

### Component Generation

```bash
# Generate a new component
forsure gen component -n button -d components/ui

# Generate a hook
forsure gen hook -n use-data-fetcher

# Generate a utility
forsure gen utility -n format-currency
```

### Design System Commands

```bash
# Generate CSS variables from design tokens
forsure design tokens

# Publish a new version
forsure publish --patch

# Run linting and formatting
forsure lint --fix

# Clean build artifacts
forsure clean
```

## ♿ Accessibility

All components are built with accessibility in mind and comply with WCAG 2.2 AA standards.

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support with focus management
- **Screen Reader Support**: Proper ARIA labels and announcements
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Visible focus indicators and focus trapping

### Accessibility Utilities

```typescript
import { 
  useAccessibility, 
  useKeyboardNavigation,
  announce 
} from '@forsure/design-system'

// Screen reader announcements
announce('Form submitted successfully')

// Keyboard navigation
const keyboardProps = useKeyboardNavigation({
  onEnter: handleAction,
  onEscape: handleCancel,
})
```

## 📱 Responsive Design

Mobile-first responsive design with comprehensive breakpoint system.

### Breakpoints

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1920px

### Responsive Utilities

```typescript
import { useResponsive, useBreakpoint } from '@forsure/design-system'

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const isLargeScreen = useBreakpoint({ breakpoint: 'lg', match: 'up' })

  return (
    <div className={cn(
      'p-4',
      isMobile && 'p-2',
      isDesktop && 'p-8'
    )}>
      Content
    </div>
  )
}
```

## 🧪 Testing

All components are thoroughly tested with comprehensive test suites.

### Testing Setup

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@forsure/design-system'

test('Button renders correctly', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('Button handles click events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  screen.getByRole('button').click()
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## 📚 API Reference

### Component Props

#### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'brand' \| 'outline' \| 'ghost' \| 'link' \| 'destructive'` | `'default'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable button |
| `leftIcon` | `ReactNode` | `undefined` | Icon on the left |
| `rightIcon` | `ReactNode` | `undefined` | Icon on the right |

#### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'ghost' \| 'brand'` | `'default'` | Card style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Card padding |
| `interactive` | `boolean` | `false` | Enable hover effects |
| `fullWidth` | `boolean` | `false` | Full width card |

### Hook APIs

#### useResponsive

```typescript
interface UseResponsiveReturn {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  currentBreakpoint: Breakpoint
  orientation: 'portrait' | 'landscape'
}
```

#### useAccessibility

```typescript
interface UseAccessibilityReturn {
  screenReaderEnabled: boolean
  keyboardNavigation: boolean
  reducedMotion: boolean
  highContrast: boolean
  announce: (message: string) => void
  focusElement: (element: HTMLElement | null) => void
  trapFocus: (container: HTMLElement | null) => () => void
}
```

## 🤝 Contributing

We welcome contributions to the ForSure Design System! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/forsure/design-system.git
cd design-system

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build the project
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Documentation](https://design-system.forsure.com)
- [Storybook](https://storybook.forsure.com)
- [GitHub Repository](https://github.com/forsure/design-system)
- [NPM Package](https://www.npmjs.com/package/@forsure/design-system)

## 🆘 Support

If you need help or have questions:

- Create an issue on [GitHub](https://github.com/forsure/design-system/issues)
- Join our [Discord community](https://discord.gg/forsure)
- Check our [FAQ](https://design-system.forsure.com/faq)

---

Built with ❤️ by the ForSure team
