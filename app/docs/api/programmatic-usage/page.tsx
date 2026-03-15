import Link from 'next/link'
import DocsCodeBlock from '@/components/docs-code-block'

export default function ProgrammaticUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Programmatic Usage
        </h1>
        <p className="text-lg text-muted-foreground">
          Advanced programmatic usage patterns and techniques for ForSure.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Core Concepts</h2>
        <p>
          Understanding the core concepts of ForSure's programmatic API:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Parser</h3>
            <p className="text-sm text-muted-foreground">
              Parse ForSure files into abstract syntax trees
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Generator</h3>
            <p className="text-sm text-muted-foreground">
              Generate file structures from parsed ASTs
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Template Engine</h3>
            <p className="text-sm text-muted-foreground">
              Render templates with custom data
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">File System</h3>
            <p className="text-sm text-muted-foreground">
              Virtual file system for operations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Advanced Patterns</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Pipeline Processing</h3>
            <p>Create processing pipelines for complex workflows:</p>
            
            <DocsCodeBlock
              code={`import { Parser, Generator, TemplateEngine, Validator } from '@forsure/core'

class ForSurePipeline {
  private parser: Parser
  private generator: Generator
  private templates: TemplateEngine
  private validator: Validator

  constructor() {
    this.parser = new Parser()
    this.generator = new Generator()
    this.templates = new TemplateEngine()
    this.validator = new Validator()
  }

  async process(input: string, options: ProcessOptions) {
    // Pipeline stages
    const stages = [
      this.parseStage.bind(this),
      this.validateStage.bind(this),
      this.transformStage.bind(this),
      this.generateStage.bind(this),
      this.postProcessStage.bind(this)
    ]

    let result = input
    for (const stage of stages) {
      result = await stage(result, options)
    }

    return result
  }

  private async parseStage(input: string, options: ProcessOptions) {
    return this.parser.parse(input, {
      strict: options.strict,
      allowComments: true
    })
  }

  private async validateStage(ast: FileTree, options: ProcessOptions) {
    const validation = this.validator.validate(ast)
    if (!validation.valid && !options.skipValidation) {
      throw new ValidationError(validation.errors)
    }
    return ast
  }

  private async transformStage(ast: FileTree, options: ProcessOptions) {
    // Apply transformations
    if (options.transforms) {
      for (const transform of options.transforms) {
        ast = await transform(ast)
      }
    }
    return ast
  }

  private async generateStage(ast: FileTree, options: ProcessOptions) {
    return this.generator.generate(ast, {
      outputDir: options.output,
      templates: options.templateDir
    })
  }

  private async postProcessStage(result: GenerateResult, options: ProcessOptions) {
    // Post-processing steps
    if (options.optimize) {
      result = await this.optimizeResult(result)
    }
    return result
  }
}

// Usage
const pipeline = new ForSurePipeline()
const result = await pipeline.process('project.forsure', {
  output: './dist',
  strict: true,
  transforms: [customTransform],
  optimize: true
})`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Virtual File System</h3>
            <p>Work with virtual file systems for testing and simulation:</p>
            
            <DocsCodeBlock
              code={`import { VirtualFileSystem, ForSure } from '@forsure/core'

class VirtualForSure {
  private vfs: VirtualFileSystem
  private forsure: ForSure

  constructor() {
    this.vfs = new VirtualFileSystem()
    this.forsure = new ForSure({ fileSystem: this.vfs })
  }

  async simulateProject(forsureContent: string) {
    // Create virtual files
    await this.vfs.writeFile('project.forsure', forsureContent)
    
    // Parse and generate in virtual environment
    const fileTree = await this.forsure.parse('project.forsure')
    await this.forsure.generate(fileTree, { output: '/virtual/output' })
    
    // Get virtual file structure
    const structure = this.vfs.getTree('/virtual/output')
    
    // Analyze without touching real filesystem
    const analysis = {
      fileCount: structure.getAllFiles().length,
      directoryCount: structure.getAllDirectories().length,
      totalSize: structure.getTotalSize(),
      largestFile: structure.getLargestFile(),
      fileTypes: structure.getFileTypes()
    }
    
    return { structure, analysis }
  }

  async testGeneration(forsureContent: string, expectedStructure: any) {
    const result = await this.simulateProject(forsureContent)
    
    // Compare with expected structure
    const differences = this.compareStructures(
      result.structure, 
      expectedStructure
    )
    
    return {
      matches: differences.length === 0,
      differences
    }
  }

  private compareStructures(actual: any, expected: any) {
    // Implementation for comparing structures
    return []
  }
}

// Usage for testing
const virtualFS = new VirtualForSure()
const test = await virtualFS.testGeneration(forsureContent, expected)
console.log('Test result:', test.matches)`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Plugin Architecture</h3>
            <p>Build extensible systems with plugins:</p>
            
            <DocsCodeBlock
              code={`import { Plugin, PluginManager, ForSure } from '@forsure/core'

interface PluginContext {
  forsure: ForSure
  config: any
  logger: Logger
}

// Base plugin class
abstract class BasePlugin implements Plugin {
  abstract name: string
  abstract version: string
  
  abstract async install(context: PluginContext): Promise<void>
  abstract async uninstall(context: PluginContext): Promise<void>
}

// Custom plugin example
class CodeQualityPlugin extends BasePlugin {
  name = 'code-quality'
  version = '1.0.0'

  async install(context: PluginContext) {
    // Register hooks
    context.forsure.hook('after:generate', this.checkCodeQuality)
    
    // Register commands
    context.forsure.registerCommand('quality-check', this.qualityCheck)
    
    context.logger.info('Code quality plugin installed')
  }

  async uninstall(context: PluginContext) {
    context.forsure.removeHook('after:generate', this.checkCodeQuality)
    context.forsure.unregisterCommand('quality-check')
    context.logger.info('Code quality plugin uninstalled')
  }

  private async checkCodeQuality(context: GenerateContext) {
    const files = context.result.files
    
    for (const file of files) {
      if (file.path.endsWith('.ts') || file.path.endsWith('.js')) {
        const quality = await this.analyzeCodeQuality(file.content)
        
        if (quality.score < 0.8) {
          context.logger.warn(\`Low quality score for \${file.path}: \${quality.score}\`)
        }
      }
    }
  }

  private async qualityCheck(options: any) {
    // Implementation for quality check command
    console.log('Running code quality check...')
  }

  private async analyzeCodeQuality(code: string) {
    // Implementation for code quality analysis
    return { score: 0.9, issues: [] }
  }
}

// Plugin manager
class EnhancedForSure extends ForSure {
  private pluginManager: PluginManager

  constructor(options: any) {
    super(options)
    this.pluginManager = new PluginManager()
  }

  async use(plugin: Plugin) {
    await this.pluginManager.install(plugin, {
      forsure: this,
      config: this.config,
      logger: this.logger
    })
  }

  async remove(pluginName: string) {
    await this.pluginManager.uninstall(pluginName)
  }

  getPlugins() {
    return this.pluginManager.getPlugins()
  }
}

// Usage
const enhancedForSure = new EnhancedForSure({})
await enhancedForSure.use(new CodeQualityPlugin())`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Data Transformations</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">AST Transformations</h3>
            <p>Transform abstract syntax trees programmatically:</p>
            
            <DocsCodeBlock
              code={`import { FileTree, Transform } from '@forsure/core'

class ASTTransformer {
  // Add TypeScript types to all JS files
  static addTypeScript(fileTree: FileTree): FileTree {
    const transformer = new Transform()
    
    return transformer.transform(fileTree, {
      visitor: {
        File: (node) => {
          if (node.path.endsWith('.js') && !node.attributes?.typescript) {
            // Convert to TypeScript
            node.path = node.path.replace('.js', '.ts')
            node.attributes = { ...node.attributes, typescript: true }
            
            // Add type imports if needed
            if (node.content) {
              node.content = this.addTypeImports(node.content)
            }
          }
          return node
        }
      }
    })
  }

  // Add test files to all components
  static addTests(fileTree: FileTree): FileTree {
    const transformer = new Transform()
    
    return transformer.transform(fileTree, {
      visitor: {
        Directory: (node) => {
          if (node.name === 'components') {
            // Add test files for each component
            node.children?.forEach(child => {
              if (child.type === 'file' && child.path.endsWith('.tsx')) {
                const testFile = this.createTestFile(child)
                node.children?.push(testFile)
              }
            })
          }
          return node
        }
      }
    })
  }

  // Optimize file structure
  static optimize(fileTree: FileTree): FileTree {
    const transformer = new Transform()
    
    return transformer.transform(fileTree, {
      visitor: {
        FileTree: (node) => {
          // Remove empty directories
          node.children = node.children?.filter(child => {
            if (child.type === 'directory') {
              return child.children && child.children.length > 0
            }
            return true
          })
          
          // Sort files alphabetically
          node.children?.sort((a, b) => a.path.localeCompare(b.path))
          
          return node
        }
      }
    })
  }

  private static addTypeImports(content: string): string {
    // Logic to add TypeScript imports
    return content
  }

  private static createTestFile(componentFile: any): any {
    const componentName = componentFile.name.replace('.tsx', '')
    return {
      name: \`\${componentName}.test.tsx\`,
      type: 'file',
      path: \`\${componentFile.path.replace('.tsx', '.test.tsx')}\`,
      content: this.generateTestContent(componentName),
      attributes: { test: true }
    }
  }

  private static generateTestContent(componentName: string): string {
    return \`
import { render, screen } from '@testing-library/react'
import { \${componentName} } from './\${componentName}'

describe('\${componentName}', () => {
  it('renders correctly', () => {
    render(<\${componentName} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
\`
  }
}

// Usage
const transformer = new ASTTransformer()
let fileTree = await forsure.parse('project.forsure')

fileTree = transformer.addTypeScript(fileTree)
fileTree = transformer.addTests(fileTree)
fileTree = transformer.optimize(fileTree)

await forsure.generate(fileTree, { output: './optimized-project' })`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Template Composition</h3>
            <p>Compose templates for complex generation scenarios:</p>
            
            <DocsCodeBlock
              code={`import { TemplateEngine, Composer } from '@forsure/core'

class TemplateComposer {
  private engine: TemplateEngine
  private composer: Composer

  constructor() {
    this.engine = new TemplateEngine()
    this.composer = new Composer()
  }

  // Compose multiple templates
  async composeComponent(templateName: string, options: ComponentOptions) {
    const templates = [
      'component-header',
      'component-body',
      'component-footer',
      'component-styles',
      'component-test',
      'component-story'
    ]

    const parts = await Promise.all(
      templates.map(template => 
        this.engine.render(template, {
          name: options.name,
          props: options.props,
          ...options
        })
      )
    )

    return this.composer.join(parts, '\\n\\n')
  }

  // Conditional template rendering
  async renderSmartTemplate(templateName: string, data: any) {
    const context = this.createContext(data)
    
    // Determine which template to use
    const selectedTemplate = this.selectTemplate(templateName, context)
    
    // Render with enhanced context
    return this.engine.render(selectedTemplate, context)
  }

  // Template inheritance
  async renderWithInheritance(templateName: string, data: any) {
    const template = await this.engine.getTemplate(templateName)
    
    if (template.extends) {
      // Render parent template first
      const parentContent = await this.renderWithInheritance(template.extends, data)
      
      // Override blocks
      return this.composer.inherit(parentContent, template, data)
    }
    
    return this.engine.render(templateName, data)
  }

  private createContext(data: any) {
    return {
      ...data,
      timestamp: new Date().toISOString(),
      author: data.author || 'Unknown',
      version: data.version || '1.0.0',
      helpers: {
        capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
        kebabCase: (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase(),
        camelCase: (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      }
    }
  }

  private selectTemplate(baseName: string, context: any) {
    if (context.typescript) {
      return \`\${baseName}-ts\`
    }
    if (context.storybook) {
      return \`\${baseName}-sb\`
    }
    return baseName
  }
}

// Usage
const composer = new TemplateComposer()

const component = await composer.composeComponent('button', {
  name: 'MyButton',
  props: ['onClick', 'children', 'variant'],
  typescript: true,
  storybook: true,
  test: true
})

console.log(component) // Complete component with all parts`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Integration Patterns</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Event-Driven Architecture</h3>
            <p>Build event-driven systems with ForSure:</p>
            
            <DocsCodeBlock
              code={`import { EventEmitter, ForSure } from '@forsure/core'

class ForSureEventBus extends EventEmitter {
  private forsure: ForSure
  private middleware: Middleware[]

  constructor() {
    super()
    this.forsure = new ForSure()
    this.middleware = []
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // Parse events
    this.on('parse:start', (data) => this.emit('lifecycle:start', 'parse', data))
    this.on('parse:complete', (data) => this.emit('lifecycle:complete', 'parse', data))
    this.on('parse:error', (error) => this.emit('lifecycle:error', 'parse', error))

    // Generate events
    this.on('generate:start', (data) => this.emit('lifecycle:start', 'generate', data))
    this.on('generate:file', (data) => this.emit('file:created', data))
    this.on('generate:complete', (data) => this.emit('lifecycle:complete', 'generate', data))
    this.on('generate:error', (error) => this.emit('lifecycle:error', 'generate', error))
  }

  async parseWithEvents(filePath: string) {
    this.emit('parse:start', { filePath })
    
    try {
      const result = await this.forsure.parse(filePath)
      this.emit('parse:complete', { filePath, result })
      return result
    } catch (error) {
      this.emit('parse:error', { filePath, error })
      throw error
    }
  }

  async generateWithEvents(fileTree: FileTree, options: any) {
    this.emit('generate:start', { fileCount: fileTree.getAllFiles().length })
    
    try {
      const result = await this.forsure.generate(fileTree, options)
      this.emit('generate:complete', { result })
      return result
    } catch (error) {
      this.emit('generate:error', { error })
      throw error
    }
  }

  use(middleware: Middleware) {
    this.middleware.push(middleware)
  }

  private emit(event: string, data: any) {
    // Apply middleware
    let processedData = data
    for (const mw of this.middleware) {
      processedData = mw.process(event, processedData)
    }
    
    super.emit(event, processedData)
  }
}

// Middleware example
class LoggingMiddleware implements Middleware {
  process(event: string, data: any) {
    console.log(\`[\${new Date().toISOString()}] \${event}:\`, data)
    return data
  }
}

// Usage
const eventBus = new ForSureEventBus()
eventBus.use(new LoggingMiddleware())

// Listen to events
eventBus.on('file:created', (data) => {
  console.log(\`File created: \${data.file.path}\`)
})

eventBus.on('lifecycle:complete', (data) => {
  console.log(\`\${data.stage} completed successfully\`)
})

await eventBus.parseWithEvents('project.forsure')
await eventBus.generateWithEvents(fileTree, { output: './dist' })`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Streaming API</h3>
            <p>Handle large projects with streaming:</p>
            
            <DocsCodeBlock
              code={`import { StreamParser, StreamGenerator } from '@forsure/core'

class StreamingForSure {
  async parseStream(inputStream: NodeJS.ReadableStream) {
    const parser = new StreamParser()
    
    return new Promise((resolve, reject) => {
      inputStream.on('data', (chunk) => {
        parser.write(chunk.toString())
      })
      
      inputStream.on('end', () => {
        parser.end()
        resolve(parser.getResult())
      })
      
      inputStream.on('error', reject)
      parser.on('error', reject)
    })
  }

  async generateStream(fileTree: FileTree, outputStream: NodeJS.WritableStream) {
    const generator = new StreamGenerator()
    
    // Stream files one by one
    for (const file of fileTree.getAllFiles()) {
      const fileData = await generator.generateFile(file)
      
      await new Promise((resolve, reject) => {
        outputStream.write(fileData, (error) => {
          if (error) reject(error)
          else resolve(void 0)
        })
      })
    }
    
    outputStream.end()
  }

  async processLargeProject(inputPath: string, outputPath: string) {
    const readStream = fs.createReadStream(inputPath)
    const writeStream = fs.createWriteStream(outputPath)
    
    try {
      // Parse with streaming
      const fileTree = await this.parseStream(readStream)
      
      // Generate with streaming
      await this.generateStream(fileTree, writeStream)
      
      console.log('Large project processed successfully')
    } catch (error) {
      console.error('Streaming processing failed:', error)
    }
  }
}

// Usage for large files
const streamingForSure = new StreamingForSure()
await streamingForSure.processLargeProject('large-project.forsure', 'output.tar.gz')`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Testing & Debugging</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Test Utilities</h3>
            <p>Utilities for testing ForSure applications:</p>
            
            <DocsCodeBlock
              code={`import { TestForSure, MockFileSystem } from '@forsure/testing'

class ForSureTestUtils {
  private testForSure: TestForSure
  private mockFS: MockFileSystem

  constructor() {
    this.mockFS = new MockFileSystem()
    this.testForSure = new TestForSure({ fileSystem: this.mockFS })
  }

  // Test file parsing
  async testParsing(forsureContent: string, expectedStructure: any) {
    const result = await this.testForSure.parse(forsureContent)
    
    return {
      success: this.compareStructures(result, expectedStructure),
      result,
      differences: this.getDifferences(result, expectedStructure)
    }
  }

  // Test file generation
  async testGeneration(forsureContent: string, expectedFiles: string[]) {
    const fileTree = await this.testForSure.parse(forsureContent)
    await this.testForSure.generate(fileTree, { output: '/test' })
    
    const generatedFiles = this.mockFS.getFiles('/test')
    
    return {
      success: this.arraysEqual(generatedFiles, expectedFiles),
      generatedFiles,
      expectedFiles,
      missing: expectedFiles.filter(f => !generatedFiles.includes(f)),
      extra: generatedFiles.filter(f => !expectedFiles.includes(f))
    }
  }

  // Performance testing
  async testPerformance(forsureContent: string, iterations: number = 100) {
    const times: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await this.testForSure.parse(forsureContent)
      const end = performance.now()
      times.push(end - start)
    }
    
    return {
      average: times.reduce((a, b) => a + b) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.median(times),
      p95: this.percentile(times, 95)
    }
  }

  // Integration testing
  async testIntegration(workflow: Workflow) {
    const results = []
    
    for (const step of workflow.steps) {
      try {
        const result = await this.executeStep(step)
        results.push({ step: step.name, success: true, result })
      } catch (error) {
        results.push({ step: step.name, success: false, error: error.message })
      }
    }
    
    return {
      success: results.every(r => r.success),
      results
    }
  }

  private compareStructures(actual: any, expected: any): boolean {
    // Implementation for structure comparison
    return JSON.stringify(actual) === JSON.stringify(expected)
  }

  private getDifferences(actual: any, expected: any): any[] {
    // Implementation for finding differences
    return []
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i])
  }

  private median(numbers: number[]): number {
    const sorted = numbers.sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }

  private percentile(numbers: number[], p: number): number {
    const sorted = numbers.sort((a, b) => a - b)
    const index = (p / 100) * (sorted.length - 1)
    return sorted[Math.ceil(index) - 1]
  }

  private async executeStep(step: WorkflowStep) {
    // Implementation for executing workflow steps
    return {}
  }
}

// Usage in tests
const testUtils = new ForSureTestUtils()

const parseTest = await testUtils.testParsing(forsureContent, expectedStructure)
console.log('Parse test result:', parseTest.success)

const generateTest = await testUtils.testGeneration(forsureContent, expectedFiles)
console.log('Generate test result:', generateTest.success)

const perfTest = await testUtils.testPerformance(forsureContent, 1000)
console.log('Performance:', perfTest.average, 'ms')`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Debug Tools</h3>
            <p>Debug ForSure applications with advanced tools:</p>
            
            <DocsCodeBlock
              code={`import { Debugger, Tracer, Profiler } from '@forsure/debug'

class ForSureDebugger {
  private debugger: Debugger
  private tracer: Tracer
  private profiler: Profiler

  constructor() {
    this.debugger = new Debugger()
    this.tracer = new Tracer()
    this.profiler = new Profiler()
  }

  // Debug parsing
  async debugParsing(filePath: string) {
    const session = this.debugger.createSession('parsing')
    
    session.trace('parser', 'Starting parse', { file: filePath })
    
    try {
      const result = await this.tracer.trace('parse', async () => {
        return await this.forsure.parse(filePath)
      })
      
      session.trace('parser', 'Parse completed', { 
        fileCount: result.getAllFiles().length,
        directoryCount: result.getAllDirectories().length
      })
      
      return session.getReport()
    } catch (error) {
      session.trace('parser', 'Parse failed', { error: error.message })
      throw error
    }
  }

  // Profile generation
  async profileGeneration(fileTree: FileTree, options: any) {
    const profile = this.profiler.start('generation')
    
    try {
      const result = await this.forsure.generate(fileTree, options)
      
      profile.addMetric('files-generated', result.files.length)
      profile.addMetric('directories-created', result.directories.length)
      profile.addMetric('total-size', result.totalSize)
      
      return profile.getReport()
    } finally {
      profile.stop()
    }
  }

  // Memory usage tracking
  async trackMemoryUsage(operation: () => Promise<any>) {
    const before = process.memoryUsage()
    
    const result = await operation()
    
    const after = process.memoryUsage()
    const diff = {
      rss: after.rss - before.rss,
      heapUsed: after.heapUsed - before.heapUsed,
      heapTotal: after.heapTotal - before.heapTotal,
      external: after.external - before.external
    }
    
    return { result, memoryDiff: diff }
  }

  // Visual debugging
  async visualizeAST(fileTree: FileTree) {
    const visualization = {
      nodes: fileTree.getAllNodes().map(node => ({
        id: node.id,
        type: node.type,
        name: node.name,
        path: node.path,
        attributes: node.attributes
      })),
      edges: fileTree.getAllEdges().map(edge => ({
        from: edge.from,
        to: edge.to,
        type: edge.type
      }))
    }
    
    return visualization
  }

  // Step-by-step debugging
  async debugStepByStep(filePath: string) {
    const steps = [
      { name: 'read-file', action: () => fs.readFile(filePath, 'utf8') },
      { name: 'parse-content', action: (content) => this.forsure.parseContent(content) },
      { name: 'validate-ast', action: (ast) => this.forsure.validate(ast) },
      { name: 'generate-files', action: (ast) => this.forsure.generate(ast) }
    ]
    
    let current = filePath
    const results = {}
    
    for (const step of steps) {
      console.log(\`Executing step: \${step.name}\`)
      
      try {
        const result = await step.action(current)
        results[step.name] = { success: true, result }
        current = result
        
        console.log(\`✓ \${step.name} completed\`)
      } catch (error) {
        results[step.name] = { success: false, error: error.message }
        console.error(\`✗ \${step.name} failed: \${error.message}\`)
        break
      }
    }
    
    return results
  }
}

// Usage
const debugger = new ForSureDebugger()

const parseReport = await debugger.debugParsing('project.forsure')
console.log('Parse debug report:', parseReport)

const profileReport = await debugger.profileGeneration(fileTree, { output: './dist' })
console.log('Generation profile:', profileReport.metrics)

const memoryReport = await debugger.trackMemoryUsage(async () => {
  return await forsure.build('project.forsure')
})
console.log('Memory usage:', memoryReport.memoryDiff)`}
              language="typescript"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
        <p>Continue exploring advanced ForSure features:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/docs/api/node" className="text-primary hover:underline">
              Node.js API Documentation →
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
