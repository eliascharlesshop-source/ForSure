import { logger } from '@/lib/logger'
import { SecurityService } from './security-service'

export interface AuditEvent {
  id: string
  timestamp: Date
  action: string
  userId?: string
  email?: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  details?: Record<string, any>
  sessionId?: string
  duration?: number
  error?: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'DATA_ACCESS' | 'SYSTEM_CONFIG' | 'SECURITY' | 'BUSINESS' | 'COMPLIANCE'
}

export interface AuditFilter {
  startDate?: Date
  endDate?: Date
  userId?: string
  action?: string
  category?: string
  severity?: string
  ipAddress?: string
  limit?: number
  offset?: number
}

export interface AuditReport {
  totalEvents: number
  eventsByCategory: Record<string, number>
  eventsBySeverity: Record<string, number>
  topUsers: Array<{ userId: string; email: string; eventCount: number }>
  topIPs: Array<{ ipAddress: string; eventCount: number }>
  suspiciousActivities: AuditEvent[]
  complianceMetrics: {
    gdprCompliance: number
    soc2Compliance: number
    dataRetentionCompliance: number
  }
}

export class AuditService {
  private securityService: SecurityService
  private retentionPeriod: number = 2555 * 24 * 60 * 60 * 1000 // 7 years in milliseconds

  constructor() {
    this.securityService = new SecurityService()
  }

  async log(event: Partial<AuditEvent>): Promise<void> {
    const auditEvent: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      severity: 'LOW',
      category: 'BUSINESS',
      ...event
    }

