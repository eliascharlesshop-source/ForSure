# Common Issues and Solutions

This guide covers common problems developers may encounter while working with the ForSure application, along with detailed solutions and preventive measures.

## Quick Reference

| Issue Category     | Common Problems                              | Quick Fix                             |
| ------------------ | -------------------------------------------- | ------------------------------------- |
| **Installation**   | Node.js version conflicts, dependency errors | Use Node 18+, clear cache, reinstall  |
| **Database**       | Connection failures, RLS issues              | Check credentials, verify policies    |
| **Authentication** | JWT errors, session issues                   | Verify JWT secret, check token format |
| **Build**          | TypeScript errors, build failures            | Run type-check, check imports         |
| **Performance**    | Slow builds, memory issues                   | Optimize imports, check bundle size   |
| **API**            | CORS errors, rate limiting                   | Check headers, verify endpoints       |

## Installation Issues

### Node.js Version Conflicts

#### Problem

```bash
Error: The module was compiled against a different Node.js version
```

#### Solution

```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Verify version
node --version  # Should show v18.x.x

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Prevention

- Use `.nvmrc` file in project root:

```bash
# .nvmrc
18
```

### Dependency Installation Errors

#### Problem

```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

#### Solution

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Try installing with legacy peer deps
npm install --legacy-peer-deps

# Or use pnpm (recommended)
npm install -g pnpm
pnpm install
```

#### pnpm Specific Issues

```bash
# Clear pnpm store
pnpm store prune

# Delete pnpm lock file
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

### Environment Variable Issues

#### Problem

```bash
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

#### Solution

```bash
# Check if .env.local exists
ls -la .env.local

# Create from template if missing
cp .env.example .env.local

# Verify variables are set
grep NEXT_PUBLIC_SUPABASE_URL .env.local

# Restart development server
pnpm dev
```

#### Common Environment Variable Mistakes

```bash
# ❌ Wrong file name
.env  # Should be .env.local

# ❌ Missing NEXT_PUBLIC_ prefix for client-side vars
SUPABASE_URL=https://...  # Should be NEXT_PUBLIC_SUPABASE_URL

# ❌ Spaces around equals
NEXT_PUBLIC_SUPABASE_URL = https://...  # Remove spaces
```

## Database Issues

### Supabase Connection Failures

#### Problem

```bash
Error: fetch failed
Error: Invalid API key
Error: Database connection timeout
```

#### Solution

```bash
# Verify Supabase URL format
echo $NEXT_PUBLIC_SUPABASE_URL
# Should be: https://your-project-ref.supabase.co

# Test connection manually
curl -I $NEXT_PUBLIC_SUPABASE_URL

# Check API key format
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY | head -c 20
# Should start with eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Verify project is active
# Go to Supabase dashboard → Settings → API
```

#### Row Level Security (RLS) Issues

#### Problem

```bash
Error: permission denied for table users
Error: new row violates row-level security policy
```

#### Solution

```sql
-- Check if RLS is enabled
SELECT relname, rowsecurity
FROM pg_class
WHERE relname = 'users';

-- Enable RLS if disabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Check existing policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- Test policy with current user
-- In Supabase SQL Editor:
SELECT * FROM users;  -- Should return empty or filtered results
```

#### Common RLS Policy Fixes

```sql
-- Allow users to see their own data
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own data
CREATE POLICY "Users can insert own profile" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);
```

### Database Schema Issues

#### Problem

```bash
Error: column "new_column" does not exist
Error: relation "table_name" does not exist
```

#### Solution

```bash
# Pull latest schema from Supabase
pnpm db:pull

# Or manually run schema migration
# In Supabase SQL Editor, run:
-- Your schema changes here

# Verify table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'your_table_name';
```

## Authentication Issues

### JWT Token Problems

#### Problem

```bash
Error: Invalid JWT token
Error: JWT expired
Error: Malformed JWT
```

#### Solution

```typescript
// Debug JWT token
import jwt from 'jsonwebtoken'

const token = 'your-jwt-token'
try {
  const decoded = jwt.decode(token, { complete: true })
  console.log('JWT Header:', decoded.header)
  console.log('JWT Payload:', decoded.payload)
  console.log('JWT Expiration:', new Date(decoded.payload.exp * 1000))
} catch (error) {
  console.error('JWT decode error:', error)
}

