# Coding Standards Guide

This guide outlines the coding standards, best practices, and conventions used throughout the ForSure project to ensure code quality, maintainability, and consistency.

## General Principles

### Code Quality Goals

- **Readability**: Code should be self-documenting and easy to understand
- **Maintainability**: Code should be easy to modify and extend
- **Performance**: Code should be optimized for speed and memory usage
- **Security**: Code should follow security best practices
- **Testability**: Code should be easy to test

### Core Values

- **Simplicity**: Favor simple solutions over complex ones
- **Consistency**: Use consistent patterns and conventions
- **Clarity**: Write code that explains its intent
- **Reliability**: Handle errors and edge cases properly

## TypeScript Standards

### Type Definitions

#### Interfaces vs Types

```typescript
// Use interfaces for object shapes that can be extended
interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface ExtendedUser extends User {
  bio?: string
  avatarUrl?: string
}

// Use types for unions, primitives, and utility types
type UserRole = 'user' | 'admin' | 'moderator'
type Status = 'pending' | 'active' | 'completed' | 'archived'
type ID = string
type Timestamp = number

// Use generics for reusable types
interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  meta?: Record<string, any>
}

type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}>
```

#### Strict Typing

```typescript
// Avoid 'any' - use specific types
// ❌ Bad
function processData(data: any): any {
  return data.processed
}

// ✅ Good
interface ProcessableData {
  id: string
  value: number
}

interface ProcessedData {
  id: string
  result: number
  processedAt: Date
}

function processData(data: ProcessableData): ProcessedData {
  return {
    id: data.id,
    result: data.value * 2,
    processedAt: new Date(),
  }
}

// Use type guards for runtime type checking
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj
  )
}
```

#### Utility Types

```typescript
// Create reusable utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Example usage
interface UpdateUserRequest {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
}

type PartialUpdateUser = Optional<UpdateUserRequest, 'id' | 'name' | 'email'>
```

### Function Patterns

#### Arrow Functions vs Function Declarations

```typescript
// Use arrow functions for callbacks and simple functions
const users = data.filter(user => user.isActive)
const doubled = numbers.map(n => n * 2)

// Use function declarations for named functions with complex logic
function calculateUserPermissions(user: User): Permission[] {
  // Complex logic here
  return permissions
}

// Use arrow functions for object methods when you need 'this' binding
const userService = {
  users: [],

  addUser(user: User) {
    this.users.push(user)
  },

  findUser(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  },
}
```

#### Async/Await Patterns

```typescript
// Always use async/await over Promise chains
// ❌ Bad
function fetchUserData(userId: string): Promise<User> {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(data => data.user)
    .catch(error => {
      console.error('Failed to fetch user:', error)
      throw error
    })
}

// ✅ Good
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`)
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// Handle concurrent operations properly
async function fetchMultipleUsers(userIds: string[]): Promise<User[]> {
  try {
    const promises = userIds.map(id => fetchUserData(id))
    return await Promise.all(promises)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}
```

## React Standards

### Component Patterns

#### Functional Components

```typescript
// Use functional components with TypeScript interfaces
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = 'btn'
  const variantClasses = `btn-${variant}`
  const sizeClasses = `btn-${size}`
  const disabledClasses = disabled ? 'btn-disabled' : ''

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}
```

#### Custom Hooks

```typescript
// Custom hooks should start with 'use'
// Use TypeScript for proper typing
import { useState, useEffect, useCallback } from 'react'

interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url)
      const result = await response.json()

      setData(result.data)
      options.onSuccess?.(result.data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }
  }, [fetchData, options.immediate])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
```

#### Performance Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveListComponent = React.memo<{
  items: Item[]
  onItemClick: (item: Item) => void
}>(({ items, onItemClick }) => {
  return (
    <div>
      {items.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={onItemClick}
        />
      ))}
    </div>
  )
})

// Use useMemo for expensive calculations
const ProcessedDataComponent: React.FC<{ data: number[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data
      .filter(n => n > 0)
      .map(n => n * 2)
      .sort((a, b) => a - b)
  }, [data])

  return <div>{processedData.join(', ')}</div>
}

// Use useCallback for stable function references
const ParentComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item)
  }, [])

  return (
    <div>
      {items.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  )
}
```

## CSS and Styling Standards

### Tailwind CSS Patterns

#### Component Styling

