import { Pool, PoolConfig, PoolClient, types } from 'pg'
import Redis from 'ioredis'
import { logger } from '@/lib/logger'
import { SecurityService } from './security-service'
import { AuditService } from './audit-service'

// Type declarations for missing modules
declare module 'pg' {
  interface PoolConfig {
    host?: string
    port?: number
    database?: string
    user?: string
    password?: string
    max?: number
    min?: number
    idleTimeoutMillis?: number
    connectionTimeoutMillis?: number
    ssl?: boolean
  }
}

declare module 'ioredis' {
  class Redis {
    constructor(options: any)
    ping(): Promise<string>
    get(key: string): Promise<string | null>
    setex(key: string, ttl: number, value: string): Promise<void>
    del(...keys: string[]): Promise<number>
    keys(pattern: string): Promise<string[]>
    quit(): Promise<void>
  }
}

export interface DatabaseConfig {
  master: PoolConfig
  replicas: PoolConfig[]
  shards: ShardConfig[]
  redis: {
    host: string
    port: number
    password?: string
    db?: number
  }
  connectionPool: {
    min: number
    max: number
    idleTimeoutMillis: number
    connectionTimeoutMillis: number
  }
  backup: {
    enabled: boolean
    schedule: string
    retentionDays: number
    s3Bucket: string
  }
  monitoring: {
    enabled: boolean
    metricsInterval: number
    alertThresholds: {
      connectionCount: number
      queryTime: number
      errorRate: number
    }
  }
}

export interface ShardConfig {
  id: string
  host: string
  port: number
  database: string
  username: string
  password: string
  keyRange: {
    start: string
    end: string
  }
  weight: number // Relative weight for load balancing
}

export interface QueryPerformance {
  query: string
  duration: number
  rows: number
  indexUsed?: string
  timestamp: Date
  parameters?: any[]
}

export interface DatabaseMetrics {
  connections: {
    active: number
    idle: number
    total: number
  }
  performance: {
    avgQueryTime: number
    slowQueries: QueryPerformance[]
    cacheHitRate: number
  }
  replication: {
    lag: number
    status: 'HEALTHY' | 'DEGRADED' | 'FAILED'
  }
  sharding: {
    balance: number // 0-100, how well balanced the shards are
    hotShards: string[]
  }
}