// Verify JWT secret
const isVerified = jwt.verify(token, process.env.JWT_SECRET)
console.log('JWT Verified:', isVerified)
```

#### Common JWT Issues

```typescript
// ❌ JWT secret too short
JWT_SECRET=short  // Should be at least 32 characters

// ✅ Strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)

// ❌ JWT token format wrong
Authorization: Bearer  // Missing token

// ✅ Correct JWT token format
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Session Management Issues

#### Problem

```bash
User logged out unexpectedly
Session not persisting across refresh
Multiple session conflicts
```

#### Solution

```typescript
// Check session storage
if (typeof window !== 'undefined') {
  console.log('Session Storage:', sessionStorage.getItem('supabase.auth.token'))
  console.log('Local Storage:', localStorage.getItem('supabase.auth.token'))
}

// Clear corrupted session
await supabase.auth.signOut()

// Reinitialize auth context
window.location.reload()
```

## Build and Compilation Issues

### TypeScript Errors

#### Problem

```bash
Error: Cannot find module '@/lib/utils'
Error: Property 'user' does not exist on type
Error: Type 'string' is not assignable to type 'number'
```

#### Solution

```bash
# Check TypeScript configuration
cat tsconfig.json

# Verify path mapping
"paths": {
  "@/*": ["./*"]
}

# Check file exists
ls -la lib/utils.ts

# Run type checking
pnpm type-check

# Generate types if missing
pnpm db:generate
```

#### Common TypeScript Fixes

```typescript
// ❌ Missing import
import { User } from './types' // File doesn't exist

// ✅ Correct import
import { User } from '@/types/user'

// ❌ Type assertion without proper checking
const user = data as User

// ✅ Type guard
function isUser(obj: any): obj is User {
  return obj && typeof obj === 'object' && 'id' in obj
}

const user = isUser(data) ? data : null
```

### Next.js Build Errors

#### Problem

```bash
Error: build optimization failed
Error: Module not found
Error: Static page generation failed
```

#### Solution

```bash
# Clear Next.js cache
rm -rf .next

# Check for circular dependencies
# Look for imports that reference each other

# Build with debug info
NODE_OPTIONS='--inspect' pnpm build

# Check memory usage
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

#### Build Optimization Issues

```typescript
// ❌ Large bundle size
import { library } from 'large-library' // Imports entire library

// ✅ Tree shaking
import { specificFunction } from 'large-library'

// ❌ Dynamic imports in wrong place
const HeavyComponent = dynamic(() => import('./HeavyComponent')) // In render

// ✅ Dynamic imports at top level
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

## API Issues

### CORS Errors

#### Problem

```bash
Error: Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:3001' has been blocked by CORS policy
```

#### Solution

```typescript
// Check CORS configuration in API route
// app/api/example/route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Or use CORS middleware
import cors from 'next-cors'

export default cors(handler, {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
```

### Rate Limiting Issues

#### Problem

```bash
Error: 429 Too Many Requests
Error: Rate limit exceeded
```

#### Solution

```typescript
// Check rate limiting configuration
// lib/rate-limit.ts
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
}

// Implement rate limiting bypass for testing
if (process.env.NODE_ENV === 'test') {
  // Skip rate limiting
  return handler(req, res)
}
```

### API Response Issues

#### Problem

```bash
Error: Unexpected end of JSON input
Error: Network request failed
```

#### Solution

```typescript
// Add error handling to API calls
const apiCall = async (url: string) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Add response validation
const validateApiResponse = (response: any): boolean => {
  return response && typeof response.success === 'boolean'
}
```

## Performance Issues

### Slow Development Server

#### Problem

```bash
Development server takes >30 seconds to start
Hot reload is slow
Memory usage is high
```

#### Solution

```bash
# Check Node.js memory
node --max-old-space-size=4096 node_modules/.bin/next dev

# Use Turbopack for faster development
pnpm dev --turbo

# Exclude large directories from watching
# next.config.js
module.exports = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**']
    }
    return config
  }
}
```

### Bundle Size Issues

#### Problem

```bash
JavaScript bundle is >1MB
Initial load time is slow
```

#### Solution

```bash
# Analyze bundle size
pnpm build
pnpm build:analyze

# Check for large dependencies
pnpm why large-package

# Optimize imports
// ❌ Import entire library
import * as _ from 'lodash'

// ✅ Import specific functions
import { debounce } from 'lodash'
```

## Frontend Issues

### React Hydration Mismatches

#### Problem

```bash
Warning: Text content does not match server-rendered HTML
Warning: Prop `className` did not match
```

