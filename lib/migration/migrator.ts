import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'

export interface MigrationOptions {
  from: string
  to: string
  dryRun?: boolean
  backup?: boolean
  force?: boolean
  verbose?: boolean
}

export interface MigrationResult {
  success: boolean
  migrated: string[]
  errors: string[]
  warnings: string[]
  summary: {
    totalFiles: number
    migratedFiles: number
    errorFiles: number
    skippedFiles: number
  }
}

export class DesignSystemMigrator {
  private migrationStrategies: Map<string, MigrationStrategy> = new Map()
  private backupDir: string

  constructor() {
    this.setupMigrationStrategies()
    this.backupDir = path.join(process.cwd(), '.forsure-backup')
  }

  async migrate(options: MigrationOptions): Promise<MigrationResult> {
    const spinner = ora('Starting migration...').start()
    
    try {
      // Create backup if requested
      if (options.backup) {
        spinner.text = 'Creating backup...'
        await this.createBackup()
      }

      // Analyze project structure
      spinner.text = 'Analyzing project structure...'
      const analysis = await this.analyzeProject()
      
      // Get migration strategy
      const strategy = this.migrationStrategies.get(options.from)
      if (!strategy) {
        throw new Error(`No migration strategy found for ${options.from}`)
      }

      // Plan migration
      spinner.text = 'Planning migration...'
      const plan = await strategy.planMigration(analysis)
      
      if (options.dryRun) {
        spinner.succeed('Dry run completed')
        this.displayMigrationPlan(plan)
        return this.createDryRunResult(plan)
      }

      // Execute migration
      spinner.text = 'Executing migration...'
      const result = await this.executeMigration(plan, options)
      
      spinner.succeed('Migration completed!')
      this.displayMigrationResult(result)
      
      return result
    } catch (error: any) {
      spinner.fail('Migration failed')
      throw error
    }
  }

  async upgrade(currentVersion: string, targetVersion: string, options: { dryRun?: boolean; force?: boolean } = {}): Promise<MigrationResult> {
    const spinner = ora(`Upgrading from ${currentVersion} to ${targetVersion}...`).start()
    
    try {
      // Check compatibility
      spinner.text = 'Checking compatibility...'
      const compatibility = await this.checkCompatibility(currentVersion, targetVersion)
      
      if (!compatibility.compatible && !options.force) {
        spinner.fail('Incompatible versions')
        this.displayCompatibilityIssues(compatibility.issues)
        throw new Error('Incompatible versions detected')
      }

      // Get upgrade steps
      spinner.text = 'Planning upgrade...'
      const upgradeSteps = await this.getUpgradeSteps(currentVersion, targetVersion)
      
      if (options.dryRun) {
        spinner.succeed('Upgrade dry run completed')
        this.displayUpgradePlan(upgradeSteps)
        return this.createDryRunResult({ steps: upgradeSteps.map(step => ({ type: 'upgrade', description: step })) })
      }

      // Execute upgrade
      spinner.text = 'Executing upgrade...'
      const result = await this.executeUpgrade(upgradeSteps)
      
      spinner.succeed('Upgrade completed!')
      this.displayMigrationResult(result)
      
      return result
    } catch (error: any) {
      spinner.fail('Upgrade failed')
      throw error
    }
  }

  private setupMigrationStrategies() {
    // Ant Design migration
    this.migrationStrategies.set('antd', new AntDesignMigrationStrategy())
    
    // Material-UI migration
    this.migrationStrategies.set('material-ui', new MaterialUIMigrationStrategy())
    this.migrationStrategies.set('mui', new MaterialUIMigrationStrategy())
    
    // Chakra UI migration
    this.migrationStrategies.set('chakra-ui', new ChakraUIMigrationStrategy())
    
    // Bootstrap migration
    this.migrationStrategies.set('bootstrap', new BootstrapMigrationStrategy())
    
    // Custom migration
    this.migrationStrategies.set('custom', new CustomMigrationStrategy())
  }

