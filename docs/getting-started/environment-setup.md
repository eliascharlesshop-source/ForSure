# Environment Setup Guide

This comprehensive guide covers setting up your development environment for the ForSure project, including IDE configuration, development tools, and best practices.

## IDE Setup

### Visual Studio Code (Recommended)

#### Installation

```bash
# Download and install VS Code
# macOS: brew install --cask visual-studio-code
# Ubuntu: sudo snap install code --classic
# Windows: Download from https://code.visualstudio.com/
```

#### Recommended Extensions

Install these extensions for optimal development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-prettier",
    "ms-vscode.vscode-git",
    "eamodio.gitlens",
    "ms-vscode.vscode-thunder-client",
    "humao.rest-client"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Alternative IDEs

#### WebStorm

- Install Tailwind CSS plugin
- Configure ESLint and Prettier
- Set up TypeScript compilation

#### Vim/Neovim

```vim
" Essential plugins for TypeScript/React development
Plug 'neoclide/coc.nvim'
Plug 'leafgarland/typescript-vim'
Plug 'peitalin/vim-jsx-typescript'
Plug 'styled-components/vim-styled-components'
Plug 'ap/vim-css-color'
Plug 'norcalli/nvim-colorizer.lua'
```

## Development Tools

### Package Manager

#### pnpm (Recommended)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version

# Use pnpm for all operations
pnpm install
pnpm dev
pnpm build
```

#### npm (Alternative)

```bash
# npm comes with Node.js
npm --version

# Use npm for operations
npm install
npm run dev
npm run build
```

#### Yarn (Alternative)

```bash
# Install Yarn
npm install -g yarn

# Use Yarn for operations
yarn install
yarn dev
yarn build
```

### Database Tools

#### Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Database operations
supabase db push
supabase db pull
supabase db diff
supabase db reset
```

#### TablePlus (GUI Client)

- Download from [tableplus.com](https://tableplus.com/)
- Connect to Supabase using connection string
- Useful for database exploration and queries

#### DBeaver (Free Alternative)

- Open-source database tool
- Supports PostgreSQL
- Advanced query builder

### API Testing Tools

#### Thunder Client (VS Code Extension)

```bash
# Install within VS Code
# Search for "Thunder Client" in extensions
```

#### Postman

```bash
# Download from https://www.postman.com/downloads/
# Import API collection from docs/api-reference/
```

#### Insomnia

```bash
# Download from https://insomnia.rest/download
# GraphQL and REST API testing
```

### Git Tools

#### Git Configuration

```bash
# Set up your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set up helpful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

#### Git Hooks (Husky)

```bash
# Install Git hooks (automatically done on npm install)
pnpm prepare

# Manual installation
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm lint"

# Add pre-push hook
npx husky add .husky/pre-push "pnpm type-check"
```

## Environment Variables

### Development Environment

Create `.env.local` in project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Development tools
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

### Staging Environment

Create `.env.staging`:

```bash
# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# Application
NEXT_PUBLIC_APP_URL=https://staging.forsure.app
NODE_ENV=staging

# Monitoring
SENTRY_DSN=your-staging-sentry-dsn
```

### Production Environment

Production variables should be set in your hosting platform (Vercel, Netlify, etc.):

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Application
NEXT_PUBLIC_APP_URL=https://forsure.app
NODE_ENV=production

# Security
JWT_SECRET=your-production-jwt-secret

# Monitoring
SENTRY_DSN=your-production-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-production-analytics-id
```

## Database Setup

### Supabase Project Setup

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and database region
   - Set database password
   - Create project

2. **Get API Keys**
   - Navigate to **Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key
   - Copy **service_role** key (keep secret)

3. **Apply Database Schema**
   - Go to **SQL Editor**
   - Copy contents of `database-schema.sql`
   - Click **Run** to execute

4. **Configure Authentication**
   - Go to **Authentication** → **Settings**
   - Enable required providers (Email, Google, GitHub)
   - Configure redirect URLs

5. **Set Up Storage**
   - Go to **Storage**
   - Create buckets: `uploads`, `avatars`, `project-files`
   - Set up appropriate policies

### Local Development with Docker

```bash
# Create docker-compose.yml for local services
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: forsure_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Browser Development Tools

### Chrome Extensions

#### React Developer Tools

```bash
# Install from Chrome Web Store
# Search for "React Developer Tools"
```

#### Redux DevTools (if using Redux)

```bash
# Install from Chrome Web Store
# Search for "Redux DevTools"
```

#### Tailwind CSS DevTools

```bash
# Install from Chrome Web Store
# Search for "Tailwind CSS DevTools"
```

### Firefox Extensions

- React Developer Tools
- Redux DevTools
- Tailwind CSS DevTools

## Performance Monitoring

### Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run Lighthouse audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Chrome DevTools

#### Performance Tab

- Record performance while using the app
- Analyze frame rates and loading times
- Identify bottlenecks

#### Network Tab

- Monitor API requests
- Check response times
- Analyze bundle sizes

#### Memory Tab

- Check for memory leaks
- Analyze heap usage
- Profile memory performance

## Code Quality Tools

### ESLint Configuration

The project uses ESLint with Next.js configuration:

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Type Checking

```bash
# Run TypeScript compiler check
pnpm type-check

# Watch for type changes
pnpm type-check --watch
```

## Testing Environment

### Jest Configuration

The project uses Jest for unit and integration testing:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: ['**/*.(ts|tsx)', '!**/*.d.ts', '!**/node_modules/**'],
}
```

### Playwright for E2E Testing

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
npx playwright install

# Run E2E tests
pnpm test:e2e
```

## Debugging Setup

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### Chrome DevTools Debugging

1. Open Chrome DevTools (F12)
2. Go to **Sources** tab
3. Use **Ctrl+P** to find files
4. Set breakpoints with **Ctrl+B**
5. Use **Debugger** panel for step-through debugging

## Environment Verification Checklist

### Development Environment

- [ ] Node.js 18+ installed
- [ ] pnpm installed and configured
- [ ] VS Code with recommended extensions
- [ ] Git configured with user info
- [ ] Environment variables set in `.env.local`
- [ ] Supabase project created and configured
- [ ] Database schema applied
- [ ] Git hooks installed (Husky)

### Tools Verification

- [ ] ESLint and Prettier working
- [ ] TypeScript compilation successful
- [ ] Development server starts without errors
- [ ] Database connection functional
- [ ] API endpoints responding
- [ ] Browser dev tools working

### Code Quality

- [ ] Linting passes on commit
- [ ] Type checking passes
- [ ] Tests can run successfully
- [ ] Code formatting consistent
- [ ] Git hooks functioning

## Troubleshooting Common Issues

### Port Conflicts

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Use different port
PORT=3001 pnpm dev
```

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Fix pnpm permissions
sudo chown -R $(whoami) ~/.pnpm-store
```

### Cache Issues

```bash
# Clear npm cache
npm cache clean --force

# Clear pnpm cache
pnpm store prune

# Clear Next.js cache
rm -rf .next

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Environment Variable Issues

```bash
# Verify environment variables are loaded
echo $NEXT_PUBLIC_SUPABASE_URL

# Restart development server after changes
pnpm dev
```

Your development environment is now fully configured and ready for productive development!