#### Solution

```typescript
// Ensure client and server render same content
// ❌ Using browser-only APIs during SSR
const Component = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  if (!isClient) return null  // Causes hydration mismatch
}

// ✅ Proper SSR handling
const Component = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div>
      <div className="server-content">Always rendered</div>
      {mounted && <div className="client-content">Client only</div>}
    </div>
  )
}
```

### State Management Issues

#### Problem

```bash
Component re-renders infinitely
State not updating correctly
Memory leaks in useEffect
```

#### Solution

```typescript
// ❌ Infinite re-render
const Component = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count + 1) // Missing dependency array
  })
}

// ✅ Proper useEffect
const Component = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setCount(c => c + 1), 1000)
    return () => clearTimeout(timer) // Cleanup
  }, []) // Empty dependency array
}

// ❌ Memory leak
const Component = () => {
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    // Missing cleanup
  })
}

// ✅ Proper cleanup
const Component = () => {
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}
```

## Deployment Issues

### Vercel Deployment Failures

#### Problem

```bash
Build failed during deployment
Environment variables not available
Static generation failed
```

#### Solution

```bash
# Check Vercel logs
vercel logs

# Verify environment variables in Vercel dashboard
# Settings → Environment Variables

# Test build locally with production env
NODE_ENV=production pnpm build

# Check for Node.js version compatibility
node --version  # Should match Vercel runtime
```

### Database Migration Issues

#### Problem

```bash
Migration failed in production
Schema conflicts
Data loss during migration
```

#### Solution

```bash
# Test migrations in staging first
# Backup production data
# Run migrations incrementally

# Rollback plan
supabase db rollback --version previous-version

# Check migration status
supabase migration list
```

## Debugging Tools and Techniques

### Browser DevTools

#### Console Debugging

```typescript
// Add debug statements
console.log('Debug: user data', user)
console.log('Debug: API response', response)
console.table('Debug: project list', projects)

// Use debugger statements
debugger // Execution will pause here in DevTools

// Debug React components
window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot
```

#### Network Debugging

```typescript
// Add request logging
const originalFetch = window.fetch
window.fetch = async (...args) => {
  console.log('Fetch:', args[0], args[1])
  const response = await originalFetch(...args)
  console.log('Response:', response.status, response.url)
  return response
}
```

### VS Code Debugging

#### Launch Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["inspect"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Error Boundary Implementation

```typescript
// components/ErrorBoundary.tsx
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red' }}>
          <h2>Something went wrong</h2>
          <details>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.error.stack}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Preventive Measures

### Code Quality

```bash
# Run pre-commit hooks
pnpm prepare  # Install Husky

# Manual pre-commit checks
pnpm lint && pnpm type-check && pnpm test

# Regular dependency updates
pnpm update
pnpm audit fix
```

### Environment Management

```bash
# Use environment-specific configs
cp .env.staging .env.local  # For staging
cp .env.production .env.local  # For production

# Validate environment variables
node scripts/validate-env.js
```

### Monitoring Setup

```typescript
// Add comprehensive error tracking
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

// Add performance monitoring
const reportWebVitals = (metric: any) => {
  console.log('Web Vital:', metric)
  // Send to analytics service
}
```

## Getting Help

### Community Resources

- **GitHub Issues**: [github.com/elicharlese/ForSure/issues](https://github.com/elicharlese/ForSure/issues)
- **GitHub Discussions**: [github.com/elicharlese/ForSure/discussions](https://github.com/elicharlese/ForSure/discussions)
- **Discord Community**: [discord.gg/forsure](https://discord.gg/forsure)
- **Stack Overflow**: Search for `forsure` and `nextjs` tags

### Debug Information to Include

When reporting issues, include:

```bash
# System information
node --version
pnpm --version
npm --version
git --version

# Project information
git rev-parse HEAD
git status
git log --oneline -5

# Error details
Full error message
Stack trace
Steps to reproduce
Expected vs actual behavior
```

### Emergency Procedures

```bash
# Quick fixes for common issues
# 1. Clear all caches
rm -rf .next node_modules package-lock.json
pnpm install

# 2. Reset to last working commit
git log --oneline -10
git reset --hard <commit-hash>

# 3. Create fresh environment
cp .env.example .env.local
pnpm dev
```

This troubleshooting guide should help resolve most common issues encountered during ForSure development. For additional help, don't hesitate to reach out to the community!
