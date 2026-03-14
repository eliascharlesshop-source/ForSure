# Frequently Asked Questions (FAQ)

This FAQ addresses common questions about the ForSure application, covering setup, development, deployment, and usage scenarios.

## General Questions

### What is ForSure?

ForSure is a modern, full-stack web application built with Next.js 15, React 19, and TypeScript. It features user authentication, project management, a blog system, file uploads, and AI-powered features with Solana blockchain integration.

### What technologies does ForSure use?

**Frontend:**

- Next.js 15 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 3.4.17
- Radix UI components
- GSAP and Framer Motion for animations

**Backend:**

- Next.js API routes
- Supabase (PostgreSQL)
- JWT authentication
- Zod validation

**Infrastructure:**

- Vercel for hosting
- Supabase for database and auth
- Solana blockchain integration

### Is ForSure open source?

Yes! ForSure is open source and available on [GitHub](https://github.com/elicharlese/ForSure). Contributions are welcome through pull requests.

## Setup and Installation

### What are the system requirements?

**Minimum Requirements:**

- Node.js 18.0.0 or higher
- 8GB RAM
- 10GB free disk space
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

**Recommended:**

- Node.js 20.x LTS
- 16GB RAM
- SSD with 20GB+ free space
- Latest version of your preferred browser

### How do I install ForSure locally?

1. Clone the repository:

   ```bash
   git clone https://github.com/elicharlese/ForSure.git
   cd ForSure
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Set up the database:
   - Create a Supabase project
   - Run the SQL schema in Supabase SQL Editor
   - Configure authentication providers

5. Start the development server:
   ```bash
   pnpm dev
   ```

### Do I need a Supabase account?

Yes, Supabase is required for:

- Database (PostgreSQL)
- Authentication
- File storage
- Real-time subscriptions

You can start with the free tier, which is sufficient for development and small projects.

### What environment variables do I need?

Required variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-random-jwt-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Development

### How do I add a new page?

1. Create a new folder in `app/`:

   ```bash
   mkdir app/new-page
   ```

2. Create a `page.tsx` file:

   ```typescript
   export default function NewPage() {
     return <div>New Page Content</div>
   }
   ```

3. The page will be available at `/new-page`

### How do I create API endpoints?

Create API routes in the `app/api/` directory:

```typescript
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello World' })
}
```

The endpoint will be available at `/api/hello`.

### How do I add new components?

1. Create component files in `components/`:

   ```typescript
   // components/ui/MyComponent.tsx
   interface MyComponentProps {
     title: string
     onClick?: () => void
   }

   export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
     return (
       <div onClick={onClick}>
         <h1>{title}</h1>
       </div>
     )
   }
   ```

2. Export from index file if needed:
   ```typescript
   // components/ui/index.ts
   export { MyComponent } from './MyComponent'
   ```

### How do I run tests?

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e
```

### How do I debug issues?

1. **Check browser console** for JavaScript errors
2. **Check network tab** for API request failures
3. **Use VS Code debugger** with launch configurations
4. **Add console.log statements** for quick debugging
5. **Use React DevTools** for component inspection

## Database

### How do I modify the database schema?

1. **For development**: Make changes in Supabase SQL Editor
2. **For production**: Use database migrations:

   ```bash
   pnpm db:migrate
   ```

3. **Update TypeScript types**:
   ```bash
   pnpm db:generate
   ```

### How do I handle database migrations?

ForSure uses Supabase migrations:

```bash
# Create new migration
pnpm db:migrate --create migration_name

# Apply pending migrations
pnpm db:migrate

# Rollback migration
pnpm db:migrate --rollback
```

### How do I back up my data?

Supabase provides automatic backups:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Configure **Point-in-Time Recovery**
4. Set up **Automated backups**

For manual backups:

```bash
# Export data
pnpm db:dump

# Import data
pnpm db:import backup.sql
```

## Authentication

### How does authentication work?

ForSure uses Supabase Auth:

- **Email/Password**: Traditional authentication
- **Social Login**: Google, GitHub (configurable)
- **JWT Tokens**: For API authentication
- **Session Management**: Automatic token refresh

### How do I add social authentication?

1. In Supabase Dashboard → Authentication → Providers:
2. Enable desired providers (Google, GitHub, etc.)
3. Configure OAuth credentials
4. Add redirect URLs to your environment

### How do I protect routes?

Use the `withAuth` middleware:

```typescript
import { withAuth } from '@/lib/auth-middleware'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  // User is authenticated
  // user object contains user information
})
```

### How do I handle user roles?

ForSure implements Role-Based Access Control (RBAC):

```typescript
// Check user permissions
if (user.role === 'admin') {
  // Admin-only functionality
}

// Use permission helper
import { hasPermission } from '@/lib/rbac'

if (hasPermission(user.role, 'projects', 'create')) {
  // Allow project creation
}
```

## Deployment

### How do I deploy to Vercel?

