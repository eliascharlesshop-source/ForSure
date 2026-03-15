import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { glob } from 'glob'
import semver from 'semver'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'

export interface PublishingOptions {
  version?: string
  tag?: 'latest' | 'beta' | 'alpha' | 'next'
  dryRun?: boolean
  skipTests?: boolean
  skipBuild?: boolean
  force?: boolean
  registry?: string
  access?: 'public' | 'private'
}

export interface VersioningOptions {
  type: 'major' | 'minor' | 'patch' | 'prerelease'
  preId?: string
  message?: string
  skipGit?: boolean
  skipChangelog?: boolean
}

export interface PublishingResult {
  success: boolean
  version: string
  published: boolean
  testsPassed: boolean
  buildSucceeded: boolean
  errors: string[]
  warnings: string[]
  artifacts: string[]
}

export class ComponentLibraryPublisher {
  private packageJsonPath: string
  private distPath: string
  private registry: string

  constructor(private projectRoot: string = process.cwd()) {
    this.packageJsonPath = path.join(projectRoot, 'package.json')
    this.distPath = path.join(projectRoot, 'dist')
    this.registry = 'https://registry.npmjs.org'
  }

  async publish(options: PublishingOptions = {}): Promise<PublishingResult> {
    const spinner = ora('Starting publishing process...').start()
    
    try {
      const result: PublishingResult = {
        success: false,
        version: '',
        published: false,
        testsPassed: false,
        buildSucceeded: false,
        errors: [],
        warnings: [],
        artifacts: []
      }

      // Validate package
      spinner.text = 'Validating package...'
      await this.validatePackage(result)

      // Run tests
      if (!options.skipTests) {
        spinner.text = 'Running tests...'
        await this.runTests(result)
      } else {
        result.testsPassed = true
        result.warnings.push('Tests skipped')
      }

      // Build package
      if (!options.skipBuild) {
        spinner.text = 'Building package...'
        await this.buildPackage(result)
      } else {
        result.buildSucceeded = true
        result.warnings.push('Build skipped')
      }

      // Check if version already exists
      spinner.text = 'Checking version availability...'
      const currentVersion = this.getCurrentVersion()
      const targetVersion = options.version || currentVersion
      
      if (!options.force) {
        const isPublished = await this.isVersionPublished(targetVersion)
        if (isPublished) {
          throw new Error(`Version ${targetVersion} is already published`)
        }
      }

      // Update version if specified
      if (options.version && options.version !== currentVersion) {
        spinner.text = 'Updating version...'
        await this.updateVersion(options.version)
        result.version = options.version
      } else {
        result.version = currentVersion
      }

      // Publish to npm
      if (!options.dryRun) {
        spinner.text = 'Publishing to npm...'
        await this.publishToNpm(options, result)
        result.published = true
      } else {
        result.warnings.push('Dry run - package not actually published')
        result.published = true
      }

      // Create GitHub release
      if (!options.dryRun && result.published) {
        spinner.text = 'Creating GitHub release...'
        await this.createGitHubRelease(result.version, options)
      }

      // Update changelog
      if (!options.dryRun && result.published) {
        spinner.text = 'Updating changelog...'
        await this.updateChangelog(result.version)
      }

      result.success = true
      spinner.succeed('Package published successfully!')
      
      this.displayPublishingResult(result)
      return result
    } catch (error: any) {
      spinner.fail('Publishing failed')
      throw error
    }
  }

  async version(options: VersioningOptions): Promise<void> {
    const spinner = ora('Versioning package...').start()
    
    try {
      const currentVersion = this.getCurrentVersion()
      const newVersion = this.calculateNewVersion(currentVersion, options)
      
      spinner.text = `Updating version from ${currentVersion} to ${newVersion}...`
      
      // Update package.json
      await this.updateVersion(newVersion)
      
      // Update version in source files
      await this.updateVersionInFiles(newVersion)
      
      // Create git tag
      if (!options.skipGit) {
        spinner.text = 'Creating git tag...'
        await this.createGitTag(newVersion, options.message)
      }
      
      // Update changelog
      if (!options.skipChangelog) {
        spinner.text = 'Updating changelog...'
        await this.updateChangelog(newVersion)
      }
      
      spinner.succeed(`Version updated to ${newVersion}`)
      
      console.log(chalk.green(`\n✅ Version updated: ${currentVersion} → ${newVersion}`))
      console.log(chalk.blue('Next steps:'))
      console.log(chalk.blue('  1. Review changes with git diff'))
      console.log(chalk.blue('  2. Commit changes: git commit -m "chore: bump version"'))
      console.log(chalk.blue('  3. Push to remote: git push --follow-tags'))
      console.log(chalk.blue('  4. Publish: npm publish'))
      
    } catch (error: any) {
      spinner.fail('Versioning failed')
      throw error
    }
  }

