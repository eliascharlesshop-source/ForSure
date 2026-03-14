# Monitoring and Logging Guide

This guide covers setting up comprehensive monitoring, logging, and observability for the ForSure application in production.

## Monitoring Overview

Effective monitoring ensures application reliability, performance, and user experience. ForSure implements a multi-layered monitoring strategy:

- **Application Performance Monitoring (APM)**
- **Error Tracking and Reporting**
- **User Analytics and Behavior**
- **Infrastructure Health Monitoring**
- **Business Metrics Tracking**

## Application Performance Monitoring

### Vercel Analytics

Vercel provides built-in analytics for Next.js applications:

#### Setup

```bash
# Analytics are automatically enabled for Vercel deployments
# View in: Vercel Dashboard → Analytics
```

#### Key Metrics

- **Page Views**: Total page visits and unique visitors
- **Web Vitals**: Core Web Vitals (LCP, FID, CLS)
- **Route Changes**: Navigation patterns and performance
- **API Usage**: Endpoint response times and error rates

#### Custom Events

```typescript
// lib/analytics.ts
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Usage examples
trackEvent('project_created', {
  project_type: 'web_app',
  tech_stack: 'react,nodejs',
})

trackEvent('user_registered', {
  method: 'email',
  source: 'organic',
})
```

### Core Web Vitals Monitoring

#### Implementation

```typescript
// app/layout.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to Vercel Analytics
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    })
  }
}

export function reportWebVitals(metric: any) {
  sendToAnalytics(metric)
}

// In your app
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

#### API Endpoint for Analytics

```typescript
// app/api/analytics/route.ts
export async function POST(request: NextRequest) {
  const metric = await request.json()

  // Store in database or send to analytics service
  await supabase.from('analytics_events').insert({
    metric_name: metric.name,
    metric_value: metric.value,
    metric_id: metric.id,
    user_agent: request.headers.get('user-agent'),
    created_at: new Date().toISOString(),
  })

  return Response.json({ success: true })
}
```

## Error Tracking

### Sentry Integration

Sentry provides comprehensive error tracking and performance monitoring:

#### Setup

```bash
# Install Sentry
pnpm add @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

#### Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

#### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client'
import * as Sentry from '@sentry/nextjs'
import { ErrorFallback } from './ErrorFallback'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback || ErrorFallback}
      showDialog={process.env.NODE_ENV === 'production'}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
```

#### Custom Error Reporting

```typescript
// lib/error-reporting.ts
import * as Sentry from '@sentry/nextjs'

export const reportError = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error)

  Sentry.captureException(error, {
    contexts: { custom: context },
    tags: {
      section: context?.section || 'unknown',
      userAction: context?.userAction || 'none',
    },
  })
}

export const reportMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  Sentry.captureMessage(message, level)
}

// Usage examples
try {
  await riskyOperation()
} catch (error) {
  reportError(error, {
    section: 'project_creation',
    userAction: 'create_project',
    projectId: project.id,
  })
}
```

## Logging Strategy

### Structured Logging

#### Logger Configuration

```typescript
// lib/logger.ts
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
}

class Logger {
  private context: Record<string, any> = {}

  constructor(context?: Record<string, any>) {
    this.context = context || {}
  }

  private log(level: LogLevel, message: string, extra?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...this.context,
      ...extra,
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(entry, null, 2))
    }

    // Send to logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLogService(entry)
    }
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  private async sendToLogService(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error('Failed to send log:', error)
    }
  }
}

export const logger = new Logger()
export const createLogger = (context: Record<string, any>) =>
  new Logger(context)
```

#### API Logging Middleware

```typescript
// lib/api-logging.ts
import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from './logger'

export function withLogging(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const requestId = crypto.randomUUID()
    const startTime = Date.now()
    const logger = createLogger({
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip,
    })

    try {
      logger.info('API request started')

      const response = await handler(request, context)

      const duration = Date.now() - startTime
      logger.info('API request completed', {
        status: response.status,
        duration,
      })

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error('API request failed', {
        error: error.message,
        duration,
        stack: error.stack,
      })

      throw error
    }
  }
}
```

## Database Monitoring

### Query Performance Tracking

#### Query Logger

```typescript
// lib/db-logger.ts
import { supabase } from './supabase'

