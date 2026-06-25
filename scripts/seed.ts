import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/password'

interface SeedUser {
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  bio?: string
  password?: string
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin@forsure.app',
    name: 'Admin User',
    role: 'admin',
    bio: 'System administrator for ForSure platform',
  },
  {
    email: 'moderator@forsure.app',
    name: 'Moderator User',
    role: 'moderator',
    bio: 'Community moderator',
  },
  {
    email: 'user@forsure.app',
    name: 'Test User',
    role: 'user',
    bio: 'Regular platform user',
  },
  {
    email: 'test@example.com',
    name: 'Test Account',
    role: 'user',
    bio: 'Test account for demonstration',
    password: 'TestPassword123!',
  },
]

const seedProjects = [
  {
    name: 'Sample Project',
    description: 'A sample project to demonstrate ForSure capabilities',
    slug: 'sample-project',
    status: 'active',
    visibility: 'public',
    tags: ['sample', 'demo', 'tutorial'],
  },
  {
    name: 'Advanced Dashboard',
    description: 'Complex dashboard with multiple data sources',
    slug: 'advanced-dashboard',
    status: 'active',
    visibility: 'public',
    tags: ['dashboard', 'analytics', 'charts'],
  },
]

const seedBlogPosts = [
  {
    title: 'Welcome to ForSure',
    content:
      'This is an introduction to the ForSure platform and its capabilities.',
    excerpt: 'Learn about ForSure platform features and how to get started.',
    slug: 'welcome-to-forsure',
    status: 'published',
    tags: ['welcome', 'introduction', 'guide'],
  },
  {
    title: 'Building Your First Project',
    content: 'Step-by-step guide to creating your first project on ForSure.',
    excerpt:
      'A comprehensive guide for beginners to start their first project.',
    slug: 'building-your-first-project',
    status: 'published',
    tags: ['tutorial', 'beginner', 'project'],
  },
]

const seedTemplates = [
  {
    name: 'Basic React Component',
    description: 'A simple React component template with TypeScript',
    category: 'React',
    content: {
      type: 'component',
      language: 'typescript',
      code: `import React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nconst Component: React.FC<Props> = ({ title }) => {\n  return <div>{title}</div>;\n};\n\nexport default Component;`,
    },
    tags: ['react', 'typescript', 'component'],
    is_public: true,
  },
  {
    name: 'Next.js API Route',
    description: 'Template for Next.js API route with TypeScript',
    category: 'API',
    content: {
      type: 'api',
      language: 'typescript',
      code: `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  return NextResponse.json({ message: 'Hello World' });\n}\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  return NextResponse.json({ data: body });\n}`,
    },
    tags: ['nextjs', 'api', 'typescript'],
    is_public: true,
  },
]

const seedTeams = [
  {
    name: 'ForSure Core Team',
    description: 'Core development team for ForSure platform',
    slug: 'forsure-core-team',
    is_public: true,
    settings: {
      permissions: {
        canCreateProjects: true,
        canManageMembers: true,
        canDeleteTeam: false,
      },
    },
  },
  {
    name: 'Community Contributors',
    description: 'Open source contributors and community members',
    slug: 'community-contributors',
    is_public: true,
    settings: {
      permissions: {
        canCreateProjects: true,
        canManageMembers: false,
        canDeleteTeam: false,
      },
    },
  },
]

const seedTasks = [
  {
    title: 'Set up project structure',
    description:
      'Initialize the project with proper folder structure and configuration',
    status: 'done',
    priority: 'high',
    estimated_hours: 4,
    actual_hours: 3.5,
    tags: ['setup', 'initialization'],
  },
  {
    title: 'Implement authentication',
    description: 'Add user authentication using Supabase Auth',
    status: 'done',
    priority: 'high',
    estimated_hours: 8,
    actual_hours: 6,
    tags: ['auth', 'security'],
  },
  {
    title: 'Create user dashboard',
    description: 'Build the main user dashboard with project overview',
    status: 'in_progress',
    priority: 'medium',
    estimated_hours: 12,
    tags: ['frontend', 'dashboard'],
  },
  {
    title: 'Add blockchain integration',
    description: 'Integrate Solana blockchain functionality',
    status: 'todo',
    priority: 'medium',
    estimated_hours: 16,
    tags: ['blockchain', 'solana'],
  },
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Seed users (profiles)
    console.log('📝 Seeding users...')
    for (const user of seedUsers) {
      try {
        const existingUser = await prisma.profile.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          let passwordHash: string | null = null
          if (user.password) {
            passwordHash = await hashPassword(user.password)
          }

          await prisma.profile.create({
            data: {
              email: user.email,
              name: user.name,
              role: user.role,
              bio: user.bio,
              password_hash: passwordHash,
              is_verified: true,
              skills: {},
              preferences: [],
            },
          })

          console.log(`✅ Created user: ${user.email}`)
        } else {
          console.log(`⏭️  User already exists: ${user.email}`)
        }
      } catch (error) {
        console.error(`Error seeding user ${user.email}:`, error)
      }
    }

    await prisma.$disconnect()

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed successfully!')
    if (typeof process !== 'undefined') {
      process.exit(0)
    }
  })
  .catch(error => {
    console.error('❌ Seeding failed:', error)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  })

export { seedDatabase }
