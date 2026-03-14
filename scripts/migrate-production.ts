#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { getPrismaClient } from '../lib/database-config'

interface MigrationConfig {
  environment: 'development' | 'staging' | 'production'
  skipBackup?: boolean
  forceReset?: boolean
  seedAfterMigration?: boolean
}

class ProductionMigrator {
  private prisma: PrismaClient
  private config: MigrationConfig

  constructor(config: MigrationConfig) {
    this.config = config
    this.prisma = getPrismaClient()
  }

  async checkPrerequisites(): Promise<void> {
    console.log('🔍 Checking migration prerequisites...')

    // Check environment variables
    const requiredEnvVars = ['DATABASE_URL', 'DIRECT_URL']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      )
    }

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`)
    }

    // Check if migrations directory exists
    const migrationsDir = join(process.cwd(), 'prisma', 'migrations')
    if (!existsSync(migrationsDir)) {
      console.log('📁 Creating migrations directory...')
      execSync('mkdir -p prisma/migrations', { stdio: 'inherit' })
    }

    console.log('✅ Prerequisites check completed')
  }

  async backupDatabase(): Promise<void> {
    if (this.config.skipBackup) {
      console.log('⏭️  Skipping database backup')
      return
    }

    console.log('💾 Creating database backup...')

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = `backup-${this.config.environment}-${timestamp}.sql`

    try {
      const command = `pg_dump "${process.env.DIRECT_URL}" > "${backupFile}"`
      execSync(command, { stdio: 'inherit' })
      console.log(`✅ Database backup created: ${backupFile}`)
    } catch (error) {
      console.warn('⚠️  Backup failed, continuing with migration...')
    }
  }

  async generateMigration(): Promise<void> {
    console.log('🔄 Generating migration...')

    try {
      execSync(
        'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init.sql',
        {
          stdio: 'inherit',
        }
      )
      console.log('✅ Migration generated successfully')
    } catch (error) {
      console.log('ℹ️  Using existing migration files')
    }
  }

  async applyMigrations(): Promise<void> {
    console.log('🚀 Applying database migrations...')

    try {
      if (this.config.forceReset) {
        console.log('⚠️  Force resetting database...')
        execSync('npx prisma migrate reset --force --skip-seed', {
          stdio: 'inherit',
        })
      } else {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      }

      console.log('✅ Migrations applied successfully')
    } catch (error) {
      throw new Error(`Migration failed: ${error}`)
    }
  }

  async validateMigration(): Promise<void> {
    console.log('🔍 Validating migration...')

    try {
      // Check if all tables exist
      const tables = await this.prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `

      const expectedTables = [
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

      const existingTables = tables.map((t: any) => t.tablename)
      const missingTables = expectedTables.filter(
        table => !existingTables.includes(table)
      )

      if (missingTables.length > 0) {
        throw new Error(
          `Missing tables after migration: ${missingTables.join(', ')}`
        )
      }

      // Test basic operations
      await this.prisma.$queryRaw`SELECT COUNT(*) FROM profiles`

      console.log('✅ Migration validation successful')
    } catch (error) {
      throw new Error(`Migration validation failed: ${error}`)
    }
  }

  async seedDatabase(): Promise<void> {
    if (!this.config.seedAfterMigration) {
      console.log('⏭️  Skipping database seeding')
      return
    }

    console.log('🌱 Seeding database...')

    try {
      execSync('npm run seed:prisma', { stdio: 'inherit' })
      console.log('✅ Database seeded successfully')
    } catch (error) {
      console.warn('⚠️  Database seeding failed, but migration was successful')
    }
  }

  async generateClient(): Promise<void> {
    console.log('🔧 Generating Prisma client...')

    try {
      execSync('npx prisma generate', { stdio: 'inherit' })
      console.log('✅ Prisma client generated successfully')
    } catch (error) {
      throw new Error(`Prisma client generation failed: ${error}`)
    }
  }

  async runMigration(): Promise<void> {
    console.log(`🚀 Starting ${this.config.environment} database migration...`)

    try {
      await this.checkPrerequisites()
      await this.backupDatabase()
      await this.generateMigration()
      await this.applyMigrations()
      await this.validateMigration()
      await this.generateClient()
      await this.seedDatabase()

      console.log(
        `🎉 ${this.config.environment} database migration completed successfully!`
      )
    } catch (error) {
      console.error(`❌ Migration failed: ${error}`)
      throw error
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2) as string[]

  const config: MigrationConfig = {
    environment: (process.env.NODE_ENV as any) || 'development',
    skipBackup: args.includes('--skip-backup'),
    forceReset: args.includes('--force-reset'),
    seedAfterMigration:
      args.includes('--seed') || process.env.NODE_ENV !== 'production',
  }

  // Parse custom environment flag
  const envIndex = args.findIndex((arg: string) => arg.startsWith('--env='))
  if (envIndex !== -1) {
    config.environment = args[envIndex].split('=')[1] as any
  }

  const migrator = new ProductionMigrator(config)

  try {
    await migrator.runMigration()
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

// Export for programmatic use
export { ProductionMigrator, type MigrationConfig }

// Run if called directly
if (require.main === module) {
  main()
}