export function withQueryLogging<T>(
  operation: string,
  queryFn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now()

    try {
      const result = await queryFn()
      const duration = performance.now() - startTime

      // Log slow queries
      if (duration > 1000) {
        logger.warn('Slow database query detected', {
          operation,
          duration: Math.round(duration),
          threshold: 1000,
        })
      }

      resolve(result)
    } catch (error) {
      const duration = performance.now() - startTime
      logger.error('Database query failed', {
        operation,
        duration: Math.round(duration),
        error: error.message,
      })
      reject(error)
    }
  })
}

// Usage
const projects = await withQueryLogging('get_user_projects', async () => {
  return await supabase.from('projects').select('*')
})
```

#### Database Health Check

```typescript
// app/api/health/database/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {},
  }

  try {
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) throw error

    health.checks.connection = { status: 'ok' }

    // Test query performance
    const start = Date.now()
    await supabase.from('projects').select('count').limit(1)
    const queryTime = Date.now() - start

    health.checks.query_performance = {
      status: queryTime < 500 ? 'ok' : 'slow',
      response_time_ms: queryTime,
    }

    // Check table sizes
    const [{ count: userCount }] = await supabase
      .from('users')
      .select('count', { count: 'exact' })
    const [{ count: projectCount }] = await supabase
      .from('projects')
      .select('count', { count: 'exact' })

    health.checks.database_size = {
      status: 'ok',
      users: userCount,
      projects: projectCount,
    }
  } catch (error) {
    health.status = 'error'
    health.checks.connection = {
      status: 'error',
      error: error.message,
    }
  }

  return Response.json(health, {
    status: health.status === 'ok' ? 200 : 503,
  })
}
```

## User Analytics

### Custom Analytics Events

#### Event Tracking System

```typescript
// lib/analytics.ts
interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp: number
}

class Analytics {
  private queue: AnalyticsEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => this.flush(), 30000)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush())
    }
  }

  track(event: string, properties?: Record<string, any>) {
    this.queue.push({
      event,
      properties,
      userId: this.getCurrentUserId(),
      timestamp: Date.now(),
    })

    // Immediate flush for critical events
    if (this.isCriticalEvent(event)) {
      this.flush()
    }
  }

  private async flush() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      // Re-queue events on failure
      this.queue.unshift(...events)
    }
  }

  private isCriticalEvent(event: string): boolean {
    const criticalEvents = [
      'user_registered',
      'user_login',
      'purchase_completed',
    ]
    return criticalEvents.includes(event)
  }

  private getCurrentUserId(): string | undefined {
    // Get current user ID from auth context
    return undefined // Implementation depends on your auth setup
  }
}

export const analytics = new Analytics()

// Usage examples
analytics.track('project_created', {
  project_type: 'web_app',
  tech_stack: ['react', 'nodejs'],
  is_public: true,
})

analytics.track('file_uploaded', {
  file_type: 'image',
  file_size: 1024000,
  bucket: 'uploads',
})
```

#### Analytics API Endpoint

```typescript
// app/api/analytics/events/route.ts
export async function POST(request: NextRequest) {
  const { events } = await request.json()

  // Process events in batch
  for (const event of events) {
    await supabase.from('analytics_events').insert({
      event_name: event.event,
      properties: event.properties,
      user_id: event.userId,
      timestamp: new Date(event.timestamp).toISOString(),
      created_at: new Date().toISOString(),
    })
  }

  return Response.json({ success: true, processed: events.length })
}
```

## Infrastructure Monitoring

### Health Check Endpoints

#### Application Health

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {},
  }

  // Check database
  try {
    await supabase.from('users').select('count').limit(1)
    health.services.database = { status: 'ok' }
  } catch (error) {
    health.services.database = { status: 'error', error: error.message }
    health.status = 'degraded'
  }

  // Check storage
  try {
    const { data } = await supabase.storage.listBuckets()
    health.services.storage = { status: 'ok', buckets: data.length }
  } catch (error) {
    health.services.storage = { status: 'error', error: error.message }
    health.status = 'degraded'
  }

  // Check external services
  health.services.external = await checkExternalServices()

  return Response.json(health, {
    status: health.status === 'ok' ? 200 : 503,
  })
}

async function checkExternalServices() {
  const services = {}

  // Check blockchain service
  try {
    const response = await fetch(
      `${process.env.BLOCKCHAIN_SERVICE_URL}/health`,
      {
        timeout: 5000,
      }
    )
    services.blockchain = { status: response.ok ? 'ok' : 'error' }
  } catch (error) {
    services.blockchain = { status: 'error', error: error.message }
  }

  return services
}
```

