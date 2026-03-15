import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { Logger } from './logger'
import { ConfigManager } from './config-manager'

const execAsync = promisify(exec)

export interface ProjectOptions {
  template?: string
  name?: string
  directory?: string
  quantum?: boolean
  typescript?: boolean
  packageManager?: 'npm' | 'yarn' | 'pnpm'
  git?: boolean
  install?: boolean
}

export interface BuildOptions {
  watch?: boolean
  production?: boolean
  output?: string
}

export interface DevOptions {
  port?: number
  host?: string
  https?: boolean
}

export interface TestOptions {
  watch?: boolean
  coverage?: boolean
  verbose?: boolean
}

export interface LintOptions {
  fix?: boolean
  verbose?: boolean
}

export interface CleanOptions {
  all?: boolean
}

export class ProjectCLI {
  private logger: Logger
  private config: ConfigManager

  constructor() {
    this.logger = new Logger()
    this.config = new ConfigManager()
  }

  async init(options: ProjectOptions): Promise<void> {
    const spinner = ora('Initializing project...').start()

    try {
      // Get project name if not provided
      if (!options.name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Project name:',
            default: 'my-forsure-project',
            validate: (input: string) => {
              if (!input.trim()) return 'Project name is required'
              if (!/^[a-z0-9-_]+$/.test(input)) {
                return 'Project name can only contain lowercase letters, numbers, hyphens, and underscores'
              }
              return true
            }
          }
        ])
        options.name = answers.name
      }

      // Get template if not provided
      if (!options.template) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Choose project template:',
            choices: [
              { name: 'Quantum App (Recommended)', value: 'quantum-app' },
              { name: 'Design System', value: 'design-system' },
              { name: 'Component Library', value: 'component-library' },
              { name: 'Web Application', value: 'web-app' },
              { name: 'Next.js App', value: 'nextjs-app' },
              { name: 'React App', value: 'react-app' },
              { name: 'Basic Project', value: 'basic' }
            ]
          }
        ])
        options.template = answers.template
      }

      // Set defaults
      options.directory = options.directory || options.name
      options.quantum = options.quantum !== false
      options.typescript = options.typescript !== false
      options.packageManager = options.packageManager || 'npm'
      options.git = options.git !== false
      options.install = options.install !== false

      // Create project directory
      const projectPath = path.resolve(options.directory!)
      await fs.ensureDir(projectPath)

      // Copy template files
      const templatePath = path.join(__dirname, '../templates', options.template)
      if (await fs.pathExists(templatePath)) {
        await fs.copy(templatePath, projectPath, { overwrite: false })
      } else {
        // Create basic project structure
        await this.createBasicProject(projectPath, options)
      }

      // Update package.json
      await this.updatePackageJson(projectPath, options)

      // Initialize git repository
      if (options.git) {
        await this.initGit(projectPath)
      }

      // Install dependencies
      if (options.install) {
        await this.installDependencies(projectPath, options.packageManager!)
      }

      // Create initial files
      await this.createInitialFiles(projectPath, options)

      spinner.succeed(`Project ${options.name} initialized successfully!`)
    } catch (error) {
      spinner.fail('Failed to initialize project')
      throw error
    }
  }

  private async createBasicProject(projectPath: string, options: ProjectOptions): Promise<void> {
    const structure = {
      'src': {
        'components': {},
        'hooks': {},
        'lib': {},
        'styles': {},
        'types': {},
        'utils': {}
      },
      'public': {},
      'tests': {},
      'docs': {},
      '.vscode': {},
      '.github': {
        'workflows': {}
      }
    }

    for (const [dir, content] of Object.entries(structure)) {
      const dirPath = path.join(projectPath, dir)
      await fs.ensureDir(dirPath)
      
      if (typeof content === 'object' && content !== null) {
        for (const subDir of Object.keys(content)) {
          await fs.ensureDir(path.join(dirPath, subDir))
        }
      }
    }
  }

  private async updatePackageJson(projectPath: string, options: ProjectOptions): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json')
    
    let packageJson: any = {}
    if (await fs.pathExists(packageJsonPath)) {
      packageJson = await fs.readJson(packageJsonPath)
    } else {
      packageJson = {
        name: options.name,
        version: '1.0.0',
        description: `${options.name} - A ForSure Design System project`,
        main: 'src/index.ts',
        scripts: {},
        keywords: ['forsure', 'design-system'],
        author: '',
        license: 'MIT'
      }
    }

    // Add dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      '@forsure/design-system': '^1.0.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    }

    if (options.quantum) {
      packageJson.dependencies['@forsure/quantum'] = '^1.0.0'
    }

    if (options.typescript) {
      packageJson.dependencies['typescript'] = '^5.1.0'
      packageJson.dependencies['@types/react'] = '^18.2.0'
      packageJson.dependencies['@types/react-dom'] = '^18.2.0'
    }

    // Add dev dependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'vite': '^4.4.0',
      '@vitejs/plugin-react': '^4.0.0',
      'eslint': '^8.44.0',
      'prettier': '^3.0.0',
      'jest': '^29.6.0',
      '@testing-library/react': '^13.4.0',
      '@testing-library/jest-dom': '^5.16.0'
    }

    // Add scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'dev': 'vite',
      'build': 'vite build',
      'preview': 'vite preview',
      'test': 'jest',
      'test:watch': 'jest --watch',
      'lint': 'eslint src --ext .ts,.tsx',
      'lint:fix': 'eslint src --ext .ts,.tsx --fix',
      'format': 'prettier --write src/**/*.{ts,tsx}',
      'type-check': 'tsc --noEmit'
    }

    if (options.quantum) {
      packageJson.scripts['quantum:simulate'] = 'forsure-quantum quantum simulate'
      packageJson.scripts['quantum:optimize'] = 'forsure-quantum quantum optimize'
      packageJson.scripts['quantum:validate'] = 'forsure-quantum quantum validate'
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  }

  private async initGit(projectPath: string): Promise<void> {
    try {
      await execAsync('git init', { cwd: projectPath })
      
      // Create .gitignore
      const gitignorePath = path.join(projectPath, '.gitignore')
      const gitignoreContent = `
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Coverage
coverage/

# Temporary files
*.tmp
*.temp

# Quantum files
*.quantum-temp
*.simulation-cache
`
      await fs.writeFile(gitignorePath, gitignoreContent.trim())
    } catch (error) {
      this.logger.warn('Failed to initialize git repository:', error)
    }
  }

  private async installDependencies(projectPath: string, packageManager: string): Promise<void> {
    const spinner = ora(`Installing dependencies with ${packageManager}...`).start()
    
    try {
      const command = packageManager === 'npm' ? 'npm install' : `${packageManager} install`
      await execAsync(command, { cwd: projectPath })
      spinner.succeed('Dependencies installed successfully!')
    } catch (error) {
      spinner.fail('Failed to install dependencies')
      throw error
    }
  }

  private async createInitialFiles(projectPath: string, options: ProjectOptions): Promise<void> {
    // Create README.md
    const readmePath = path.join(projectPath, 'README.md')
    const readmeContent = `
# ${options.name}

${options.name ? `${options.name} - ` : ''}A ForSure Design System project${options.quantum ? ' with quantum computing capabilities' : ''}.

## Getting Started

### Installation
\`\`\`bash
${options.packageManager} install
\`\`\`

### Development
\`\`\`bash
${options.packageManager} run dev
\`\`\`

### Build
\`\`\`bash
${options.packageManager} run build
\`\`\`

### Testing
\`\`\`bash
${options.packageManager} run test
\`\`\`

${options.quantum ? `
### Quantum Computing
\`\`\`bash
${options.packageManager} run quantum:simulate
${options.packageManager} run quantum:optimize
${options.packageManager} run quantum:validate
\`\`\`
` : ''}