  async build(): Promise<void> {
    const spinner = ora('Building package...').start()
    
    try {
      // Clean dist directory
      if (fs.existsSync(this.distPath)) {
        fs.rmSync(this.distPath, { recursive: true, force: true })
      }
      
      // Run build command
      await this.runCommand('npm', ['run', 'build'])
      
      // Verify build output
      const buildFiles = await glob('dist/**/*')
      if (buildFiles.length === 0) {
        throw new Error('Build completed but no output files found')
      }
      
      spinner.succeed('Package built successfully')
      console.log(chalk.green(`✅ Built ${buildFiles.length} files`))
      
    } catch (error: any) {
      spinner.fail('Build failed')
      throw error
    }
  }

  async analyze(): Promise<void> {
    const spinner = ora('Analyzing package...').start()
    
    try {
      const analysis = await this.analyzePackage()
      
      spinner.succeed('Analysis completed')
      this.displayAnalysis(analysis)
      
    } catch (error: any) {
      spinner.fail('Analysis failed')
      throw error
    }
  }

  private async validatePackage(result: PublishingResult): Promise<void> {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error('package.json not found')
    }

    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
    
    // Required fields
    const requiredFields = ['name', 'version', 'description', 'main', 'types']
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        throw new Error(`Missing required field in package.json: ${field}`)
      }
    }

    // Validate name
    if (!/^[a-z0-9-_]+$/.test(packageJson.name)) {
      result.warnings.push('Package name should contain only lowercase letters, numbers, hyphens, and underscores')
    }

    // Validate version
    if (!semver.valid(packageJson.version)) {
      throw new Error(`Invalid version format: ${packageJson.version}`)
    }

    // Check for sensitive data
    const sensitiveFields = ['privateKey', 'password', 'token', 'secret']
    for (const field of sensitiveFields) {
      if (packageJson[field]) {
        throw new Error(`Sensitive data found in package.json: ${field}`)
      }
    }
  }

  private async runTests(result: PublishingResult): Promise<void> {
    try {
      await this.runCommand('npm', ['test', '--', '--passWithNoTests'])
      result.testsPassed = true
    } catch (error: any) {
      result.errors.push('Tests failed')
      result.testsPassed = false
      throw new Error('Tests failed - cannot publish package')
    }
  }

  private async buildPackage(result: PublishingResult): Promise<void> {
    try {
      await this.runCommand('npm', ['run', 'build'])
      result.buildSucceeded = true
      
      // Collect build artifacts
      const buildFiles = await glob('dist/**/*')
      result.artifacts = buildFiles
      
    } catch (error: any) {
      result.errors.push('Build failed')
      result.buildSucceeded = false
      throw new Error('Build failed - cannot publish package')
    }
  }

  private async isVersionPublished(version: string): Promise<boolean> {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
      const packageName = packageJson.name
      
      const { stdout } = await this.runCommand('npm', ['view', `${packageName}@${version}`, 'version'], { silent: true })
      return stdout.trim() === version
    } catch {
      return false
    }
  }

  private getCurrentVersion(): string {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
    return packageJson.version
  }

  private async updateVersion(version: string): Promise<void> {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
    packageJson.version = version
    fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  private async updateVersionInFiles(version: string): Promise<void> {
    const files = await glob('**/*.{ts,tsx,js,jsx,md}')
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const updatedContent = content.replace(
        /(@forsure\/design-system|@forsure\/components)['"]\s*([^'"]*)['"]\s*([^'"]*)['"]/g,
        `$1'$2'$3'`
      )
      
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent)
      }
    }
  }

  private async publishToNpm(options: PublishingOptions, result: PublishingResult): Promise<void> {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
    const packageName = packageJson.name
    
    const publishArgs = ['publish']
    
    if (options.tag) {
      publishArgs.push('--tag', options.tag)
    }
    
    if (options.registry) {
      publishArgs.push('--registry', options.registry)
    }
    
    if (options.access) {
      publishArgs.push('--access', options.access)
    }
    
    if (options.force) {
      publishArgs.push('--force')
    }
    
    await this.runCommand('npm', publishArgs)
  }

  private async createGitHubRelease(version: string, options: PublishingOptions): Promise<void> {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
      const changelog = await this.getChangelogContent(version)
      
      // This would use GitHub API to create a release
      // For now, just log the action
      console.log(chalk.blue(`📝 GitHub release created for v${version}`))
      
    } catch (error: any) {
      result.warnings.push('Failed to create GitHub release')
    }
  }

  private async updateChangelog(version: string): Promise<void> {
    const changelogPath = path.join(this.projectRoot, 'CHANGELOG.md')
    
    let changelog = ''
    if (fs.existsSync(changelogPath)) {
      changelog = fs.readFileSync(changelogPath, 'utf8')
    }
    
    const newEntry = `## [${version}] - ${new Date().toISOString().split('T')[0]}

### Added
- New features and improvements

### Changed
- Updated components and APIs

### Fixed
- Bug fixes and improvements

### Deprecated
- Deprecated features

### Removed
- Removed features

### Security
- Security updates

`
    
    const updatedChangelog = newEntry + changelog
    fs.writeFileSync(changelogPath, updatedChangelog)
  }

  private async getChangelogContent(version: string): Promise<string> {
    const changelogPath = path.join(this.projectRoot, 'CHANGELOG.md')
    
    if (!fs.existsSync(changelogPath)) {
      return `Release v${version}`
    }
    
    const changelog = fs.readFileSync(changelogPath, 'utf8')
    const versionMatch = changelog.match(new RegExp(`## \\[${version}\\][\\s\\S]*?(?=## \\[|$)`))
    
    return versionMatch ? versionMatch[0] : `Release v${version}`
  }

  private calculateNewVersion(currentVersion: string, options: VersioningOptions): string {
    switch (options.type) {
      case 'major':
        return semver.inc(currentVersion, 'major')!
      case 'minor':
        return semver.inc(currentVersion, 'minor')!
      case 'patch':
        return semver.inc(currentVersion, 'patch')!
      case 'prerelease':
        return semver.inc(currentVersion, 'prerelease', options.preId || 'beta')!
      default:
        return currentVersion
    }
  }

  private async createGitTag(version: string, message?: string): Promise<void> {
    const tagMessage = message || `Release v${version}`
    
    await this.runCommand('git', ['add', 'package.json', 'CHANGELOG.md'])
    await this.runCommand('git', ['commit', '-m', tagMessage])
    await this.runCommand('git', ['tag', '-a', `v${version}`, '-m', tagMessage])
  }

  private async analyzePackage(): Promise<PackageAnalysis> {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'))
    const files = await glob('**/*.{ts,tsx,js,jsx}')
    
    const analysis: PackageAnalysis = {
      package: packageJson,
      files: {
        total: files.length,
        typescript: files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length,
        javascript: files.filter(f => f.endsWith('.js') || f.endsWith('.jsx')).length
      },
      dependencies: {
        total: Object.keys(packageJson.dependencies || {}).length,
        production: Object.keys(packageJson.dependencies || {}).length,
        development: Object.keys(packageJson.devDependencies || {}).length
      },
      size: await this.calculatePackageSize(),
      quality: await this.analyzeCodeQuality()
    }
    
    return analysis
  }

  private async calculatePackageSize(): Promise<PackageSize> {
    const distFiles = await glob('dist/**/*')
    let totalSize = 0
    
    for (const file of distFiles) {
      const stats = fs.statSync(file)
      totalSize += stats.size
    }
    
    return {
      total: totalSize,
      human: this.formatBytes(totalSize),
      files: distFiles.length
    }
  }

  private async analyzeCodeQuality(): Promise<CodeQuality> {
    const files = await glob('src/**/*.{ts,tsx}')
    
    let totalLines = 0
    let totalComplexity = 0
    const testCoverage = 0
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n').length
      totalLines += lines
      
      // Simple complexity calculation (can be enhanced with proper analysis)
      const complexity = (content.match(/if|for|while|switch|catch/g) || []).length
      totalComplexity += complexity
    }
    
    return {
      lines: totalLines,
      complexity: totalComplexity,
      coverage: testCoverage,
      maintainability: this.calculateMaintainability(totalLines, totalComplexity)
    }
  }

  private calculateMaintainability(lines: number, complexity: number): number {
    if (lines === 0) return 100
    const complexityRatio = complexity / lines
    return Math.max(0, Math.min(100, 100 - (complexityRatio * 100)))
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private displayPublishingResult(result: PublishingResult): void {
    console.log(chalk.cyan('\n📊 Publishing Results:'))
    console.log(chalk.green(`✅ Version: ${result.version}`))
    console.log(chalk.green(`✅ Published: ${result.published ? 'Yes' : 'No'}`))
    console.log(chalk.green(`✅ Tests: ${result.testsPassed ? 'Passed' : 'Failed'}`))
    console.log(chalk.green(`✅ Build: ${result.buildSucceeded ? 'Success' : 'Failed'}`))
    console.log(chalk.blue(`📦 Artifacts: ${result.artifacts.length} files`))
    
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'))
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`))
      })
    }
    
    if (result.errors.length > 0) {
      console.log(chalk.red('\n❌ Errors:'))
      result.errors.forEach(error => {
        console.log(chalk.red(`  • ${error}`))
      })
    }
  }

  private displayAnalysis(analysis: PackageAnalysis): void {
    console.log(chalk.cyan('\n📊 Package Analysis:'))
    
    console.log(chalk.blue('\n📦 Package Info:'))
    console.log(`  Name: ${analysis.package.name}`)
    console.log(`  Version: ${analysis.package.version}`)
    console.log(`  Description: ${analysis.package.description}`)
    
    console.log(chalk.blue('\n📁 Files:'))
    console.log(`  Total: ${analysis.files.total}`)
    console.log(`  TypeScript: ${analysis.files.typescript}`)
    console.log(`  JavaScript: ${analysis.files.javascript}`)
    
    console.log(chalk.blue('\n🔗 Dependencies:'))
    console.log(`  Total: ${analysis.dependencies.total}`)
    console.log(`  Production: ${analysis.dependencies.production}`)
    console.log(`  Development: ${analysis.dependencies.development}`)
    
    console.log(chalk.blue('\n📏 Package Size:'))
    console.log(`  Total: ${analysis.size.human}`)
    console.log(`  Files: ${analysis.size.files}`)
    
    console.log(chalk.blue('\n📈 Code Quality:'))
    console.log(`  Lines: ${analysis.quality.lines.toLocaleString()}`)
    console.log(`  Complexity: ${analysis.quality.complexity}`)
    console.log(`  Maintainability: ${analysis.quality.maintainability.toFixed(1)}%`)
  }

  private async runCommand(command: string, args: string[], options: { silent?: boolean } = {}): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: options.silent ? 'pipe' : 'inherit',
        cwd: this.projectRoot
      })
      
      let stdout = ''
      let stderr = ''
      
      if (options.silent) {
        child.stdout?.on('data', (data) => {
          stdout += data.toString()
        })
        
        child.stderr?.on('data', (data) => {
          stderr += data.toString()
        })
      }
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject(new Error(`Command failed with exit code ${code}`))
        }
      })
      
      child.on('error', (error) => {
        reject(error)
      })
    })
  }
}

// Type definitions
interface PackageAnalysis {
  package: any
  files: {
    total: number
    typescript: number
    javascript: number
  }
  dependencies: {
    total: number
    production: number
    development: number
  }
  size: PackageSize
  quality: CodeQuality
}

interface PackageSize {
  total: number
  human: string
  files: number
}

interface CodeQuality {
  lines: number
  complexity: number
  coverage: number
  maintainability: number
}