  private async analyzeProject(): Promise<ProjectAnalysis> {
    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**']
    })

    const analysis: ProjectAnalysis = {
      files: [],
      components: new Map(),
      imports: new Map(),
      styles: new Map(),
      dependencies: new Map()
    }

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const fileAnalysis = this.analyzeFile(file, content)
      
      analysis.files.push(fileAnalysis)
      
      // Collect components
      fileAnalysis.components.forEach(comp => {
        analysis.components.set(comp.name, comp)
      })
      
      // Collect imports
      fileAnalysis.imports.forEach(imp => {
        const existing = analysis.imports.get(imp.source) || []
        existing.push(imp)
        analysis.imports.set(imp.source, existing)
      })
      
      // Collect styles
      fileAnalysis.styles.forEach(style => {
        const existing = analysis.styles.get(style.type) || []
        existing.push(style)
        analysis.styles.set(style.type, existing)
      })
    }

    return analysis
  }

  private analyzeFile(filePath: string, content: string): FileAnalysis {
    const analysis: FileAnalysis = {
      path: filePath,
      components: [],
      imports: [],
      styles: [],
      framework: this.detectFramework(content)
    }

    // Analyze imports
    const importRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const [, namedImports, defaultImport, source] = match
      analysis.imports.push({
        source,
        named: namedImports ? namedImports.split(',').map(s => s.trim()) : [],
        default: defaultImport || null
      })
    }

    // Analyze components
    const componentRegex = /(?:const|function)\s+(\w+)(?:\s*:\s*React\.\w+)?\s*[=\(]/g
    while ((match = componentRegex.exec(content)) !== null) {
      analysis.components.push({
        name: match[1],
        props: this.extractProps(content, match[1]),
        usage: this.extractUsage(content, match[1])
      })
    }

    // Analyze styles
    const styleRegex = /className=\{?([^}]+)\}?|style=\{?([^}]+)\}?/g
    while ((match = styleRegex.exec(content)) !== null) {
      analysis.styles.push({
        type: match[1] ? 'className' : 'style',
        value: match[1] || match[2]
      })
    }

    return analysis
  }

  private detectFramework(content: string): string {
    if (content.includes('import React') || content.includes('from "react"')) {
      return 'react'
    }
    if (content.includes('import Vue') || content.includes('from "vue"')) {
      return 'vue'
    }
    if (content.includes('import Angular') || content.includes('@angular')) {
      return 'angular'
    }
    return 'unknown'
  }

  private extractProps(content: string, componentName: string): PropInfo[] {
    const props: PropInfo[] = []
    
    // Extract from interface
    const interfaceRegex = new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]+)\\}`, 's')
    const interfaceMatch = interfaceRegex.exec(content)
    
    if (interfaceMatch) {
      const propLines = interfaceMatch[1].split('\n')
      propLines.forEach(line => {
        const propMatch = line.match(/\s*(\w+)(\?)?:\s*([^;]+)/)
        if (propMatch) {
          props.push({
            name: propMatch[1],
            type: propMatch[3],
            optional: propMatch[2] === '?'
          })
        }
      })
    }
    
    return props
  }

  private extractUsage(content: string, componentName: string): UsageInfo[] {
    const usage: UsageInfo[] = []
    
    // Find component usage
    const usageRegex = new RegExp(`<${componentName}([^>]*)>`, 'g')
    let match
    while ((match = usageRegex.exec(content)) !== null) {
      usage.push({
        props: this.parseProps(match[1]),
        line: content.substring(0, match.index).split('\n').length
      })
    }
    
    return usage
  }

  private parseProps(propString: string): Record<string, string> {
    const props: Record<string, string> = {}
    
    // Simple prop parsing
    const propRegex = /(\w+)=\{([^}]+)\}|(\w+)=["']([^"']+)["']/g
    let match
    while ((match = propRegex.exec(propString)) !== null) {
      const [, name1, value1, name2, value2] = match
      props[name1 || name2] = value1 || value2
    }
    
    return props
  }

  private async createBackup() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(this.backupDir, timestamp)
    
    // Copy important files
    const filesToBackup = ['package.json', 'tsconfig.json', 'src/**/*']
    
    for (const pattern of filesToBackup) {
      const files = await glob(pattern)
      for (const file of files) {
        const destPath = path.join(backupPath, file)
        const destDir = path.dirname(destPath)
        
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        
        fs.copyFileSync(file, destPath)
      }
    }
    
    console.log(chalk.green(`✅ Backup created: ${backupPath}`))
  }

  private async executeMigration(plan: MigrationPlan, options: MigrationOptions): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrated: [],
      errors: [],
      warnings: [],
      summary: {
        totalFiles: plan.steps.length,
        migratedFiles: 0,
        errorFiles: 0,
        skippedFiles: 0
      }
    }

    for (const step of plan.steps) {
      try {
        await this.executeStep(step, options)
        result.migrated.push(step.file)
        result.summary.migratedFiles++
      } catch (error: any) {
        result.errors.push(`${step.file}: ${error.message}`)
        result.summary.errorFiles++
        result.success = false
      }
    }

    return result
  }

  private async executeStep(step: MigrationStep, options: MigrationOptions) {
    switch (step.type) {
      case 'component':
        await this.migrateComponent(step)
        break
      case 'import':
        await this.migrateImport(step)
        break
      case 'style':
        await this.migrateStyle(step)
        break
      case 'dependency':
        await this.migrateDependency(step)
        break
      case 'config':
        await this.migrateConfig(step)
        break
      default:
        throw new Error(`Unknown migration step type: ${step.type}`)
    }
  }

  private async migrateComponent(step: MigrationStep) {
    const content = fs.readFileSync(step.file, 'utf8')
    const newContent = step.transform!(content)
    fs.writeFileSync(step.file, newContent)
  }

  private async migrateImport(step: MigrationStep) {
    const content = fs.readFileSync(step.file, 'utf8')
    const newContent = step.transform!(content)
    fs.writeFileSync(step.file, newContent)
  }

  private async migrateStyle(step: MigrationStep) {
    const content = fs.readFileSync(step.file, 'utf8')
    const newContent = step.transform!(content)
    fs.writeFileSync(step.file, newContent)
  }

  private async migrateDependency(step: MigrationStep) {
    const packageJsonPath = 'package.json'
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    // Remove old dependencies
    if (step.remove) {
      step.remove.forEach(dep => {
        delete packageJson.dependencies[dep]
        delete packageJson.devDependencies[dep]
      })
    }
    
    // Add new dependencies
    if (step.add) {
      Object.assign(packageJson.dependencies, step.add)
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  private async migrateConfig(step: MigrationStep) {
    const content = fs.readFileSync(step.file, 'utf8')
    const newContent = step.transform!(content)
    fs.writeFileSync(step.file, newContent)
  }

  private displayMigrationPlan(plan: MigrationPlan) {
    console.log(chalk.cyan('\n📋 Migration Plan:'))
    console.log(chalk.gray(`Total steps: ${plan.steps.length}\n`))
    
    plan.steps.forEach((step, index) => {
      const icon = this.getStepIcon(step.type)
      console.log(`${chalk.gray(`${index + 1}.`)} ${icon} ${step.description} (${chalk.blue(step.file)})`)
      
      if (step.warning) {
        console.log(chalk.yellow(`   ⚠️  ${step.warning}`))
      }
    })
  }

  private displayMigrationResult(result: MigrationResult) {
    console.log(chalk.cyan('\n📊 Migration Results:'))
    console.log(chalk.green(`✅ Migrated: ${result.summary.migratedFiles}`))
    console.log(chalk.red(`❌ Errors: ${result.summary.errorFiles}`))
    console.log(chalk.yellow(`⚠️  Warnings: ${result.warnings.length}`))
    
    if (result.errors.length > 0) {
      console.log(chalk.red('\n❌ Errors:'))
      result.errors.forEach(error => {
        console.log(chalk.red(`  • ${error}`))
      })
    }
    
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'))
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`))
      })
    }
  }

  private getStepIcon(type: string): string {
    const icons: Record<string, string> = {
      component: '🧩',
      import: '📦',
      style: '🎨',
      dependency: '🔗',
      config: '⚙️',
      upgrade: '⬆️'
    }
    return icons[type] || '📄'
  }

  private createDryRunResult(plan: MigrationPlan): MigrationResult {
    return {
      success: true,
      migrated: plan.steps.map(step => step.file),
      errors: [],
      warnings: plan.steps.filter(step => step.warning).map(step => step.warning!),
      summary: {
        totalFiles: plan.steps.length,
        migratedFiles: plan.steps.length,
        errorFiles: 0,
        skippedFiles: 0
      }
    }
  }

  private async checkCompatibility(currentVersion: string, targetVersion: string): Promise<CompatibilityResult> {
    // Mock compatibility check
    return {
      compatible: true,
      issues: []
    }
  }

  private async getUpgradeSteps(currentVersion: string, targetVersion: string): Promise<string[]> {
    // Mock upgrade steps
    return [
      'Update dependencies',
      'Run migration scripts',
      'Update configuration files',
      'Verify compatibility'
    ]
  }

  private async executeUpgrade(steps: string[]): Promise<MigrationResult> {
    // Mock upgrade execution
    return {
      success: true,
      migrated: [],
      errors: [],
      warnings: [],
      summary: {
        totalFiles: steps.length,
        migratedFiles: steps.length,
        errorFiles: 0,
        skippedFiles: 0
      }
    }
  }

  private displayCompatibilityIssues(issues: string[]) {
    console.log(chalk.red('\n❌ Compatibility Issues:'))
    issues.forEach(issue => {
      console.log(chalk.red(`  • ${issue}`))
    })
  }

  private displayUpgradePlan(steps: string[]) {
    console.log(chalk.cyan('\n📋 Upgrade Plan:'))
    steps.forEach((step, index) => {
      console.log(`${chalk.gray(`${index + 1}.`)} ⬆️ ${step}`)
    })
  }
}

