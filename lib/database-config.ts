import { PrismaClient } from '@prisma/client'
import { createPool, Pool } from 'pg'

// Database configuration interface
interface DatabaseConfig {
  url: string
  directUrl: string
  poolMin?: number
  poolMax?: number
  poolIdleTimeout?: number
  connectionTimeout?: number
  sslMode?: string
  logLevel?: string
  enableQueryLogging?: boolean
}

// Production-ready database configuration
const getDatabaseConfig = (): DatabaseConfig => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    url: process.env.DATABASE_URL!,
    directUrl: process.env.DIRECT_URL!,
    poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2'),
    poolMax: parseInt(
      process.env.DATABASE_POOL_MAX || isProduction ? '20' : '10'
    ),
    poolIdleTimeout: parseInt(
      process.env.DATABASE_POOL_IDLE_TIMEOUT || '30000'
    ),
    connectionTimeout: parseInt(
      process.env.DATABASE_CONNECTION_TIMEOUT || '10000'
    ),
    sslMode:
      process.env.DATABASE_SSL_MODE || (isProduction ? 'require' : 'prefer'),
    logLevel: process.env.DATABASE_LOG_LEVEL || 'warn',
    enableQueryLogging: process.env.DATABASE_ENABLE_QUERY_LOGGING === 'true',
  }
}

// Create PostgreSQL connection pool
export const createConnectionPool = (): Pool => {
  const config = getDatabaseConfig()
  const isProduction = process.env.NODE_ENV === 'production'

  return createPool({
    connectionString: config.directUrl,
    min: config.poolMin,
    max: config.poolMax,
    idleTimeoutMillis: config.poolIdleTimeout,
    connectionTimeoutMillis: config.connectionTimeout,
    ssl: isProduction
      ? {
          rejectUnauthorized: true,
          mode: config.sslMode as any,
        }
      : false,
    // Enable prepared statements for better performance
    statement_timeout: 30000,
    query_timeout: 30000,
    // Connection validation
    allowExitOnIdle: false,
    maxUses: 7500, // Recreate connections after 7500 uses
  })
}

// Enhanced Prisma Client with production optimizations
export const createPrismaClient = (): PrismaClient => {
  const config = getDatabaseConfig()
  const isProduction = process.env.NODE_ENV === 'production'

  return new PrismaClient({
    datasources: {
      db: {
        url: config.url,
      },
    },
    log: config.enableQueryLogging
      ? ['query', 'info', 'warn', 'error']
      : [config.logLevel as any],
    errorFormat: 'pretty',

    // Connection strategy for production
    __internal: {
      engine: {
        // Use connection pooling in production
        connectionLimit: config.poolMax,
        binaryTargets: ['native'],
      },
    },
  })
}

// Singleton instances
let prismaInstance: PrismaClient | null = null
let poolInstance: Pool | null = null

// Get Prisma client instance
export const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient()

    // Graceful shutdown
    if (typeof process !== 'undefined') {
      process.on('beforeExit', async () => {
        await prismaInstance?.$disconnect()
        prismaInstance = null
      })

      process.on('SIGINT', async () => {
        await prismaInstance?.$disconnect()
        prismaInstance = null
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        await prismaInstance?.$disconnect()
        prismaInstance = null
        process.exit(0)
      })
    }
  }

  return prismaInstance
}

// Get connection pool instance
export const getConnectionPool = (): Pool => {
  if (!poolInstance) {
    poolInstance = createConnectionPool()

    // Graceful shutdown
    if (typeof process !== 'undefined') {
      process.on('beforeExit', async () => {
        await poolInstance?.end()
        poolInstance = null
      })

      process.on('SIGINT', async () => {
        await poolInstance?.end()
        poolInstance = null
        process.exit(0)
      })

      process.on('SIGTERM', async () => {
        await poolInstance?.end()
        poolInstance = null
        process.exit(0)
      })
    }
  }

  return poolInstance
}

// Database health check
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}> => {
  const startTime = Date.now()

  try {
    const prisma = getPrismaClient()
    await prisma.$queryRaw`SELECT 1`

    const latency = Date.now() - startTime

    return {
      status: 'healthy',
      latency,
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Connection pool monitoring
export const getPoolStats = () => {
  const pool = getConnectionPool()
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  }
}

// Database transaction helper with retry logic
export const withTransaction = async <T>(
  callback: (tx: PrismaClient) => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  const prisma = getPrismaClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(callback)
    } catch (error) {
      // Retry on deadlock or connection errors
      if (
        attempt < maxRetries &&
        error instanceof Error &&
        (error.message.includes('deadlock') ||
          error.message.includes('connection') ||
          error.message.includes('timeout'))
      ) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }

  throw new Error('Transaction failed after maximum retries')
}

// Export configured instances
export const prisma = getPrismaClient()
export const pool = getConnectionPool()

export type { DatabaseConfig }
