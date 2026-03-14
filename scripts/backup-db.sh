#!/bin/bash

# Database Backup Script for Production
# This script creates automated backups with retention management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration from environment variables
BACKUP_DIR=${BACKUP_DIR:-"./backups"}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
S3_BUCKET=${S3_BUCKET:-""}
S3_REGION=${S3_REGION:-"us-east-1"}
COMPRESS_BACKUP=${COMPRESS_BACKUP:-true}
DATABASE_URL=${DATABASE_URL}
DIRECT_URL=${DIRECT_URL}

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
    print_status "Checking backup prerequisites..."
    
    if [[ -z "$DATABASE_URL" ]]; then
        print_error "DATABASE_URL environment variable is required"
        exit 1
    fi
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    # Check if pg_dump is available
    if ! command -v pg_dump &> /dev/null; then
        print_error "pg_dump is not available. Please install PostgreSQL client tools."
        exit 1
    fi
    
    # Check AWS CLI if S3 backup is enabled
    if [[ -n "$S3_BUCKET" ]] && ! command -v aws &> /dev/null; then
        print_warning "AWS CLI not found. S3 upload will be skipped."
    fi
    
    print_success "Prerequisites check completed"
}

# Create database backup
create_backup() {
    print_status "Creating database backup..."
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="backup_${TIMESTAMP}.sql"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"
    
    # Create the backup
    if pg_dump "$DIRECT_URL" > "$BACKUP_PATH" 2>/dev/null; then
        print_success "Database backup created: $BACKUP_PATH"
        
        # Get backup size
        BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
        print_status "Backup size: $BACKUP_SIZE"
        
        # Compress backup if enabled
        if [[ "$COMPRESS_BACKUP" == "true" ]]; then
            print_status "Compressing backup..."
            gzip "$BACKUP_PATH"
            BACKUP_PATH="${BACKUP_PATH}.gz"
            BACKUP_FILE="${BACKUP_FILE}.gz"
            COMPRESSED_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
            print_success "Backup compressed: $COMPRESSED_SIZE"
        fi
        
        echo "$BACKUP_PATH"
    else
        print_error "Backup creation failed"
        exit 1
    fi
}

# Upload to S3 if configured
upload_to_s3() {
    local backup_path=$1
    
    if [[ -z "$S3_BUCKET" ]]; then
        print_status "S3 backup not configured, skipping upload"
        return
    fi
    
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI not available, skipping S3 upload"
        return
    fi
    
    print_status "Uploading backup to S3..."
    
    local s3_key="backups/$(basename "$backup_path")"
    
    if aws s3 cp "$backup_path" "s3://$S3_BUCKET/$s3_key" --region "$S3_REGION"; then
        print_success "Backup uploaded to S3: s3://$S3_BUCKET/$s3_key"
        
        # Set lifecycle policy for automatic cleanup
        aws s3api put-object-lifecycle-configuration \
            --bucket "$S3_BUCKET" \
            --lifecycle-configuration '{
                "Rules": [
                    {
                        "ID": "BackupCleanup",
                        "Status": "Enabled",
                        "Filter": {"Prefix": "backups/"},
                        "Transitions": [
                            {
                                "Days": 30,
                                "StorageClass": "STANDARD_IA"
                            },
                            {
                                "Days": 90,
                                "StorageClass": "GLACIER"
                            }
                        ],
                        "Expiration": {"Days": '$BACKUP_RETENTION_DAYS'}
                    }
                ]
            }' \
            --region "$S3_REGION" 2>/dev/null || print_warning "Could not set lifecycle policy"
    else
        print_error "S3 upload failed"
        return 1
    fi
}

# Clean up old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups (retention: $BACKUP_RETENTION_DAYS days)..."
    
    local deleted_count=0
    
    # Find and delete old local backups
    while IFS= read -r -d '' backup_file; do
        print_status "Deleting old backup: $(basename "$backup_file")"
        rm "$backup_file"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "backup_*.sql*" -type f -mtime +$BACKUP_RETENTION_DAYS -print0)
    
    if [[ $deleted_count -gt 0 ]]; then
        print_success "Deleted $deleted_count old backup(s)"
    else
        print_status "No old backups to delete"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_path=$1
    
    print_status "Verifying backup integrity..."
    
    if [[ "$backup_path" == *.gz ]]; then
        # Test gzip integrity
        if gzip -t "$backup_path" 2>/dev/null; then
            print_success "Backup integrity verified"
        else
            print_error "Backup integrity check failed"
            return 1
        fi
    else
        # Check if file is not empty and has valid SQL content
        if [[ -s "$backup_path" ]] && head -n 1 "$backup_path" | grep -q "PostgreSQL database dump"; then
            print_success "Backup integrity verified"
        else
            print_error "Backup integrity check failed"
            return 1
        fi
    fi
}

# Send notification (optional)
send_notification() {
    local status=$1
    local backup_file=$2
    
    if [[ -n "$WEBHOOK_URL" ]]; then
        local message="Database backup $status: $backup_file"
        
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" \
            2>/dev/null || print_warning "Failed to send notification"
    fi
}

# Main backup function
run_backup() {
    print_status "Starting database backup process..."
    
    check_prerequisites
    
    # Create backup
    backup_path=$(create_backup)
    
    # Verify backup
    if verify_backup "$backup_path"; then
        # Upload to S3 if configured
        upload_to_s3 "$backup_path"
        
        # Clean up old backups
        cleanup_old_backups
        
        print_success "Database backup completed successfully!"
        send_notification "completed" "$(basename "$backup_path")"
    else
        print_error "Backup verification failed"
        send_notification "failed" "$(basename "$backup_path")"
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dir=*)
            BACKUP_DIR="${1#*=}"
            shift
            ;;
        --retention=*)
            BACKUP_RETENTION_DAYS="${1#*=}"
            shift
            ;;
        --s3-bucket=*)
            S3_BUCKET="${1#*=}"
            shift
            ;;
        --s3-region=*)
            S3_REGION="${1#*=}"
            shift
            ;;
        --no-compress)
            COMPRESS_BACKUP=false
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dir=DIR           Backup directory (default: ./backups)"
            echo "  --retention=DAYS     Retention period in days (default: 30)"
            echo "  --s3-bucket=BUCKET  S3 bucket for uploads"
            echo "  --s3-region=REGION  S3 region (default: us-east-1)"
            echo "  --no-compress        Disable compression"
            echo "  --help              Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DATABASE_URL        PostgreSQL database URL"
            echo "  DIRECT_URL          Direct database URL"
            echo "  BACKUP_DIR         Backup directory"
            echo "  BACKUP_RETENTION_DAYS  Retention period"
            echo "  S3_BUCKET          S3 bucket name"
            echo "  S3_REGION          S3 region"
            echo "  COMPRESS_BACKUP     Enable compression (true|false)"
            echo "  WEBHOOK_URL         Notification webhook URL"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run the backup
run_backup
