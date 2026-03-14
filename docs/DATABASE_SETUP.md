# Database Setup Guide

This guide covers the complete database setup for the ForSure application, including configuration, migrations, backups, and monitoring.

## Overview

The ForSure application uses PostgreSQL as the primary database with Prisma as the ORM. The database schema includes comprehensive models for user management, projects, tasks, teams, blog posts, templates, and more.

## Prerequisites

- PostgreSQL 14+ (for local development)
- Node.js 18+
- Prisma CLI
- AWS CLI (for S3 backups, optional)

## Environment Configuration

### Required Environment Variables

Copy `.env.example` to `.env.local` and configure the following:

```bash
# Database URLs
DATABASE_URL="postgresql://username:password@localhost:5432/forsure_db?connection_limit=20&pool_timeout=20"
DIRECT_URL="postgresql://username:password@localhost:5432/forsure_db"

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_POOL_IDLE_TIMEOUT=30000
DATABASE_CONNECTION_TIMEOUT=10000

# SSL Configuration (Production)
DATABASE_SSL_MODE="require"
```

## Database Schema

### Core Models

- **profiles**: User accounts and authentication
- **projects**: Project management and tracking
- **project_members**: Project collaboration
- **tasks**: Task management within projects
- **teams**: Team organization
- **team_members**: Team membership
- **blog_posts**: Content management
- **templates**: Reusable code templates
- **file_uploads**: File management
- **notifications**: User notifications
- **components**: UI component library
- **audit_logs**: Activity tracking

### Key Relationships

- Users can own multiple projects and teams
- Projects can have multiple members and tasks
- Teams can have multiple members
- All entities support audit logging

## Setup Commands

### Initial Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm db:migrate

# Seed database (development only)
pnpm seed:prisma
```

### Production Deployment

```bash
# Production migration with backup
./scripts/migrate.sh --env=production

# Production seeding (admin user only)
tsx scripts/seed-production.ts --env=production --create-admin

# Create backup
./scripts/backup-db.sh --s3-bucket=your-backup-bucket
```

## Database Operations

### Migrations

```bash
# Development migration
pnpm db:migrate

# Production migration
pnpm db:migrate:prod

# Push schema changes (development)
pnpm db:push

# Pull schema from database
pnpm db:pull
```

### Seeding

```bash
# Development seeding with sample data
pnpm seed:prisma

# Production seeding (admin only)
pnpm seed:prod --create-admin

# Custom seeding with options
tsx scripts/seed-production.ts --env=staging --create-admin --sample-data
```

### Health Checks

```bash
# Basic health check
pnpm db:health

# Health check as JSON
pnpm db:health:json

# Check connection pool status
curl http://localhost:3000/api/health/db
```

### Backups

```bash
# Quick backup
pnpm db:backup

# Production backup with S3 upload
pnpm db:backup:prod

# Custom backup configuration
./scripts/backup-db.sh --retention=60 --s3-bucket=my-bucket
```

## Connection Pool Configuration

### Development

```bash
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_POOL_IDLE_TIMEOUT=30000
```

### Production

```bash
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50
DATABASE_POOL_IDLE_TIMEOUT=60000
DATABASE_CONNECTION_TIMEOUT=10000
```

## Backup Strategy

### Automated Backups

Set up cron jobs for automated backups:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh

# Weekly full backup with S3 upload
0 3 * * 0 /path/to/scripts/backup-db.sh --s3-bucket=prod-backups
```

### Retention Policy

- **Local backups**: 30 days
- **S3 Standard**: 30 days
- **S3 Infrequent Access**: 90 days
- **S3 Glacier**: 365 days

## Monitoring

### Health Metrics

Monitor these key metrics:

- Connection pool utilization
- Query latency
- Error rates
- Table sizes
- Index performance

### Alerts

Set up monitoring for:

- Database connection failures
- High query latency (>1000ms)
- Pool exhaustion
- Backup failures

## Security

### SSL Configuration

```bash
# Production SSL
DATABASE_SSL_MODE="require"
DATABASE_SSL_CERT_PATH="/path/to/cert.pem"
DATABASE_SSL_KEY_PATH="/path/to/key.pem"
DATABASE_SSL_CA_PATH="/path/to/ca.pem"
```

### Access Control

- Use read-only replicas for reporting
- Implement connection timeouts
- Monitor query patterns
- Regular security updates

## Performance Optimization

### Indexing

Key indexes are automatically created:

- Primary keys on all tables
- Foreign key relationships
- Frequently queried columns (email, slugs, status)

### Query Optimization

- Use connection pooling
- Implement query timeouts
- Monitor slow queries
- Regular vacuuming

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check PostgreSQL service status
   - Verify connection strings
   - Check firewall settings

2. **Migration Failures**
   - Verify database permissions
   - Check for locked tables
   - Review migration files

3. **Performance Issues**
   - Check connection pool settings
   - Analyze slow queries
   - Review index usage

### Recovery Procedures

```bash
# Restore from backup
pg_restore -d forsure_db backup_20231201_020000.sql

# Emergency reset
pnpm prisma migrate reset --force

# Check database integrity
pnpm db:health
```

## Production Checklist

### Pre-deployment

- [ ] Backup current database
- [ ] Test migrations in staging
- [ ] Verify connection pool settings
- [ ] Check SSL configuration
- [ ] Test backup procedures

### Post-deployment

- [ ] Verify all tables created
- [ ] Test basic CRUD operations
- [ ] Check connection pool health
- [ ] Monitor query performance
- [ ] Verify backup automation

## Maintenance

### Regular Tasks

- **Daily**: Health checks, log review
- **Weekly**: Performance analysis, backup verification
- **Monthly**: Index optimization, vacuuming
- **Quarterly**: Security audit, capacity planning

### Cleanup

```bash
# Clean old local backups
find ./backups -name "backup_*.sql*" -mtime +30 -delete

# Clean Prisma migration history
rm -rf prisma/migrations/old_migrations
```

## API Integration

### Database Health Endpoint

```typescript
// GET /api/health/db
{
  "status": "healthy",
  "database": {
    "connection": { "status": "connected", "latency": 45 },
    "pool": { "total": 20, "idle": 15, "waiting": 0 },
    "tables": { "count": 12, "expected": 12, "missing": [] }
  },
  "recommendations": []
}
```

### Usage Examples

```typescript
import { getPrismaClient, checkDatabaseHealth } from '@/lib/database-config'

// Health check
const health = await checkDatabaseHealth()

// Transaction with retry
await withTransaction(async tx => {
  await tx.project.create({ data: projectData })
  await tx.task.create({ data: taskData })
})
```

## Support

For database-related issues:

1. Check the health check endpoint
2. Review database logs
3. Verify configuration
4. Consult troubleshooting guide

Additional resources:

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Performance Guide](./PERFORMANCE_GUIDE.md)
