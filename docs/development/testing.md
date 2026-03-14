# Testing Guide

This comprehensive guide covers testing strategies, tools, and best practices for the ForSure application to ensure code quality, reliability, and maintainability.

## Testing Strategy Overview

ForSure implements a multi-layered testing approach:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test component interactions and API integrations
- **End-to-End Tests**: Test complete user workflows
- **Performance Tests**: Ensure application performance standards
- **Security Tests**: Validate security measures

## Testing Tools and Setup

### Testing Framework Stack

```json
{
  "testingFramework": "Jest",
  "reactTesting": "@testing-library/react",
  "e2eFramework": "Playwright",
  "mocking": "MSW (Mock Service Worker)",
  "coverage": "Jest Coverage",
  "visualTesting": "Storybook + Chromatic",
  "performanceTesting": "Lighthouse CI"
}
```

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',

  // Add Jest configuration options
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: [
    '**/*.(ts|tsx)',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!jest.setup.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  transformIgnorePatterns: ['/node_modules/(?!(.*\\.mjs$))'],
})

module.exports = createJestConfig
```

### Jest Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
})

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

## Unit Testing

### Component Testing

#### Basic Component Test

```typescript
// __tests__/components/Button.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies correct variant classes', () => {
    render(<Button {...defaultProps} variant="primary" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-primary')
  })

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button {...defaultProps} disabled />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    const customClass = 'custom-button-class'
    render(<Button {...defaultProps} className={customClass} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(customClass)
  })

  it('renders as different element when asChild is true', () => {
    render(
      <Button {...defaultProps} asChild>
        <a href="#">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Click me' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
  })
})
```

#### Complex Component Test

```typescript
// __tests__/components/UserCard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserCard } from '@/components/features/UserCard'
import { mockUser } from '@/__mocks__/user'

describe('UserCard Component', () => {
  const defaultProps = {
    user: mockUser,
    onEdit: jest.fn(),
    onDelete: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />)

    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByAltText(mockUser.name)).toBeInTheDocument()
  })

  it('shows edit and delete buttons when callbacks are provided', () => {
    render(<UserCard {...defaultProps} />)

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('does not show action buttons when callbacks are not provided', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls onEdit with correct user when edit button is clicked', async () => {
    render(<UserCard {...defaultProps} />)

    await userEvent.click(screen.getByText('Edit'))

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUser)
  })

  it('shows confirmation dialog before deleting', async () => {
    render(<UserCard {...defaultProps} />)

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText(/Are you sure/)).toBeInTheDocument()
    })
  })

  it('calls onDelete after confirmation', async () => {
    render(<UserCard {...defaultProps} />)

    // Click delete button
    await userEvent.click(screen.getByText('Delete'))

    // Wait for confirmation dialog and click confirm
    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Confirm'))

    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUser.id)
  })

  it('applies loading state during operations', async () => {
    render(<UserCard {...defaultProps} loading />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })
})
```

### Hook Testing

```typescript
// __tests__/hooks/useApi.test.ts
import { renderHook, act } from '@testing-library/react'
import { useApi } from '@/hooks/useApi'

// Mock fetch
global.fetch = jest.fn()

describe('useApi Hook', () => {
  const mockData = { id: 1, name: 'Test Data' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useApi('/api/test'))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('fetches data on mount', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const { result } = renderHook(() => useApi('/api/test'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
  })

  it('handles fetch error', async () => {
    const errorMessage = 'Network error'
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useApi('/api/test'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('refetches data when refetch is called', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const { result } = renderHook(() => useApi('/api/test'))

    // Initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Reset mock
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { ...mockData, updated: true } }),
    })

    // Call refetch
    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data).toEqual({ ...mockData, updated: true })
  })
})
```

### Utility Function Testing

```typescript
// __tests__/utils/dateHelpers.test.ts
import {
  formatDate,
  formatRelativeTime,
  isValidDate,
} from '@/utils/dateHelpers'

describe('Date Helpers', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const result = formatDate(date)

      expect(result).toBe('January 15, 2024')
    })

    it('handles invalid dates gracefully', () => {
      const result = formatDate(new Date('invalid'))

      expect(result).toBe('Invalid Date')
    })

    it('accepts date string input', () => {
      const result = formatDate('2024-01-15T10:30:00Z')

      expect(result).toBe('January 15, 2024')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current time
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T10:30:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('formats time relative to now', () => {
      const pastDate = new Date('2024-01-15T09:30:00Z')
      const result = formatRelativeTime(pastDate)

      expect(result).toBe('1 hour ago')
    })

    it('handles future dates', () => {
      const futureDate = new Date('2024-01-15T11:30:00Z')
      const result = formatRelativeTime(futureDate)

      expect(result).toBe('in 1 hour')
    })
  })

  describe('isValidDate', () => {
    it('returns true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate('2024-01-15')).toBe(true)
    })

    it('returns false for invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
      expect(isValidDate('not-a-date')).toBe(false)
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
    })
  })
})
```

## Integration Testing

### API Integration Tests

```typescript
// __tests__/integration/api/auth.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/login'
import { createUser } from '@/__helpers__/userFactory'