### Uptime Monitoring

#### External Monitoring Setup

```bash
# Set up uptime monitoring services
# Recommended services:

# UptimeRobot (Free tier available)
# - Monitor https://forsure.app/api/health
# - Check every 5 minutes
# - Alert on failures

# Pingdom (Paid)
# - More comprehensive monitoring
# - Performance checks
# - Advanced alerting

# Custom monitoring with cron job
# */5 * * * * curl -f https://forsure.app/api/health
```

#### Custom Monitoring Dashboard

```typescript
// app/api/monitoring/metrics/route.ts
export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    application: await getApplicationMetrics(),
    database: await getDatabaseMetrics(),
    business: await getBusinessMetrics(),
  }

  return Response.json(metrics)
}

async function getApplicationMetrics() {
  // Get application metrics from last 24 hours
  const { data } = await supabase
    .from('analytics_events')
    .select('event_name, timestamp')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  return {
    total_events: data.length,
    unique_events: new Set(data.map(e => e.event_name)).size,
    error_rate: calculateErrorRate(data),
  }
}

async function getDatabaseMetrics() {
  const [
    { count: userCount },
    { count: projectCount },
    { count: blogPostCount },
  ] = await Promise.all([
    supabase.from('users').select('count', { count: 'exact' }),
    supabase.from('projects').select('count', { count: 'exact' }),
    supabase.from('blog_posts').select('count', { count: 'exact' }),
  ])

  return {
    users: userCount,
    projects: projectCount,
    blog_posts: blogPostCount,
  }
}

async function getBusinessMetrics() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [{ count: newUsers }, { count: newProjects }, { count: activeUsers }] =
    await Promise.all([
      supabase
        .from('users')
        .select('count', { count: 'exact' })
        .gte('created_at', last24Hours),
      supabase
        .from('projects')
        .select('count', { count: 'exact' })
        .gte('created_at', last24Hours),
      supabase
        .from('user_sessions')
        .select('count', { count: 'exact' })
        .gte('last_active', last24Hours),
    ])

  return {
    new_users_today: newUsers,
    new_projects_today: newProjects,
    active_users_today: activeUsers,
  }
}
```

## Alerting System

### Error Alerting

#### Sentry Alerts

```typescript
// sentry.alerts.ts
export const configureSentryAlerts = () => {
  // Configure Sentry alerts in dashboard or via API
  const alertRules = [
    {
      name: 'High Error Rate',
      condition: 'error_rate > 5%',
      duration: '5m',
      actions: ['slack', 'email'],
    },
    {
      name: 'Critical Error',
      condition: 'error.level = error',
      filters: ['environment:production'],
      actions: ['slack', 'email', 'sms'],
    },
    {
      name: 'Performance Degradation',
      condition: 'transaction.duration > 2000ms',
      duration: '10m',
      actions: ['slack'],
    },
  ]
}
```

#### Custom Alert System

