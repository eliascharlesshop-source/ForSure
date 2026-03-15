#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import figlet from 'figlet'
import { boxen } from 'boxen'
import ora from 'ora'
import { QuantumCLI } from './lib/quantum-cli'
import { DesignSystemCLI } from './lib/design-system-cli'
import { ProjectCLI } from './lib/project-cli'
import { ConfigManager } from './lib/config-manager'
import { Logger } from './lib/logger'
import { version } from '../package.json'

// Initialize logger
const logger = new Logger()

// Initialize CLI modules
const quantumCLI = new QuantumCLI()
const designSystemCLI = new DesignSystemCLI()
const projectCLI = new ProjectCLI()
const configManager = new ConfigManager()

// Create main program
const program = new Command()

// Setup program
program
  .name('forsure-quantum')
  .description('ForSure Design System CLI with advanced quantum computing capabilities')
  .version(version)
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--debug', 'Enable debug mode')
  .option('--config <path>', 'Path to configuration file', '.forsurerc.json')
  .option('--no-color', 'Disable colored output')
  .hook('preAction', (thisCommand) => {
    // Setup logging based on options
    if (thisCommand.opts().verbose) {
      logger.setLevel('verbose')
    }
    if (thisCommand.opts().debug) {
      logger.setLevel('debug')
    }
    if (thisCommand.opts().noColor) {
      chalk.level = 0
    }
  })

// Display welcome banner
function displayBanner() {
  const banner = figlet.textSync('ForSure Quantum', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })
  
  console.log(chalk.cyan(banner))
  console.log(chalk.gray('Design System CLI with Quantum Computing Capabilities'))
  console.log(chalk.gray(`Version ${version}`))
  console.log()
}

// Core commands
program
  .command('init')
  .description('Initialize a new ForSure project with quantum features')
  .option('-t, --template <template>', 'Project template', 'quantum-app')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --directory <directory>', 'Target directory')
  .option('--quantum', 'Enable quantum computing features')
  .option('--typescript', 'Use TypeScript (default: true)')
  .option('--package-manager <pm>', 'Package manager (npm, yarn, pnpm)', 'npm')
  .option('--git', 'Initialize git repository', true)
  .option('--install', 'Install dependencies', true)
  .action(async (options) => {
    displayBanner()
    const spinner = ora('Initializing project...').start()
    
    try {
      await projectCLI.init(options)
      spinner.succeed('Project initialized successfully!')
      
      console.log(boxen(
        chalk.green('🚀 Project ready!') + '\\n\\n' +
        'Next steps:\\n' +
        `  cd ${options.name || 'my-project'}\\n` +
        '  forsure-quantum dev\\n' +
        '  forsure-quantum gen component --help\\n' +
        '  forsure-quantum quantum --help',
        { padding: 1, borderColor: 'green' }
      ))
    } catch (error) {
      spinner.fail('Failed to initialize project')
      logger.error('Project initialization failed:', error)
      process.exit(1)
    }
  })

// Design System commands
const designSystem = program
  .command('design')
  .description('Design system management commands')

designSystem
  .command('tokens')
  .description('Generate design tokens')
  .option('-f, --format <format>', 'Output format (css, scss, ts, json)', 'css')
  .option('-o, --output <path>', 'Output directory', './styles')
  .option('-w, --watch', 'Watch for changes')
  .option('--theme <theme>', 'Theme name', 'default')
  .action(async (options) => {
    const spinner = ora('Generating design tokens...').start()
    
    try {
      await designSystemCLI.generateTokens(options)
      spinner.succeed('Design tokens generated successfully!')
    } catch (error) {
      spinner.fail('Failed to generate design tokens')
      logger.error('Token generation failed:', error)
      process.exit(1)
    }
  })

designSystem
  .command('audit')
  .description('Audit design system consistency')
  .option('--report', 'Generate detailed report')
  .option('--fix', 'Auto-fix issues')
  .option('--strict', 'Use strict validation')
  .action(async (options) => {
    const spinner = ora('Auditing design system...').start()
    
    try {
      const results = await designSystemCLI.audit(options)
      spinner.succeed('Design system audit completed!')
      
      if (results.issues.length > 0) {
        console.log(chalk.yellow('\\nIssues found:'))
        results.issues.forEach(issue => {
          console.log(chalk.red(`  • ${issue.message}`))
        })
      } else {
        console.log(chalk.green('\\n✅ No issues found!'))
      }
    } catch (error) {
      spinner.fail('Failed to audit design system')
      logger.error('Audit failed:', error)
      process.exit(1)
    }
  })

