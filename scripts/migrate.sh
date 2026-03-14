#!/bin/bash

# Production Database Migration Script
# This script handles database migrations for production environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${NODE_ENV:-production}
SKIP_BACKUP=${SKIP_BACKUP:-false}
FORCE_RESET=${FORCE_RESET:-false}
SEED_AFTER=${SEED_AFTER:-false}

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking migration prerequisites..."
    
    # Check if required environment variables are set
    if [[ -z "$DATABASE_URL" ]]; then
        print_error "DATABASE_URL environment variable is required"
        exit 1
    fi
    
    if [[ -z "$DIRECT_URL" ]]; then
        print_error "DIRECT_URL environment variable is required"
        exit 1
    fi
    
    # Check if Prisma is installed
    if ! command -v npx &> /dev/null; then
        print_error "npx is not available"
        exit 1
    fi
    
    print_success "Prerequisites check completed"
}

# Backup database
backup_database() {
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        print_warning "Skipping database backup"
        return
    fi
    
    print_status "Creating database backup..."
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="backup_${ENVIRONMENT}_${TIMESTAMP}.sql"
    
    if pg_dump "$DIRECT_URL" > "$BACKUP_FILE" 2>/dev/null; then
        print_success "Database backup created: $BACKUP_FILE"
    else
        print_warning "Backup failed, continuing with migration..."
    fi
}

# Generate Prisma client
generate_client() {
    print_status "Generating Prisma client..."
    
    if npx prisma generate; then
        print_success "Prisma client generated successfully"
    else
        print_error "Prisma client generation failed"
        exit 1
    fi
}

# Apply database migrations
apply_migrations() {
    print_status "Applying database migrations..."
    
    if [[ "$FORCE_RESET" == "true" ]]; then
        print_warning "Force resetting database..."
        if npx prisma migrate reset --force --skip-seed; then
            print_success "Database reset successfully"
        else
            print_error "Database reset failed"
            exit 1
        fi
    else
        if npx prisma migrate deploy; then
            print_success "Migrations applied successfully"
        else
            print_error "Migration failed"
            exit 1
        fi
    fi
}

# Validate migration
validate_migration() {
    print_status "Validating migration..."
    
    # Check if all expected tables exist
    EXPECTED_TABLES=("profiles" "projects" "project_members" "tasks" "teams" "team_members" "blog_posts" "templates" "file_uploads" "notifications" "components" "audit_logs")
    
    for table in "${EXPECTED_TABLES[@]}"; do
        if ! npx prisma db execute --stdin <<< "SELECT 1 FROM $table LIMIT 1;" &>/dev/null; then
            print_error "Table '$table' not found after migration"
            exit 1
        fi
    done
    
    print_success "Migration validation successful"
}

# Seed database
seed_database() {
    if [[ "$SEED_AFTER" == "true" && "$ENVIRONMENT" != "production" ]]; then
        print_status "Seeding database..."
        
        if npm run seed:prisma; then
            print_success "Database seeded successfully"
        else
            print_warning "Database seeding failed, but migration was successful"
        fi
    else
        print_status "Skipping database seeding"
    fi
}

# Main migration function
run_migration() {
    print_status "Starting $ENVIRONMENT database migration..."
    
    check_prerequisites
    backup_database
    generate_client
    apply_migrations
    validate_migration
    seed_database
    
    print_success "$ENVIRONMENT database migration completed successfully!"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env=*)
            ENVIRONMENT="${1#*=}"
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --force-reset)
            FORCE_RESET=true
            shift
            ;;
        --seed)
            SEED_AFTER=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --env=ENVIRONMENT     Set environment (development|staging|production)"
            echo "  --skip-backup        Skip database backup"
            echo "  --force-reset        Force reset database before migration"
            echo "  --seed              Seed database after migration"
            echo "  --help              Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  NODE_ENV            Environment (default: production)"
            echo "  DATABASE_URL        PostgreSQL database URL"
            echo "  DIRECT_URL          Direct database URL for migrations"
            echo "  SKIP_BACKUP         Skip backup (true|false)"
            echo "  FORCE_RESET         Force reset (true|false)"
            echo "  SEED_AFTER         Seed after migration (true|false)"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run the migration
run_migration
