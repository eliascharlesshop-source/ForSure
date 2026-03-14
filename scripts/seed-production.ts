#!/usr/bin/env tsx

import { getPrismaClient, withTransaction } from '../lib/database-config'

interface ProductionSeedConfig {
  createAdminUser?: boolean
  sampleData?: boolean
  environment: 'staging' | 'production'
}

class ProductionSeeder {
  private prisma = getPrismaClient()
  private config: ProductionSeedConfig

  constructor(config: ProductionSeedConfig) {
    this.config = config
  }

  async createSystemAdmin(): Promise<void> {
    if (!this.config.createAdminUser) {
      console.log('⏭️  Skipping admin user creation')
      return
    }

    console.log('👤 Creating system admin user...')

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@forsure.app'

      // Check if admin already exists
      const existingAdmin = await this.prisma.profile.findUnique({
        where: { email: adminEmail },
      })

      if (existingAdmin) {
        console.log('✅ Admin user already exists')
        return
      }

      // Create admin user
      const adminUser = await this.prisma.profile.create({
        data: {
          id: 'system-admin',
          email: adminEmail,
          name: 'System Administrator',
          role: 'admin',
          is_verified: true,
          is_active: true,
          preferences: {},
          skills: [],
        },
      })

      console.log(`✅ Created admin user: ${adminUser.email}`)
    } catch (error) {
      throw new Error(`Failed to create admin user: ${error}`)
    }
  }

  async createSampleData(): Promise<void> {
    if (!this.config.sampleData) {
      console.log('⏭️  Skipping sample data creation')
      return
    }

    if (this.config.environment === 'production') {
      console.log('⚠️  Sample data creation skipped in production environment')
      return
    }

    console.log('📊 Creating sample data...')

    try {
      await withTransaction(async tx => {
        // Create sample project
        const project = await tx.project.create({
          data: {
            name: 'Welcome to ForSure',
            description: 'Getting started project to explore ForSure features',
            slug: 'welcome-project',
            status: 'active',
            visibility: 'public',
            priority: 'medium',
            progress: 25,
            tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
            tags: ['welcome', 'tutorial', 'getting-started'],
            metadata: {
              difficulty: 'beginner',
              estimatedTime: '2 hours',
            },
          },
        })

        // Create sample tasks
        const tasks = [
          {
            title: 'Complete profile setup',
            description: 'Fill out your profile information and preferences',
            status: 'done' as const,
            priority: 'high' as const,
            estimated_hours: 0.5,
            actual_hours: 0.25,
            tags: ['onboarding', 'profile'],
          },
          {
            title: 'Explore project dashboard',
            description: 'Navigate through the project management interface',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            estimated_hours: 1,
            tags: ['onboarding', 'dashboard'],
          },
          {
            title: 'Create your first project',
            description: 'Start by creating a new project from scratch',
            status: 'todo' as const,
            priority: 'medium' as const,
            estimated_hours: 2,
            tags: ['onboarding', 'project'],
          },
        ]

        for (const taskData of tasks) {
          await tx.task.create({
            data: {
              ...taskData,
              project_id: project.id,
              reporter_id: 'system-admin',
              assignee_id: 'system-admin',
              metadata: {},
            },
          })
        }

        // Create sample blog post
        await tx.blogPost.create({
          data: {
            title: 'Getting Started with ForSure',
            slug: 'getting-started',
            content: `# Getting Started with ForSure

Welcome to ForSure! This platform helps you manage projects, collaborate with teams, and build amazing things.

## Key Features

- **Project Management**: Create and organize your projects
- **Team Collaboration**: Work together with your team
- **Task Tracking**: Stay on top of your tasks
- **Templates**: Use pre-built templates to get started fast

## Next Steps

1. Complete your profile setup
2. Create your first project
3. Invite team members
4. Start building!

Happy coding! 🚀`,
            excerpt: 'Learn how to get started with ForSure platform',
            author_id: 'system-admin',
            status: 'published',
            tags: ['tutorial', 'getting-started', 'welcome'],
            seo_title:
              'Getting Started with ForSure - Project Management Platform',
            seo_description:
              'Learn how to use ForSure for project management, team collaboration, and task tracking.',
            view_count: 0,
            published_at: new Date(),
          },
        })

        // Create sample template
        await tx.template.create({
          data: {
            name: 'React Component Template',
            description:
              'Basic React component with TypeScript and Tailwind CSS',
            category: 'React',
            content: {
              type: 'component',
              language: 'typescript',
              code: `import React from 'react';

interface Props {
  title: string;
  description?: string;
}

export const ComponentTemplate: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
};

export default ComponentTemplate;`,
              styles: `/* Add your custom styles here */`,
              dependencies: ['react', 'react-dom'],
              devDependencies: ['@types/react', '@types/react-dom'],
            },
            creator_id: 'system-admin',
            is_public: true,
            download_count: 0,
            tags: ['react', 'typescript', 'component', 'template'],
            version: '1.0.0',
          },
        })

        // Create sample notification
        await tx.notification.create({
          data: {
            user_id: 'system-admin',
            type: 'welcome',
            title: 'Welcome to ForSure!',
            message:
              'Your account has been set up successfully. Start by exploring the dashboard and creating your first project.',
            data: {
              action: 'dashboard',
              priority: 'high',
            },
            action_url: '/app',
          },
        })
      })

      console.log('✅ Sample data created successfully')
    } catch (error) {
      throw new Error(`Failed to create sample data: ${error}`)
    }
  }

  async runSeeding(): Promise<void> {
    console.log(`🌱 Starting ${this.config.environment} database seeding...`)

    try {
      await this.createSystemAdmin()
      await this.createSampleData()

      console.log(
        `🎉 ${this.config.environment} database seeding completed successfully!`
      )
    } catch (error) {
      console.error(`❌ Seeding failed: ${error}`)
      throw error
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)

  const config: ProductionSeedConfig = {
    environment: (process.env.NODE_ENV as any) || 'staging',
    createAdminUser:
      args.includes('--create-admin') || process.env.CREATE_ADMIN === 'true',
    sampleData:
      args.includes('--sample-data') ||
      process.env.CREATE_SAMPLE_DATA === 'true',
  }

  // Parse environment flag
  const envIndex = args.findIndex((arg: string) => arg.startsWith('--env='))
  if (envIndex !== -1) {
    config.environment = args[envIndex].split('=')[1] as any
  }

  // Safety check for production
  if (config.environment === 'production' && config.sampleData) {
    console.error('❌ Sample data creation is not allowed in production')
    console.log('Use --no-sample-data or set CREATE_SAMPLE_DATA=false')
    process.exit(1)
  }

  const seeder = new ProductionSeeder(config)

  try {
    await seeder.runSeeding()
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

// Export for programmatic use
export { ProductionSeeder, type ProductionSeedConfig }

// Run if called directly
if (require.main === module) {
  main()
}
