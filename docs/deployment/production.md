# Production Deployment Guide

This guide covers deploying the ForSure application to production using Vercel, the recommended platform for Next.js applications.

## Deployment Overview

ForSure is designed for modern, serverless deployment with the following characteristics:

- **Zero-downtime deployments**
- **Automatic scaling**
- **Global CDN distribution**
- **Edge function optimization**
- **Environment-specific configurations**

## Prerequisites

### Required Accounts

- **Vercel Account**: [vercel.com](https://vercel.com)
- **Supabase Project**: [supabase.com](https://supabase.com)
- **Custom Domain** (optional): For branded URLs
- **SSL Certificate** (optional): Auto-provided by Vercel

### Technical Requirements

- **Git Repository**: Code pushed to GitHub/GitLab/Bitbucket
- **Environment Variables**: All production secrets configured
- **Database**: Supabase production project ready
- **Domain**: Custom domain configured (if applicable)

## Vercel Deployment

### Step 1: Prepare Your Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main

# Verify main branch is deployable
git checkout main
git pull origin main
```

### Step 2: Connect to Vercel

#### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Deploy to production
vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Connect your Git provider
   - Select the ForSure repository

2. **Configure Build Settings**

   ```json
   {
     "framework": "nextjs",
     "buildCommand": "pnpm build",
     "outputDirectory": ".next",
     "installCommand": "pnpm install"
   }
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Test the deployed application

### Step 3: Configure Environment Variables

#### Required Environment Variables

In your Vercel project dashboard, navigate to **Settings** → **Environment Variables**:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Authentication
JWT_SECRET=your-production-jwt-secret

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-production-analytics-id
SENTRY_DSN=your-production-sentry-dsn
```

#### Environment-Specific Variables

```bash
# Production-specific
NEXT_PUBLIC_APP_URL=https://forsure.app
VERCEL_ENV=production

# Staging (if using preview deployments)
NEXT_PUBLIC_APP_URL=https://staging.forsure.app
VERCEL_ENV=preview
```

### Step 4: Custom Domain Configuration

#### Option 1: Vercel-provided Domain

- Your app will be available at `https://your-project-name.vercel.app`
- No additional configuration needed

#### Option 2: Custom Domain

1. **Add Domain in Vercel**
   - Go to **Settings** → **Domains**
   - Click "Add" and enter your domain (e.g., `forsure.app`)
   - Follow the DNS configuration instructions

2. **Configure DNS**

   ```bash
   # A Record (recommended)
   A    @    76.76.19.61
   A    www  76.76.19.61

   # CNAME Record (alternative)
   CNAME www  cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enabled automatically

### Step 5: Deploy and Verify

```bash
# Trigger production deployment
vercel --prod

# Monitor deployment
vercel logs

# Check deployment status
vercel inspect
```

#### Verification Checklist

- [ ] Application loads correctly at production URL
- [ ] All pages render without errors
- [ ] Authentication flow works properly
- [ ] Database connections are functional
- [ ] File uploads work correctly
- [ ] API endpoints respond correctly
- [ ] Custom domain resolves (if configured)
- [ ] SSL certificate is valid

## Supabase Production Setup

### Database Configuration

#### 1. Production Project Setup

```bash
# Create production Supabase project
# - Choose production region (closest to users)
# - Set strong database password
# - Enable point-in-time recovery
```

#### 2. Apply Database Schema

```bash
# Using Supabase CLI
supabase link --project-ref your-production-project-ref
supabase db push

# Or manually via dashboard
# Go to SQL Editor → paste schema.sql → Run
```

#### 3. Configure Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- ... enable on all tables

-- Apply production policies
-- Review and test all RLS policies
```

#### 4. Set Up Storage Buckets

```sql
-- Create production storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', false);
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false);
```

### Authentication Configuration

#### 1. Enable Auth Providers

```bash
# In Supabase Dashboard → Authentication → Providers
# Enable required providers:
# - Email (with confirmation)
# - Google (if using social auth)
# - GitHub (if using social auth)
```

#### 2. Configure Redirect URLs

```bash
# Add production URLs to allowed redirect URLs:
# https://forsure.app/auth/callback
# https://forsure.app/**
```

#### 3. Set Up JWT Settings

```bash
# Configure JWT settings:
# - Expiration time (recommended: 1 hour)
# - Refresh token rotation
# - Session management
```

## Performance Optimization

### Build Optimization

#### Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    domains: ['your-supabase-project-ref.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
}

export default nextConfig
```

#### Package.json Scripts

```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Caching Strategy

#### Static Asset Caching

```javascript
// app/layout.tsx
export const metadata = {
  title: 'ForSure',
  description: 'Modern full-stack application',
  keywords: ['nextjs', 'react', 'typescript'],
  openGraph: {
    title: 'ForSure',
    description: 'Modern full-stack application',
    url: 'https://forsure.app',
    siteName: 'ForSure',
    images: ['/og-image.jpg'],
    locale: 'en_US',
    type: 'website',
  },
}
```

#### API Response Caching

```typescript
// lib/cache.ts
export const cacheHeaders = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
  'CDN-Cache-Control': 'public, s-maxage=3600',
}

export const withCache = (handler: Function, maxAge: number = 3600) => {
  return async (...args: any[]) => {
    const response = await handler(...args)
    response.headers.set('Cache-Control', `public, s-maxage=${maxAge}`)
    return response
  }
}
```

### Image Optimization

#### Next.js Image Component

```typescript
import Image from 'next/image'

// Optimized images
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

## Monitoring and Analytics

### Vercel Analytics

#### Setup

```bash
# Analytics are automatically enabled
# View in Vercel Dashboard → Analytics
```

#### Key Metrics

- **Page Views**: Track user engagement
- **Web Vitals**: Performance metrics
- **Route Changes**: Navigation patterns
- **API Usage**: Endpoint performance

### Error Monitoring

#### Sentry Integration

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

#### Error Tracking

```typescript
// Error boundary implementation
'use client'
import * as Sentry from '@sentry/nextjs'

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={<ErrorFallback />}
      showDialog={true}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
```

## Security Configuration

### Environment Security

#### Secret Management

```bash
# Use Vercel's encrypted environment variables
# Never commit secrets to Git
# Rotate secrets regularly
# Use different secrets for staging/production
```

#### HTTPS Configuration

```bash
# Vercel automatically provides:
# - SSL certificates
# - HTTP to HTTPS redirects
# - HSTS headers
```

### Application Security

#### Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}
```

#### Rate Limiting

```typescript
// lib/rate-limit.ts
export const productionRateLimit = {
  '/api/auth/login': { limit: 5, window: 15 * 60 * 1000 },
  '/api/auth/register': { limit: 3, window: 60 * 60 * 1000 },
  '/api/upload': { limit: 10, window: 60 * 60 * 1000 },
  default: { limit: 100, window: 15 * 60 * 1000 },
}
```

## Scaling Considerations

### Database Scaling

#### Connection Pooling

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      poolSize: 10, // Adjust based on load
    },
  }
)
```

#### Query Optimization

```typescript
// Optimized queries with proper indexing
const getProjects = async (userId: string, filters: any) => {
  return await supabase
    .from('projects')
    .select(
      `
      id, name, status, created_at,
      profiles!projects_owner_id_fkey (name, avatar_url)
    `
    )
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .range(filters.offset, filters.offset + filters.limit - 1)
}
```

### CDN Optimization

#### Edge Caching

```typescript
// app/api/projects/route.ts
export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const data = await getProjects()

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
```

## Deployment Workflow

### CI/CD Pipeline

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build application
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Branch Deployment Strategy

#### Main Branch

```bash
# Production deployments
git push origin main  # Triggers production deployment
```

#### Feature Branches

```bash
# Preview deployments
git push origin feature/new-feature  # Creates preview URL
```

#### Staging Environment

```bash
# Staging deployments
git push origin develop  # Deploys to staging URL
```

## Post-Deployment Checklist

### Functional Testing

- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Project CRUD operations functional
- [ ] File uploads work properly
- [ ] Search functionality works
- [ ] All API endpoints respond
- [ ] Error pages display correctly

### Performance Testing

- [ ] Page load times under 3 seconds
- [ ] Core Web Vitals within acceptable ranges
- [ ] Images optimized and loading correctly
- [ ] API response times under 500ms
- [ ] Caching headers properly set

### Security Testing

- [ ] HTTPS enforced properly
- [ ] Security headers present
- [ ] Authentication flows secure
- [ ] Rate limiting active
- [ ] Environment variables secure

### Monitoring Setup

- [ ] Error tracking configured
- [ ] Analytics collecting data
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Log aggregation working

## Troubleshooting Common Issues

### Build Failures

```bash
# Check build logs
vercel logs

# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Dependency conflicts
# - Build timeout
```

### Runtime Errors

```bash
# Check function logs
vercel logs --filter=error

# Debug API issues
curl -I https://forsure.app/api/health
```

### Performance Issues

```bash
# Check Web Vitals
# View in Vercel Analytics → Speed

# Optimize images
# Check bundle size with:
pnpm build:analyze
```

## Maintenance and Updates

### Regular Tasks

```bash
# Update dependencies monthly
pnpm update

# Security patches
pnpm audit fix

# Database maintenance
# Monitor query performance
# Update statistics
```

### Backup Strategy

```bash
# Supabase automatic backups
# Configure point-in-time recovery
# Regular backup verification
```

Your ForSure application is now ready for production deployment with Vercel!