## Project Structure

\`\`\`
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── lib/            # Utility functions
├── styles/         # CSS/SCSS files
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
\`\`\`

## Learn More

- [ForSure Design System Documentation](https://docs.forsure.com)
- [ForSure CLI Documentation](https://docs.forsure.com/cli)
${options.quantum ? '- [Quantum Computing Guide](https://docs.forsure.com/quantum)' : ''}

## License

MIT
`
    await fs.writeFile(readmePath, readmeContent.trim())

    // Create .forsurerc.json
    const configPath = path.join(projectPath, '.forsurerc.json')
    const configContent = {
      designTokens: {
        input: './src/styles/tokens.ts',
        output: './src/styles/generated.css',
        format: 'css',
        watch: false
      },
      components: {
        directory: './src/components',
        prefix: 'forsure-',
        typescript: options.typescript,
        test: true,
        storybook: false
      },
      ...(options.quantum && {
        quantum: {
          maxQubits: 20,
          precision: 'medium',
          enableExperimental: false,
          simulationEngine: 'state-vector',
          optimizationLevel: 'balanced'
        }
      }),
      build: {
        outputDirectory: './dist',
        minify: true,
        sourcemap: true,
        target: 'es2020'
      }
    }
    await fs.writeJson(configPath, configContent, { spaces: 2 })

    // Create vite.config.ts if TypeScript
    if (options.typescript) {
      const viteConfigPath = path.join(projectPath, 'vite.config.ts')
      const viteConfigContent = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          forsure: ['@forsure/design-system'${options.quantum ? ", '@forsure/quantum'" : ''}]
        }
      }
    }
  })