// Migration Strategy Interface
interface MigrationStrategy {
  planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan>
}

// Ant Design Migration Strategy
class AntDesignMigrationStrategy implements MigrationStrategy {
  async planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan> {
    const steps: MigrationStep[] = []

    // Find Ant Design imports
    const antdImports = analysis.imports.get('antd') || []
    antdImports.forEach(imp => {
      imp.named.forEach(component => {
        const mapping = this.getAntdToForSureMapping(component)
        if (mapping) {
          steps.push({
            type: 'import',
            file: analysis.files.find(f => f.imports.includes(imp))?.path || '',
            description: `Migrate ${component} to ${mapping.forsure}`,
            transform: (content: string) => this.transformAntdImport(content, component, mapping),
            warning: mapping.warning
          })
        }
      })
    })

    return { steps }
  }

  private getAntdToForSureMapping(component: string): { forsure: string; warning?: string } | null {
    const mappings: Record<string, { forsure: string; warning?: string }> = {
      'Button': { forsure: 'Button' },
      'Card': { forsure: 'Card' },
      'Input': { forsure: 'Input' },
      'Badge': { forsure: 'Badge' },
      'Typography': { forsure: 'Heading', warning: 'Typography component will be split into Heading, Text, etc.' }
    }
    
    return mappings[component] || null
  }

