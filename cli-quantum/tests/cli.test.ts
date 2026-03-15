import { ProjectCLI } from '../src/lib/project-cli'
import { DesignSystemCLI } from '../src/lib/design-system-cli'
import { QuantumCLI } from '../src/lib/quantum-cli'
import { ConfigManager } from '../src/lib/config-manager'
import { Logger } from '../src/lib/logger'
import fs from 'fs-extra'

// Mock dependencies
jest.mock('fs-extra')
jest.mock('ora')
jest.mock('inquirer')
jest.mock('child_process')

const mockFs = fs as jest.Mocked<typeof fs>

describe('ProjectCLI', () => {
  let projectCLI: ProjectCLI

  beforeEach(() => {
    projectCLI = new ProjectCLI()
    jest.clearAllMocks()
  })

  describe('init', () => {
    it('should initialize a basic project', async () => {
      const options = {
        name: 'test-project',
        template: 'basic',
        directory: './test-project',
        typescript: true,
        packageManager: 'npm' as const,
        git: true,
        install: true
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(false)
      mockFs.writeFile.mockResolvedValue()
      mockFs.writeJson.mockResolvedValue()

      await projectCLI.init(options)

      expect(mockFs.ensureDir).toHaveBeenCalledWith('./test-project')
      expect(mockFs.writeJson).toHaveBeenCalledTimes(1) // package.json
      expect(mockFs.writeFile).toHaveBeenCalledTimes(4) // README, config, vite config, main, App, CSS
    })

    it('should initialize a quantum project', async () => {
      const options = {
        name: 'quantum-project',
        template: 'quantum-app',
        directory: './quantum-project',
        quantum: true,
        typescript: true,
        packageManager: 'npm' as const,
        git: true,
        install: true
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(false)
      mockFs.writeFile.mockResolvedValue()
      mockFs.writeJson.mockResolvedValue()

      await projectCLI.init(options)

      expect(mockFs.ensureDir).toHaveBeenCalledWith('./quantum-project')
      expect(mockFs.writeJson).toHaveBeenCalledTimes(1)
      expect(mockFs.writeFile).toHaveBeenCalledTimes(4)
    })
  })

  describe('build', () => {
    it('should build the project', async () => {
      const options = {
        watch: false,
        production: true,
        output: './dist'
      }

      // Mock execAsync
      const { execAsync } = require('child_process')
      execAsync.mockResolvedValue({ stdout: 'Build successful' })

      await projectCLI.build(options)

      expect(execAsync).toHaveBeenCalledWith('npm run build')
    })
  })

  describe('test', () => {
    it('should run tests', async () => {
      const options = {
        watch: false,
        coverage: true,
        verbose: false
      }

      const { execAsync } = require('child_process')
      execAsync.mockResolvedValue({ stdout: 'Tests passed' })

      await projectCLI.test(options)

      expect(execAsync).toHaveBeenCalledWith('npm run test -- --coverage')
    })
  })

  describe('lint', () => {
    it('should lint code', async () => {
      const options = {
        fix: true,
        verbose: false
      }

      const { execAsync } = require('child_process')
      execAsync.mockResolvedValue({ stdout: 'Linting completed' })

      await projectCLI.lint(options)

      expect(execAsync).toHaveBeenCalledWith('npm run lint --fix')
    })
  })

  describe('clean', () => {
    it('should clean build artifacts', async () => {
      const options = {
        all: false
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.remove.mockResolvedValue()

      await projectCLI.clean(options)

      expect(mockFs.remove).toHaveBeenCalledTimes(5) // dist, build, .next, out, .cache
    })

    it('should clean all artifacts including node_modules', async () => {
      const options = {
        all: true
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.remove.mockResolvedValue()

      await projectCLI.clean(options)

      expect(mockFs.remove).toHaveBeenCalledTimes(8) // Including node_modules and lock files
    })
  })
})

describe('DesignSystemCLI', () => {
  let designSystemCLI: DesignSystemCLI

  beforeEach(() => {
    designSystemCLI = new DesignSystemCLI()
    jest.clearAllMocks()
  })

  describe('generateTokens', () => {
    it('should generate CSS tokens', async () => {
      const options = {
        format: 'css' as const,
        output: './styles',
        watch: false,
        theme: 'default'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue('export const tokens = {}')
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateTokens(options)

      expect(mockFs.ensureDir).toHaveBeenCalledWith('./styles')
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './styles/tokens-default.css',
        expect.stringContaining('--forsure-color-primary-50: #f0fdf4')
      )
    })

    it('should generate SCSS tokens', async () => {
      const options = {
        format: 'scss' as const,
        output: './styles',
        watch: false,
        theme: 'default'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue('export const tokens = {}')
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateTokens(options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './styles/tokens-default.scss',
        expect.stringContaining('$primary-50: #f0fdf4')
      )
    })

    it('should generate TypeScript tokens', async () => {
      const options = {
        format: 'ts' as const,
        output: './styles',
        watch: false,
        theme: 'default'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue('export const tokens = {}')
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateTokens(options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './styles/tokens-default.ts',
        expect.stringContaining('export interface DesignTokens')
      )
    })

    it('should generate JSON tokens', async () => {
      const options = {
        format: 'json' as const,
        output: './styles',
        watch: false,
        theme: 'default'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue('export const tokens = {}')
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateTokens(options)

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        './styles/tokens-default.json',
        expect.objectContaining({
          theme: 'default',
          colors: expect.any(Object)
        })
      )
    })
  })

  describe('generateComponent', () => {
    it('should generate a basic component', async () => {
      const name = 'button'
      const options = {
        template: 'basic',
        directory: './components/ui',
        typescript: true,
        test: true,
        story: false,
        quantum: false
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateComponent(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './components/ui/forsure-button.tsx',
        expect.stringContaining('export const ForsureButton')
      )
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './components/ui/forsure-button.test.tsx',
        expect.stringContaining('describe')
      )
    })

    it('should generate a quantum component', async () => {
      const name = 'quantum-circuit'
      const options = {
        template: 'quantum',
        directory: './components/ui',
        typescript: true,
        test: true,
        story: false,
        quantum: true
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateComponent(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './components/ui/forsure-quantum-circuit.tsx',
        expect.stringContaining('QuantumCircuit')
      )
    })
  })

  describe('generateHook', () => {
    it('should generate a basic hook', async () => {
      const name = 'useData'
      const options = {
        template: 'basic',
        directory: './hooks',
        typescript: true,
        test: true,
        quantum: false
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateHook(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './hooks/useData.ts',
        expect.stringContaining('export const useData')
      )
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './hooks/useData.test.ts',
        expect.stringContaining('describe')
      )
    })

    it('should generate a quantum hook', async () => {
      const name = 'useQuantum'
      const options = {
        template: 'quantum',
        directory: './hooks',
        typescript: true,
        test: true,
        quantum: true
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateHook(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './hooks/useQuantum.ts',
        expect.stringContaining('QuantumCircuit')
      )
    })
  })

  describe('generateUtility', () => {
    it('should generate a utility function', async () => {
      const name = 'formatCurrency'
      const options = {
        template: 'basic',
        directory: './lib',
        typescript: true,
        test: true
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await designSystemCLI.generateUtility(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './lib/formatCurrency.ts',
        expect.stringContaining('export function formatCurrency')
      )
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './lib/formatCurrency.test.ts',
        expect.stringContaining('describe')
      )
    })
  })

  describe('audit', () => {
    it('should audit design system', async () => {
      const options = {
        report: false,
        fix: false,
        strict: false
      }

      mockFs.pathExists.mockResolvedValue(false)
      const { glob } = require('glob')
      glob.mockImplementation((pattern: string, callback: Function) => {
        callback(null, [])
      })

      const result = await designSystemCLI.audit(options)

      expect(result.issues).toHaveLength(1)
      expect(result.issues[0].message).toBe('Design tokens file not found')
      expect(result.summary.errors).toBe(1)
    })
  })
})

describe('QuantumCLI', () => {
  let quantumCLI: QuantumCLI

  beforeEach(() => {
    quantumCLI = new QuantumCLI()
    jest.clearAllMocks()
  })

  describe('createCircuit', () => {
    it('should create a Bell state circuit', async () => {
      const name = 'bell-state'
      const options = {
        algorithm: 'bell',
        format: 'ts'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await quantumCLI.createCircuit(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './circuits/bell-state.ts',
        expect.stringContaining('Bell State Circuit')
      )
    })

    it('should create a custom circuit', async () => {
      const name = 'custom-circuit'
      const options = {
        qubits: '3',
        gates: 'H(0),CNOT(0,1),CNOT(1,2)',
        format: 'ts'
      }

      mockFs.ensureDir.mockResolvedValue()
      mockFs.writeFile.mockResolvedValue()

      await quantumCLI.createCircuit(name, options)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        './circuits/custom-circuit.ts',
        expect.stringContaining('Custom Quantum Circuit')
      )
    })
  })

  describe('simulateCircuit', () => {
    it('should simulate a quantum circuit', async () => {
      const circuit = 'bell-state'
      const options = {
        shots: '1000',
        precision: 'medium',
        visualize: false,
        noise: false
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue(JSON.stringify({
        name: 'bell-state',
        qubits: 2,
        gates: [
          { gate: 'H', target: 0 },
          { gate: 'CNOT', control: 0, target: 1 }
        ]
      }))

      const result = await quantumCLI.simulateCircuit(circuit, options)

      expect(result.circuit).toBe('bell-state')
      expect(result.results.probabilities).toBeDefined()
      expect(result.results.samples).toBeDefined()
      expect(result.results.fidelity).toBeGreaterThan(0.9)
    })
  })

  describe('optimizeCircuit', () => {
    it('should optimize a quantum circuit', async () => {
      const circuit = 'test-circuit'
      const options = {
        rules: 'gate-fusion,gate-cancellation',
        target: 'depth',
        iterations: '100',
        preserveSemantics: true
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue(JSON.stringify({
        name: 'test-circuit',
        qubits: 2,
        gates: [
          { gate: 'H', target: 0 },
          { gate: 'H', target: 0 }, // Should be cancelled
          { gate: 'CNOT', control: 0, target: 1 }
        ]
      }))

      const result = await quantumCLI.optimizeCircuit(circuit, options)

      expect(result.original).toBeDefined()
      expect(result.optimized).toBeDefined()
      expect(result.metrics.depthReduction).toBeGreaterThan(0)
      expect(result.diff).toBeDefined()
    })
  })

  describe('validateCircuit', () => {
    it('should validate a quantum circuit', async () => {
      const circuit = 'test-circuit'
      const options = {
        strict: false,
        warnings: true,
        fix: false
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue(JSON.stringify({
        name: 'test-circuit',
        qubits: 2,
        gates: [
          { gate: 'H', target: 0 },
          { gate: 'CNOT', control: 0, target: 1 }
        ]
      }))

      const result = await quantumCLI.validateCircuit(circuit, options)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid circuit', async () => {
      const circuit = 'invalid-circuit'
      const options = {
        strict: true,
        warnings: true,
        fix: false
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readFile.mockResolvedValue(JSON.stringify({
        // Missing name
        qubits: 0, // Invalid qubits
        gates: []
      }))

      const result = await quantumCLI.validateCircuit(circuit, options)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('createSuperposition', () => {
    it('should create a superposition state', async () => {
      const options = {
        states: '|0⟩,|1⟩',
        amplitudes: '0.707,0.707',
        name: 'superposition'
      }

      const result = await quantumCLI.createSuperposition(options)

      expect(result.name).toBe('superposition')
      expect(result.type).toBe('superposition')
      expect(result.qubits).toBe(2)
      expect(result.fidelity).toBe(0.99)
    })
  })

  describe('createEntanglement', () => {
    it('should create an entanglement state', async () => {
      const options = {
        qubits: '0,1',
        bellState: 'Φ+',
        name: 'entanglement'
      }

      const result = await quantumCLI.createEntanglement(options)

      expect(result.name).toBe('entanglement')
      expect(result.type).toBe('entanglement')
      expect(result.qubits).toBe(2)
      expect(result.entanglement).toBe(1.0)
    })
  })

  describe('performMeasurement', () => {
    it('should perform quantum measurement', async () => {
      const state = 'test-state'
      const options = {
        basis: 'computational',
        shots: '1000',
        collapse: true
      }

      const result = await quantumCLI.performMeasurement(state, options)

      expect(result.state).toBe('test-state')
      expect(result.basis).toBe('computational')
      expect(result.shots).toBe(1000)
      expect(result.results.probabilities).toBeDefined()
      expect(result.collapse).toBe(true)
    })
  })
})

describe('ConfigManager', () => {
  let configManager: ConfigManager

  beforeEach(() => {
    configManager = new ConfigManager()
    jest.clearAllMocks()
  })

  describe('load', () => {
    it('should load default config when file does not exist', async () => {
      mockFs.pathExists.mockResolvedValue(false)

      const config = await configManager.load()

      expect(config.designTokens.input).toBe('./lib/design-tokens.ts')
      expect(config.components.prefix).toBe('forsure-')
    })

    it('should load config from file', async () => {
      const customConfig = {
        designTokens: {
          input: './custom/tokens.ts',
          output: './custom/styles.css',
          format: 'scss',
          watch: true
        }
      }

      mockFs.pathExists.mockResolvedValue(true)
      mockFs.readJson.mockResolvedValue(customConfig)

      const config = await configManager.load()

      expect(config.designTokens.input).toBe('./custom/tokens.ts')
      expect(config.designTokens.format).toBe('scss')
    })
  })

  describe('save', () => {
    it('should save config to file', async () => {
      const config = {
        designTokens: {
          input: './lib/design-tokens.ts',
          output: './styles/generated.css',
          format: 'css',
          watch: false
        },
        components: {
          directory: './components/ui',
          prefix: 'forsure-',
          typescript: true,
          test: true,
          storybook: false
        },
        build: {
          outputDirectory: './dist',
          minify: true,
          sourcemap: true,
          target: 'es2020'
        }
      }

      mockFs.writeJson.mockResolvedValue()

      await configManager.save(config)

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        '.forsurerc.json',
        config,
        { spaces: 2 }
      )
    })
  })

  describe('get', () => {
    it('should get nested config value', async () => {
      mockFs.pathExists.mockResolvedValue(false)

      const value = await configManager.get('designTokens.format')

      expect(value).toBe('css')
    })
  })

  describe('set', () => {
    it('should set nested config value', async () => {
      mockFs.pathExists.mockResolvedValue(false)
      mockFs.writeJson.mockResolvedValue()

      await configManager.set('designTokens.format', 'scss')

      expect(mockFs.writeJson).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should reset config to defaults', async () => {
      mockFs.writeJson.mockResolvedValue()

      await configManager.reset()

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        '.forsurerc.json',
        expect.any(Object),
        { spaces: 2 }
      )
    })
  })
})

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    logger = new Logger()
    jest.clearAllMocks()
  })

  describe('log levels', () => {
    it('should respect log levels', () => {
      logger.setLevel(1) // WARN level

      const consoleSpy = jest.spyOn(console, 'error')
      const consoleWarnSpy = jest.spyOn(console, 'warn')
      const consoleInfoSpy = jest.spyOn(console, 'info')

      logger.error('Error message')
      logger.warn('Warning message')
      logger.info('Info message')

      expect(consoleSpy).toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleWarnSpy).toHaveBeenCalledWith('WARN: Warning message')
      expect(consoleInfoSpy).not.toHaveBeenCalled()
    })
  })

  describe('success', () => {
    it('should log success message', () => {
      const consoleSpy = jest.spyOn(console, 'log')

      logger.success('Success message')

      expect(consoleSpy).toHaveBeenCalledWith('SUCCESS: Success message')
    })
  })
})