`
      await fs.writeFile(viteConfigPath, viteConfigContent.trim())
    }

    // Create index.html
    const indexPath = path.join(projectPath, 'index.html')
    const indexContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.name}</title>
    <meta name="description" content="${options.name} - A ForSure Design System project" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
    await fs.writeFile(indexPath, indexContent.trim())

    // Create main entry point
    const mainPath = path.join(projectPath, 'src/main.tsx')
    const mainContent = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`
    await fs.writeFile(mainPath, mainContent.trim())

    // Create App component
    const appPath = path.join(projectPath, 'src/App.tsx')
    const appContent = `
import React from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@forsure/design-system'
${options.quantum ? "import { QuantumCircuit, QuantumSimulator } from '@forsure/quantum'" : ''}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${options.name}</h1>
        <p>
          A ForSure Design System project${options.quantum ? ' with quantum computing capabilities' : ''}.
        </p>
      </header>
      
      <main className="App-main">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is your new ForSure Design System project.</p>
            <Button variant="brand">Get Started</Button>
          </CardContent>
        </Card>
        
        ${options.quantum ? `
        <Card>
          <CardHeader>
            <CardTitle>Quantum Computing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore quantum computing capabilities with ForSure Quantum.</p>
            <Button variant="outline">Try Quantum Demo</Button>
          </CardContent>
        </Card>
        ` : ''}
      </main>
    </div>
  )
}

export default App
`
    await fs.writeFile(appPath, appContent.trim())

    // Create basic CSS
    const cssPath = path.join(projectPath, 'src/styles/index.css')
    const cssContent = `
@import '@forsure/design-system/styles/tokens.css';

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.App-header {
  padding: 2rem;
  background: var(--forsure-color-primary-50);
  color: var(--forsure-color-primary-900);
}

.App-main {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.App-main > * {
  max-width: 600px;
  width: 100%;
}
`
    await fs.writeFile(cssPath, cssContent.trim())
  }

  async build(options: BuildOptions): Promise<void> {
    const spinner = ora('Building project...').start()
    
    try {
      const buildCommand = options.production ? 'build' : 'build:dev'
      const args = ['run', buildCommand]
      
      if (options.output) {
        args.push('--', '--outDir', options.output)
      }
      
      await execAsync(`npm ${args.join(' ')}`)
      
      if (options.watch) {
        spinner.text = 'Watching for changes...'
        // Start watch mode
        const watchProcess = spawn('npm', ['run', 'build:watch'], {
          stdio: 'inherit'
        })
        
        watchProcess.on('close', (code) => {
          if (code !== 0) {
            spinner.fail('Build failed')
            process.exit(code)
          }
        })
      } else {
        spinner.succeed('Build completed successfully!')
      }
    } catch (error) {
      spinner.fail('Build failed')
      throw error
    }
  }

  async dev(options: DevOptions): Promise<void> {
    const spinner = ora('Starting development server...').start()
    
    try {
      const devArgs = ['run', 'dev']
      
      if (options.port) {
        devArgs.push('--', '--port', options.port.toString())
      }
      
      if (options.host && options.host !== 'localhost') {
        devArgs.push('--', '--host', options.host)
      }
      
      if (options.https) {
        devArgs.push('--', '--https')
      }
      
      const devProcess = spawn('npm', devArgs, {
        stdio: 'inherit'
      })
      
      spinner.succeed(`Development server started on ${options.https ? 'https' : 'http'}://${options.host || 'localhost'}:${options.port || 3000}`)
      
      devProcess.on('close', (code) => {
        if (code !== 0) {
          spinner.fail('Development server failed')
          process.exit(code)
        }
      })
    } catch (error) {
      spinner.fail('Failed to start development server')
      throw error
    }
  }

  async test(options: TestOptions): Promise<void> {
    const spinner = ora('Running tests...').start()
    
    try {
      const testArgs = ['run', 'test']
      
      if (options.watch) {
        testArgs.push('--', '--watch')
      }
      
      if (options.coverage) {
        testArgs.push('--', '--coverage')
      }
      
      if (options.verbose) {
        testArgs.push('--', '--verbose')
      }
      
      await execAsync(`npm ${testArgs.join(' ')}`)
      spinner.succeed('Tests completed successfully!')
    } catch (error) {
      spinner.fail('Tests failed')
      throw error
    }
  }

  async lint(options: LintOptions): Promise<void> {
    const spinner = ora('Linting code...').start()
    
    try {
      const lintArgs = ['run', 'lint']
      
      if (options.fix) {
        lintArgs.push('--fix')
      }
      
      if (options.verbose) {
        lintArgs.push('--', '--verbose')
      }
      
      await execAsync(`npm ${lintArgs.join(' ')}`)
      spinner.succeed('Linting completed successfully!')
    } catch (error) {
      spinner.fail('Linting failed')
      throw error
    }
  }

  async clean(options: CleanOptions): Promise<void> {
    const spinner = ora('Cleaning project...').start()
    
    try {
      // Clean build outputs
      const buildDirs = ['dist', 'build', '.next', 'out']
      for (const dir of buildDirs) {
        if (await fs.pathExists(dir)) {
          await fs.remove(dir)
        }
      }
      
      // Clean cache files
      const cacheFiles = ['*.tsbuildinfo', '.cache']
      for (const pattern of cacheFiles) {
        // This would need glob pattern matching
        // For now, just remove common cache directories
        if (await fs.pathExists('.cache')) {
          await fs.remove('.cache')
        }
      }
      
      // Clean node_modules if --all
      if (options.all) {
        if (await fs.pathExists('node_modules')) {
          await fs.remove('node_modules')
        }
        
        // Clean package lock files
        const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
        for (const lockFile of lockFiles) {
          if (await fs.pathExists(lockFile)) {
            await fs.remove(lockFile)
          }
        }
      }
      
      spinner.succeed('Project cleaned successfully!')
    } catch (error) {
      spinner.fail('Cleaning failed')
      throw error
    }
  }
}