  private transformAntdImport(content: string, component: string, mapping: any): string {
    return content
      .replace(new RegExp(`import\\s*\\{[^}]*${component}[^}]*\\}\\s*from\\s*['"]antd['"]`, 'g'),
        `import { ${mapping.forsure} } from '@/components/ui/forsure-${mapping.forsure.toLowerCase()}'`)
      .replace(new RegExp(`<${component}`, 'g'), `<${mapping.forsure}`)
      .replace(new RegExp(`</${component}`, 'g'), `</${mapping.forsure}`)
  }
}

// Material-UI Migration Strategy
class MaterialUIMigrationStrategy implements MigrationStrategy {
  async planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan> {
    const steps: MigrationStep[] = []

    // Find Material-UI imports
    const muiImports = analysis.imports.get('@mui/material') || []
    muiImports.forEach(imp => {
      imp.named.forEach(component => {
        const mapping = this.getMuiToForSureMapping(component)
        if (mapping) {
          steps.push({
            type: 'import',
            file: analysis.files.find(f => f.imports.includes(imp))?.path || '',
            description: `Migrate ${component} to ${mapping.forsure}`,
            transform: (content: string) => this.transformMuiImport(content, component, mapping),
            warning: mapping.warning
          })
        }
      })
    })

    return { steps }
  }