// Component generation commands
program
  .command('gen')
  .description('Generate components, hooks, utilities, and more')
  .alias('generate')

program
  .command('gen component <name>')
  .description('Generate a new component')
  .option('-t, --template <template>', 'Component template', 'basic')
  .option('-d, --directory <directory>', 'Target directory', './components')
  .option('--typescript', 'Use TypeScript', true)
  .option('--test', 'Generate test file', true)
  .option('--story', 'Generate Storybook story', true)
  .option('--quantum', 'Generate quantum component')
  .action(async (name, options) => {
    const spinner = ora(`Generating component: ${name}...`).start()
    
    try {
      await designSystemCLI.generateComponent(name, options)
      spinner.succeed(`Component ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate component ${name}`)
      logger.error('Component generation failed:', error)
      process.exit(1)
    }
  })

program
  .command('gen hook <name>')
  .description('Generate a new custom hook')
  .option('-t, --template <template>', 'Hook template', 'basic')
  .option('-d, --directory <directory>', 'Target directory', './hooks')
  .option('--typescript', 'Use TypeScript', true)
  .option('--test', 'Generate test file', true)
  .option('--quantum', 'Generate quantum hook')
  .action(async (name, options) => {
    const spinner = ora(`Generating hook: ${name}...`).start()
    
    try {
      await designSystemCLI.generateHook(name, options)
      spinner.succeed(`Hook ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate hook ${name}`)
      logger.error('Hook generation failed:', error)
      process.exit(1)
    }
  })

program
  .command('gen utility <name>')
  .description('Generate a new utility function')
  .option('-t, --template <template>', 'Utility template', 'basic')
  .option('-d, --directory <directory>', 'Target directory', './lib')
  .option('--typescript', 'Use TypeScript', true)
  .option('--test', 'Generate test file', true)
  .action(async (name, options) => {
    const spinner = ora(`Generating utility: ${name}...`).start()
    
    try {
      await designSystemCLI.generateUtility(name, options)
      spinner.succeed(`Utility ${name} generated successfully!`)
    } catch (error) {
      spinner.fail(`Failed to generate utility ${name}`)
      logger.error('Utility generation failed:', error)
      process.exit(1)
    }
  })

// Quantum computing commands
const quantum = program
  .command('quantum')
  .description('Quantum computing commands')

