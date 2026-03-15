'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import { cn } from '@/lib/utils'

interface DashboardMetrics {
  totalComponents: number
  activeComponents: number
  testCoverage: number
  accessibilityScore: number
  usageCount: number
  issuesCount: number
  lastUpdated: string
}

interface ComponentUsage {
  name: string
  usage: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface Issue {
  id: string
  type: 'accessibility' | 'performance' | 'consistency' | 'bug'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  component?: string
  createdAt: string
}

export function DesignSystemDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalComponents: 0,
    activeComponents: 0,
    testCoverage: 0,
    accessibilityScore: 0,
    usageCount: 0,
    issuesCount: 0,
    lastUpdated: new Date().toISOString(),
  })

  const [componentUsage, setComponentUsage] = useState<ComponentUsage[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true)
      
      // Mock data - in real implementation, this would come from your analytics API
      setTimeout(() => {
        setMetrics({
          totalComponents: 24,
          activeComponents: 22,
          testCoverage: 94,
          accessibilityScore: 98,
          usageCount: 15420,
          issuesCount: 3,
          lastUpdated: new Date().toISOString(),
        })

        setComponentUsage([
          { name: 'Button', usage: 5420, trend: 'up', change: 12.5 },
          { name: 'Card', usage: 3210, trend: 'up', change: 8.3 },
          { name: 'Input', usage: 2890, trend: 'stable', change: 2.1 },
          { name: 'Badge', usage: 1870, trend: 'down', change: -3.2 },
          { name: 'Heading', usage: 1560, trend: 'up', change: 5.7 },
          { name: 'Link', usage: 1420, trend: 'stable', change: 1.2 },
        ])

        setIssues([
          {
            id: '1',
            type: 'accessibility',
            severity: 'medium',
            title: 'Missing aria-label on Icon buttons',
            component: 'Button',
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: '2',
            type: 'performance',
            severity: 'low',
            title: 'Unused CSS in Card component',
            component: 'Card',
            createdAt: '2024-01-14T15:20:00Z',
          },
          {
            id: '3',
            type: 'consistency',
            severity: 'high',
            title: 'Inconsistent spacing in form layouts',
            createdAt: '2024-01-13T09:15:00Z',
          },
        ])

        setLoading(false)
      }, 1000)
    }

    fetchDashboardData()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      case 'down':
        return <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      default:
        return <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-brand-secondary font-bold text-sm">FS</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Design System Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button variant="brand" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Components</p>
                    <p className="text-2xl font-bold">{metrics.totalComponents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Test Coverage</p>
                    <p className="text-2xl font-bold">{metrics.testCoverage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Accessibility Score</p>
                    <p className="text-2xl font-bold">{metrics.accessibilityScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                    <p className="text-2xl font-bold">{metrics.usageCount.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Usage */}
          <section className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Component Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {componentUsage.map((component) => (
                    <div key={component.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                        <span className="font-medium">{component.name}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(component.trend)}
                          <span className={cn(
                            "text-sm",
                            component.trend === 'up' ? "text-green-500" : 
                            component.trend === 'down' ? "text-red-500" : "text-gray-500"
                          )}>
                            {component.change > 0 ? '+' : ''}{component.change}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-primary h-2 rounded-full" 
                            style={{ width: `${(component.usage / componentUsage[0].usage) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {component.usage.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Issues */}
          <section>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Issues</CardTitle>
                  <Badge variant="error">{metrics.issuesCount}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issues.map((issue) => (
                    <div key={issue.id} className="border-l-4 pl-3 py-2" style={{ borderColor: getSeverityColor(issue.severity).replace('bg-', '#') }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{issue.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" size="sm">{issue.type}</Badge>
                            {issue.component && (
                              <span className="text-xs text-muted-foreground">{issue.component}</span>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className={cn("border-current", getSeverityColor(issue.severity).replace('bg-', 'text-'))}
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {issues.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-muted-foreground">No issues found!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Run Audit</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Generate Report</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>View Tokens</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
