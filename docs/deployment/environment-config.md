# Environment Configuration Guide

This guide covers configuring environment variables and settings for different deployment environments in the ForSure application.

## Environment Overview

ForSure supports multiple environments with distinct configurations:

- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## Environment Variables

### Required Variables

All environments must have these variables configured:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Application
NEXT_PUBLIC_APP_URL=your-app-url
NODE_ENV=environment-type
```

### Optional Variables

These variables enhance functionality but are not required:

```bash
# Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn

# Blockchain Integration
SOLANA_NETWORK=mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BLOCKCHAIN_SERVICE_URL=https://blockchain.forsure.app

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_BETA_FEATURES=false

# External Services
EMAIL_SERVICE_PROVIDER=sendgrid
EMAIL_SERVICE_API_KEY=your-email-api-key

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

## Development Environment

### Local Development (.env.local)

Create `.env.local` in the project root:

```bash
# Supabase Development
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key

# Authentication
JWT_SECRET=dev-jwt-secret-change-in-production

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Development Tools
NEXT_PUBLIC_ANALYTICS_ID=dev-analytics-id
SENTRY_DSN=your-dev-sentry-dsn

# Debugging
DEBUG=forsure:*
LOG_LEVEL=debug
```

### Environment Setup Script

```bash
#!/bin/bash
# scripts/setup-env.sh

echo "Setting up development environment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "Please edit .env.local with your configuration"
else
    echo ".env.local already exists"
fi

# Generate JWT secret if not set
if ! grep -q "JWT_SECRET=" .env.local; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET" >> .env.local
    echo "Generated JWT secret"
fi

echo "Environment setup complete!"
echo "Don't forget to:"
echo "1. Configure Supabase credentials"
echo "2. Set up database schema"
echo "3. Start the development server"
```

## Staging Environment

### Vercel Staging Configuration

Configure in Vercel dashboard under **Settings** → **Environment Variables**:

```bash
# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# Authentication
JWT_SECRET=staging-jwt-secret-strong-random-string

# Application
NEXT_PUBLIC_APP_URL=https://staging.forsure.app
NODE_ENV=staging

# Monitoring
SENTRY_DSN=your-staging-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=staging-analytics-id

# Feature Flags
ENABLE_BETA_FEATURES=true
ENABLE_AI_FEATURES=true
```

### Environment-Specific Code

```typescript
// lib/config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  isProduction: process.env.NODE_ENV === 'production',

  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,

  features: {
    ai: process.env.ENABLE_AI_FEATURES === 'true',
    beta: process.env.ENABLE_BETA_FEATURES === 'true',
  },

  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
  },
}
```

## Production Environment

### Vercel Production Configuration

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Authentication
JWT_SECRET=production-jwt-secret-very-strong-random-string

# Application
NEXT_PUBLIC_APP_URL=https://forsure.app
NODE_ENV=production

# Monitoring
SENTRY_DSN=your-production-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id

# External Services
EMAIL_SERVICE_API_KEY=your-production-email-api-key
BLOCKCHAIN_SERVICE_URL=https://blockchain.forsure.app

# Security
ENABLE_RATE_LIMITING=true
STRICT_CORS=true
```

### Production Security Considerations

```typescript
// lib/security.ts
export const securityConfig = {
  // Only in production
  enforceHTTPS: process.env.NODE_ENV === 'production',

  // Rate limiting
  rateLimiting: {
    enabled: process.env.ENABLE_RATE_LIMITING === 'true',
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },

  // CORS
  cors: {
    strict: process.env.STRICT_CORS === 'true',
    origins:
      process.env.NODE_ENV === 'production'
        ? ['https://forsure.app', 'https://www.forsure.app']
        : ['http://localhost:3000'],
  },
}
```

## Environment Validation

### Runtime Validation

```typescript
// lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'staging', 'production']),

  // Optional variables
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  ENABLE_AI_FEATURES: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  MAX_FILE_SIZE: z.string().transform(Number).optional(),
})

export const env = envSchema.parse(process.env)

// Validate on startup
if (typeof window === 'undefined') {
  console.log('Environment validated:', {
    NODE_ENV: env.NODE_ENV,
    SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
    APP_URL: env.NEXT_PUBLIC_APP_URL,
    FEATURES: {
      AI: env.ENABLE_AI_FEATURES,
    },
  })
}
```

### Startup Validation Script

```typescript
// scripts/validate-env.ts
import { env } from '../lib/env-validation'

function validateEnvironment() {
  const errors: string[] = []

  // Check required Supabase connection
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('Supabase URL is required')
  }

  // Check JWT secret strength
  if (env.JWT_SECRET.length < 32) {
    errors.push('JWT secret must be at least 32 characters')
  }

  // Production-specific checks
  if (env.NODE_ENV === 'production') {
    if (env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
      errors.push('Production app URL cannot be localhost')
    }

    if (env.NEXT_PUBLIC_SUPABASE_URL.includes('dev')) {
      errors.push('Production cannot use dev Supabase project')
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:')
    errors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
  }

  console.log('✅ Environment validation passed')
}

validateEnvironment()
```

## Environment Management

### Multiple Environment Files

```
.env.example           # Template with all variables
.env.local            # Local development (gitignored)
.env.test             # Testing environment
.env.staging           # Staging environment
.env.production        # Production environment
```

### Git Configuration

```gitignore
# .gitignore