```typescript
// Use utility classes with consistent patterns
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = ''
}) => {
  const baseClasses = 'rounded-lg transition-shadow duration-200'

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg'
  }

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].join(' ')

  return <div className={classes}>{children}</div>
}
```

#### Responsive Design

```typescript
// Use responsive utilities consistently
export const ResponsiveLayout: React.FC = ({ children }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  )
}

// Mobile-first approach
export const Navigation: React.FC = () => {
  return (
    <nav className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/projects">Projects</NavLink>
      <NavLink href="/blog">Blog</NavLink>
    </nav>
  )
}
```

### CSS-in-JS Patterns

#### Styled Components

```typescript
// Use styled-components for complex styling
import styled from 'styled-components'

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          border: none;
          
          &:hover {
            background-color: #2563eb;
          }
        `
      case 'secondary':
        return `
          background-color: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
          
          &:hover {
            background-color: #eff6ff;
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
```

## File and Directory Standards

### Naming Conventions

#### Files

```typescript
// Components: PascalCase
UserProfile.tsx
Button.tsx
Navigation.tsx

// Utilities: camelCase
apiClient.ts
dateHelpers.ts
stringUtils.ts

// Types: camelCase with type suffix
userTypes.ts
apiTypes.ts

// Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts

// Tests: same as file with .test/.spec suffix
UserProfile.test.tsx
apiClient.test.ts
```

#### Directories

```
src/
├── components/          # Reusable components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   └── features/      # Feature components
├── lib/               # Utility functions
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── types/             # TypeScript type definitions
├── constants/         # Application constants
├── utils/             # Helper functions
├── services/          # External service integrations
└── styles/            # Global styles
```

### File Structure Templates

#### Component File

```typescript
// components/features/UserCard.tsx
import React from 'react'
import { User } from '@/types/user'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/utils/dateHelpers'

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
  className?: string
}

/**
 * UserCard component displays user information with edit and delete actions
 * @param user - User object to display
 * @param onEdit - Optional callback for edit action
 * @param onDelete - Optional callback for delete action
 * @param className - Additional CSS classes
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  className = ''
}) => {
  const handleEdit = () => {
    onEdit?.(user)
  }

  const handleDelete = () => {
    onDelete?.(user.id)
  }

  return (
    <div className={`user-card ${className}`}>
      <Avatar src={user.avatarUrl} name={user.name} size="md" />
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <p className="user-joined">
          Joined {formatDate(user.createdAt)}
        </p>
      </div>
      <div className="user-actions">
        {onEdit && (
          <button onClick={handleEdit} className="btn-edit">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={handleDelete} className="btn-delete">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default UserCard
```

## API Standards

### Route Structure

#### File Organization

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { apiResponse, apiError } from '@/lib/api-utils'
import { getUserSchema, updateUserSchema } from '@/lib/validations'

/**
 * GET /api/users - Get current user profile
 */
export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    // Implementation
    return apiResponse(user)
  } catch (error) {
    return apiError('Failed to fetch user profile', 500)
  }
})

/**
 * PUT /api/users - Update user profile
 */
export const PUT = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Update logic here

    return apiResponse(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation failed', 422, error.errors)
    }
    return apiError('Failed to update user profile', 500)
  }
})
```

#### Response Format

```typescript
// Standard API response format
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
  meta?: {
    pagination?: PaginationMeta
    timestamp?: string
    version?: string
  }
}

// Success response
const successResponse = <T>(data: T, meta?: any): ApiResponse<T> => ({
  success: true,
  data,
  meta,
})

// Error response
const errorResponse = (
  message: string,
  status: number = 500,
  details?: any
): ApiResponse => ({
  success: false,
  error: message,
  details,
})
```

### Validation Standards

#### Zod Schemas

```typescript
// lib/validations.ts
import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  role: z.enum(['user', 'admin']).default('user'),
})

export const updateUserSchema = createUserSchema.partial().omit({
  password: true,
})

// Project validation schemas
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  techStack: z
    .array(z.string())
    .max(10, 'Maximum 10 technologies allowed')
    .optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})
```

## Database Standards

### Query Patterns

#### Supabase Queries

```typescript
// Use type-safe queries
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type User = Database['public']['Tables']['users']['Row']
type Project = Database['public']['Tables']['projects']['Row']