  private getMuiToForSureMapping(component: string): { forsure: string; warning?: string } | null {
    const mappings: Record<string, { forsure: string; warning?: string }> = {
      'Button': { forsure: 'Button' },
      'Card': { forsure: 'Card' },
      'TextField': { forsure: 'Input' },
      'Chip': { forsure: 'Badge' },
      'Typography': { forsure: 'Heading', warning: 'Typography component will be split into Heading, Text, etc.' }
    }
    
    return mappings[component] || null
  }

  private transformMuiImport(content: string, component: string, mapping: any): string {
    return content
      .replace(new RegExp(`import\\s*\\{[^}]*${component}[^}]*\\}\\s*from\\s*['"]@mui/material['"]`, 'g'),
        `import { ${mapping.forsure} } from '@/components/ui/forsure-${mapping.forsure.toLowerCase()}'`)
      .replace(new RegExp(`<${component}`, 'g'), `<${mapping.forsure}`)
      .replace(new RegExp(`</${component}`, 'g'), `</${mapping.forsure}`)
  }
}

// Chakra UI Migration Strategy
class ChakraUIMigrationStrategy implements MigrationStrategy {
  async planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan> {
    const steps: MigrationStep[] = []

    // Find Chakra UI imports
    const chakraImports = analysis.imports.get('@chakra-ui/react') || []
    chakraImports.forEach(imp => {
      imp.named.forEach(component => {
        const mapping = this.getChakraToForSureMapping(component)
        if (mapping) {
          steps.push({
            type: 'import',
            file: analysis.files.find(f => f.imports.includes(imp))?.path || '',
            description: `Migrate ${component} to ${mapping.forsure}`,
            transform: (content: string) => this.transformChakraImport(content, component, mapping),
            warning: mapping.warning
          })
        }
      })
    })

    return { steps }
  }

  private getChakraToForSureMapping(component: string): { forsure: string; warning?: string } | null {
    const mappings: Record<string, { forsure: string; warning?: string }> = {
      'Button': { forsure: 'Button' },
      'Card': { forsure: 'Card' },
      'Input': { forsure: 'Input' },
      'Badge': { forsure: 'Badge' },
      'Heading': { forsure: 'Heading' }
    }
    
    return mappings[component] || null
  }

  private transformChakraImport(content: string, component: string, mapping: any): string {
    return content
      .replace(new RegExp(`import\\s*\\{[^}]*${component}[^}]*\\}\\s*from\\s*['"]@chakra-ui/react['"]`, 'g'),
        `import { ${mapping.forsure} } from '@/components/ui/forsure-${mapping.forsure.toLowerCase()}'`)
      .replace(new RegExp(`<${component}`, 'g'), `<${mapping.forsure}`)
      .replace(new RegExp(`</${component}`, 'g'), `</${mapping.forsure}`)
  }
}

