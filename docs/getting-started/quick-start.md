# Quick Start Guide

Get the ForSure application running in minutes with this streamlined guide. Perfect for developers who want to get started quickly without diving deep into configuration details.

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/elicharlese/ForSure.git
cd ForSure

# Install dependencies
pnpm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Get your Supabase credentials from: https://app.supabase.com/project/_/settings/api
# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-random-jwt-secret
```

### Step 3: Setup Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database-schema.sql`
4. Paste and run the SQL script

### Step 4: Start Development

```bash
# Start the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running!

## 🎯 What You Get Out of the Box

### Core Features

- ✅ User authentication (register, login, social auth)
- ✅ Project management system
- ✅ Blog platform
- ✅ File uploads
- ✅ Real-time updates
- ✅ Dark/light theme
- ✅ Responsive design

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL with Supabase
- **Styling**: Tailwind CSS, Radix UI
- **Animations**: GSAP, Framer Motion

## 🛠️ Common Tasks

### Create Your First Project

1. Register a new account or login
2. Navigate to **Projects** → **New Project**
3. Fill in project details
4. Click **Create Project**

### Add a Blog Post

1. Go to **Blog** → **New Post**
2. Write your content using the markdown editor
3. Add tags and featured image
4. Set publication status
5. Click **Publish**

### Customize Your Profile

1. Click your avatar → **Profile**
2. Update your information
3. Upload a profile picture
4. Add your skills and bio
5. Save changes

## 🎨 UI Components Available

The application includes a comprehensive component library:

### Forms

- Input fields with validation
- Dropdown selects
- Checkboxes and radio buttons
- File uploaders
- Rich text editors

### Navigation

- Header with navigation menu
- Sidebar navigation
- Breadcrumbs
- Tabs and pagination

### Feedback

- Toast notifications
- Loading spinners
- Progress bars
- Alert messages

### Data Display

- Cards and lists
- Tables with sorting
- Avatars and badges
- Charts and graphs

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm dev:webpack      # Start dev server with Webpack

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Database
pnpm db:push          # Push schema to database
pnpm db:pull          # Pull schema from database
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open database studio
```

## 📁 Project Structure at a Glance

```
ForSure/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Application pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature components
├── lib/                  # Utility libraries
├── contexts/             # React contexts
├── hooks/                # Custom hooks
└── docs/                 # Documentation
```

## 🎯 Next Steps

### For Frontend Developers

1. **Explore Components**: Check `/components/ui/` for available components
2. **Read Styling Guide**: Learn about Tailwind CSS usage
3. **Study State Management**: Understand React Context patterns

### For Backend Developers

1. **API Documentation**: Review `/docs/api-reference/`
2. **Database Schema**: Study `/docs/architecture/database.md`
3. **Authentication**: Understand the auth flow in `/docs/architecture/authentication.md`

### For Full Stack Developers

1. **Architecture Overview**: Read `/docs/architecture/system-overview.md`
2. **Development Guide**: Check `/docs/development/`
3. **Deployment Guide**: Prepare for production with `/docs/deployment/`

## 🔍 Quick Testing

### Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'
```

### Test API Health

```bash
# Check if API is running
curl http://localhost:3000/api/health
```

### Test Database Connection

1. Try to create a project in the UI
2. Check if it appears in Supabase database
3. Verify the data is correctly stored

## 🚨 Common Quick Fixes

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Environment Variables Not Working

```bash
# Restart development server after changing .env.local
# Environment variables are only loaded on server start
```

### Database Connection Failed

1. Verify Supabase URL and keys in `.env.local`
2. Check if database schema is applied
3. Ensure RLS policies are enabled

## 📚 Learn More

### Documentation

- **Installation Guide**: [./installation.md](./installation.md) - Detailed setup instructions
- **Architecture**: [../architecture/](../architecture/) - System design and patterns
- **API Reference**: [../api-reference/](../api-reference/) - Complete API documentation
- **Development**: [../development/](../development/) - Development guidelines

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)

## 🤝 Need Help?

- **Issues**: [GitHub Issues](https://github.com/elicharlese/ForSure/issues)
- **Discussions**: [GitHub Discussions](https://github.com/elicharlese/ForSure/discussions)
- **Documentation**: [Main Documentation](../README.md)

## ✅ Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Development server running
- [ ] Application loads in browser
- [ ] User registration works
- [ ] Project creation works
- [ ] API endpoints responding

Congratulations! 🎉 You now have a fully functional ForSure development environment running locally. You can start building, customizing, and extending the application to meet your needs.
