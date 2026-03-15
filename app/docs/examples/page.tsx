import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function ExamplesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Examples
        </h1>
        <p className="text-lg text-muted-foreground">
          Practical examples of using ForSure for different project types and workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Project Examples</h2>
        <p>Explore different project structures you can create with ForSure:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Basic Examples</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Simple project structures to get started
            </p>
            <Link
              href="/docs/examples/basic"
              className="text-primary hover:underline text-sm"
            >
              Basic Examples →
            </Link>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Intermediate Examples</h3>
            <p className="text-sm text-muted-foreground mb-2">
              More complex project structures with features
            </p>
            <Link
              href="/docs/examples/intermediate"
              className="text-primary hover:underline text-sm"
            >
              Intermediate Examples →
            </Link>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Advanced Examples</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Enterprise-grade project structures
            </p>
            <Link
              href="/docs/examples/advanced"
              className="text-primary hover:underline text-sm"
            >
              Advanced Examples →
            </Link>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">CLI Examples</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Command-line usage examples and workflows
            </p>
            <Link
              href="/docs/examples/cli"
              className="text-primary hover:underline text-sm"
            >
              CLI Examples →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">React Application</h3>
            <p>Create a complete React application structure:</p>
            <DocsCodeBlock
              code={`root { name: "react-app", version: "1.0.0" }:
  # Source code
  - src:
      - App.tsx { entry: true }
      - index.tsx
      - components:
          - Header.tsx
          - Footer.tsx
          - Button.tsx { test: true, storybook: true }
      - hooks:
          - useAuth.ts
          - useApi.ts
      - utils:
          - helpers.ts
      - styles:
          - globals.css
          - components.css
  
  # Public assets
  - public:
      - index.html
      - favicon.ico
      - images/
  
  # Configuration
  - package.json { auto-update: true }
  - tsconfig.json
  - vite.config.ts
  - .gitignore
  - README.md { template: "react" }`}
              fileName="react-app.forsure"
            />
            <DocsCodeBlock
              code={`# Generate the React application
forsure generate react-app.forsure --output ./my-react-app

# Generate with TypeScript support
forsure gen component -n UserProfile --template react --typescript --test --storybook

# Setup the development environment
forsure setup --template react`}
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Node.js API</h3>
            <p>Create a Node.js API project structure:</p>
            <DocsCodeBlock
              code={`root { name: "node-api", version: "1.0.0" }:
  # Source code
  - src:
      - server.ts { entry: true }
      - app.ts
      - routes:
          - auth.ts { middleware: "auth" }
          - users.ts { validation: true }
          - products.ts { cache: true }
      - middleware:
          - auth.ts
          - cors.ts
          - validation.ts
      - services:
          - user.service.ts
          - product.service.ts
      - models:
          - user.model.ts
          - product.model.ts
      - utils:
          - database.ts
          - logger.ts
          - errors.ts
  
  # Configuration
  - config:
      - default.json
      - development.json { env: "development" }
      - production.json { env: "production" }
  
  # Tests
  - tests:
      - unit/
      - integration/
      - e2e/
  
  # Documentation
  - docs:
      - api.md
      - setup.md
  
  # Project files
  - package.json { scripts: ["start", "test", "build"] }
  - tsconfig.json
      - .env.example
      - .gitignore
      - README.md`}
              fileName="node-api.forsure"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Design System</h3>
            <p>Create a design system project with components:</p>
            <DocsCodeBlock
              code={`root { name: "design-system", version: "1.0.0" }:
  # Design tokens
  - tokens:
      - colors.ts
      - typography.ts
      - spacing.ts
      - shadows.ts
  
  # Components
  - components:
      - Button:
          - Button.tsx { storybook: true, test: true }
          - Button.stories.tsx
          - Button.test.tsx
      - Card:
          - Card.tsx { storybook: true, test: true }
          - Card.stories.tsx
          - Card.test.tsx
      - Input:
          - Input.tsx { storybook: true, test: true }
          - Input.stories.tsx
          - Input.test.tsx
  
  # Hooks
  - hooks:
      - useTheme.ts
      - useResponsive.ts
  
  # Utilities
  - utils:
      - cn.ts
      - styles.ts
  
  # Storybook
  - .storybook:
      - main.ts
      - preview.ts
  
  # Build output
  - dist/
  
  # Configuration
  - package.json { build: "rollup", test: "jest" }
  - rollup.config.js
  - jest.config.js
  - tsconfig.json
  - tailwind.config.js
  - .gitignore
  - README.md`}
              fileName="design-system.forsure"
            />
            <DocsCodeBlock
              code={`# Generate design system
forsure generate design-system.forsure --output ./my-design-system

# Generate design tokens
forsure design tokens --format css --watch

# Generate a new component
forsure gen component -n Modal --template design-system --typescript --test --storybook`}
              language="bash"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">CLI Workflows</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Complete Project Setup</h3>
            <p>Set up a complete project from scratch:</p>
            <DocsCodeBlock
              code={`# 1. Initialize a new project
forsure init my-project.forsure

# 2. Edit the project structure
# (edit my-project.forsure file)

# 3. Generate the project
forsure generate my-project.forsure --output ./my-project

# 4. Setup development environment
cd my-project
forsure setup

# 5. Install dependencies
npm install

# 6. Start development
npm run dev`}
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Component Development Workflow</h3>
            <p>Efficient component development with ForSure:</p>
            <DocsCodeBlock
              code={`# Generate a new component
forsure gen component -n DataTable --template data --typescript --test --storybook

# Generate a custom hook
forsure gen hook -n useDataTable --template api --typescript --test

# Generate a utility function
forsure gen utility -n formatCurrency --typescript --test

# Update design tokens
forsure design tokens --format css --watch

# Run tests
forsure test --coverage

# Build for production
forsure build --production`}
              language="bash"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Project Migration</h3>
            <p>Migrate an existing project to use ForSure:</p>
            <DocsCodeBlock
              code={`# Analyze existing project
forsure analyze ./existing-project

# Generate ForSure file from existing structure
forsure extract ./existing-project --output project.forsure

# Review and customize the generated file
# (edit project.forsure)

# Validate the structure
forsure validate project.forsure

# Generate new structure (dry run first)
forsure generate project.forsure --output ./new-project --dry-run

# Generate the actual structure
forsure generate project.forsure --output ./new-project`}
              language="bash"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Advanced Features</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Using @import Directives</h3>
            <p>Reuse common structures across projects:</p>
            <DocsCodeBlock
              code={`# common-components.fs
- components:
    - Button.tsx
    - Input.tsx
    - Card.tsx

# In your main project file
root:
  @import 'common-components.fs'
  - src:
      - App.tsx
      - pages:
          - Home.tsx
          - About.tsx`}
              fileName="example.forsure"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Custom Attributes</h3>
            <p>Add custom metadata to files and directories:</p>
            <DocsCodeBlock
              code={`root:
  - src:
      - components:
          - Button.tsx { 
            test: true, 
            storybook: true, 
            accessibility: "aa",
            performance: "critical"
          }
      - styles:
          - main.css { 
            minify: true, 
            autoprefixer: true,
            critical: true
          }
  - config:
      - database.json { 
        env: "production", 
        secrets: true,
        backup: true
      }`}
              fileName="advanced.forsure"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Environment-Specific Structures</h3>
            <p>Create different structures for different environments:</p>
            <DocsCodeBlock
              code={`root:
  # Common files
  - src:
      - App.tsx
      - utils/
  
  # Development-specific
  - dev-tools:
      - debug.tsx { env: "development" }
      - hot-reload.js { env: "development" }
  
  # Production-specific
  - prod-config:
      - cache.json { env: "production" }
      - cdn.js { env: "production" }
  
  # Test-specific
  - test-utils:
      - mocks.ts { env: "test" }
      - fixtures.ts { env: "test" }`}
              fileName="environments.forsure"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Explore more examples and use cases:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/docs/examples/basic" className="text-primary hover:underline">
              Basic Examples →
            </Link>
          </li>
          <li>
            <Link href="/docs/examples/intermediate" className="text-primary hover:underline">
              Intermediate Examples →
            </Link>
          </li>
          <li>
            <Link href="/docs/examples/advanced" className="text-primary hover:underline">
              Advanced Examples →
            </Link>
          </li>
          <li>
            <Link href="/docs/cli" className="text-primary hover:underline">
              CLI Reference →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