// Select with joins
async function getUserWithProjects(
  userId: string
): Promise<User & { projects: Project[] }> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      projects (
        id,
        name,
        status,
        created_at
      )
    `
    )
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Pagination
async function getProjects(params: {
  page: number
  limit: number
  userId: string
  search?: string
}): Promise<{ projects: Project[]; total: number }> {
  const { page, limit, userId, search } = params
  const offset = (page - 1) * limit

  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    projects: data || [],
    total: count || 0,
  }
}
```

### Transaction Patterns

```typescript
// Use transactions for multiple operations
async function createUserWithProfile(
  userData: CreateUserRequest
): Promise<User> {
  const { data, error } = await supabase.rpc('create_user_with_profile', {
    user_email: userData.email,
    user_password: userData.password,
    user_name: userData.name,
    user_bio: userData.bio,
  })

  if (error) throw error
  return data
}
```

## Testing Standards

### Test Structure

#### Unit Tests

```typescript
// __tests__/components/UserCard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserCard } from '@/components/features/UserCard'
import { mockUser } from '@/__mocks__/user'

describe('UserCard', () => {
  const defaultProps = {
    user: mockUser
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />)

    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(/Joined/)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn()
    render(<UserCard {...defaultProps} onEdit={onEdit} />)

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(mockUser)
    })
  })

  it('does not show edit button when onEdit is not provided', () => {
    render(<UserCard {...defaultProps} />)

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('applies custom className correctly', () => {
    const customClass = 'custom-card-class'
    render(<UserCard {...defaultProps} className={customClass} />)

    const card = screen.getByTestId('user-card')
    expect(card).toHaveClass(customClass)
  })
})
```

#### Integration Tests

```typescript
// __tests__/integration/user-registration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { RegistrationForm } from '@/components/forms/RegistrationForm'

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('User Registration Integration', () => {
  it('completes registration flow successfully', async () => {
    renderWithAuth(<RegistrationForm />)

    // Fill out form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' }
    })

    // Submit form
    fireEvent.click(screen.getByText('Register'))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
    })
  })
})
```

## Error Handling Standards

### Error Types

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}
```

### Error Handling Patterns

```typescript
// API error handling
export const withErrorHandling = (handler: Function) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)

      if (error instanceof AppError) {
        return Response.json(
          { success: false, error: error.message, code: error.code },
          { status: error.statusCode }
        )
      }

      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, error: 'Validation failed', details: error.errors },
          { status: 422 }
        )
      }

      return Response.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Component error boundaries
export const ErrorBoundary: React.FC<{
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}> = ({ children, fallback }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <React.ErrorBoundary fallback={fallback || DefaultErrorFallback}>
        {children}
      </React.ErrorBoundary>
    </React.Suspense>
  )
}
```

## Performance Standards

### Code Optimization

#### React Performance

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id &&
         prevProps.data.updatedAt === nextProps.data.updatedAt
})

// Use useMemo for expensive calculations
const ExpensiveList = ({ items, filter }: Props) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
  }, [items, filter])

  return <List items={filteredItems} />
}

// Use useCallback for stable references
const ParentComponent = ({ items }: Props) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const handleSelect = useCallback((item: Item) => {
    setSelectedItem(item)
  }, [])

  return items.map(item => (
    <ItemComponent
      key={item.id}
      item={item}
      onSelect={handleSelect}
    />
  ))
}
```

#### Bundle Optimization

```typescript
// Dynamic imports for code splitting
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>Loading admin panel...</div>,
  ssr: false
})

// Lazy load heavy libraries
const loadChartLibrary = () => import('chart.js').then(mod => mod.default)

// Tree shaking friendly imports
import { Button, Input, Card } from '@/components/ui'
// Instead of
import * as UI from '@/components/ui'
```

## Security Standards

### Input Validation

```typescript
// Always validate user input
import { z } from 'zod'
import DOMPurify from 'dompurify'

const userInputSchema = z.object({
  content: z
    .string()
    .max(1000)
    .transform(val => DOMPurify.sanitize(val)),
  email: z.string().email(),
  url: z.string().url().optional(),
})

// Sanitize HTML content
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href', 'target'],
  })
}
```

### Authentication Security

```typescript
// Secure password handling
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT token validation
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    return null
  }
}
```

These coding standards ensure consistency, maintainability, and quality across the ForSure codebase. All contributors should follow these guidelines when writing code.