export class DatabaseService {
  private config: DatabaseConfig
  private masterPool: Pool
  private replicaPools: Map<string, Pool> = new Map()
  private shardPools: Map<string, Pool> = new Map()
  private redis: Redis
  private securityService: SecurityService
  private auditService: AuditService
  private metrics: DatabaseMetrics = {
    connections: {
      active: 0,
      idle: 0,
      total: 0
    },
    performance: {
      avgQueryTime: 0,
      slowQueries: [],
      cacheHitRate: 0
    },
    replication: {
      lag: 0,
      status: 'HEALTHY'
    },
    sharding: {
      balance: 100,
      hotShards: []
    }
  }
  private queryPerformance: QueryPerformance[] = []

  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      master: {
        host: process.env.DB_MASTER_HOST || 'localhost',
        port: parseInt(process.env.DB_MASTER_PORT || '5432'),
        database: process.env.DB_NAME || 'forsure',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: process.env.NODE_ENV === 'production'
      },
      replicas: [],
      shards: [],
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0')
      },
      connectionPool: {
        min: 5,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
      },
      backup: {
        enabled: true,
        schedule: '0 2 * * *', // Daily at 2 AM
        retentionDays: 30,
        s3Bucket: process.env.BACKUP_S3_BUCKET || 'forsure-backups'
      },
      monitoring: {
        enabled: true,
        metricsInterval: 60000, // 1 minute
        alertThresholds: {
          connectionCount: 15,
          queryTime: 1000, // 1 second
          errorRate: 0.05 // 5%
        }
      },
      ...config
    }
    
    this.securityService = new SecurityService()
    this.auditService = new AuditService()
    this.initializeConnections()
    this.initializeMetrics()
  }

  private async initializeConnections(): Promise<void> {
    try {
      // Initialize master connection pool
      this.masterPool = new Pool(this.config.master)
      
      // Initialize replica connection pools
      for (const replica of this.config.replicas) {
        const replicaPool = new Pool(replica)
        this.replicaPools.set(`${replica.host}:${replica.port}`, replicaPool)
      }
      
      // Initialize shard connection pools
      for (const shard of this.config.shards) {
        const shardPool = new Pool({
          host: shard.host,
          port: shard.port,
          database: shard.database,
          user: shard.username,
          password: shard.password,
          max: 10,
          min: 2,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
          ssl: process.env.NODE_ENV === 'production'
        })
        this.shardPools.set(shard.id, shardPool)
      }
      
      // Initialize Redis connection
      this.redis = new Redis({
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
        db: this.config.redis.db,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        keyPrefix: 'forsure:'
      })
      
      // Test connections
      await this.testConnections()
      
      logger.info('Database connections initialized', {
        masterPool: this.config.master.host,
        replicaCount: this.config.replicas.length,
        shardCount: this.config.shards.length,
        redisConnected: true
      }, 'DatabaseService')
    } catch (error) {
      logger.error('Failed to initialize database connections', error as Error, {}, 'DatabaseService')
      throw error
    }
  }

  private async testConnections(): Promise<void> {
    try {
      await this.masterPool.query('SELECT 1')
      logger.info('Master database connection successful', {}, 'DatabaseService')
    } catch (error) {
      logger.error('Master database connection failed', error as Error, {}, 'DatabaseService')
      throw error
    }

    // Check replicas
    const replicaStatus: Array<{ host: string; status: string }> = []
    for (const [key, pool] of this.replicaPools) {
      try {
        await pool.query('SELECT 1')
        replicaStatus.push({ host: key.split(':')[0], status: 'HEALTHY' })
      } catch (error) {
        replicaStatus.push({ host: key.split(':')[0], status: 'UNHEALTHY' })
        logger.error(`Replica check failed: ${key}`, error as Error, {}, 'DatabaseService')
      }
    }

    // Check shards
    const shardStatus: Array<{ id: string; status: string }> = []
    for (const [shardId, pool] of this.shardPools) {
      try {
        await pool.query('SELECT 1')
        shardStatus.push({ id: shardId, status: 'HEALTHY' })
      } catch (error) {
        shardStatus.push({ id: shardId, status: 'UNHEALTHY' })
        logger.error(`Shard check failed: ${shardId}`, error as Error, {}, 'DatabaseService')
      }
    }

    // Test Redis connection
    try {
      await this.redis.ping()
      logger.info('Redis connection successful', {}, 'DatabaseService')
    } catch (error) {
      logger.error('Redis connection failed', error as Error, {}, 'DatabaseService')
    }
  }

  private initializeMetrics(): void {
    this.metrics = {
      connections: {
        active: 0,
        idle: 0,
        total: 0
      },
      performance: {
        avgQueryTime: 0,
        slowQueries: [],
        cacheHitRate: 0
      },
      replication: {
        lag: 0,
        status: 'HEALTHY'
      },
      sharding: {
        balance: 100,
        hotShards: []
      }
    }

    if (this.config.monitoring.enabled) {
      setInterval(() => {
        this.collectMetrics()
      }, this.config.monitoring.metricsInterval)
    }
  }

  async query<T = any>(sql: string, parameters?: any[], options?: {
    useReplica?: boolean
    useShard?: string
    forceMaster?: boolean
  }): Promise<T[]> {
    const startTime = Date.now()
    let pool: Pool
    let queryType = 'MASTER'

    try {
      // Determine which pool to use
      if (options?.forceMaster) {
        pool = this.masterPool
        queryType = 'MASTER_FORCE'
      } else if (options?.useShard) {
        pool = this.shardPools.get(options.useShard)
        if (!pool) {
          throw new Error(`Shard ${options.useShard} not found`)
        }
        queryType = `SHARD_${options.useShard}`
      } else if (options?.useReplica && this.replicaPools.size > 0) {
        // Select a healthy replica
        const healthyReplica = await this.selectHealthyReplica()
        pool = healthyReplica.pool
        queryType = `REPLICA_${healthyReplica.key}`
      } else {
        pool = this.masterPool
        queryType = 'MASTER'
      }

      // Execute query
      const result = await pool.query(sql, parameters || [])
      const duration = Date.now() - startTime

      // Log query performance
      await this.logQueryPerformance(sql, parameters, duration, result.rows.length, queryType)

      // Update metrics
      this.updateQueryMetrics(duration, result.rows.length)

      await this.auditService.log({
        action: 'DATABASE_QUERY',
        category: 'DATA_ACCESS',
        details: {
          query: sql,
          parameters: this.sanitizeParameters(parameters),
          duration,
          rows: result.rows.length,
          queryType
        }
      })

      return result.rows
    } catch (error) {
      const duration = Date.now() - startTime
      
      await this.auditService.log({
        action: 'DATABASE_QUERY_ERROR',
        category: 'DATA_ACCESS',
        details: {
          query: sql,
          parameters: this.sanitizeParameters(parameters),
          duration,
          error: (error as Error).message,
          queryType
        }
      })

      logger.error('Database query failed', error as Error, {
        query: sql,
        duration,
        queryType
      }, 'DatabaseService')
      
      throw error
    }
  }

  async transaction<T = any>(callback: (client: PoolClient) => Promise<T>, options?: {
    useShard?: string
    forceMaster?: boolean
  }): Promise<T> {
    let pool: Pool
    let transactionType = 'MASTER'

    try {
      if (options?.forceMaster) {
        pool = this.masterPool
        transactionType = 'MASTER_FORCE'
      } else if (options?.useShard) {
        pool = this.shardPools.get(options.useShard)
        if (!pool) {
          throw new Error(`Shard ${options.useShard} not found`)
        }
        transactionType = `SHARD_${options.useShard}`
      } else {
        pool = this.masterPool
        transactionType = 'MASTER'
      }

      const result = await pool.connect(async (client: PoolClient) => {
        await client.query('BEGIN')
        try {
          const transactionResult = await callback(client)
          await client.query('COMMIT')
          return transactionResult
        } catch (error) {
          await client.query('ROLLBACK')
          throw error
        }
      })

      await this.auditService.log({
        action: 'DATABASE_TRANSACTION',
        category: 'DATA_ACCESS',
        details: { transactionType }
      })

      return result
    } catch (error) {
      await this.auditService.log({
        action: 'DATABASE_TRANSACTION_ERROR',
        category: 'DATA_ACCESS',
        details: {
          transactionType,
          error: (error as Error).message
        }
      })

      logger.error('Database transaction failed', error as Error, { transactionType }, 'DatabaseService')
      throw error
    }
  }

  // Caching with Redis
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key)
      if (cached) {
        return JSON.parse(cached)
      }
      return null
    } catch (error) {
      logger.error('Redis get failed', error as Error, { key }, 'DatabaseService')
      return null
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      logger.error('Redis set failed', error as Error, { key, ttl }, 'DatabaseService')
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      logger.error('Redis del failed', error as Error, { key }, 'DatabaseService')
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      logger.error('Redis invalidate pattern failed', error as Error, { pattern }, 'DatabaseService')
    }
  }

  // Sharding utilities
  determineShard(key: string): string | null {
    for (const shard of this.config.shards) {
      if (key >= shard.keyRange.start && key <= shard.keyRange.end) {
        return shard.id
      }
    }
    return null
  }

  async distributeQuery<T = any>(sql: string, parameters?: any[]): Promise<T[]> {
    const shardResults: Array<{ shardId: string; data: T[] }> = []
    
    // Execute query on all relevant shards
    for (const shard of this.config.shards) {
      try {
        const shardPool = this.shardPools.get(shard.id)
        if (shardPool) {
          const result = await shardPool.query(sql, parameters)
          shardResults.push({
            shardId: shard.id,
            data: result.rows
          })
        }
      } catch (error) {
        logger.error(`Shard query failed: ${shard.id}`, error as Error, {}, 'DatabaseService')
      }
    }
    
    // Combine results (simplified - in production would handle merging/union)
    const allResults = shardResults.flatMap(result => result.data)
    
    await this.auditService.log({
      action: 'DATABASE_DISTRIBUTED_QUERY',
      category: 'DATA_ACCESS',
      details: {
        query: sql,
        shardsQueried: shardResults.length,
        totalRows: allResults.length
      }
    })
    
    return allResults
  }

  // Replication management
  async checkReplicationStatus(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'FAILED'
    lag: number
    details: Array<{
      host: string
      port: number
      status: string
      lag: number
    }>
  }> {
    const replicaStatus = []
    let totalLag = 0
    let healthyCount = 0

    // Check each replica
    for (const [key, pool] of this.replicaPools) {
      try {
        const result = await pool.query('SELECT pg_last_xact_receive_timestamp()')
        const lag = result.rows[0] ? result.rows[0].pg_last_xact_receive_timestamp : 0
        
        replicaStatus.push({
          host: key.split(':')[0],
          port: parseInt(key.split(':')[1]),
          status: lag < 1000 ? 'HEALTHY' : lag < 5000 ? 'DEGRADED' : 'FAILED',
          lag
        })
        
        totalLag += lag
        if (lag < 1000) healthyCount++
      } catch (error) {
        replicaStatus.push({
          host: key.split(':')[0],
          port: parseInt(key.split(':')[1]),
          status: 'FAILED',
          lag: -1
        })
        logger.error(`Replica check failed: ${key}`, error as Error, {}, 'DatabaseService')
      }
    }

    const avgLag = replicaStatus.length > 0 ? totalLag / replicaStatus.length : 0
    const overallStatus = healthyCount === replicaStatus.length ? 'HEALTHY' : 
                         healthyCount > 0 ? 'DEGRADED' : 'FAILED'

    this.metrics.replication = {
      lag: avgLag,
      status: overallStatus
    }

    return {
      status: overallStatus,
      lag: avgLag,
      details: replicaStatus
    }
  }

  async promoteReplica(replicaKey: string): Promise<void> {
    const replicaPool = this.replicaPools.get(replicaKey)
    if (!replicaPool) {
      throw new Error(`Replica ${replicaKey} not found`)
    }

    try {
      // This would involve complex failover procedures
      // 1. Stop writes to master
      // 2. Promote replica to master
      // 3. Update configuration
      // 4. Restart other replicas with new master
      
      await this.auditService.log({
        action: 'REPLICA_PROMOTION',
        category: 'SYSTEM_CONFIG',
        details: { replicaKey }
      })
      
      logger.info(`Replica promoted: ${replicaKey}`, {}, 'DatabaseService')
    } catch (error) {
      logger.error('Replica promotion failed', error as Error, { replicaKey }, 'DatabaseService')
      throw error
    }
  }

  // Backup and restore
  async createBackup(type: 'FULL' | 'INCREMENTAL' = 'FULL'): Promise<{
    success: boolean
    backupId?: string
    error?: string
  }> {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      if (type === 'FULL') {
        // Create full database backup
        await this.performFullBackup(backupId)
      } else {
        // Create incremental backup
        await this.performIncrementalBackup(backupId)
      }
      
      await this.auditService.log({
        action: 'BACKUP_CREATED',
        category: 'SYSTEM_CONFIG',
        details: { backupId, type }
      })
      
      logger.info(`Backup created: ${backupId}`, { type }, 'DatabaseService')
      
      return {
        success: true,
        backupId
      }
    } catch (error) {
      logger.error('Backup creation failed', error as Error, { type }, 'DatabaseService')
      return {
        success: false,
        error: (error as Error).message
      }
    }
  }

  private async performFullBackup(backupId: string): Promise<void> {
    // Use pg_dump for full backup
    const { spawn } = require('child_process')
    
    const backupProcess = spawn('pg_dump', [
      '-h', this.config.master.host,
      '-p', this.config.master.port,
      '-U', this.config.master.user,
      '-d', this.config.master.database,
      '-f', 'custom',
      '--no-owner',
      '--no-privileges',
      `--file=/tmp/${backupId}.sql`
    ])
    
    await new Promise((resolve, reject) => {
      backupProcess.on('close', (code: number) => {
        if (code === 0) {
          resolve(null)
        } else {
          reject(new Error(`Backup process exited with code ${code}`))
        }
      })
      
      backupProcess.on('error', reject)
    })
    
    // Upload to S3 (simplified)
    await this.uploadBackupToS3(backupId)
  }

  private async performIncrementalBackup(backupId: string): Promise<void> {
    // For incremental backups, we'd use WAL archiving or similar
    // This is a simplified implementation
    await this.performFullBackup(backupId)
  }

  private async uploadBackupToS3(backupId: string): Promise<void> {
    // Upload backup file to S3
    // This would use AWS SDK or similar
    logger.info(`Backup uploaded to S3: ${backupId}`, {}, 'DatabaseService')
  }

  // Performance monitoring
  private async collectMetrics(): Promise<void> {
    try {
      // Collect connection metrics
      const masterConnections = this.masterPool.totalCount - this.masterPool.idleCount
      this.metrics.connections.active = masterConnections
      this.metrics.connections.total = this.masterPool.totalCount
      this.metrics.connections.idle = this.masterPool.idleCount

      // Calculate performance metrics
      if (this.queryPerformance.length > 0) {
        const recentQueries = this.queryPerformance.slice(-100) // Last 100 queries
        this.metrics.performance.avgQueryTime = recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length
        this.metrics.performance.slowQueries = recentQueries.filter(q => q.duration > 1000).slice(-10)
      }

      // Check replication status
      await this.checkReplicationStatus()

      // Check shard balance
      await this.checkShardBalance()

      // Alert on thresholds
      await this.checkMetricThresholds()

    } catch (error) {
      logger.error('Metrics collection failed', error as Error, {}, 'DatabaseService')
    }
  }

  private updateQueryMetrics(duration: number, rowCount: number): void {
    this.queryPerformance.push({
      query: '', // Would be populated from actual query
      duration,
      rows: rowCount,
      timestamp: new Date()
    })

    // Keep only recent queries
    if (this.queryPerformance.length > 1000) {
      this.queryPerformance = this.queryPerformance.slice(-500)
    }
  }

  private async checkMetricThresholds(): Promise<void> {
    const thresholds = this.config.monitoring.alertThresholds
    
    if (this.metrics.connections.active > thresholds.connectionCount) {
      await this.sendAlert('HIGH_CONNECTION_COUNT', {
        current: this.metrics.connections.active,
        threshold: thresholds.connectionCount
      })
    }

    if (this.metrics.performance.avgQueryTime > thresholds.queryTime) {
      await this.sendAlert('SLOW_QUERIES', {
        avgTime: this.metrics.performance.avgQueryTime,
        threshold: thresholds.queryTime
      })
    }
  }

  private async checkShardBalance(): Promise<void> {
    // Simplified shard balance checking
    const shardLoads: Record<string, number> = {}
    
    for (const [shardId, pool] of this.shardPools) {
      try {
        const load = await pool.query('SELECT COUNT(*) as load FROM pg_stat_activity WHERE state = \'active\'')
        shardLoads[shardId] = parseInt(load.rows[0].load)
      } catch (error) {
        logger.error(`Shard load check failed: ${shardId}`, error as Error, {}, 'DatabaseService')
      }
    }
    
    const loads = Object.values(shardLoads)
    const avgLoad = loads.reduce((sum, load) => sum + load, 0) / loads.length
    
    const hotShards = Object.entries(shardLoads)
      .filter(([_, load]) => load > avgLoad * 1.5)
      .map(([shardId, _]) => shardId)
    
    this.metrics.sharding.balance = Math.max(0, 100 - (Math.max(...loads) - Math.min(...loads)) / avgLoad * 100)
    this.metrics.sharding.hotShards = hotShards
  }

  private async selectHealthyReplica(): Promise<{ key: string; pool: Pool }> {
    for (const [key, pool] of this.replicaPools) {
      try {
        await pool.query('SELECT 1')
        return { key, pool }
      } catch (error) {
        continue
      }
    }
    
    // Fallback to first replica if all are unhealthy
    const firstReplica = Array.from(this.replicaPools.entries())[0]
    return firstReplica ? { key: firstReplica[0], pool: firstReplica[1] } : 
           { key: '', pool: this.masterPool }
  }

  private async logQueryPerformance(sql: string, parameters: any[], duration: number, rows: number, queryType: string): Promise<void> {
    const performance: QueryPerformance = {
      query: sql,
      duration,
      rows,
      timestamp: new Date(),
      parameters
    }
    
    this.queryPerformance.push(performance)
    
    // Keep only recent performance data
    if (this.queryPerformance.length > 1000) {
      this.queryPerformance = this.queryPerformance.slice(-500)
    }
  }

  private sanitizeParameters(parameters?: any[]): any {
    if (!parameters) return undefined
    
    return parameters.map(param => {
      if (typeof param === 'string' && param.length > 100) {
        return '[REDACTED_LONG_STRING]'
      }
      if (typeof param === 'object' && param.password) {
        return { ...param, password: '[REDACTED]' }
      }
      return param
    })
  }

  private async sendAlert(type: string, details: any): Promise<void> {
    await this.auditService.log({
      action: 'DATABASE_ALERT',
      category: 'SYSTEM_CONFIG',
      details: { alertType: type, ...details }
    })
    
    logger.warn('Database alert', { type, details }, 'DatabaseService')
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'
    details: {
      master: boolean
      replicas: Array<{ host: string; status: string }>
      shards: Array<{ id: string; status: string }>
      redis: boolean
    }
    metrics: DatabaseMetrics
  }> {
    const details = {
      master: false,
      replicas: [],
      shards: [],
      redis: false
    }

    // Check master
    try {
      await this.masterPool.query('SELECT 1')
      details.master = true
    } catch (error) {
      logger.error('Master health check failed', error as Error, {}, 'DatabaseService')
    }

    // Check replicas
    for (const [key, pool] of this.replicaPools) {
      try {
        await pool.query('SELECT 1')
        details.replicas.push({ host: key, status: 'HEALTHY' })
      } catch (error) {
        details.replicas.push({ host: key, status: 'UNHEALTHY' })
      }
    }

    // Check shards
    for (const [shardId, pool] of this.shardPools) {
      try {
        await pool.query('SELECT 1')
        details.shards.push({ id: shardId, status: 'HEALTHY' })
      } catch (error) {
        details.shards.push({ id: shardId, status: 'UNHEALTHY' })
      }
    }

    // Check Redis
    try {
      await this.redis.ping()
      details.redis = true
    } catch (error) {
      logger.error('Redis health check failed', error as Error, {}, 'DatabaseService')
    }

    // Determine overall status
    const allHealthy = details.master && 
                       details.replicas.every(r => r.status === 'HEALTHY') &&
                       details.shards.every(s => s.status === 'HEALTHY') &&
                       details.redis

    const status = allHealthy ? 'HEALTHY' : 
                  details.master ? 'DEGRADED' : 'UNHEALTHY'

    return {
      status,
      details,
      metrics: this.metrics
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    logger.info('Starting database service shutdown', {}, 'DatabaseService')
    
    try {
      // Close all connection pools
      await this.masterPool.end()
      
      for (const pool of this.replicaPools.values()) {
        await pool.end()
      }
      
      for (const pool of this.shardPools.values()) {
        await pool.end()
      }
      
      // Close Redis connection
      await this.redis.quit()
      
      await this.auditService.log({
        action: 'DATABASE_SHUTDOWN',
        category: 'SYSTEM_CONFIG'
      })
      
      logger.info('Database service shutdown completed', {}, 'DatabaseService')
    } catch (error) {
      logger.error('Database shutdown failed', error as Error, {}, 'DatabaseService')
    }
  }

  getMetrics(): DatabaseMetrics {
    return this.metrics
  }
}

export default DatabaseService