describe('/api/auth/login Integration', () => {
  beforeEach(async () => {
    // Clean up database
    await cleanupDatabase()
  })

  it('authenticates user with valid credentials', async () => {
    // Create test user
    const user = await createUser({
      email: 'test@example.com',
      password: 'Password123!',
    })

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: user.email,
        password: 'Password123!',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const response = JSON.parse(res._getData())

    expect(response.success).toBe(true)
    expect(response.data.user.email).toBe(user.email)
    expect(response.data.session.access_token).toBeDefined()
  })

  it('rejects invalid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    const response = JSON.parse(res._getData())

    expect(response.success).toBe(false)
    expect(response.error).toBe('Invalid credentials')
  })

  it('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        // Missing password
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const response = JSON.parse(res._getData())

    expect(response.success).toBe(false)
    expect(response.error).toBe('Validation failed')
    expect(response.details).toContain('password')
  })
})
```

### Component Integration Tests

```typescript
// __tests__/integration/ProjectForm.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from '@/components/forms/ProjectForm'
import { AuthProvider } from '@/contexts/AuthContext'
import { mockUser } from '@/__mocks__/user'

// Mock API calls
jest.mock('@/lib/api', () => ({
  createProject: jest.fn(),
  updateProject: jest.fn()
}))

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('ProjectForm Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates new project successfully', async () => {
    const { createProject } = require('@/lib/api')
    createProject.mockResolvedValue({ success: true, data: { id: '123' } })

    renderWithAuth(<ProjectForm />)

    // Fill out form
    await userEvent.type(screen.getByLabelText('Project Name'), 'Test Project')
    await userEvent.type(screen.getByLabelText('Description'), 'Test Description')

    // Submit form
    await userEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Test Description',
        techStack: [],
        tags: [],
        visibility: 'private'
      })
    })

    // Check for success message
    expect(screen.getByText(/Project created successfully/)).toBeInTheDocument()
  })

  it('updates existing project', async () => {
    const { updateProject } = require('@/lib/api')
    updateProject.mockResolvedValue({ success: true, data: { id: '123' } })

    const project = {
      id: '123',
      name: 'Existing Project',
      description: 'Existing Description'
    }

    renderWithAuth(<ProjectForm project={project} />)

    // Form should be pre-filled
    expect(screen.getByDisplayValue('Existing Project')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument()

    // Update form
    await userEvent.clear(screen.getByLabelText('Project Name'))
    await userEvent.type(screen.getByLabelText('Project Name'), 'Updated Project')

    // Submit form
    await userEvent.click(screen.getByText('Update Project'))

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalledWith('123', {
        name: 'Updated Project',
        description: 'Existing Description'
      })
    })
  })

  it('handles API errors gracefully', async () => {
    const { createProject } = require('@/lib/api')
    createProject.mockRejectedValue(new Error('Network error'))

    renderWithAuth(<ProjectForm />)

    // Fill and submit form
    await userEvent.type(screen.getByLabelText('Project Name'), 'Test Project')
    await userEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(screen.getByText(/Failed to create project/)).toBeInTheDocument()
    })
  })
})
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['junit', { outputFile: 'playwright-report.xml' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Registration', () => {
  test('user can register successfully', async ({ page }) => {
    await page.goto('/register')

    // Fill registration form
    await page.fill('[data-testid="name-input"]', 'John Doe')
    await page.fill('[data-testid="email-input"]', 'john@example.com')
    await page.fill('[data-testid="password-input"]', 'Password123!')
    await page.fill('[data-testid="confirm-password-input"]', 'Password123!')

    // Submit form
    await page.click('[data-testid="register-button"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('shows validation errors for invalid data', async ({ page }) => {
    await page.goto('/register')

    // Submit empty form
    await page.click('[data-testid="register-button"]')

    // Should show validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })

  test('prevents registration with existing email', async ({ page }) => {
    await page.goto('/register')

    // Try to register with existing email
    await page.fill('[data-testid="name-input"]', 'Jane Doe')
    await page.fill('[data-testid="email-input"]', 'existing@example.com')
    await page.fill('[data-testid="password-input"]', 'Password123!')
    await page.fill('[data-testid="confirm-password-input"]', 'Password123!')

    await page.click('[data-testid="register-button"]')

    // Should show email already exists error
    await expect(
      page.locator('[data-testid="email-exists-error"]')
    ).toBeVisible()
  })
})
```

```typescript
// e2e/project-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'Password123!')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('user can create a new project', async ({ page }) => {
    await page.goto('/projects')

    // Click create project button
    await page.click('[data-testid="create-project-button"]')

    // Fill project form
    await page.fill('[data-testid="project-name"]', 'Test Project')
    await page.fill('[data-testid="project-description"]', 'Test Description')

    // Submit form
    await page.click('[data-testid="save-project-button"]')

    // Should redirect to project details
    await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9-]+/)

    // Should show success message
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
  })

  test('user can edit existing project', async ({ page }) => {
    await page.goto('/projects')

    // Click edit button on first project
    await page.click('[data-testid="edit-project-0"]')

    // Update project name
    await page.fill('[data-testid="project-name"]', 'Updated Project Name')

    // Save changes
    await page.click('[data-testid="save-project-button"]')

    // Should show updated name
    await expect(page.locator('[data-testid="project-title"]')).toHaveText(
      'Updated Project Name'
    )
  })

  test('user can delete a project', async ({ page }) => {
    await page.goto('/projects')

    // Click delete button
    await page.click('[data-testid="delete-project-0"]')

    // Confirm deletion in modal
    await page.click('[data-testid="confirm-delete-button"]')

    // Should show success message
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()

    // Project should be removed from list
    await expect(page.locator('[data-testid="project-0"]')).not.toBeVisible()
  })
})
```

## Mocking Strategies

### API Mocking with MSW

```typescript
// __mocks__/handlers.ts
import { rest } from 'msw'
import { mockUser, mockProjects } from './data'

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as any

    if (email === 'test@example.com' && password === 'Password123!') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: {
            user: mockUser,
            session: {
              access_token: 'mock-token',
              expires_at: Date.now() + 3600000,
            },
          },
        })
      )
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Invalid credentials',
      })
    )
  }),

  // Project endpoints
  rest.get('/api/projects', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1
    const limit = Number(req.url.searchParams.get('limit')) || 10

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          projects: mockProjects.slice((page - 1) * limit, page * limit),
          pagination: {
            page,
            limit,
            total: mockProjects.length,
            totalPages: Math.ceil(mockProjects.length / limit),
          },
        },
      })
    )
  }),

  rest.post('/api/projects', (req, res, ctx) => {
    const projectData = req.body as any

    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: 'new-project-id',
          ...projectData,
          created_at: new Date().toISOString(),
        },
      })
    )
  }),
]
```

### Test Setup with MSW

```typescript
// jest.setup.js
import { server } from './__mocks__/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())
```

### Component Mocking

```typescript
// __mocks__/components/ExternalComponent.tsx
import React from 'react'

