#!/usr/bin/env tsx

import {
  getPrismaClient,
  checkDatabaseHealth,
  getPoolStats,
} from '../lib/database-config'

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  database: {
    connection: {
      status: 'connected' | 'disconnected'
      latency?: number
      error?: string
    }
    pool: {
      total: number
      idle: number
      waiting: number
    }
    tables: {
      count: number
      expected: number
      missing: string[]
    }
  }
  recommendations: string[]
}

class DatabaseHealthChecker {
  private expectedTables = [
    'profiles',
    'projects',
    'project_members',
    'tasks',
    'teams',
    'team_members',
    'blog_posts',
    'templates',
    'file_uploads',
    'notifications',
    'components',
    'audit_logs',
  ]

  async checkTables(): Promise<{ count: number; missing: string[] }> {
    const prisma = getPrismaClient()

    try {
      const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `

      const existingTables = result.map((row: any) => row.tablename)
      const missingTables = this.expectedTables.filter(
        table => !existingTables.includes(table)
      )

      return {
        count: existingTables.length,
        missing: missingTables,
      }
    } catch (error) {
      throw new Error(`Failed to check tables: ${error}`)
    }
  }

  async getRecommendations(
    healthResult: Partial<HealthCheckResult>
  ): Promise<string[]> {
    const recommendations: string[] = []

    // Database connection recommendations
    if (healthResult.database?.connection?.status === 'disconnected') {
      recommendations.push(
        'Database connection failed - check DATABASE_URL and DIRECT_URL environment variables'
      )
      recommendations.push('Verify database server is running and accessible')
    }

    if (
      healthResult.database?.connection?.latency &&
      healthResult.database.connection.latency > 1000
    ) {
      recommendations.push(
        'High database latency detected - consider optimizing queries or increasing connection pool size'
      )
    }

    // Connection pool recommendations
    if (healthResult.database?.pool) {
      const { total, idle, waiting } = healthResult.database.pool

      if (waiting > 0) {
        recommendations.push(
          'Connection pool exhausted - consider increasing DATABASE_POOL_MAX'
        )
      }

      if (idle === 0 && total > 0) {
        recommendations.push(
          'No idle connections - consider increasing DATABASE_POOL_MIN'
        )
      }
    }

    // Table recommendations
    if (
      healthResult.database?.tables?.missing &&
      healthResult.database.tables.missing.length > 0
    ) {
      recommendations.push(
        `Missing tables detected: ${healthResult.database.tables.missing.join(', ')}`
      )
      recommendations.push('Run database migration: npm run db:migrate')
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Database is healthy - no action needed')
    }

    return recommendations
  }

  async runHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString()

    console.log('🔍 Running database health check...')

    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp,
      database: {
        connection: {
          status: 'connected',
        },
        pool: {
          total: 0,
          idle: 0,
          waiting: 0,
        },
        tables: {
          count: 0,
          expected: this.expectedTables.length,
          missing: [],
        },
      },
      recommendations: [],
    }

    try {
      // Check database connection
      const dbHealth = await checkDatabaseHealth()
      result.database.connection = {
        status: dbHealth.status === 'healthy' ? 'connected' : 'disconnected',
        latency: dbHealth.latency,
        error: dbHealth.error,
      }

      if (dbHealth.status === 'unhealthy') {
        result.status = 'unhealthy'
      }

      // Get connection pool stats
      try {
        const poolStats = getPoolStats()
        result.database.pool = {
          total: poolStats.totalCount,
          idle: poolStats.idleCount,
          waiting: poolStats.waitingCount,
        }
      } catch (error) {
        console.warn('Could not get pool stats:', error)
      }

      // Check tables
      try {
        const tableCheck = await this.checkTables()
        result.database.tables = {
          count: tableCheck.count,
          expected: this.expectedTables.length,
          missing: tableCheck.missing,
        }

        if (tableCheck.missing.length > 0) {
          result.status = 'unhealthy'
        }
      } catch (error) {
        console.warn('Could not check tables:', error)
        result.status = 'unhealthy'
      }

      // Generate recommendations
      result.recommendations = await this.getRecommendations(result)
    } catch (error) {
      result.status = 'unhealthy'
      result.database.connection.status = 'disconnected'
      result.database.connection.error =
        error instanceof Error ? error.message : 'Unknown error'
      result.recommendations.push(
        'Database health check failed - check configuration and connectivity'
      )
    }

    return result
  }

  printResults(result: HealthCheckResult): void {
    console.log('\n📊 Database Health Check Results')
    console.log('================================')
    console.log(
      `Status: ${result.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}`
    )
    console.log(`Timestamp: ${result.timestamp}`)

    console.log('\n🔗 Connection:')
    console.log(`  Status: ${result.database.connection.status}`)
    if (result.database.connection.latency) {
      console.log(`  Latency: ${result.database.connection.latency}ms`)
    }
    if (result.database.connection.error) {
      console.log(`  Error: ${result.database.connection.error}`)
    }

    console.log('\n🏊 Connection Pool:')
    console.log(`  Total: ${result.database.pool.total}`)
    console.log(`  Idle: ${result.database.pool.idle}`)
    console.log(`  Waiting: ${result.database.pool.waiting}`)

    console.log('\n📋 Tables:')
    console.log(
      `  Found: ${result.database.tables.count}/${result.database.tables.expected}`
    )
    if (result.database.tables.missing.length > 0) {
      console.log(`  Missing: ${result.database.tables.missing.join(', ')}`)
    }

    console.log('\n💡 Recommendations:')
    result.recommendations.forEach(rec => {
      console.log(`  • ${rec}`)
    })

    console.log('\n' + '='.repeat(50))
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const quiet = args.includes('--quiet')

  const checker = new DatabaseHealthChecker()

  try {
    const result = await checker.runHealthCheck()

    if (json) {
      console.log(JSON.stringify(result, null, 2))
    } else if (!quiet) {
      checker.printResults(result)
    }

    // Exit with appropriate code
    process.exit(result.status === 'healthy' ? 0 : 1)
  } catch (error) {
    console.error('Health check failed:', error)
    process.exit(1)
  }
}

// Export for programmatic use
export { DatabaseHealthChecker, type HealthCheckResult }

// Run if called directly
if (require.main === module) {
  main()
}
