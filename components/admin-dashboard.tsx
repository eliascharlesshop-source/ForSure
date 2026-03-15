'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import { ErrorBoundary } from '@/components/error-boundary'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Mock data types
interface DashboardMetrics {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  security: {
    threats: number
    incidents: number
    riskScore: number
    compliance: number
  }
  performance: {
    uptime: number
    responseTime: number
    errorRate: number
    throughput: number
  }
  business: {
    revenue: number
    transactions: number
    conversionRate: number
    customerSatisfaction: number
  }
}

interface AuditTrail {
  id: string
  timestamp: Date
  userId: string
  action: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ipAddress: string
  userAgent: string
  details: Record<string, any>
}

interface SecurityAlert {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  timestamp: Date
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
  assignedTo?: string
}

interface SystemHealth {
  services: Array<{
    name: string
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'
    uptime: number
    lastCheck: Date
  }>
  resources: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
}

const COLORS = {
  primary: '#8CFFE6',
  secondary: '#0A4D68',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  muted: '#6B7280'
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  // Mock data generation
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics({
        users: {
          total: 12453,
          active: 8932,
          new: 234,
          growth: 12.5
        },
        security: {
          threats: 23,
          incidents: 5,
          riskScore: 42,
          compliance: 96.8
        },
        performance: {
          uptime: 99.97,
          responseTime: 245,
          errorRate: 0.12,
          throughput: 15420
        },
        business: {
          revenue: 2847392,
          transactions: 8934,
          conversionRate: 3.2,
          customerSatisfaction: 4.7
        }
      })

      setAuditTrails([
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          userId: 'user_123',
          action: 'LOGIN_SUCCESS',
          category: 'AUTHENTICATION',
          severity: 'LOW',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          details: { method: 'SSO', provider: 'Google' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          userId: 'user_456',
          action: 'PAYMENT_PROCESSED',
          category: 'BUSINESS',
          severity: 'MEDIUM',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          details: { amount: 299.99, currency: 'USD', gateway: 'stripe' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          userId: 'user_789',
          action: 'SECURITY_ALERT',
          category: 'SECURITY',
          severity: 'HIGH',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          details: { alertType: 'BRUTE_FORCE_ATTEMPT', attempts: 12 }
        }
      ])

      setSecurityAlerts([
        {
          id: '1',
          type: 'BRUTE_FORCE_ATTEMPT',
          severity: 'HIGH',
          title: 'Brute Force Attack Detected',
          description: 'Multiple failed login attempts detected from IP 192.168.1.102',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'INVESTIGATING',
          assignedTo: 'Security Team'
        },
        {
          id: '2',
          type: 'UNUSUAL_ACCESS_PATTERN',
          severity: 'MEDIUM',
          title: 'Unusual Access Pattern',
          description: 'User accessing system from multiple geographic locations',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          status: 'OPEN'
        }
      ])

      setSystemHealth({
        services: [
          { name: 'API Gateway', status: 'HEALTHY', uptime: 99.98, lastCheck: new Date() },
          { name: 'Database', status: 'HEALTHY', uptime: 99.95, lastCheck: new Date() },
          { name: 'Authentication', status: 'HEALTHY', uptime: 100, lastCheck: new Date() },
          { name: 'Payment Processing', status: 'DEGRADED', uptime: 99.2, lastCheck: new Date() },
          { name: 'Email Service', status: 'HEALTHY', uptime: 99.99, lastCheck: new Date() }
        ],
        resources: {
          cpu: 45,
          memory: 67,
          disk: 34,
          network: 12
        }
      })

      setLoading(false)
    }

    loadDashboardData()
    
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [selectedTimeRange])

  // Chart data
  const performanceData = useMemo(() => [
    { time: '00:00', uptime: 99.9, responseTime: 220 },
    { time: '04:00', uptime: 99.8, responseTime: 245 },
    { time: '08:00', uptime: 99.7, responseTime: 280 },
    { time: '12:00', uptime: 99.9, responseTime: 260 },
    { time: '16:00', uptime: 99.95, responseTime: 240 },
    { time: '20:00', uptime: 99.97, responseTime: 235 },
    { time: '23:59', uptime: 99.97, responseTime: 245 }
  ], [])

  const securityData = useMemo(() => [
    { name: 'Low', value: 45, color: COLORS.success },
    { name: 'Medium', value: 30, color: COLORS.warning },
    { name: 'High', value: 20, color: COLORS.danger },
    { name: 'Critical', value: 5, color: COLORS.danger }
  ], [])

  const businessData = useMemo(() => [
    { month: 'Jan', revenue: 245000, transactions: 7200 },
    { month: 'Feb', revenue: 268000, transactions: 7800 },
    { month: 'Mar', revenue: 289000, transactions: 8200 },
    { month: 'Apr', revenue: 312000, transactions: 8900 },
    { month: 'May', revenue: 298000, transactions: 8600 },
    { month: 'Jun', revenue: 324000, transactions: 9100 }
  ], [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return COLORS.success
      case 'MEDIUM': return COLORS.warning
      case 'HIGH': return COLORS.danger
      case 'CRITICAL': return COLORS.danger
      default: return COLORS.muted
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return COLORS.success
      case 'DEGRADED': return COLORS.warning
      case 'UNHEALTHY': return COLORS.danger
      default: return COLORS.muted
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Enterprise Dashboard</h1>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Live
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              
              <Button variant="brand" size="sm">
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.users.total.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Active: {metrics?.users.active.toLocaleString()}</span>
                  <Badge variant="success" className="text-xs">
                    +{metrics?.users.growth}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.security.compliance}%</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Risk Score: {metrics?.security.riskScore}</span>
                  <Badge variant="warning" className="text-xs">
                    {metrics?.security.threats} threats
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-info">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.performance.uptime}%</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Response: {metrics?.performance.responseTime}ms</span>
                  <Badge variant="outline" className="text-xs">
                    {metrics?.performance.errorRate}% error rate
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-brand-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(metrics?.business.revenue || 0).toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">{metrics?.business.transactions} transactions</span>
                  <Badge variant="brand" className="text-xs">
                    {metrics?.business.conversionRate}% conv.
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="uptime" 
                      stroke={COLORS.success} 
                      name="Uptime %"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke={COLORS.info} 
                      name="Response Time (ms)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Security Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Security Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={securityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {securityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Business Analytics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={businessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    name="Revenue ($)"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="transactions" 
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary}
                    fillOpacity={0.3}
                    name="Transactions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Services Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <div className="space-y-3">
                    {systemHealth?.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColor(service.status) }}
                          />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{service.uptime}%</span>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: getStatusColor(service.status), color: getStatusColor(service.status) }}
                          >
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Usage */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
                  <div className="space-y-4">
                    {systemHealth?.resources && Object.entries(systemHealth.resources).map(([resource, usage]) => (
                      <div key={resource} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize font-medium">{resource}</span>
                          <span className="text-sm text-muted-foreground">{usage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${usage}%`,
                              backgroundColor: usage > 80 ? COLORS.danger : usage > 60 ? COLORS.warning : COLORS.success
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditTrails.slice(0, 5).map((trail) => (
                    <div key={trail.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div 
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: getSeverityColor(trail.severity) }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{trail.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {trail.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trail.userId} • {trail.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div 
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ backgroundColor: getSeverityColor(alert.severity) }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{alert.title}</span>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: getSeverityColor(alert.severity), color: getSeverityColor(alert.severity) }}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default AdminDashboard