# Environment files
.env.local
.env.test
.env.staging
.env.production

# But keep the example
!.env.example
```

### Environment Switching Script

```bash
#!/bin/bash
# scripts/switch-env.sh

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: ./switch-env.sh [development|staging|production]"
    exit 1
fi

echo "Switching to $ENVIRONMENT environment..."

# Copy appropriate environment file
case $ENVIRONMENT in
    "development")
        cp .env.local.example .env.local
        echo "✅ Development environment configured"
        ;;
    "staging")
        echo "⚠️  Staging environment variables must be set in Vercel dashboard"
        echo "📝 Go to: https://vercel.com/your-project/settings/environment-variables"
        ;;
    "production")
        echo "⚠️  Production environment variables must be set in Vercel dashboard"
        echo "📝 Go to: https://vercel.com/your-project/settings/environment-variables"
        ;;
    *)
        echo "❌ Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac
```

## Database Environment Configuration

### Supabase Projects

Create separate Supabase projects for each environment:

```bash
# Development Project
# - Name: ForSure Dev
# - Region: Closest to developers
# - Database: forsure_dev

# Staging Project
# - Name: ForSure Staging
# - Region: Same as production
# - Database: forsure_staging

# Production Project
# - Name: ForSure Production
# - Region: Closest to users
# - Database: forsure_production
```

### Database Migration Scripts

```typescript
// scripts/migrate-env.ts
import { createClient } from '@supabase/supabase-js'

async function migrateEnvironment(
  env: 'development' | 'staging' | 'production'
) {
  const config = getEnvironmentConfig(env)
  const supabase = createClient(config.url, config.serviceKey)

  console.log(`Migrating ${env} database...`)

  try {
    // Run schema migrations
    const schema = await fs.readFile('./database-schema.sql', 'utf8')
    await supabase.rpc('exec_sql', { sql: schema })

    // Insert seed data for development
    if (env === 'development') {
      await seedDevelopmentData(supabase)
    }

    console.log(`✅ ${env} database migration complete`)
  } catch (error) {
    console.error(`❌ ${env} migration failed:`, error)
    process.exit(1)
  }
}

function getEnvironmentConfig(env: string) {
  const configs = {
    development: {
      url: process.env.DEV_SUPABASE_URL,
      serviceKey: process.env.DEV_SUPABASE_SERVICE_KEY,
    },
    staging: {
      url: process.env.STAGING_SUPABASE_URL,
      serviceKey: process.env.STAGING_SUPABASE_SERVICE_KEY,
    },
    production: {
      url: process.env.PROD_SUPABASE_URL,
      serviceKey: process.env.PROD_SUPABASE_SERVICE_KEY,
    },
  }

  return configs[env]
}
```

## CI/CD Environment Configuration

### GitHub Actions Environment

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build application
        run: pnpm build
        env:
          # Environment-specific variables
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### Environment Secrets Management

```bash
# Add secrets to GitHub
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://your-project.supabase.co"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-service-role-key"
gh secret set JWT_SECRET --body "your-jwt-secret"

# List secrets
gh secret list

# Update secrets
gh secret set JWT_SECRET --body "new-jwt-secret"
```

## Troubleshooting Environment Issues

### Common Problems

#### Missing Environment Variables

```bash
# Error: NEXT_PUBLIC_SUPABASE_URL is not defined
# Solution: Check environment variable configuration
echo $NEXT_PUBLIC_SUPABASE_URL

# For Next.js, restart server after changing .env.local
pnpm dev
```

#### Invalid Supabase Connection

```bash
# Error: Invalid Supabase credentials
# Solution: Verify URL and keys
curl -I $NEXT_PUBLIC_SUPABASE_URL
```

#### JWT Secret Issues

```bash
# Error: JWT verification failed
# Solution: Ensure JWT_SECRET is set and consistent
# Check length (minimum 32 characters)
echo $JWT_SECRET | wc -c
```

### Debugging Environment Variables

```typescript
// lib/debug-env.ts
export function debugEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Debug Info:')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
    console.log(
      'Supabase URL configured:',
      !!process.env.NEXT_PUBLIC_SUPABASE_URL
    )
    console.log('JWT Secret configured:', !!process.env.JWT_SECRET)
    console.log('JWT Secret length:', process.env.JWT_SECRET?.length || 0)
  }
}
```

### Environment Health Check

```typescript
// app/api/health/env/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      supabase: {
        configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '***'), // Hide full URL
      },
      auth: {
        jwtConfigured: !!process.env.JWT_SECRET,
        jwtLength: process.env.JWT_SECRET?.length || 0,
      },
    },
    features: {
      ai: process.env.ENABLE_AI_FEATURES === 'true',
      beta: process.env.ENABLE_BETA_FEATURES === 'true',
    },
  }

  return Response.json(health)
}
```

## Best Practices

### Security

- Never commit `.env.local` to version control
- Use strong, randomly generated secrets
- Rotate secrets regularly
- Use different secrets for each environment
- Limit access to production secrets

### Performance

- Use environment-specific configurations
- Enable debug features only in development
- Optimize build settings for production
- Monitor environment-specific performance

### Maintainability

- Document all environment variables
- Use validation schemas
- Provide clear error messages
- Automate environment setup
- Test environment configurations

Your environment configuration is now properly set up for all deployment scenarios!
