# Database Architecture

## Overview

ForSure uses Supabase (PostgreSQL) as its primary database, leveraging Row Level Security (RLS), real-time subscriptions, and automatic type generation. The database design emphasizes data integrity, security, and performance.

## Database Schema

### Core Tables

#### Users Table

```sql
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio text,
  company text,
  location text,
  skills jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created_at ON public.users(created_at);
```

#### Projects Table

```sql
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'draft')),
  visibility text DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  repository_url text,
  tech_stack jsonb DEFAULT '[]',
  tags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_visibility ON public.projects(visibility);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);
CREATE INDEX idx_projects_tech_stack ON public.projects USING GIN(tech_stack);
CREATE INDEX idx_projects_tags ON public.projects USING GIN(tags);
```

#### Blog Posts Table

```sql
CREATE TABLE public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  tags jsonb DEFAULT '[]',
  read_time integer,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);
```

#### Comments Table

```sql
CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  status text DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'spam')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_status ON public.comments(status);
CREATE INDEX idx_comments_created_at ON public.comments(created_at);
```

#### Files Table

```sql
CREATE TABLE public.files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  file_url text NOT NULL,
  bucket text DEFAULT 'uploads' NOT NULL,
  path text NOT NULL,
  uploaded_by uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_files_uploaded_by ON public.files(uploaded_by);
CREATE INDEX idx_files_bucket ON public.files(bucket);
CREATE INDEX idx_files_mime_type ON public.files(mime_type);
CREATE INDEX idx_files_created_at ON public.files(created_at);
```

### Junction Tables

#### Project Collaborators

```sql
CREATE TABLE public.project_collaborators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  role text DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  invited_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Indexes
CREATE INDEX idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user_id ON public.project_collaborators(user_id);
```

#### Project Tags

```sql
CREATE TABLE public.project_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(project_id, tag_id)
);

-- Indexes
CREATE INDEX idx_project_tags_project_id ON public.project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON public.project_tags(tag_id);
```

#### Tags Table

```sql
CREATE TABLE public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  description text,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tags_name ON public.tags(name);
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);
```

## Row Level Security (RLS)

### Users Table RLS

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Public can view user names and avatars" ON public.users
  FOR SELECT USING (true) WITH CHECK (true);
```

### Projects Table RLS

```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view public projects" ON public.projects
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view unlisted projects with link" ON public.projects
  FOR SELECT USING (visibility = 'unlisted');

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Collaborators can view assigned projects" ON public.projects
  FOR SELECT USING (
    id IN (
      SELECT project_id FROM public.project_collaborators
      WHERE user_id = auth.uid()
    )
  );
```

### Blog Posts RLS

```sql
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage own posts" ON public.blog_posts
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON public.blog_posts
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

## Database Functions

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Slug Generation Function

```sql
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
DECLARE
  slug text;
  counter integer := 1;
  original_slug text;
BEGIN
  -- Generate base slug
  original_slug := lower(regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'));
  original_slug := regexp_replace(original_slug, '\s+', '-', 'g');
  original_slug := regexp_replace(original_slug, '-+', '-', 'g');
  original_slug := trim(original_slug, '-');

  slug := original_slug;

  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.projects WHERE slug = slug) LOOP
    slug := original_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN slug;
END;
$$ LANGUAGE plpgsql;
```

### Tag Usage Counter Function

```sql
CREATE OR REPLACE FUNCTION update_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_trigger
  AFTER INSERT OR DELETE ON public.project_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();
```

## Database Views

### Project Statistics View

```sql
CREATE VIEW public.project_stats AS
SELECT
  p.id,
  p.name,
  p.status,
  p.visibility,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT pc.user_id) as collaborator_count,
  COUNT(DISTINCT pt.tag_id) as tag_count,
  u.name as owner_name,
  u.avatar_url as owner_avatar
FROM public.projects p
LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id
LEFT JOIN public.project_tags pt ON p.id = pt.project_id
LEFT JOIN public.users u ON p.owner_id = u.id
GROUP BY p.id, u.name, u.avatar_url;
```

### User Activity View

```sql
CREATE VIEW public.user_activity AS
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT bp.id) as blog_post_count,
  COUNT(DISTINCT c.id) as comment_count,
  MAX(p.created_at) as last_project_date,
  MAX(bp.created_at) as last_blog_post_date
FROM public.users u
LEFT JOIN public.projects p ON u.id = p.owner_id
LEFT JOIN public.blog_posts bp ON u.id = bp.author_id
LEFT JOIN public.comments c ON u.id = c.author_id
GROUP BY u.id, u.name, u.email;
```

## Performance Optimization

### Indexing Strategy

```sql
-- Composite indexes for common queries
CREATE INDEX idx_projects_owner_status ON public.projects(owner_id, status);
CREATE INDEX idx_blog_posts_author_status ON public.blog_posts(author_id, status);
CREATE INDEX idx_comments_post_status ON public.comments(post_id, status);

-- Partial indexes for filtered queries
CREATE INDEX idx_projects_public_active ON public.projects(created_at)
  WHERE visibility = 'public' AND status = 'active';

CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at)
  WHERE status = 'published';
```

### Query Optimization Examples

```typescript
// Optimized project query with proper indexing
const getUserProjects = async (userId: string, filters: ProjectFilters) => {
  let query = supabase
    .from('projects')
    .select(
      `
      id,
      name,
      description,
      status,
      visibility,
      progress,
      created_at,
      updated_at,
      profiles!projects_owner_id_fkey (
        name,
        avatar_url
      ),
      project_tags (
        tags (name, color)
      )
    `
    )
    .eq('owner_id', userId)

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.visibility) {
    query = query.eq('visibility', filters.visibility)
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  return await query
    .order('created_at', { ascending: false })
    .range(filters.offset, filters.offset + filters.limit - 1)
}
```

## Database Backups & Recovery

### Automated Backups

```sql
-- Supabase handles automated backups, but for custom backup strategies:

-- Export schema
pg_dump --schema-only --no-owner --no-privileges > schema.sql

-- Export data
pg_dump --data-only --no-owner --no-privileges > data.sql

-- Full backup
pg_dump --no-owner --no-privileges > full_backup.sql
```

### Point-in-Time Recovery

```sql
-- Supabase provides point-in-time recovery through their dashboard
-- For custom implementations, consider:

-- Create backup table before major updates
CREATE TABLE projects_backup AS TABLE projects;

-- Transaction rollback for critical operations
BEGIN;
-- Your operations here
-- ROLLBACK if something goes wrong
COMMIT;
```

## Migration Strategy

### Version Control

```sql
-- Migration file naming convention: 001_initial_schema.sql
-- Each migration should be idempotent

-- Example migration
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'new_table') THEN
    CREATE TABLE public.new_table (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      -- columns
    );
  END IF;
END $$;
```

### Rollback Procedures

```sql
-- Create rollback scripts for each migration
-- Example rollback for adding a column
ALTER TABLE public.projects DROP COLUMN IF EXISTS new_column;
```

## Monitoring & Maintenance

### Performance Monitoring

```sql
-- Slow query log analysis
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage statistics
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Regular Maintenance

```sql
-- Update table statistics
ANALYZE public.projects;
ANALYZE public.users;
ANALYZE public.blog_posts;

-- Reindex fragmented indexes
REINDEX INDEX CONCURRENTLY idx_projects_created_at;

-- Clean up old data (example: delete soft-deleted records older than 1 year)
DELETE FROM public.projects
WHERE status = 'archived'
AND updated_at < now() - interval '1 year';
```