```typescript
// lib/alerts.ts
interface Alert {
  type: 'error' | 'warning' | 'info'
  message: string
  context?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class AlertManager {
  private async sendAlert(alert: Alert) {
    console.log(`ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`)

    // Send to different channels based on severity
    if (alert.severity === 'critical') {
      await this.sendSlackAlert(alert)
      await this.sendEmailAlert(alert)
    } else if (alert.severity === 'high') {
      await this.sendSlackAlert(alert)
    }

    // Store alert in database
    await supabase.from('alerts').insert({
      ...alert,
      created_at: new Date().toISOString(),
    })
  }

  private async sendSlackAlert(alert: Alert) {
    if (!process.env.SLACK_WEBHOOK_URL) return

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 ${alert.message}`,
        attachments: [
          {
            color: this.getSeverityColor(alert.severity),
            fields: Object.entries(alert.context || {}).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            })),
          },
        ],
      }),
    })
  }

  private async sendEmailAlert(alert: Alert) {
    // Implementation depends on your email service
    // Send email to operations team
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      low: 'good',
      medium: 'warning',
      high: 'danger',
      critical: 'danger',
    }
    return colors[severity] || 'warning'
  }
}

export const alertManager = new AlertManager()

// Usage
alertManager.sendAlert({
  type: 'error',
  message: 'Database connection failed',
  context: {
    service: 'supabase',
    error_code: 'CONNECTION_TIMEOUT',
  },
  severity: 'critical',
})
```

## Performance Optimization

### Real User Monitoring (RUM)

#### RUM Implementation

```typescript
// lib/rum.ts
export class RealUserMonitoring {
  private metrics: any[] = []

  constructor() {
    this.observePageLoad()
    this.observeRouteChanges()
    this.observeUserInteractions()
  }

  private observePageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      this.recordMetric('page_load', {
        load_time: navigation.loadEventEnd - navigation.navigationStart,
        dom_content_loaded:
          navigation.domContentLoadedEventEnd - navigation.navigationStart,
        first_byte: navigation.responseStart - navigation.navigationStart,
      })
    })
  }

  private observeRouteChanges() {
    // Observe Next.js route changes
    if (typeof window !== 'undefined' && (window as any).next) {
      ;(window as any).next.router.events.on(
        'routeChangeComplete',
        (url: string) => {
          this.recordMetric('route_change', { url })
        }
      )
    }
  }

  private observeUserInteractions() {
    if (typeof window === 'undefined') return

    // Track clicks, form submissions, etc.
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement
      this.recordMetric('user_click', {
        element: target.tagName,
        element_id: target.id,
        element_class: target.className,
      })
    })
  }

  private recordMetric(name: string, data: any) {
    const metric = {
      name,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      user_agent: navigator.userAgent,
    }

    this.metrics.push(metric)
    this.sendMetrics()
  }

  private async sendMetrics() {
    if (this.metrics.length === 0) return

    const metricsToSend = [...this.metrics]
    this.metrics = []

    try {
      await fetch('/api/analytics/rum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: metricsToSend }),
      })
    } catch (error) {
      console.error('Failed to send RUM metrics:', error)
    }
  }
}

export const rum = new RealUserMonitoring()
```

## Monitoring Dashboard

### Custom Dashboard

```typescript
// app/dashboard/monitoring/page.tsx
export default async function MonitoringDashboard() {
  const metrics = await getMonitoringMetrics()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Application Health"
          value={metrics.application.status}
          status={metrics.application.status === 'ok' ? 'success' : 'error'}
        />

        <MetricCard
          title="Error Rate"
          value={`${metrics.application.error_rate}%`}
          status={metrics.application.error_rate < 1 ? 'success' : 'warning'}
        />

        <MetricCard
          title="Active Users"
          value={metrics.business.active_users_today}
          status="info"
        />

        <MetricCard
          title="Database Status"
          value={metrics.database.status}
          status={metrics.database.status === 'ok' ? 'success' : 'error'}
        />

        <MetricCard
          title="New Projects Today"
          value={metrics.business.new_projects_today}
          status="info"
        />

        <MetricCard
          title="Uptime"
          value={`${metrics.application.uptime}%`}
          status={metrics.application.uptime > 99.9 ? 'success' : 'warning'}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
        <AlertsList alerts={metrics.recent_alerts} />
      </div>
    </div>
  )
}
```

Your monitoring and logging system is now comprehensive and ready for production!