1. **Push code to GitHub**
2. **Import project in Vercel dashboard**
3. **Configure environment variables**
4. **Deploy automatically**

Or use Vercel CLI:

```bash
npm install -g vercel
vercel --prod
```

### What environment variables do I need for production?

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### How do I set up a custom domain?

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

### How do I monitor my deployed application?

Vercel provides built-in monitoring:

- **Analytics**: Page views, Web Vitals
- **Logs**: Function logs and errors
- **Speed Insights**: Performance metrics

For advanced monitoring, integrate Sentry:

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## Features

### How do I upload files?

ForSure supports file uploads through Supabase Storage:

```typescript
// Client-side upload
const fileInput = document.getElementById('file-input')
const file = fileInput.files[0]

const { data, error } = await supabase.storage
  .from('uploads')
  .upload(`public/${file.name}`, file)

if (error) {
  console.error('Upload failed:', error)
} else {
  console.log('File uploaded:', data.path)
}
```

### How do I implement real-time features?

Use Supabase Realtime subscriptions:

```typescript
// Subscribe to changes
const subscription = supabase
  .channel('public:projects')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'projects' },
    payload => {
      console.log('Change received:', payload)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### How do I add AI features?

ForSure includes AI integration capabilities:

1. **Set up AI service** in environment variables
2. **Use AI helper functions**:

   ```typescript
   import { generateText } from '@/lib/ai-service'

   const result = await generateText(prompt)
   ```

3. **Add AI components** from the AI features directory

### How does blockchain integration work?

ForSure integrates with Solana:

1. **Set up Solana wallet** in client components
2. **Use blockchain service** for transactions:

   ```typescript
   import { createProjectOnChain } from '@/lib/blockchain'

   const txId = await createProjectOnChain(projectData)
   ```

3. **Monitor transactions** through the blockchain service

## Troubleshooting

### Why is my build failing?

Common causes:

- **TypeScript errors**: Run `pnpm type-check`
- **Missing dependencies**: Run `pnpm install`
- **Environment variables**: Check `.env.local`
- **Import errors**: Verify file paths and exports

### Why are API requests failing?

Check:

- **CORS configuration**: Ensure proper headers
- **Environment variables**: Verify API URLs and keys
- **Network connectivity**: Test with curl
- **Authentication**: Check JWT tokens

### Why is authentication not working?

Verify:

- **JWT secret**: Must be same on client and server
- **Supabase configuration**: Check project settings
- **RLS policies**: Ensure proper database permissions
- **Redirect URLs**: Must match Supabase configuration

### How do I fix memory issues?

Solutions:

- **Increase Node.js memory**: `NODE_OPTIONS='--max-old-space-size=4096'`
- **Optimize imports**: Use tree shaking
- **Check for memory leaks**: Review useEffect cleanup
- **Use dynamic imports**: For large components

## Best Practices

### What are the coding standards?

ForSure follows:

- **TypeScript strict mode**
- **ESLint with Next.js config**
- **Prettier for formatting**
- **Conventional commits**
- **Component-driven development**

### How do I contribute to ForSure?

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following coding standards
4. **Add tests** for new functionality
5. **Update documentation**
6. **Submit pull request** with clear description

### Where can I get help?

- **Documentation**: [docs/](../README.md)
- **GitHub Issues**: [Create an issue](https://github.com/elicharlese/ForSure/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/elicharlese/ForSure/discussions)
- **Discord Community**: [Join our Discord](https://discord.gg/forsure)

## Licensing

### What license does ForSure use?

ForSure is released under the MIT License. See the [LICENSE](https://github.com/elicharlese/ForSure/blob/main/LICENSE) file for details.

### Can I use ForSure commercially?

Yes! The MIT license allows commercial use. You can:

- Use it in commercial projects
- Modify the code
- Distribute your modifications
- Use it privately without open-sourcing your changes

## Performance

### How can I optimize my ForSure application?

1. **Use Next.js Image component** for optimized images
2. **Implement code splitting** with dynamic imports
3. **Use React.memo** for expensive components
4. **Optimize database queries** with proper indexing
5. **Enable caching** for API responses
6. **Monitor performance** with Web Vitals

### What are the performance benchmarks?

Target metrics:

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Security

### How secure is ForSure?

ForSure implements multiple security measures:

- **JWT authentication** with secure token handling
- **Input validation** with Zod schemas
- **SQL injection prevention** through Supabase
- **XSS protection** with content sanitization
- **Rate limiting** on API endpoints
- **HTTPS enforcement** in production

### How do I report security vulnerabilities?

Please report security issues privately:

- **Email**: security@forsure.app
- **Private GitHub issue**: [Create private issue](https://github.com/elicharlese/ForSure/security/advisories)

Do not disclose security issues publicly until they have been addressed.

---

Still have questions? Check out our [troubleshooting guide](./common-issues.md) or reach out to our community for help!