export const ExternalComponent = jest.fn().mockImplementation(({ children }) => (
  <div data-testid="external-component-mock">{children}</div>
))

// __mocks__/lib/api.ts
export const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}

export const createUser = jest.fn()
export const updateUser = jest.fn()
export const deleteUser = jest.fn()
```

## Performance Testing

### Lighthouse CI Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Performance Test Configuration

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--headless"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.8 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Visual Testing

### Storybook Configuration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
}

export default config
```

### Visual Regression Tests

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    chromatic: { viewports: [320, 768, 1200] },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
}
```

## Test Data Management

### Factories

```typescript
// __tests__/factories/userFactory.ts
import { faker } from '@faker-js/faker'
import { User } from '@/types/user'

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    name: faker.name.fullName(),
    avatarUrl: faker.image.avatar(),
    role: 'user',
    bio: faker.lorem.paragraph(),
    company: faker.company.name(),
    location: faker.address.city(),
    skills: [faker.lorem.word(), faker.lorem.word()],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }
}

export const createAdminUser = (overrides: Partial<User> = {}): User => {
  return createUser({
    ...overrides,
    role: 'admin',
  })
}
```

```typescript
// __tests__/factories/projectFactory.ts
import { faker } from '@faker-js/faker'
import { Project } from '@/types/project'

export const createProject = (overrides: Partial<Project> = {}): Project => {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    slug: faker.lorem.slug(),
    status: 'active',
    visibility: 'private',
    progress: faker.datatype.number({ min: 0, max: 100 }),
    ownerId: faker.datatype.uuid(),
    techStack: [faker.lorem.word(), faker.lorem.word()],
    tags: [faker.lorem.word(), faker.lorem.word()],
    repositoryUrl: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }
}
```

### Test Database Setup

```typescript
// __tests__/helpers/database.ts
import { supabase } from '@/lib/supabase'
import { createUser, createProject } from '../factories'

export const setupTestDatabase = async () => {
  // Clean up existing data
  await cleanupDatabase()

  // Create test data
  const user = await createUser()
  const project = await createProject({ ownerId: user.id })

  return { user, project }
}

export const cleanupDatabase = async () => {
  // Clean up all test data
  await supabase.from('projects').delete().neq('id', 'impossible-id')
  await supabase.from('users').delete().neq('id', 'impossible-id')
}
```

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
```

## Test Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:visual": "chromatic test --build-storybook",
    "test:performance": "lhci autorun",
    "test:all": "npm run lint && npm run type-check && npm run test:ci && npm run test:e2e"
  }
}
```

This comprehensive testing guide ensures high-quality, reliable code through multiple testing layers and best practices.
