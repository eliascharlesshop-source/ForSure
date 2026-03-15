import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'
import { Logger } from './logger'
import { ConfigManager } from './config-manager'

export interface CircuitOptions {
  name: string
  qubits?: string
  gates?: string
  algorithm?: string
  file?: string
  format?: string
}

export interface SimulateOptions {
  shots?: string
  precision?: string
  output?: string
  visualize?: boolean
  noise?: boolean
}

export interface OptimizeOptions {
  rules?: string
  target?: string
  iterations?: string
  preserveSemantics?: boolean
}

export interface ValidateOptions {
  strict?: boolean
  warnings?: boolean
  fix?: boolean
}

export interface BenchmarkOptions {
  metrics?: string
  iterations?: string
  parallel?: boolean
  output?: string
}

export interface SuperpositionOptions {
  states?: string
  amplitudes?: string
  name?: string
  file?: string
}

export interface EntanglementOptions {
  qubits?: string
  bellState?: string
  name?: string
  file?: string
}

export interface MeasureOptions {
  basis?: string
  shots?: string
  collapse?: boolean
}

export interface SimulationResult {
  circuit: string
  results: {
    probabilities: Record<string, number>
    samples: Record<string, number>
    fidelity: number
    confidence: number
    executionTime: number
  }
  visualization?: string
}

export interface OptimizationResult {
  original: any
  optimized: any
  metrics: {
    depthReduction: number
    fidelityImprovement: number
    gateReduction: number
    optimizationTime: number
  }
  diff: string
}

export interface ValidationResult {
  valid: boolean
  errors: Array<{
    message: string
    severity: 'error' | 'warning' | 'info'
    line?: number
    column?: number
  }>
  warnings: Array<{
    message: string
    severity: 'error' | 'warning' | 'info'
    line?: number
    column?: number
  }>
  suggestions: string[]
}

export interface BenchmarkResult {
  circuit: string
  metrics: Record<string, number>
  iterations: number
  totalTime: number
  parallel: boolean
}

export interface QuantumState {
  name: string
  type: 'superposition' | 'entanglement' | 'mixed'
  qubits: number
  amplitudes: Complex[]
  phases: number[]
  fidelity: number
  coherence: number
  purity: number
  entanglement?: number
  metadata: {
    algorithm: string
    depth: number
    width: number
    gates: number
    measurements: number
    optimizations: string[]
    errors: string[]
    warnings: string[]
    suggestions: string[]
  }
}

export interface MeasurementResult {
  state: string
  basis: string
  shots: number
  results: {
    probabilities: Record<string, number>
    samples: Record<string, number>
    expectation: Record<string, number>
    variance: Record<string, number>
  }
  collapse: boolean
  postState?: string
  confidence: number
  error: number
  timestamp: number
}

export class QuantumCLI {
  private logger: Logger
  private config: ConfigManager

  constructor() {
    this.logger = new Logger()
    this.config = new ConfigManager()
  }

  async createCircuit(name: string, options: CircuitOptions): Promise<void> {
    const spinner = ora('Creating quantum circuit...').start()
    
    try {
      const qubits = parseInt(options.qubits || '2')
      const gates = options.gates ? options.gates.split(',').map(g => g.trim()) : []
      const algorithm = options.algorithm
      const format = options.format || 'ts'
      const outputPath = options.file || `./circuits/${name}.${format}`
      
      let circuitCode = ''
      
      if (algorithm) {
        circuitCode = this.generateAlgorithmCircuit(name, algorithm, qubits)
      } else {
        circuitCode = this.generateCustomCircuit(name, qubits, gates)
      }
      
      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputPath))
      
      // Write circuit file
      if (format === 'ts') {
        circuitCode = this.wrapInTypeScript(circuitCode)
      } else if (format === 'js') {
        circuitCode = this.wrapInJavaScript(circuitCode)
      } else if (format === 'json') {
        circuitCode = JSON.stringify({
          name,
          qubits,
          gates: gates.map(gate => this.parseGate(gate)),
          algorithm
        }, null, 2)
      }
      
