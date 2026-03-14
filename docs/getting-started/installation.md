# Installation Guide

This guide will walk you through setting up the ForSure development environment on your local machine. Follow these steps to get the application running locally.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)

  ```bash
  # Check your Node.js version
  node --version

  # Install Node.js using nvm (recommended)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 18
  nvm use 18
  ```

- **pnpm** (v8.0.0 or higher) - Recommended package manager

  ```bash
  # Install pnpm globally
  npm install -g pnpm

  # Or using npm
  npm install -g pnpm
  ```

- **Git** (v2.30.0 or higher)

  ```bash
  # Check Git version
  git --version

  # Install Git (macOS)
  brew install git

  # Install Git (Ubuntu)
  sudo apt-get update
  sudo apt-get install git
  ```

### Database Setup

- **Supabase Account** (Free tier is sufficient)
  1. Create an account at [supabase.com](https://supabase.com)
  2. Create a new project
  3. Note your project URL and anon key

### Optional Tools

- **Docker** (for containerized development)
- **VS Code** with recommended extensions
- **Postman** or **Insomnia** (for API testing)

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/elicharlese/ForSure.git

# Navigate to the project directory
cd ForSure

# Verify the project structure
ls -la
```

## Step 2: Install Dependencies

```bash
# Install all dependencies using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

The installation will download and install:

- Next.js 15 and React 19
- TypeScript and development tools
- UI libraries (Radix UI, Tailwind CSS)
- Database clients (Supabase)
- Animation libraries (GSAP, Framer Motion)
- Testing frameworks (Jest, React Testing Library)

## Step 3: Environment Configuration

### Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# Or create manually
touch .env.local
```

### Configure Environment Variables

Open `.env.local` and add the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

#### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. For the service role key, go to **Settings** → **Database** → **API**

#### Generate JWT Secret

```bash
# Generate a secure random string
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Database Setup

### Option 1: Use Supabase Dashboard (Recommended)

1. **Run Database Schema**
   - Go to your Supabase project
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `database-schema.sql`
   - Click **Run** to execute the schema

2. **Enable Row Level Security (RLS)**
   - Go to **Authentication** → **Policies**
   - Ensure RLS is enabled for all tables
   - Review the automatically generated policies

3. **Set Up Storage Buckets**
   - Go to **Storage**
   - Create buckets: `uploads`, `avatars`, `project-files`
   - Configure appropriate access policies

### Option 2: Use Database CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push
```

## Step 5: Start Development Server

```bash
# Start the development server with Turbopack (recommended)
pnpm dev

# Or with regular Webpack
pnpm dev:webpack

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)

## Step 6: Verify Installation

### Check Frontend

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the ForSure homepage
3. Check the browser console for any errors

### Check API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test authentication endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'
```

### Check Database Connection

1. Try to register a new user through the UI
2. Check if the user appears in your Supabase database
3. Verify that authentication works correctly

## Common Issues & Solutions

### Port Already in Use

```bash
# Find the process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Database Connection Issues

1. **Check Supabase URL**: Ensure it's correct and includes `https://`
2. **Verify Keys**: Double-check anon and service role keys
3. **Network Issues**: Check if you can reach Supabase from your network
4. **CORS Settings**: Ensure localhost is allowed in Supabase CORS settings

### Environment Variables Not Loading

1. **File Name**: Ensure the file is named `.env.local` (not `.env`)
2. **File Location**: Make sure it's in the project root
3. **Restart Server**: Environment variables require a server restart

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Restart development server
pnpm dev
```

## Development Tools Setup

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Git Hooks Setup

The project uses Husky for Git hooks:

```bash
# Install Git hooks (automatically done on install)
pnpm prepare

# Manually install hooks
npx husky install
```

This will:

- Run linting on pre-commit
- Run type checking on pre-push
- Ensure commit messages follow conventional format

## Next Steps

After successful installation:

1. **Read the Quick Start Guide** - [./quick-start.md](./quick-start.md)
2. **Explore the Architecture** - [../architecture/](../architecture/)
3. **Check API Documentation** - [../api-reference/](../api-reference/)
4. **Review Development Guidelines** - [../development/](../development/)

## Need Help?

If you encounter issues during installation:

1. **Check the logs** in your terminal and browser console
2. **Review common issues** above
3. **Search existing issues** on [GitHub](https://github.com/elicharlese/ForSure/issues)
4. **Create a new issue** with detailed information about your problem

## Verification Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Development server starts without errors
- [ ] Frontend loads correctly in browser
- [ ] API endpoints respond correctly
- [ ] User registration/login works
- [ ] Database connection is functional

Once all items are checked, your development environment is ready!