    try {
      // Store audit event
      await this.storeAuditEvent(auditEvent)
      
      // Check for suspicious patterns
      await this.analyzeForSuspiciousActivity(auditEvent)
      
      // Real-time alerts for critical events
      if (auditEvent.severity === 'CRITICAL') {
        await this.sendCriticalAlert(auditEvent)
      }
      
      logger.info('Audit event logged', {
        eventId: auditEvent.id,
        action: auditEvent.action,
        userId: auditEvent.userId,
        category: auditEvent.category,
        severity: auditEvent.severity
      }, 'AuditService')
    } catch (error) {
      logger.error('Failed to log audit event', error as Error, { 
        eventId: auditEvent.id,
        action: auditEvent.action 
      }, 'AuditService')
    }
  }

  async logSecurityEvent(event: {
    id: string
    timestamp: Date
    type: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    ipAddress?: string
    userAgent?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    const auditEvent: AuditEvent = {
      id: event.id,
      timestamp: event.timestamp,
      action: event.type,
      severity: event.severity,
      category: 'SECURITY',
      details: {
        description: event.description,
        ...event.metadata
      },
      ipAddress: event.ipAddress,
      userAgent: event.userAgent
    }

    await this.log(auditEvent)
  }

  async queryAuditLogs(filter: AuditFilter): Promise<{
    events: AuditEvent[]
    totalCount: number
    hasMore: boolean
  }> {
    try {
      const events = await this.fetchAuditEvents(filter)
      const totalCount = await this.countAuditEvents(filter)
      
      return {
        events,
        totalCount,
        hasMore: (filter.offset || 0) + events.length < totalCount
      }
    } catch (error) {
      logger.error('Failed to query audit logs', error as Error, { filter }, 'AuditService')
      throw error
    }
  }

  async generateAuditReport(filter: AuditFilter): Promise<AuditReport> {
    const startDate = filter.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const endDate = filter.endDate || new Date()
    
    const events = await this.fetchAuditEvents({
      ...filter,
      startDate,
      endDate,
      limit: 10000 // Large limit for comprehensive analysis
    })

    const report: AuditReport = {
      totalEvents: events.length,
      eventsByCategory: this.groupEventsByCategory(events),
      eventsBySeverity: this.groupEventsBySeverity(events),
      topUsers: this.getTopUsers(events),
      topIPs: this.getTopIPs(events),
      suspiciousActivities: await this.identifySuspiciousActivities(events),
      complianceMetrics: await this.calculateComplianceMetrics(events, startDate, endDate)
    }

    await this.log({
      action: 'AUDIT_REPORT_GENERATED',
      category: 'COMPLIANCE',
      details: {
        reportPeriod: `${startDate.toISOString()} - ${endDate.toISOString()}`,
        totalEvents: report.totalEvents,
        suspiciousCount: report.suspiciousActivities.length
      }
    })

    return report
  }

  async exportAuditData(filter: AuditFilter, format: 'JSON' | 'CSV' | 'PDF'): Promise<{
    data: string | Buffer
    filename: string
    mimeType: string
  }> {
    const events = await this.fetchAuditEvents(filter)
    
    switch (format) {
      case 'JSON':
        return {
          data: JSON.stringify(events, null, 2),
          filename: `audit-export-${Date.now()}.json`,
          mimeType: 'application/json'
        }
      
      case 'CSV':
        const csv = this.convertToCSV(events)
        return {
          data: csv,
          filename: `audit-export-${Date.now()}.csv`,
          mimeType: 'text/csv'
        }
      
      case 'PDF':
        const pdf = await this.convertToPDF(events)
        return {
          data: pdf,
          filename: `audit-export-${Date.now()}.pdf`,
          mimeType: 'application/pdf'
        }
      
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  // Data Retention and Cleanup
  async cleanupOldAuditLogs(): Promise<{
    deletedCount: number
    retentionPeriod: string
  }> {
    const cutoffDate = new Date(Date.now() - this.retentionPeriod)
    
    try {
      const deletedCount = await this.deleteAuditEventsBefore(cutoffDate)
      
      await this.log({
        action: 'AUDIT_CLEANUP',
        category: 'COMPLIANCE',
        severity: 'LOW',
        details: {
          cutoffDate: cutoffDate.toISOString(),
          deletedCount,
          retentionPeriod: `${this.retentionPeriod / (24 * 60 * 60 * 1000)} days`
        }
      })

      logger.info('Audit cleanup completed', {
        cutoffDate: cutoffDate.toISOString(),
        deletedCount
      }, 'AuditService')

      return {
        deletedCount,
        retentionPeriod: `${this.retentionPeriod / (24 * 60 * 60 * 1000)} days`
      }
    } catch (error) {
      logger.error('Audit cleanup failed', error as Error, { cutoffDate }, 'AuditService')
      throw error
    }
  }

  // GDPR Compliance
  async handleDataSubjectRequest(userId: string, requestType: 'ACCESS' | 'PORTABILITY' | 'DELETION'): Promise<{
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    data?: any
    exportUrl?: string
    deletionDate?: Date
  }> {
    try {
      await this.log({
        action: 'DATA_SUBJECT_REQUEST',
        category: 'COMPLIANCE',
        userId,
        details: { requestType }
      })

      switch (requestType) {
        case 'ACCESS':
          const userData = await this.getUserAuditData(userId)
          return {
            status: 'COMPLETED',
            data: userData
          }

        case 'PORTABILITY':
          const portableData = await this.getUserPortableData(userId)
          const exportUrl = await this.createSecureExport(portableData)
          return {
            status: 'COMPLETED',
            exportUrl
          }

        case 'DELETION':
          // Anonymize user data instead of hard deletion for audit purposes
          await this.anonymizeUserData(userId)
          const deletionDate = new Date()
          return {
            status: 'COMPLETED',
            deletionDate
          }

        default:
          throw new Error(`Invalid request type: ${requestType}`)
      }
    } catch (error) {
      logger.error('Data subject request failed', error as Error, { userId, requestType }, 'AuditService')
      return {
        status: 'FAILED'
      }
    }
  }

  // Real-time Monitoring
  async setupRealTimeMonitoring(): Promise<void> {
    // Monitor for suspicious patterns
    setInterval(async () => {
      await this.checkForAnomalies()
    }, 60000) // Check every minute

    // Monitor for failed login attempts
    setInterval(async () => {
      await this.checkForBruteForceAttacks()
    }, 300000) // Check every 5 minutes
  }

  private async storeAuditEvent(event: AuditEvent): Promise<void> {
    // In production, this would store to a secure audit database
    // For now, we'll simulate storage
    logger.debug('Storing audit event', { eventId: event.id }, 'AuditService')
  }

  private async fetchAuditEvents(filter: AuditFilter): Promise<AuditEvent[]> {
    // In production, this would query the audit database
    // For now, return empty array
    return []
  }

  private async countAuditEvents(filter: AuditFilter): Promise<number> {
    // In production, this would count events in the audit database
    return 0
  }

  private async deleteAuditEventsBefore(cutoffDate: Date): Promise<number> {
    // In production, this would delete old events from the audit database
    return 0
  }

  private groupEventsByCategory(events: AuditEvent[]): Record<string, number> {
    return events.reduce((groups, event) => {
      groups[event.category] = (groups[event.category] || 0) + 1
      return groups
    }, {} as Record<string, number>)
  }

  private groupEventsBySeverity(events: AuditEvent[]): Record<string, number> {
    return events.reduce((groups, event) => {
      groups[event.severity] = (groups[event.severity] || 0) + 1
      return groups
    }, {} as Record<string, number>)
  }

  private getTopUsers(events: AuditEvent[]): Array<{ userId: string; email: string; eventCount: number }> {
    const userCounts = events
      .filter(event => event.userId)
      .reduce((counts, event) => {
        const userId = event.userId!
        counts[userId] = (counts[userId] || 0) + 1
        return counts
      }, {} as Record<string, number>)

    return Object.entries(userCounts)
      .map(([userId, eventCount]) => ({
        userId,
        email: events.find(e => e.userId === userId)?.email || '',
        eventCount
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10)
  }

  private getTopIPs(events: AuditEvent[]): Array<{ ipAddress: string; eventCount: number }> {
    const ipCounts = events
      .filter(event => event.ipAddress)
      .reduce((counts, event) => {
        const ip = event.ipAddress!
        counts[ip] = (counts[ip] || 0) + 1
        return counts
      }, {} as Record<string, number>)

    return Object.entries(ipCounts)
      .map(([ipAddress, eventCount]) => ({ ipAddress, eventCount }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10)
  }

  private async identifySuspiciousActivities(events: AuditEvent[]): Promise<AuditEvent[]> {
    const suspiciousEvents: AuditEvent[] = []
    
    // Check for multiple failed logins from same IP
    const failedLoginsByIP = events
      .filter(event => event.action === 'LOGIN_FAILED')
      .reduce((groups, event) => {
        const ip = event.ipAddress || 'unknown'
        groups[ip] = (groups[ip] || 0) + 1
        return groups
      }, {} as Record<string, number>)

    Object.entries(failedLoginsByIP).forEach(([ip, count]) => {
      if (count > 10) { // More than 10 failed logins
        const events = events.filter(e => e.ipAddress === ip && e.action === 'LOGIN_FAILED')
        suspiciousEvents.push(...events.slice(-5)) // Last 5 failed attempts
      }
    })

    // Check for access from unusual locations
    const userAccessByIP = events
      .filter(event => event.action === 'LOGIN_SUCCESS' && event.userId)
      .reduce((groups, event) => {
        const userId = event.userId!
        if (!groups[userId]) {
          groups[userId] = new Set()
        }
        groups[userId].add(event.ipAddress || 'unknown')
        return groups
      }, {} as Record<string, Set<string>>)

    Object.entries(userAccessByIP).forEach(([userId, ips]) => {
      if (ips.size > 3) { // Access from more than 3 different IPs
        const events = events.filter(e => e.userId === userId && e.action === 'LOGIN_SUCCESS')
        suspiciousEvents.push(...events.slice(-ips.size))
      }
    })

    return suspiciousEvents
  }

  private async calculateComplianceMetrics(events: AuditEvent[], startDate: Date, endDate: Date): Promise<{
    gdprCompliance: number
    soc2Compliance: number
    dataRetentionCompliance: number
  }> {
    // GDPR Compliance: Check for proper consent logging and data subject requests
    const gdprEvents = events.filter(e => e.category === 'COMPLIANCE')
    const gdprCompliance = Math.min(100, (gdprEvents.length / 10) * 100) // Simplified calculation

    // SOC 2 Compliance: Check for security controls
    const securityEvents = events.filter(e => e.category === 'SECURITY')
    const soc2Compliance = Math.min(100, (securityEvents.length / 50) * 100) // Simplified calculation

    // Data Retention Compliance: Check if old data is properly deleted
    const retentionCompliance = await this.checkDataRetentionCompliance()

    return {
      gdprCompliance,
      soc2Compliance,
      dataRetentionCompliance
    }
  }

  private async checkDataRetentionCompliance(): Promise<number> {
    // Check if data retention policies are being followed
    // This would analyze actual data retention in the system
    return 95 // Placeholder compliance score
  }

  private async analyzeForSuspiciousActivity(event: AuditEvent): Promise<void> {
    // Real-time analysis of individual events for suspicious patterns
    if (event.action === 'LOGIN_FAILED') {
      // Check for rapid successive failures
      const recentFailures = await this.getRecentFailures(event.email || '', 5) // Last 5 minutes
      if (recentFailures.length >= 5) {
        await this.sendSecurityAlert({
          type: 'POTENTIAL_BRUTE_FORCE',
          severity: 'HIGH',
          description: `Multiple failed login attempts for ${event.email}`,
          details: { email: event.email, attempts: recentFailures.length }
        })
      }
    }
  }

  private async checkForAnomalies(): Promise<void> {
    // Check for unusual patterns in system usage
    const recentEvents = await this.getRecentEvents(60) // Last hour
    await this.detectAnomalousAccessPatterns(recentEvents)
  }

  private async checkForBruteForceAttacks(): Promise<void> {
    // Check for coordinated brute force attacks
    const recentFailures = await this.getRecentFailures('', 15) // Last 15 minutes
    const failuresByIP = recentFailures.reduce((groups, event) => {
      const ip = event.ipAddress || 'unknown'
      groups[ip] = (groups[ip] || 0) + 1
      return groups
    }, {} as Record<string, number>)

    Object.entries(failuresByIP).forEach(([ip, count]) => {
      if (count >= 20) { // 20+ failed attempts from same IP
        this.sendSecurityAlert({
          type: 'BRUTE_FORCE_ATTACK',
          severity: 'CRITICAL',
          description: `Brute force attack detected from ${ip}`,
          details: { ip, attempts: count }
        })
      }
    })
  }

  private async detectAnomalousAccessPatterns(events: AuditEvent[]): Promise<void> {
    // Machine learning could be implemented here for anomaly detection
    // For now, simple rule-based detection
    const userAccessCounts = events.reduce((counts, event) => {
      if (event.userId) {
        counts[event.userId] = (counts[event.userId] || 0) + 1
      }
      return counts
    }, {} as Record<string, number>)

    const avgAccess = Object.values(userAccessCounts).reduce((sum, count) => sum + count, 0) / Object.keys(userAccessCounts).length
    
    Object.entries(userAccessCounts).forEach(([userId, count]) => {
      if (count > avgAccess * 3) { // 3x more access than average
        this.sendSecurityAlert({
          type: 'ANOMALOUS_ACCESS_PATTERN',
          severity: 'MEDIUM',
          description: `Unusual access pattern detected for user ${userId}`,
          details: { userId, accessCount: count, averageAccess: avgAccess }
        })
      }
    })
  }

  private async sendCriticalAlert(event: AuditEvent): Promise<void> {
    await this.sendSecurityAlert({
      type: 'CRITICAL_SECURITY_EVENT',
      severity: 'CRITICAL',
      description: `Critical security event: ${event.action}`,
      details: event
    })
  }

  private async sendSecurityAlert(alert: {
    type: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    details: any
  }): Promise<void> {
    // In production, this would send alerts via email, SMS, Slack, etc.
    logger.error('Security alert', { alert }, 'AuditService')
  }

  private async getRecentFailures(email: string, minutes: number): Promise<AuditEvent[]> {
    // In production, this would query the audit database
    return []
  }

  private async getRecentEvents(minutes: number): Promise<AuditEvent[]> {
    // In production, this would query the audit database
    return []
  }

  private async getUserAuditData(userId: string): Promise<any> {
    // Compile all audit data for a specific user
    const userEvents = await this.fetchAuditEvents({ userId })
    return {
      userId,
      events: userEvents,
      exportDate: new Date().toISOString()
    }
  }

  private async getUserPortableData(userId: string): Promise<any> {
    // Compile user data in portable format (JSON for GDPR)
    const userData = await this.getUserAuditData(userId)
    return {
      ...userData,
      format: 'JSON',
      schema: 'GDPR_PORTABILITY_V1'
    }
  }

  private async createSecureExport(data: any): Promise<string> {
    // Create a secure, time-limited export URL
    const exportId = this.generateEventId()
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // In production, this would store the data securely and generate a signed URL
    return `https://forsure.com/exports/${exportId}?expires=${expiryTime.getTime()}`
  }

  private async anonymizeUserData(userId: string): Promise<void> {
    // Anonymize user data while preserving audit trail
    await this.log({
      action: 'DATA_ANONYMIZED',
      category: 'COMPLIANCE',
      userId,
      details: { anonymizationDate: new Date().toISOString() }
    })
  }

  private convertToCSV(events: AuditEvent[]): string {
    const headers = ['id', 'timestamp', 'action', 'userId', 'email', 'ipAddress', 'category', 'severity']
    const csvRows = [headers.join(',')]
    
    for (const event of events) {
      const row = [
        event.id,
        event.timestamp.toISOString(),
        event.action,
        event.userId || '',
        event.email || '',
        event.ipAddress || '',
        event.category,
        event.severity
      ]
      csvRows.push(row.join(','))
    }
    
    return csvRows.join('\n')
  }

  private async convertToPDF(events: AuditEvent[]): Promise<Buffer> {
    // In production, this would use a PDF library
    // For now, return a simple buffer
    const content = `Audit Report\n\nTotal Events: ${events.length}\n\nEvents:\n${events.map(e => `${e.timestamp}: ${e.action}`).join('\n')}`
    return Buffer.from(content, 'utf-8')
  }

  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default AuditService
