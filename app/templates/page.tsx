'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/forsure-button'
import { Input } from '@/components/ui/forsure-input'
import { Download, Search, ArrowRight, Check, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import CodeExample from '@/components/code-example'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('downloads')
  const [currentPage, setCurrentPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const ITEMS_PER_PAGE = 6

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'web', name: 'Web' },
    { id: 'backend', name: 'Backend' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'database', name: 'Database' },
    { id: 'api', name: 'API' },
  ]

  const templates = [
    {
      id: 'nextjs-app',
      name: 'Next.js App Router',
      description: 'Modern Next.js 16 project with App Router, TypeScript, and Tailwind CSS.',
      category: 'web',
      downloads: 2145,
      difficulty: 'beginner',
      setupTime: '5 min',
      tags: ['React', 'TypeScript', 'Tailwind'],
      code: `# nextjs-app.forsure
root:
  - Type: Directory
    - Name: app/
    - Description: App Router structure with pages and layouts

    - Type: File
      - Name: layout.tsx
      - Description: Root layout component

    - Type: Directory
      - Name: api/
      - Description: API route handlers

    - Type: Directory
      - Name: (auth)/
      - Description: Auth-grouped routes with custom layout

  - Type: Directory
    - Name: components/
    - Description: Reusable React components

    - Type: Directory
      - Name: ui/
      - Description: UI component library

  - Type: Directory
    - Name: lib/
    - Description: Utility functions and helpers

    - Type: Directory
      - Name: hooks/
      - Description: Custom React hooks

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts

  - Type: File
    - Name: tsconfig.json
    - Description: TypeScript configuration

  - Type: File
    - Name: tailwind.config.js
    - Description: Tailwind CSS configuration`,
    },
    {
      id: 'express-api',
      name: 'Express.js REST API',
      description: 'Scalable Express API with MongoDB, authentication, and middleware.',
      category: 'api',
      downloads: 1887,
      difficulty: 'intermediate',
      setupTime: '10 min',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      code: `# express-api.forsure
root:
  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: Directory
      - Name: routes/
      - Description: API route definitions

    - Type: Directory
      - Name: controllers/
      - Description: Request handlers and business logic

    - Type: Directory
      - Name: models/
      - Description: Data models and schemas

    - Type: Directory
      - Name: middleware/
      - Description: Custom middleware functions

      - Type: File
        - Name: auth.js
        - Description: JWT authentication middleware

      - Type: File
        - Name: errorHandler.js
        - Description: Global error handling

    - Type: Directory
      - Name: config/
      - Description: Configuration files

  - Type: File
    - Name: server.js
    - Description: Application entry point

  - Type: File
    - Name: .env
    - Description: Environment variables

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'react-native',
      name: 'React Native Mobile App',
      description: 'Cross-platform mobile app with navigation and state management.',
      category: 'mobile',
      downloads: 1456,
      difficulty: 'intermediate',
      setupTime: '15 min',
      tags: ['React Native', 'Expo', 'TypeScript'],
      code: `# react-native-app.forsure
root:
  - Type: Directory
    - Name: app/
    - Description: Core app configuration and navigation

    - Type: File
      - Name: _layout.tsx
      - Description: Root layout with navigation stack

  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: Directory
      - Name: screens/
      - Description: Screen components

      - Type: File
        - Name: HomeScreen.tsx
        - Description: Home screen component

      - Type: File
        - Name: ProfileScreen.tsx
        - Description: User profile screen

    - Type: Directory
      - Name: components/
      - Description: Reusable components

    - Type: Directory
      - Name: hooks/
      - Description: Custom React hooks

    - Type: Directory
      - Name: context/
      - Description: React Context for state management

    - Type: Directory
      - Name: services/
      - Description: API and utility services

  - Type: File
    - Name: app.json
    - Description: Expo configuration

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'fullstack-nextjs',
      name: 'Full Stack Next.js with Auth',
      description: 'Complete full-stack app with API routes, database, and authentication.',
      category: 'fullstack',
      downloads: 2089,
      difficulty: 'advanced',
      setupTime: '20 min',
      tags: ['Next.js', 'Prisma', 'Authentication', 'PostgreSQL'],
      code: `# fullstack-nextjs.forsure
root:
  - Type: Directory
    - Name: app/
    - Description: App Router with pages and API routes

    - Type: Directory
      - Name: api/
      - Description: API routes and handlers

      - Type: File
        - Name: auth/[...nextauth]/route.ts
        - Description: NextAuth authentication endpoint

      - Type: Directory
        - Name: users/
        - Description: User-related API routes

    - Type: Directory
      - Name: (dashboard)/
      - Description: Protected routes with layout

  - Type: Directory
    - Name: components/
    - Description: React components

  - Type: Directory
    - Name: prisma/
    - Description: Database schema and migrations

    - Type: File
      - Name: schema.prisma
      - Description: Data models definition

  - Type: Directory
    - Name: lib/
    - Description: Utilities and helpers

    - Type: File
      - Name: auth.ts
      - Description: Authentication configuration

  - Type: File
    - Name: .env.local
    - Description: Environment variables

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'vite-react',
      name: 'Vite React SPA',
      description: 'Single Page Application with Vite, React, and modern tooling.',
      category: 'web',
      downloads: 1676,
      difficulty: 'beginner',
      setupTime: '5 min',
      tags: ['React', 'Vite', 'TypeScript'],
      code: `# vite-react.forsure
root:
  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: File
      - Name: main.tsx
      - Description: Application entry point

    - Type: File
      - Name: App.tsx
      - Description: Root component

    - Type: Directory
      - Name: components/
      - Description: React components

      - Type: Directory
        - Name: common/
        - Description: Shared UI components

      - Type: Directory
        - Name: pages/
        - Description: Page components

    - Type: Directory
      - Name: hooks/
      - Description: Custom React hooks

    - Type: Directory
      - Name: stores/
      - Description: State management (Zustand/Redux)

    - Type: Directory
      - Name: styles/
      - Description: CSS and styling

  - Type: File
    - Name: vite.config.ts
    - Description: Vite configuration

  - Type: File
    - Name: tsconfig.json
    - Description: TypeScript configuration

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'astro-website',
      name: 'Astro Static Site',
      description: 'Fast static website with Astro, components, and content collections.',
      category: 'web',
      downloads: 1234,
      difficulty: 'beginner',
      setupTime: '5 min',
      tags: ['Astro', 'Static Site', 'Content'],
      code: `# astro-website.forsure
root:
  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: Directory
      - Name: pages/
      - Description: File-based routing

      - Type: File
        - Name: index.astro
        - Description: Home page

      - Type: Directory
        - Name: blog/
        - Description: Blog pages

    - Type: Directory
      - Name: components/
      - Description: Reusable Astro components

    - Type: Directory
      - Name: layouts/
      - Description: Layout components

    - Type: Directory
      - Name: content/
      - Description: Content collections

      - Type: Directory
        - Name: blog/
        - Description: Blog markdown files

  - Type: Directory
    - Name: public/
    - Description: Static assets

  - Type: File
    - Name: astro.config.mjs
    - Description: Astro configuration

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'prisma-orm',
      name: 'Node.js with Prisma ORM',
      description: 'Database-first development with Prisma, migrations, and seed data.',
      category: 'database',
      downloads: 1543,
      difficulty: 'intermediate',
      setupTime: '10 min',
      tags: ['Prisma', 'PostgreSQL', 'Database', 'Node.js'],
      code: `# prisma-orm.forsure
root:
  - Type: Directory
    - Name: prisma/
    - Description: Database schema directory

    - Type: File
      - Name: schema.prisma
      - Description: Data models and relationships

    - Type: Directory
      - Name: migrations/
      - Description: Database migration files

    - Type: File
      - Name: seed.ts
      - Description: Database seed script

  - Type: Directory
    - Name: src/
    - Description: Application source code

    - Type: Directory
      - Name: db/
      - Description: Database client and queries

    - Type: Directory
      - Name: services/
      - Description: Business logic services

    - Type: Directory
      - Name: types/
      - Description: TypeScript type definitions

  - Type: File
    - Name: .env
    - Description: Database URL and secrets

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts

  - Type: File
    - Name: tsconfig.json
    - Description: TypeScript configuration`,
    },
    {
      id: 'sveltekit-app',
      name: 'SvelteKit Full Stack',
      description: 'Modern SvelteKit application with API routes and form actions.',
      category: 'fullstack',
      downloads: 987,
      difficulty: 'intermediate',
      setupTime: '8 min',
      tags: ['SvelteKit', 'Svelte', 'Full Stack'],
      code: `# sveltekit-app.forsure
root:
  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: Directory
      - Name: routes/
      - Description: File-based routing

      - Type: File
        - Name: +page.svelte
        - Description: Home page component

      - Type: Directory
        - Name: api/
        - Description: API route handlers

      - Type: Directory
        - Name: (app)/
        - Description: App layout group

    - Type: Directory
      - Name: components/
      - Description: Reusable components

    - Type: Directory
      - Name: lib/
      - Description: Utilities and helpers

    - Type: File
      - Name: app.html
      - Description: HTML template

  - Type: File
    - Name: svelte.config.js
    - Description: SvelteKit configuration

  - Type: File
    - Name: vite.config.js
    - Description: Vite configuration

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'graphql-apollo',
      name: 'Apollo GraphQL API',
      description: 'GraphQL server with Apollo, resolvers, and real-time subscriptions.',
      category: 'api',
      downloads: 876,
      difficulty: 'advanced',
      setupTime: '15 min',
      tags: ['GraphQL', 'Apollo', 'Node.js', 'TypeScript'],
      code: `# apollo-graphql.forsure
root:
  - Type: Directory
    - Name: src/
    - Description: Source code directory

    - Type: File
      - Name: index.ts
      - Description: Server entry point

    - Type: Directory
      - Name: schema/
      - Description: GraphQL schema definitions

      - Type: File
        - Name: typeDefs.ts
        - Description: GraphQL type definitions

    - Type: Directory
      - Name: resolvers/
      - Description: GraphQL resolvers

      - Type: File
        - Name: Query.ts
        - Description: Query resolvers

      - Type: File
        - Name: Mutation.ts
        - Description: Mutation resolvers

      - Type: File
        - Name: Subscription.ts
        - Description: Subscription resolvers

    - Type: Directory
      - Name: models/
      - Description: Data models

    - Type: Directory
      - Name: utils/
      - Description: Helper functions

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts

  - Type: File
    - Name: tsconfig.json
    - Description: TypeScript configuration`,
    },
    {
      id: 'flask-api',
      name: 'Flask Python API',
      description: 'REST API with Flask, SQLAlchemy, and request validation.',
      category: 'api',
      downloads: 654,
      difficulty: 'intermediate',
      setupTime: '10 min',
      tags: ['Flask', 'Python', 'SQLAlchemy', 'REST'],
      code: `# flask-api.forsure
root:
  - Type: Directory
    - Name: app/
    - Description: Application package

    - Type: File
      - Name: __init__.py
      - Description: Flask app factory

    - Type: Directory
      - Name: routes/
      - Description: API route blueprints

      - Type: File
        - Name: users.py
        - Description: User endpoints

      - Type: File
        - Name: auth.py
        - Description: Authentication endpoints

    - Type: Directory
      - Name: models/
      - Description: SQLAlchemy models

    - Type: Directory
      - Name: schemas/
      - Description: Request/response schemas

    - Type: Directory
      - Name: utils/
      - Description: Helper functions

  - Type: File
    - Name: config.py
    - Description: Application configuration

  - Type: File
    - Name: requirements.txt
    - Description: Python dependencies

  - Type: File
    - Name: run.py
    - Description: Application entry point`,
    },
    {
      id: 'nuxt-app',
      name: 'Nuxt 4 Full Stack',
      description: 'Nuxt 4 with server routes, middleware, and auto-imports.',
      category: 'fullstack',
      downloads: 1123,
      difficulty: 'intermediate',
      setupTime: '8 min',
      tags: ['Nuxt', 'Vue', 'Full Stack', 'TypeScript'],
      code: `# nuxt-app.forsure
root:
  - Type: Directory
    - Name: app/
    - Description: Application directory

    - Type: Directory
      - Name: pages/
      - Description: File-based pages

    - Type: Directory
      - Name: components/
      - Description: Auto-imported components

    - Type: Directory
      - Name: layouts/
      - Description: Layout components

    - Type: Directory
      - Name: middleware/
      - Description: Route middleware

  - Type: Directory
    - Name: server/
    - Description: Server directory

    - Type: Directory
      - Name: api/
      - Description: API routes

    - Type: Directory
      - Name: middleware/
      - Description: Server middleware

  - Type: Directory
    - Name: composables/
    - Description: Reusable composition functions

  - Type: File
    - Name: nuxt.config.ts
    - Description: Nuxt configuration

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
    {
      id: 'mongodb-atlas',
      name: 'MongoDB Atlas Stack',
      description: 'MongoDB database setup with Mongoose, indexes, and validation.',
      category: 'database',
      downloads: 1345,
      difficulty: 'intermediate',
      setupTime: '10 min',
      tags: ['MongoDB', 'Mongoose', 'Database', 'NoSQL'],
      code: `# mongodb-atlas.forsure
root:
  - Type: Directory
    - Name: models/
    - Description: Mongoose schema models

    - Type: File
      - Name: User.js
      - Description: User model with validation

    - Type: File
      - Name: Post.js
      - Description: Post model with references

  - Type: Directory
    - Name: config/
    - Description: Configuration files

    - Type: File
      - Name: database.js
      - Description: MongoDB connection setup

  - Type: Directory
    - Name: migrations/
    - Description: Data migration scripts

  - Type: Directory
    - Name: seeds/
    - Description: Sample data seeding

  - Type: File
    - Name: .env
    - Description: MongoDB Atlas connection string

  - Type: File
    - Name: package.json
    - Description: Dependencies and scripts`,
    },
  ]

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredAndSorted = useMemo(() => {
    const result = templates.filter(template => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        activeCategory === 'all' || template.category === activeCategory
      return matchesSearch && matchesCategory
    })

    // Sort templates
    result.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads
        case 'newest':
          return templates.indexOf(b) - templates.indexOf(a)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, activeCategory, sortBy, templates])

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTemplates = filteredAndSorted.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ForSure Templates
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready-to-use templates for common project structures across various
            frameworks and languages.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeCategory === category.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted dark:bg-muted/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Need a Custom Template?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Create a custom template or
                request one from the community.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/contact">Request Template</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {/* Sorting and Results Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                {filteredAndSorted.length > 0 ? (
                  <>
                    Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(endIndex, filteredAndSorted.length)}</span> of{' '}
                    <span className="font-semibold">{filteredAndSorted.length}</span> templates
                  </>
                ) : (
                  'No templates found'
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 rounded-lg border border-primary/20 bg-background text-foreground text-sm"
              >
                <option value="downloads">Most Downloads</option>
                <option value="newest">Newest</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Templates Grid */}
            <div className="space-y-8">
              {filteredAndSorted.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-secondary-dark/30 rounded-lg border border-primary/10">
                  <h3 className="text-xl font-bold mb-2">No templates found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or category filter to find what
                    you're looking for.
                  </p>
                </div>
              ) : (
                currentTemplates.map(template => (
                  <AnimateOnScroll key={template.id} type="slideUp">
                    <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                              {template.category.charAt(0).toUpperCase() +
                                template.category.slice(1)}
                            </span>
                            <span className="text-xs bg-primary/5 text-muted-foreground px-2.5 py-1 rounded-full">
                              {template.difficulty.charAt(0).toUpperCase() +
                                template.difficulty.slice(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ⏱️ {template.setupTime}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              📥 {template.downloads}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {template.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-background/50 text-muted-foreground rounded border border-primary/10"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="ml-4 flex-shrink-0">
                          <Link
                            href={`/download?template=${template.id}`}
                            className="flex items-center"
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Link>
                        </Button>
                      </div>
                      <div className="p-6">
                        <CodeExample 
                          code={template.code} 
                          language="forsure"
                          title="Project Structure"
                          expandable={true}
                          defaultExpanded={true}
                        />
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-primary/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>

        <AnimateOnScroll type="fade">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download the ForSure CLI and start using these templates to
              jumpstart your projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild>
                <Link href="/download" className="flex items-center">
                  Download ForSure CLI
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/docs" className="flex items-center">
                  Read the Docs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