quantum
  .command('circuit <name>')
  .description('Create a quantum circuit')
  .option('-q, --qubits <number>', 'Number of qubits', '2')
  .option('-g, --gates <gates>', 'Gate definitions (comma-separated)')
  .option('-a, --algorithm <algorithm>', 'Algorithm template')
  .option('-f, --file <file>', 'Output file')
  .option('--format <format>', 'Output format (js, ts, json)', 'ts')
  .action(async (name, options) => {
    const spinner = ora('Creating quantum circuit...').start()
    
    try {
      await quantumCLI.createCircuit(name, options)
      spinner.succeed(`Quantum circuit ${name} created successfully!`)
    } catch (error) {
      spinner.fail('Failed to create quantum circuit')
      logger.error('Circuit creation failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('simulate <circuit>')
  .description('Simulate a quantum circuit')
  .option('-s, --shots <number>', 'Number of simulation shots', '1000')
  .option('-p, --precision <precision>', 'Simulation precision (low, medium, high)', 'medium')
  .option('-o, --output <file>', 'Output file for results')
  .option('--visualize', 'Generate visualization')
  .option('--noise', 'Enable noise simulation')
  .action(async (circuit, options) => {
    const spinner = ora('Simulating quantum circuit...').start()
    
    try {
      const results = await quantumCLI.simulateCircuit(circuit, options)
      spinner.succeed('Quantum circuit simulation completed!')
      
      console.log(chalk.cyan('\\nSimulation Results:'))
      console.log(JSON.stringify(results, null, 2))
    } catch (error) {
      spinner.fail('Failed to simulate quantum circuit')
      logger.error('Simulation failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('optimize <circuit>')
  .description('Optimize a quantum circuit')
  .option('-r, --rules <rules>', 'Optimization rules (comma-separated)', 'gate-fusion,gate-cancellation')
  .option('-t, --target <target>', 'Optimization target (depth, fidelity, gates)', 'depth')
  .option('-i, --iterations <number>', 'Maximum iterations', '100')
  .option('--preserve-semantics', 'Preserve circuit semantics', true)
  .action(async (circuit, options) => {
    const spinner = ora('Optimizing quantum circuit...').start()
    
    try {
      const results = await quantumCLI.optimizeCircuit(circuit, options)
      spinner.succeed('Quantum circuit optimization completed!')
      
      console.log(chalk.cyan('\\nOptimization Results:'))
      console.log(`Depth reduction: ${results.depthReduction}%`)
      console.log(`Fidelity improvement: ${results.fidelityImprovement}%`)
      console.log(`Gate reduction: ${results.gateReduction}%`)
    } catch (error) {
      spinner.fail('Failed to optimize quantum circuit')
      logger.error('Optimization failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('validate <circuit>')
  .description('Validate a quantum circuit')
  .option('--strict', 'Use strict validation')
  .option('--warnings', 'Show warnings')
  .option('--fix', 'Auto-fix issues')
  .action(async (circuit, options) => {
    const spinner = ora('Validating quantum circuit...').start()
    
    try {
      const results = await quantumCLI.validateCircuit(circuit, options)
      spinner.succeed('Quantum circuit validation completed!')
      
      if (results.errors.length > 0) {
        console.log(chalk.red('\\nValidation Errors:'))
        results.errors.forEach(error => {
          console.log(chalk.red(`  • ${error.message}`))
        })
      }
      
      if (results.warnings.length > 0 && options.warnings) {
        console.log(chalk.yellow('\\nValidation Warnings:'))
        results.warnings.forEach(warning => {
          console.log(chalk.yellow(`  • ${warning.message}`))
        })
      }
      
      if (results.errors.length === 0) {
        console.log(chalk.green('\\n✅ Circuit is valid!'))
      }
    } catch (error) {
      spinner.fail('Failed to validate quantum circuit')
      logger.error('Validation failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('benchmark <circuit>')
  .description('Benchmark quantum circuit performance')
  .option('-m, --metrics <metrics>', 'Metrics to measure (comma-separated)', 'fidelity,depth,time')
  .option('-i, --iterations <number>', 'Number of iterations', '100')
  .option('--parallel', 'Run benchmarks in parallel')
  .option('--output <file>', 'Output file for results')
  .action(async (circuit, options) => {
    const spinner = ora('Benchmarking quantum circuit...').start()
    
    try {
      const results = await quantumCLI.benchmarkCircuit(circuit, options)
      spinner.succeed('Quantum circuit benchmarking completed!')
      
      console.log(chalk.cyan('\\nBenchmark Results:'))
      Object.entries(results.metrics).forEach(([metric, value]) => {
        console.log(`${metric}: ${value}`)
      })
    } catch (error) {
      spinner.fail('Failed to benchmark quantum circuit')
      logger.error('Benchmarking failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('superposition')
  .description('Create a superposition state')
  .option('-s, --states <states>', 'Basis states (comma-separated)', '|0⟩,|1⟩')
  .option('-a, --amplitudes <amplitudes>', 'Amplitudes (comma-separated)', '0.707,0.707')
  .option('-n, --name <name>', 'State name', 'superposition')
  .option('-f, --file <file>', 'Output file')
  .action(async (options) => {
    const spinner = ora('Creating superposition state...').start()
    
    try {
      const state = await quantumCLI.createSuperposition(options)
      spinner.succeed('Superposition state created successfully!')
      
      console.log(chalk.cyan('\\nSuperposition State:'))
      console.log(JSON.stringify(state, null, 2))
    } catch (error) {
      spinner.fail('Failed to create superposition state')
      logger.error('Superposition creation failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('entanglement')
  .description('Create an entanglement state')
  .option('-q, --qubits <qubits>', 'Qubits to entangle (comma-separated)', '0,1')
  .option('-b, --bell-state <state>', 'Bell state type (Φ+, Φ-, Ψ+, Ψ-)', 'Φ+')
  .option('-n, --name <name>', 'State name', 'entanglement')
  .option('-f, --file <file>', 'Output file')
  .action(async (options) => {
    const spinner = ora('Creating entanglement state...').start()
    
    try {
      const state = await quantumCLI.createEntanglement(options)
      spinner.succeed('Entanglement state created successfully!')
      
      console.log(chalk.cyan('\\nEntanglement State:'))
      console.log(JSON.stringify(state, null, 2))
    } catch (error) {
      spinner.fail('Failed to create entanglement state')
      logger.error('Entanglement creation failed:', error)
      process.exit(1)
    }
  })

quantum
  .command('measure <state>')
  .description('Perform quantum measurement')
  .option('-b, --basis <basis>', 'Measurement basis', 'computational')
  .option('-s, --shots <number>', 'Number of measurement shots', '1000')
  .option('-c, --collapse', 'Enable state collapse', true)
  .action(async (state, options) => {
    const spinner = ora('Performing quantum measurement...').start()
    
    try {
      const results = await quantumCLI.performMeasurement(state, options)
      spinner.succeed('Quantum measurement completed!')
      
      console.log(chalk.cyan('\\nMeasurement Results:'))
      Object.entries(results.probabilities).forEach(([state, probability]) => {
        console.log(`${state}: ${(probability * 100).toFixed(2)}%`)
      })
    } catch (error) {
      spinner.fail('Failed to perform quantum measurement')
      logger.error('Measurement failed:', error)
      process.exit(1)
    }
  })

// Build and development commands
program
  .command('build')
  .description('Build the project')
  .option('-w, --watch', 'Watch for changes')
  .option('-p, --production', 'Production build')
  .option('-o, --output <directory>', 'Output directory', './dist')
  .action(async (options) => {
    const spinner = ora('Building project...').start()
    
    try {
      await projectCLI.build(options)
      spinner.succeed('Project built successfully!')
    } catch (error) {
      spinner.fail('Failed to build project')
      logger.error('Build failed:', error)
      process.exit(1)
    }
  })

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port number', '3000')
  .option('--host <host>', 'Host address', 'localhost')
  .option('--https', 'Use HTTPS')
  .action(async (options) => {
    const spinner = ora('Starting development server...').start()
    
    try {
      await projectCLI.dev(options)
      spinner.succeed('Development server started!')
    } catch (error) {
      spinner.fail('Failed to start development server')
      logger.error('Dev server failed:', error)
      process.exit(1)
    }
  })

program
  .command('test')
  .description('Run tests')
  .option('-w, --watch', 'Watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .option('--verbose', 'Verbose output')
  .action(async (options) => {
    const spinner = ora('Running tests...').start()
    
    try {
      await projectCLI.test(options)
      spinner.succeed('Tests completed!')
    } catch (error) {
      spinner.fail('Tests failed')
      logger.error('Test execution failed:', error)
      process.exit(1)
    }
  })

program
  .command('lint')
  .description('Lint code')
  .option('--fix', 'Auto-fix issues')
  .option('--verbose', 'Verbose output')
  .action(async (options) => {
    const spinner = ora('Linting code...').start()
    
    try {
      await projectCLI.lint(options)
      spinner.succeed('Linting completed!')
    } catch (error) {
      spinner.fail('Linting failed')
      logger.error('Linting failed:', error)
      process.exit(1)
    }
  })

program
  .command('clean')
  .description('Clean build artifacts')
  .option('--all', 'Clean all artifacts including node_modules')
  .action(async (options) => {
    const spinner = ora('Cleaning project...').start()
    
    try {
      await projectCLI.clean(options)
      spinner.succeed('Project cleaned!')
    } catch (error) {
      spinner.fail('Cleaning failed')
      logger.error('Cleaning failed:', error)
      process.exit(1)
    }
  })

// Configuration commands
program
  .command('config')
  .description('Manage configuration')
  .option('--list', 'List current configuration')
  .option('--set <key=value>', 'Set configuration value')
  .option('--get <key>', 'Get configuration value')
  .option('--reset', 'Reset to default configuration')
  .action(async (options) => {
    try {
      if (options.list) {
        const config = await configManager.list()
        console.log(chalk.cyan('Current Configuration:'))
        console.log(JSON.stringify(config, null, 2))
      } else if (options.set) {
        const [key, value] = options.set.split('=')
        await configManager.set(key, value)
        console.log(chalk.green(`Configuration set: ${key} = ${value}`))
      } else if (options.get) {
        const value = await configManager.get(options.get)
        console.log(chalk.cyan(`${options.get}: ${value}`))
      } else if (options.reset) {
        await configManager.reset()
        console.log(chalk.green('Configuration reset to defaults'))
      }
    } catch (error) {
      logger.error('Configuration operation failed:', error)
      process.exit(1)
    }
  })

// Help command with enhanced output
program
  .command('help [command]')
  .description('Display help for command')
  .action((command) => {
    if (command) {
      // Show specific command help
      const cmd = program.commands.find(c => c.name() === command)
      if (cmd) {
        cmd.help()
      } else {
        console.error(chalk.red(`Unknown command: ${command}`))
        process.exit(1)
      }
    } else {
      // Show main help with banner
      displayBanner()
      program.help()
    }
  })

// Error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Parse command line arguments
program.parse()