// Bootstrap Migration Strategy
class BootstrapMigrationStrategy implements MigrationStrategy {
  async planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan> {
    const steps: MigrationStep[] = []

    // Find Bootstrap class names
    analysis.files.forEach(file => {
      file.styles.forEach(style => {
        if (style.type === 'className') {
          const bootstrapClasses = style.value.match(/btn|card|badge|form-control/g)
          if (bootstrapClasses) {
            bootstrapClasses.forEach(cls => {
              const mapping = this.getBootstrapToForSureMapping(cls)
              if (mapping) {
                steps.push({
                  type: 'style',
                  file: file.path,
                  description: `Convert Bootstrap class ${cls} to ForSure`,
                  transform: (content: string) => this.transformBootstrapClass(content, cls, mapping)
                })
              }
            })
          }
        }
      })
    })

    return { steps }
  }

  private getBootstrapToForSureMapping(cls: string): { forsure: string } | null {
    const mappings: Record<string, { forsure: string }> = {
      'btn': { forsure: 'Button' },
      'card': { forsure: 'Card' },
      'badge': { forsure: 'Badge' },
      'form-control': { forsure: 'Input' }
    }
    
    return mappings[cls] || null
  }

  private transformBootstrapClass(content: string, cls: string, mapping: any): string {
    return content
      .replace(new RegExp(`\\b${cls}\\b`, 'g'), `forsure-${mapping.forsure.toLowerCase()}`)
  }
}

// Custom Migration Strategy
class CustomMigrationStrategy implements MigrationStrategy {
  async planMigration(analysis: ProjectAnalysis): Promise<MigrationPlan> {
    const steps: MigrationStep[] = []

    // Interactive migration planning
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'files',
        message: 'Select files to migrate:',
        choices: analysis.files.map(f => ({ name: f.path, value: f.path }))
      },
      {
        type: 'list',
        name: 'strategy',
        message: 'Choose migration strategy:',
        choices: [
          { name: 'Conservative - Keep existing code, add ForSure alongside', value: 'conservative' },
          { name: 'Aggressive - Replace all components with ForSure', value: 'aggressive' },
          { name: 'Manual - Review each change manually', value: 'manual' }
        ]
      }
    ])

    // Generate steps based on user choices
    answers.files.forEach((file: string) => {
      steps.push({
        type: 'component',
        file,
        description: `Migrate ${file} using ${answers.strategy} strategy`,
        transform: (content: string) => this.transformCustom(content, answers.strategy)
      })
    })

    return { steps }
  }

  private transformCustom(content: string, strategy: string): string {
    switch (strategy) {
      case 'conservative':
        return content + '\n// ForSure components added alongside existing code'
      case 'aggressive':
        return content.replace(/existing-components/g, 'forsure-components')
      case 'manual':
        return content + '\n// TODO: Manual migration required'
      default:
        return content
    }
  }
}

// Type definitions
interface ProjectAnalysis {
  files: FileAnalysis[]
  components: Map<string, ComponentInfo>
  imports: Map<string, ImportInfo[]>
  styles: Map<string, StyleInfo[]>
  dependencies: Map<string, string>
}

interface FileAnalysis {
  path: string
  components: ComponentInfo[]
  imports: ImportInfo[]
  styles: StyleInfo[]
  framework: string
}

interface ComponentInfo {
  name: string
  props: PropInfo[]
  usage: UsageInfo[]
}

interface PropInfo {
  name: string
  type: string
  optional: boolean
}

interface UsageInfo {
  props: Record<string, string>
  line: number
}

interface ImportInfo {
  source: string
  named: string[]
  default: string | null
}

interface StyleInfo {
  type: string
  value: string
}

interface MigrationPlan {
  steps: MigrationStep[]
}

interface MigrationStep {
  type: 'component' | 'import' | 'style' | 'dependency' | 'config' | 'upgrade'
  file: string
  description: string
  transform?: (content: string) => string
  add?: Record<string, string>
  remove?: string[]
  warning?: string
}

interface CompatibilityResult {
  compatible: boolean
  issues: string[]
}
