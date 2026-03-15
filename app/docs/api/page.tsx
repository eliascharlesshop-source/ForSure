import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function APIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          API Reference
        </h1>
        <p className="text-lg text-muted-foreground">
          Programmatic access to ForSure functionality through APIs and SDKs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p>
          ForSure provides multiple ways to integrate with your applications and workflows:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Node.js API</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use ForSure programmatically in Node.js applications
            </p>
            <Link
              href="/docs/api/node"
              className="text-primary hover:underline text-sm"
            >
              Node.js API →
            </Link>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Programmatic Usage</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Direct integration with ForSure core functionality
            </p>
            <Link
              href="/docs/api/programmatic-usage"
              className="text-primary hover:underline text-sm"
            >
              Programmatic Usage →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Quick Start</h2>
        <p>Get started with the ForSure API in minutes:</p>

        <DocsCodeBlock
          code={`// Install the ForSure package
npm install @forsure/cli

// Import in your application
import { ForSure } from '@forsure/cli'

// Create a new ForSure instance
const forsure = new ForSure()

// Parse a ForSure file
const project = await forsure.parse('project.forsure')

// Generate the file structure
await forsure.generate(project, { output: './dist' })`}
          language="javascript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Core APIs</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">File Parser API</h3>
            <p>Parse and validate ForSure files:</p>
            <DocsCodeBlock
              code={`import { Parser } from '@forsure/parser'

const parser = new Parser()

// Parse a ForSure file
const ast = await parser.parseFile('project.forsure')

// Validate the AST
const validation = parser.validate(ast)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}

// Get file tree
const fileTree = parser.buildFileTree(ast)
console.log(fileTree)`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Generator API</h3>
            <p>Generate file structures from parsed ForSure files:</p>
            <DocsCodeBlock
              code={`import { Generator } from '@forsure/generator'

const generator = new Generator({
  outputDir: './output',
  overwrite: false,
  dryRun: false
})

// Generate files
const result = await generator.generate(fileTree)

console.log(\`Generated \${result.files.length} files\`)
console.log(\`Created \${result.directories.length} directories\`)`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Template Engine API</h3>
            <p>Use ForSure's template system for code generation:</p>
            <DocsCodeBlock
              code={`import { TemplateEngine } from '@forsure/templates'

const templates = new TemplateEngine({
  templateDir: './templates',
  variables: {
    author: 'Your Name',
    license: 'MIT'
  }
})

// Render a template
const component = await templates.render('react-component.tsx', {
  name: 'MyButton',
  props: ['onClick', 'children'],
  typescript: true
})

// Write to file
await templates.writeFile('MyButton.tsx', component)`}
              language="javascript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
        <p>Configure the API to match your needs:</p>

        <DocsCodeBlock
          code={`import { ForSure } from '@forsure/cli'

const forsure = new ForSure({
  // Global configuration
  config: './.forsurerc.json',
  
  // Generator options
  generator: {
    outputDir: './dist',
    overwrite: true,
    dryRun: false,
    templates: './templates'
  },
  
  // Parser options
  parser: {
    strict: true,
    allowComments: true,
    validateImports: true
  },
  
  // Template variables
  variables: {
    author: 'Your Name',
    version: '1.0.0',
    license: 'MIT'
  }
})`}
          language="javascript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Error Handling</h2>
        <p>Proper error handling for robust applications:</p>

        <DocsCodeBlock
          code={`import { ForSure, ParseError, GenerateError } from '@forsure/cli'

async function processProject(filePath) {
  try {
    const forsure = new ForSure()
    
    // Parse the file
    const ast = await forsure.parse(filePath)
    
    // Validate
    const validation = forsure.validate(ast)
    if (!validation.valid) {
      throw new Error(\`Validation failed: \${validation.errors.join(', ')}\`)
    }
    
    // Generate
    await forsure.generate(ast, { output: './output' })
    
    console.log('Project generated successfully')
    
  } catch (error) {
    if (error instanceof ParseError) {
      console.error('Parse error:', error.message)
      console.error('Location:', error.line, error.column)
    } else if (error instanceof GenerateError) {
      console.error('Generation error:', error.message)
      console.error('File:', error.file)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}`}
          language="javascript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Events & Hooks</h2>
        <p>Listen to events and hook into the generation process:</p>

        <DocsCodeBlock
          code={`import { ForSure } from '@forsure/cli'

const forsure = new ForSure()

// Listen to parse events
forsure.on('parse:start', (file) => {
  console.log(\`Parsing \${file}...\`)
})

forsure.on('parse:complete', (ast) => {
  console.log('Parsing complete')
})

// Listen to generation events
forsure.on('generate:file:start', (file) => {
  console.log(\`Generating \${file.path}...\`)
})

forsure.on('generate:file:complete', (file) => {
  console.log(\`Generated \${file.path}\`)
})

forsure.on('generate:complete', (result) => {
  console.log(\`Generated \${result.files.length} files\`)
})

// Custom hooks
forsure.hook('before:generate', async (context) => {
  // Custom logic before generation
  console.log('Preparing for generation...')
})

forsure.hook('after:generate', async (context) => {
  // Custom logic after generation
  console.log('Cleaning up after generation...')
})`}
          language="javascript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">TypeScript Support</h2>
        <p>Full TypeScript support with type definitions:</p>

        <DocsCodeBlock
          code={`import { ForSure, FileTree, GeneratorOptions } from '@forsure/cli'

interface CustomOptions extends GeneratorOptions {
  customFeature: boolean
  metadata?: Record<string, any>
}

async function generateProject(
  filePath: string,
  options: CustomOptions
): Promise<void> {
  const forsure = new ForSure()
  
  const ast: FileTree = await forsure.parse(filePath)
  
  await forsure.generate(ast, {
    outputDir: options.outputDir,
    customFeature: options.customFeature,
    metadata: options.metadata
  })
}

// Usage with type safety
generateProject('project.forsure', {
  outputDir: './dist',
  customFeature: true,
  metadata: { version: '1.0.0' }
})`}
          language="typescript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Explore specific API documentation:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/docs/api/node" className="text-primary hover:underline">
              Node.js API Documentation →
            </Link>
          </li>
          <li>
            <Link href="/docs/api/programmatic-usage" className="text-primary hover:underline">
              Programmatic Usage Guide →
            </Link>
          </li>
          <li>
            <Link href="/docs/cli" className="text-primary hover:underline">
              CLI Reference →
            </Link>
          </li>
          <li>
            <Link href="/docs/examples" className="text-primary hover:underline">
              See API Examples →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
