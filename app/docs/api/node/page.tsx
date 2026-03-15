import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function NodeAPIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Node.js API
        </h1>
        <p className="text-lg text-muted-foreground">
          Use ForSure programmatically in Node.js applications with comprehensive APIs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
        <p>Install the ForSure Node.js package:</p>
        <DocsCodeBlock
          code={`# Install via npm
npm install @forsure/cli

# Install via yarn
yarn add @forsure/cli

# Install via pnpm
pnpm add @forsure/cli`}
          language="bash"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Usage</h2>
        <p>Get started with the ForSure Node.js API:</p>

        <DocsCodeBlock
          code={`import { ForSure } from '@forsure/cli'

// Create a new ForSure instance
const forsure = new ForSure()

// Parse a ForSure file
const project = await forsure.parse('project.forsure')

// Generate the file structure
await forsure.generate(project, { 
  output: './dist',
  overwrite: false 
})

console.log('Project generated successfully!')`}
          language="javascript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">ForSure Class</h3>
            <p>The main class for interacting with ForSure:</p>
            
            <DocsCodeBlock
              code={`import { ForSure } from '@forsure/cli'

// Constructor
const forsure = new ForSure(options)

// Options
interface ForSureOptions {
  config?: string              // Path to config file
  outputDir?: string           // Default output directory
  templates?: string          // Templates directory
  overwrite?: boolean         // Overwrite existing files
  dryRun?: boolean            // Dry run mode
  verbose?: boolean           // Verbose logging
  variables?: Record<string, any> // Template variables
}`}
              language="typescript"
            />

            <h4 className="font-medium mt-4 mb-2">Methods:</h4>
            <DocsCodeBlock
              code={`// Parse a ForSure file
async parse(filePath: string): Promise<FileTree>

// Validate a parsed file tree
validate(fileTree: FileTree): ValidationResult

// Generate files from file tree
async generate(fileTree: FileTree, options?: GenerateOptions): Promise<GenerateResult>

// Parse and generate in one step
async build(filePath: string, options?: BuildOptions): Promise<BuildResult>

// Watch for file changes
watch(filePath: string, callback: WatchCallback): Watcher

// Get available templates
getTemplates(): Template[]

// Render a template
async renderTemplate(templateName: string, data: any): Promise<string>`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">FileTree API</h3>
            <p>Work with parsed file tree structures:</p>
            
            <DocsCodeBlock
              code={`interface FileTree {
  name: string
  type: 'directory' | 'file'
  path: string
  children?: FileTree[]
  content?: string
  attributes?: Record<string, any>
  metadata?: FileMetadata
}

interface FileMetadata {
  permissions?: string
  encoding?: string
  created?: Date
  modified?: Date
  size?: number
}

// Example usage
const fileTree = await forsure.parse('project.forsure')

// Find specific files
const jsFiles = fileTree.find(file => file.path.endsWith('.js'))

// Get directory structure
const directories = fileTree.filter(item => item.type === 'directory')

// Access file attributes
const mainFile = fileTree.find(file => file.attributes?.entry === true)`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Generator Options</h3>
            <p>Configure the generation process:</p>
            
            <DocsCodeBlock
              code={`interface GenerateOptions {
  outputDir: string              // Output directory
  overwrite?: boolean           // Overwrite existing files
  dryRun?: boolean             // Dry run mode
  templates?: string           // Custom templates directory
  variables?: Record<string, any> // Template variables
  filters?: FileFilter[]       // File filters
  hooks?: GenerateHooks         // Generation hooks
  progress?: ProgressCallback   // Progress callback
}

interface FileFilter {
  pattern: string              // Glob pattern
  exclude?: boolean            // Exclude or include
  condition?: (file: FileTree) => boolean // Custom condition
}

interface GenerateHooks {
  beforeGenerate?: (context: GenerateContext) => Promise<void>
  afterGenerate?: (context: GenerateContext) => Promise<void>
  beforeFile?: (file: FileTree, context: GenerateContext) => Promise<void>
  afterFile?: (file: FileTree, context: GenerateContext) => Promise<void>
}

// Example usage
await forsure.generate(fileTree, {
  outputDir: './dist',
  overwrite: true,
  variables: {
    author: 'Your Name',
    version: '1.0.0'
  },
  hooks: {
    beforeGenerate: async (context) => {
      console.log('Starting generation...')
    },
    afterFile: async (file, context) => {
      console.log(\`Generated \${file.path}\`)
    }
  }
})`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Advanced Usage</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Custom Templates</h3>
            <p>Create and use custom templates:</p>
            
            <DocsCodeBlock
              code={`import { TemplateEngine } from '@forsure/cli'

const templates = new TemplateEngine({
  templateDir: './my-templates',
  variables: {
    author: 'Your Name',
    license: 'MIT'
  }
})

// Create a custom template
await templates.create('react-component.tsx', \`
import React from 'react'

interface {{name}}Props {
  {{#each props}}
  {{this}}: any
  {{/each}}
}

export const {{name}}: React.FC<{{name}}Props> = ({{#each props}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}) => {
  return (
    <div className="{{cssClass}}">
      {{children}}
    </div>
  )
}
\`)

// Use the template
const component = await templates.render('react-component.tsx', {
  name: 'MyButton',
  props: ['onClick', 'children'],
  cssClass: 'btn'
})`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">File Watching</h3>
            <p>Watch for changes and auto-generate:</p>
            
            <DocsCodeBlock
              code={`import { ForSure } from '@forsure/cli'

const forsure = new ForSure()

// Watch a ForSure file
const watcher = forsure.watch('project.forsure', async (event) => {
  console.log(\`File changed: \${event.type}\`)
  
  if (event.type === 'change') {
    try {
      await forsure.build('project.forsure', {
        output: './dist'
      })
      console.log('Project regenerated successfully')
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }
})

// Handle errors
watcher.on('error', (error) => {
  console.error('Watcher error:', error)
})

// Stop watching
setTimeout(() => {
  watcher.stop()
}, 60000) // Stop after 1 minute`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Plugin System</h3>
            <p>Extend ForSure with plugins:</p>
            
            <DocsCodeBlock
              code={`import { ForSure, Plugin } from '@forsure/cli'

// Create a custom plugin
class CustomPlugin implements Plugin {
  name = 'custom-plugin'
  version = '1.0.0'

  async install(forsure: ForSure) {
    // Register custom commands
    forsure.registerCommand('custom-command', this.handleCustomCommand)
    
    // Register hooks
    forsure.hook('before:generate', this.beforeGenerate)
  }

  async handleCustomCommand(options: any) {
    console.log('Executing custom command...')
    // Custom logic here
  }

  async beforeGenerate(context: any) {
    console.log('Custom plugin: Before generation')
    // Custom logic here
  }
}

// Use the plugin
const forsure = new ForSure()
await forsure.use(new CustomPlugin())`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Error Handling</h2>
        <p>Robust error handling for production applications:</p>

        <DocsCodeBlock
          code={`import { ForSure, ParseError, GenerateError, ValidationError } from '@forsure/cli'

class ForSureManager {
  private forsure: ForSure

  constructor() {
    this.forsure = new ForSure({
      verbose: true,
      dryRun: false
    })
  }

  async buildProject(filePath: string, outputDir: string) {
    try {
      // Parse the file
      const fileTree = await this.forsure.parse(filePath)
      
      // Validate
      const validation = this.forsure.validate(fileTree)
      if (!validation.valid) {
        throw new ValidationError(validation.errors)
      }
      
      // Generate
      const result = await this.forsure.generate(fileTree, {
        outputDir,
        overwrite: true
      })
      
      return result
      
    } catch (error) {
      if (error instanceof ParseError) {
        console.error('Parse error:', error.message)
        console.error('Location:', error.line, error.column)
        throw new Error(\`Failed to parse \${filePath}: \${error.message}\`)
      } else if (error instanceof GenerateError) {
        console.error('Generation error:', error.message)
        console.error('File:', error.file)
        throw new Error(\`Failed to generate files: \${error.message}\`)
      } else if (error instanceof ValidationError) {
        console.error('Validation errors:', error.errors)
        throw new Error(\`Validation failed: \${error.errors.join(', ')}\`)
      } else {
        console.error('Unexpected error:', error)
        throw error
      }
    }
  }
}

// Usage
const manager = new ForSureManager()
manager.buildProject('project.forsure', './dist')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error.message))`}
          language="typescript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Integration Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Express.js Integration</h3>
            <p>Integrate ForSure with Express.js applications:</p>
            
            <DocsCodeBlock
              code={`import express from 'express'
import { ForSure } from '@forsure/cli'

const app = express()
const forsure = new ForSure()

// API endpoint to generate projects
app.post('/api/generate', async (req, res) => {
  try {
    const { forsureContent, options } = req.body
    
    // Parse the ForSure content
    const fileTree = await forsure.parseContent(forsureContent)
    
    // Generate files
    const result = await forsure.generate(fileTree, {
      outputDir: './temp',
      ...options
    })
    
    res.json({
      success: true,
      result: {
        files: result.files,
        directories: result.directories
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// API endpoint to validate ForSure files
app.post('/api/validate', async (req, res) => {
  try {
    const { forsureContent } = req.body
    
    const fileTree = await forsure.parseContent(forsureContent)
    const validation = forsure.validate(fileTree)
    
    res.json({
      valid: validation.valid,
      errors: validation.errors || []
    })
  } catch (error) {
    res.status(500).json({
      valid: false,
      errors: [error.message]
    })
  }
})

app.listen(3000, () => {
  console.log('ForSure API server running on port 3000')
})`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Webpack Plugin</h3>
            <p>Create a Webpack plugin for ForSure:</p>
            
            <DocsCodeBlock
              code={`class ForSureWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      entry: './project.forsure',
      output: './src/generated',
      ...options
    }
  }

  apply(compiler) {
    const pluginName = 'ForSureWebpackPlugin'
    
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        const { ForSure } = await import('@forsure/cli')
        const forsure = new ForSure()
        
        // Generate files before compilation
        await forsure.build(this.options.entry, {
          output: this.options.output
        })
        
        console.log('ForSure files generated successfully')
        callback()
      } catch (error) {
        console.error('ForSure generation failed:', error)
        callback(error)
      }
    })
  }
}

// Usage in webpack.config.js
module.exports = {
  // ... other config
  plugins: [
    new ForSureWebpackPlugin({
      entry: './project.forsure',
      output: './src/generated'
    })
  ]
}`}
              language="javascript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Performance</h2>
        <p>Tips for optimal performance:</p>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Performance Best Practices:</h4>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Use dry-run mode for validation before generation</li>
            <li>Enable file watching only during development</li>
            <li>Cache parsed file trees for repeated use</li>
            <li>Use streaming for large file sets</li>
            <li>Implement proper error handling to avoid crashes</li>
            <li>Use worker threads for CPU-intensive operations</li>
          </ul>
        </div>

        <DocsCodeBlock
          code={`import { ForSure } from '@forsure/cli'

// Performance-optimized usage
class OptimizedForSure {
  private cache = new Map()
  private forsure = new ForSure({ verbose: false })

  async parseWithCache(filePath: string) {
    const cacheKey = \`\${filePath}:\${Date.now()}\`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const fileTree = await this.forsure.parse(filePath)
    this.cache.set(cacheKey, fileTree)
    
    // Clean old cache entries
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    return fileTree
  }

  async generateOptimized(fileTree: FileTree, options: GenerateOptions) {
    // Use streaming for large projects
    if (fileTree.getAllFiles().length > 1000) {
      return this.forsure.generateStream(fileTree, options)
    }
    
    return this.forsure.generate(fileTree, options)
  }
}`}
          language="typescript"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Continue exploring the ForSure API:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/docs/api/programmatic-usage" className="text-primary hover:underline">
              Programmatic Usage Guide →
            </Link>
          </li>
          <li>
            <Link href="/docs/api" className="text-primary hover:underline">
              Back to API Reference →
            </Link>
          </li>
          <li>
            <Link href="/docs/examples" className="text-primary hover:underline">
              See Examples →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