      await fs.writeFile(outputPath, circuitCode)
      
      spinner.succeed(`Quantum circuit ${name} created successfully!`)
      console.log(chalk.cyan(`Circuit saved to: ${outputPath}`))
    } catch (error) {
      spinner.fail('Failed to create quantum circuit')
      throw error
    }
  }

  private generateAlgorithmCircuit(name: string, algorithm: string, qubits: number): string {
    const algorithms: Record<string, string> = {
      'bell': `// Bell State Circuit
const ${name} = {
  name: '${name}',
  qubits: 2,
  gates: [
    { gate: 'H', target: 0 },
    { gate: 'CNOT', control: 0, target: 1 }
  ],
  measurements: [
    { qubit: 0, basis: 'computational' },
    { qubit: 1, basis: 'computational' }
  ]
}`,
      'ghz': `// GHZ State Circuit
const ${name} = {
  name: '${name}',
  qubits: 3,
  gates: [
    { gate: 'H', target: 0 },
    { gate: 'CNOT', control: 0, target: 1 },
    { gate: 'CNOT', control: 0, target: 2 }
  ],
  measurements: [
    { qubit: 0, basis: 'computational' },
    { qubit: 1, basis: 'computational' },
    { qubit: 2, basis: 'computational' }
  ]
}`,
      'grover': `// Grover's Algorithm
const ${name} = {
  name: '${name}',
  qubits: ${qubits},
  gates: [
    // Initialize superposition
    ...Array(${qubits}).fill(0).map((_, i) => ({ gate: 'H', target: i })),
    
    // Oracle (marking the solution)
    { gate: 'Z', target: ${qubits - 1} },
    
    // Diffusion operator
    ...Array(${qubits}).fill(0).map((_, i) => ({ gate: 'H', target: i })),
    { gate: 'Z', target: 0 },
    ...Array(${qubits}).fill(0).map((_, i) => ({ gate: 'H', target: i }))
  ],
  measurements: [
    ...Array(${qubits}).fill(0).map((_, i) => ({ qubit: i, basis: 'computational' }))
  ]
}`,
      'qft': `// Quantum Fourier Transform
const ${name} = {
  name: '${name}',
  qubits: ${qubits},
  gates: [
    // Apply H to first qubit
    { gate: 'H', target: 0 },
    
    // Apply controlled rotations
    ...Array(${qubits - 1}).fill(0).map((_, i) => ({
      gate: 'CRZ',
      control: i + 1,
      target: 0,
      phase: Math.PI / Math.pow(2, i + 1)
    })),
    
    // Apply H to remaining qubits
    ...Array(${qubits - 1}).fill(0).map((_, i) => ({ gate: 'H', target: i + 1 }))
  ],
  measurements: [
    ...Array(${qubits}).fill(0).map((_, i) => ({ qubit: i, basis: 'computational' }))
  ]
}`,
      'teleport': `// Quantum Teleportation
const ${name} = {
  name: '${name}',
  qubits: 3,
  gates: [
    // Create Bell state between qubits 1 and 2
    { gate: 'H', target: 1 },
    { gate: 'CNOT', control: 1, target: 2 },
    
    // Bell measurement on qubits 0 and 1
    { gate: 'CNOT', control: 0, target: 1 },
    { gate: 'H', target: 0 },
    
    // Conditional operations on qubit 2
    { gate: 'CNOT', control: 1, target: 2 },
    { gate: 'CZ', control: 0, target: 2 }
  ],
  measurements: [
    { qubit: 0, basis: 'computational' },
    { qubit: 1, basis: 'computational' },
    { qubit: 2, basis: 'computational' }
  ]
}`
    }
    
    return algorithms[algorithm] || `// Custom Circuit
const ${name} = {
  name: '${name}',
  qubits: ${qubits},
  gates: [
    // Add your gates here
  ],
  measurements: [
    ...Array(${qubits}).fill(0).map((_, i) => ({ qubit: i, basis: 'computational' }))
  ]
}`
  }

  private generateCustomCircuit(name: string, qubits: number, gates: string[]): string {
    const parsedGates = gates.map(gate => this.parseGate(gate))
    
    return `// Custom Quantum Circuit
const ${name} = {
  name: '${name}',
  qubits: ${qubits},
  gates: ${JSON.stringify(parsedGates, null, 2)},
  measurements: [
    ...Array(${qubits}).fill(0).map((_, i) => ({ qubit: i, basis: 'computational' }))
  ]
}`
  }

  private parseGate(gate: string): any {
    // Parse gate string like "H(0)" or "CNOT(0,1)" or "RX(0,pi/4)"
    const match = gate.match(/([A-Z]+)\(([^)]+)\)/)
    if (!match) {
      throw new Error(`Invalid gate format: ${gate}`)
    }
    
    const gateType = match[1]
    const params = match[2].split(',').map(p => p.trim())
    
    const gateObj: any = { gate: gateType }
    
    if (gateType === 'CNOT' || gateType === 'CZ' || gateType === 'SWAP') {
      gateObj.control = parseInt(params[0])
      gateObj.target = parseInt(params[1])
    } else if (gateType === 'CCX') {
      gateObj.control = [parseInt(params[0]), parseInt(params[1])]
      gateObj.target = parseInt(params[2])
    } else if (gateType === 'RX' || gateType === 'RY' || gateType === 'RZ' || gateType === 'CRZ') {
      gateObj.target = parseInt(params[0])
      if (params[1]) {
        gateObj.phase = params[1].includes('pi') ? eval(params[1]) : parseFloat(params[1])
      }
    } else {
      gateObj.target = parseInt(params[0])
    }
    
    return gateObj
  }

  private wrapInTypeScript(code: string): string {
    return `// Generated by ForSure Quantum CLI
${code}

export default ${code.match(/const (\w+) = /)?.[1] || 'circuit'}`
  }

  private wrapInJavaScript(code: string): string {
    return `// Generated by ForSure Quantum CLI
${code}

module.exports = ${code.match(/const (\w+) = /)?.[1] || 'circuit'}`
  }

  async simulateCircuit(circuit: string, options: SimulateOptions): Promise<SimulationResult> {
    const spinner = ora('Simulating quantum circuit...').start()
    
    try {
      const shots = parseInt(options.shots || '1000')
      const precision = options.precision || 'medium'
      const visualize = options.visualize || false
      const noise = options.noise || false
      
      // Load circuit
      const circuitPath = this.resolveCircuitPath(circuit)
      const circuitData = await this.loadCircuit(circuitPath)
      
      // Simulate circuit (mock implementation)
      const simulationResults = await this.performSimulation(circuitData, {
        shots,
        precision,
        noise
      })
      
      // Generate visualization if requested
      let visualization: string | undefined
      if (visualize) {
        visualization = await this.generateVisualization(circuitData, simulationResults)
      }
      
      // Save results if output specified
      if (options.output) {
        const results = {
          circuit,
          results: simulationResults,
          visualization
        }
        await fs.writeJson(options.output, results, { spaces: 2 })
      }
      
      spinner.succeed('Quantum circuit simulation completed!')
      
      return {
        circuit,
        results: simulationResults,
        visualization
      }
    } catch (error) {
      spinner.fail('Failed to simulate quantum circuit')
      throw error
    }
  }

  private resolveCircuitPath(circuit: string): string {
    // Try different file extensions
    const extensions = ['.ts', '.js', '.json']
    
    for (const ext of extensions) {
      const path = `./circuits/${circuit}${ext}`
      if (fs.existsSync(path)) {
        return path
      }
    }
    
    throw new Error(`Circuit file not found: ${circuit}`)
  }

  private async loadCircuit(circuitPath: string): Promise<any> {
    const content = await fs.readFile(circuitPath, 'utf-8')
    
    if (circuitPath.endsWith('.json')) {
      return JSON.parse(content)
    }
    
    // Parse TypeScript/JavaScript (simplified)
    const match = content.match(/const (\w+) = ({[\s\S]*?})/)
    if (match) {
      try {
        return eval(`(${match[2]})`)
      } catch (error) {
        throw new Error(`Failed to parse circuit: ${error}`)
      }
    }
    
    throw new Error('Invalid circuit format')
  }

  private async performSimulation(circuit: any, options: any): Promise<any> {
    // Mock simulation implementation
    const numQubits = circuit.qubits
    const shots = options.shots
    
    // Generate mock results
    const outcomes = Array(Math.pow(2, numQubits)).fill(0).map((_, i) => 
      i.toString(2).padStart(numQubits, '0')
    )
    
    const probabilities: Record<string, number> = {}
    const samples: Record<string, number> = {}
    
    // Generate random probabilities that sum to 1
    const randomProbs = Array(outcomes.length).fill(0).map(() => Math.random())
    const sum = randomProbs.reduce((a, b) => a + b, 0)
    const normalizedProbs = randomProbs.map(p => p / sum)
    
    outcomes.forEach((outcome, i) => {
      probabilities[outcome] = normalizedProbs[i]
      samples[outcome] = Math.floor(normalizedProbs[i] * shots)
    })
    
    return {
      probabilities,
      samples,
      fidelity: 0.95 + Math.random() * 0.04, // Mock fidelity between 0.95-0.99
      confidence: 0.9 + Math.random() * 0.09, // Mock confidence between 0.9-0.99
      executionTime: Math.random() * 100 // Mock execution time in ms
    }
  }

  private async generateVisualization(circuit: any, results: any): Promise<string> {
    // Generate SVG visualization (mock implementation)
    const svg = `
<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa"/>
  <text x="400" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">
    Quantum Circuit: ${circuit.name}
  </text>
  
  <!-- Circuit visualization would go here -->
  <text x="400" y="200" text-anchor="middle" font-family="Arial" font-size="14">
    Circuit visualization (${circuit.qubits} qubits, ${circuit.gates?.length || 0} gates)
  </text>
  
  <!-- Results visualization -->
  <text x="400" y="350" text-anchor="middle" font-family="Arial" font-size="14">
    Fidelity: ${(results.fidelity * 100).toFixed(2)}%
  </text>
</svg>`
    
    return svg
  }

  async optimizeCircuit(circuit: string, options: OptimizeOptions): Promise<OptimizationResult> {
    const spinner = ora('Optimizing quantum circuit...').start()
    
    try {
      const rules = options.rules?.split(',') || ['gate-fusion', 'gate-cancellation']
      const target = options.target || 'depth'
      const iterations = parseInt(options.iterations || '100')
      const preserveSemantics = options.preserveSemantics !== false
      
      // Load circuit
      const circuitPath = this.resolveCircuitPath(circuit)
      const originalCircuit = await this.loadCircuit(circuitPath)
      
      // Perform optimization (mock implementation)
      const optimizedCircuit = await this.performOptimization(originalCircuit, {
        rules,
        target,
        iterations,
        preserveSemantics
      })
      
      // Calculate metrics
      const metrics = this.calculateOptimizationMetrics(originalCircuit, optimizedCircuit)
      
      // Generate diff
      const diff = this.generateDiff(originalCircuit, optimizedCircuit)
      
      spinner.succeed('Quantum circuit optimization completed!')
      
      return {
        original: originalCircuit,
        optimized: optimizedCircuit,
        metrics,
        diff
      }
    } catch (error) {
      spinner.fail('Failed to optimize quantum circuit')
      throw error
    }
  }

  private async performOptimization(circuit: any, options: any): Promise<any> {
    // Mock optimization implementation
    const optimized = JSON.parse(JSON.stringify(circuit)) // Deep clone
    
    // Apply optimization rules
    if (options.rules.includes('gate-cancellation')) {
      // Remove consecutive H gates
      optimized.gates = optimized.gates.filter((gate: any, i: number, arr: any[]) => {
        if (i > 0 && gate.gate === 'H' && arr[i-1].gate === 'H') {
          return false
        }
        return true
      })
    }
    
    if (options.rules.includes('gate-fusion')) {
      // Merge consecutive rotations of the same type
      const fusedGates: any[] = []
      let currentGate: any = null
      
      for (const gate of optimized.gates) {
        if (currentGate && 
            currentGate.gate === gate.gate && 
            currentGate.target === gate.target &&
            (currentGate.gate === 'RX' || currentGate.gate === 'RY' || currentGate.gate === 'RZ')) {
          // Fuse rotation gates
          currentGate.phase = (currentGate.phase || 0) + (gate.phase || 0)
        } else {
          if (currentGate) fusedGates.push(currentGate)
          currentGate = gate
        }
      }
      if (currentGate) fusedGates.push(currentGate)
      
      optimized.gates = fusedGates
    }
    
    return optimized
  }

  private calculateOptimizationMetrics(original: any, optimized: any): any {
    const originalDepth = original.gates?.length || 0
    const optimizedDepth = optimized.gates?.length || 0
    
    return {
      depthReduction: ((originalDepth - optimizedDepth) / originalDepth) * 100,
      fidelityImprovement: Math.random() * 5, // Mock improvement
      gateReduction: ((originalDepth - optimizedDepth) / originalDepth) * 100,
      optimizationTime: Math.random() * 50 // Mock time in ms
    }
  }

  private generateDiff(original: any, optimized: any): string {
    return `# Circuit Optimization Diff

## Original Circuit
- Gates: ${original.gates?.length || 0}
- Qubits: ${original.qubits}

## Optimized Circuit
- Gates: ${optimized.gates?.length || 0}
- Qubits: ${optimized.qubits}

## Changes
${JSON.stringify(optimized.gates || [], null, 2)}`
  }

  async validateCircuit(circuit: string, options: ValidateOptions): Promise<ValidationResult> {
    const spinner = ora('Validating quantum circuit...').start()
    
    try {
      const strict = options.strict || false
      const showWarnings = options.warnings || false
      
      // Load circuit
      const circuitPath = this.resolveCircuitPath(circuit)
      const circuitData = await this.loadCircuit(circuitPath)
      
      // Perform validation
      const errors: any[] = []
      const warnings: any[] = []
      const suggestions: string[] = []
      
      // Validate circuit structure
      if (!circuitData.name) {
        errors.push({
          message: 'Circuit must have a name',
          severity: 'error'
        })
      }
      
      if (!circuitData.qubits || circuitData.qubits < 1) {
        errors.push({
          message: 'Circuit must have at least 1 qubit',
          severity: 'error'
        })
      }
      
      if (!circuitData.gates || circuitData.gates.length === 0) {
        warnings.push({
          message: 'Circuit has no gates',
          severity: 'warning'
        })
      }
      
      // Validate gates
      if (circuitData.gates) {
        for (const [i, gate] of circuitData.gates.entries()) {
          if (!gate.gate) {
            errors.push({
              message: `Gate ${i} missing gate type`,
              severity: 'error',
              line: i + 1
            })
          }
          
          if (gate.target !== undefined && (gate.target < 0 || gate.target >= circuitData.qubits)) {
            errors.push({
              message: `Gate ${i} target qubit out of range`,
              severity: 'error',
              line: i + 1
            })
          }
        }
      }
      
      // Auto-fix if requested
      if (options.fix && errors.length > 0) {
        spinner.text = 'Auto-fixing issues...'
        await this.autoFixCircuit(circuitPath, circuitData, errors)
        errors.length = 0 // Clear errors after fixing
      }
      
      // Generate suggestions
      if (circuitData.gates && circuitData.gates.length > 10) {
        suggestions.push('Consider optimizing this circuit to reduce gate count')
      }
      
      if (!circuitData.measurements) {
        suggestions.push('Add measurements to get meaningful results')
      }
      
      const isValid = errors.length === 0
      
      spinner.succeed(`Circuit validation completed! ${isValid ? 'Valid' : 'Invalid'}`)
      
      return {
        valid: isValid,
        errors,
        warnings: showWarnings ? warnings : [],
        suggestions
      }
    } catch (error) {
      spinner.fail('Failed to validate quantum circuit')
      throw error
    }
  }

  private async autoFixCircuit(circuitPath: string, circuit: any, errors: any[]): Promise<void> {
    // Auto-fix simple issues
    if (!circuit.name) {
      circuit.name = path.basename(circuitPath, path.extname(circuitPath))
    }
    
    // Save fixed circuit
    const content = this.wrapInTypeScript(`const ${circuit.name} = ${JSON.stringify(circuit, null, 2)}`)
    await fs.writeFile(circuitPath, content)
  }

  async benchmarkCircuit(circuit: string, options: BenchmarkOptions): Promise<BenchmarkResult> {
    const spinner = ora('Benchmarking quantum circuit...').start()
    
    try {
      const metrics = options.metrics?.split(',') || ['fidelity', 'depth', 'time']
      const iterations = parseInt(options.iterations || '100')
      const parallel = options.parallel || false
      
      // Load circuit
      const circuitPath = this.resolveCircuitPath(circuit)
      const circuitData = await this.loadCircuit(circuitPath)
      
      // Perform benchmarking
      const benchmarkResults = await this.performBenchmark(circuitData, {
        metrics,
        iterations,
        parallel
      })
      
      // Save results if output specified
      if (options.output) {
        await fs.writeJson(options.output, benchmarkResults, { spaces: 2 })
      }
      
      spinner.succeed('Quantum circuit benchmarking completed!')
      
      return {
        circuit,
        metrics: benchmarkResults,
        iterations,
        totalTime: benchmarkResults.totalTime || 0,
        parallel
      }
    } catch (error) {
      spinner.fail('Failed to benchmark quantum circuit')
      throw error
    }
  }

  private async performBenchmark(circuit: any, options: any): Promise<any> {
    const startTime = Date.now()
    const results: any = {}
    
    for (const metric of options.metrics) {
      switch (metric) {
        case 'fidelity':
          results.fidelity = 0.95 + Math.random() * 0.04
          break
        case 'depth':
          results.depth = circuit.gates?.length || 0
          break
        case 'time':
          const times: number[] = []
          for (let i = 0; i < options.iterations; i++) {
            const start = Date.now()
            // Mock simulation
            await new Promise(resolve => setTimeout(resolve, Math.random() * 10))
            times.push(Date.now() - start)
          }
          results.time = times.reduce((a, b) => a + b, 0) / times.length
          break
        case 'gates':
          results.gates = circuit.gates?.length || 0
          break
        case 'memory':
          results.memory = Math.random() * 1024 // Mock memory usage in KB
          break
      }
    }
    
    results.totalTime = Date.now() - startTime
    
    return results
  }

  async createSuperposition(options: SuperpositionOptions): Promise<QuantumState> {
    const spinner = ora('Creating superposition state...').start()
    
    try {
      const states = options.states?.split(',') || ['|0⟩', '|1⟩']
      const amplitudes = options.amplitudes?.split(',').map(a => parseFloat(a.trim())) || [0.707, 0.707]
      const name = options.name || 'superposition'
      
      // Normalize amplitudes
      const norm = Math.sqrt(amplitudes.reduce((sum, amp) => sum + amp * amp, 0))
      const normalizedAmplitudes = amplitudes.map(amp => amp / norm)
      
      const state: QuantumState = {
        name,
        type: 'superposition',
        qubits: Math.log2(states.length),
        amplitudes: normalizedAmplitudes.map((amp, i) => ({
          real: amp,
          imag: 0
        })),
        phases: Array(states.length).fill(0),
        fidelity: 0.99,
        coherence: 0.98,
        purity: 1.0,
        metadata: {
          algorithm: 'superposition',
          depth: 1,
          width: Math.log2(states.length),
          gates: 1,
          measurements: 0,
          optimizations: [],
          errors: [],
          warnings: [],
          suggestions: []
        }
      }
      
      // Save state if file specified
      if (options.file) {
        const content = this.wrapInTypeScript(`const ${name} = ${JSON.stringify(state, null, 2)}`)
        await fs.writeFile(options.file, content)
      }
      
      spinner.succeed('Superposition state created successfully!')
      
      return state
    } catch (error) {
      spinner.fail('Failed to create superposition state')
      throw error
    }
  }

  async createEntanglement(options: EntanglementOptions): Promise<QuantumState> {
    const spinner = ora('Creating entanglement state...').start()
    
    try {
      const qubits = options.qubits?.split(',').map(q => parseInt(q.trim())) || [0, 1]
      const bellState = options.bellState || 'Φ+'
      const name = options.name || 'entanglement'
      
      const state: QuantumState = {
        name,
        type: 'entanglement',
        qubits: qubits.length,
        amplitudes: [
          { real: 0.707, imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
          { real: 0.707, imag: 0 }
        ],
        phases: [0, 0, 0, 0],
        fidelity: 0.99,
        coherence: 0.98,
        purity: 1.0,
        entanglement: 1.0,
        metadata: {
          algorithm: 'entanglement',
          depth: 2,
          width: qubits.length,
          gates: 2,
          measurements: 0,
          optimizations: [],
          errors: [],
          warnings: [],
          suggestions: []
        }
      }
      
      // Save state if file specified
      if (options.file) {
        const content = this.wrapInTypeScript(`const ${name} = ${JSON.stringify(state, null, 2)}`)
        await fs.writeFile(options.file, content)
      }
      
      spinner.succeed('Entanglement state created successfully!')
      
      return state
    } catch (error) {
      spinner.fail('Failed to create entanglement state')
      throw error
    }
  }

  async performMeasurement(state: string, options: MeasureOptions): Promise<MeasurementResult> {
    const spinner = ora('Performing quantum measurement...').start()
    
    try {
      const basis = options.basis || 'computational'
      const shots = parseInt(options.shots || '1000')
      const collapse = options.collapse !== false
      
      // Load state (mock implementation)
      const stateData = {
        name: state,
        amplitudes: [
          { real: 0.707, imag: 0 },
          { real: 0.707, imag: 0 }
        ]
      }
      
      // Perform measurement (mock implementation)
      const probabilities: Record<string, number> = {
        '|0⟩': 0.5,
        '|1⟩': 0.5
      }
      
      const samples: Record<string, number> = {
        '|0⟩': Math.floor(0.5 * shots),
        '|1⟩': Math.floor(0.5 * shots)
      }
      
      const result: MeasurementResult = {
        state,
        basis,
        shots,
        results: {
          probabilities,
          samples,
          expectation: {
            'Z': 0 // Mock expectation value
          },
          variance: {
            'Z': 1 // Mock variance
          }
        },
        collapse,
        postState: collapse ? '|0⟩' : undefined,
        confidence: 0.95,
        error: 0.01,
        timestamp: Date.now()
      }
      
      spinner.succeed('Quantum measurement completed!')
      
      return result
    } catch (error) {
      spinner.fail('Failed to perform quantum measurement')
      throw error
    }
  }
}

interface Complex {
  real: number
  imag: number
}
