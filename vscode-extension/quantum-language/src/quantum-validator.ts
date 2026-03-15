import * as vscode from 'vscode'

export interface QuantumValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fidelity: number
  coherence: number
  diagnostics: Array<{
    range: { start: number, end: number }
    message: string
    severity: vscode.DiagnosticSeverity
    source: string
  }>
}

export interface QuantumCircuitValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fidelity: number
  depth: number
  gateCount: number
  qubitCount: number
  optimizationSuggestions: string[]
}

export class QuantumValidator {
  private config: vscode.WorkspaceConfiguration
  private validationRules: Map<string, ValidationRule> = new Map()

  constructor() {
    this.config = vscode.workspace.getConfiguration('quantumLanguage')
    this.initializeValidationRules()
  }

  private initializeValidationRules() {
    // Quantum state validation rules
    this.validationRules.set('quantum-state', {
      pattern: /\|\w+⟩/g,
      validator: (match: string) => this.validateQuantumState(match),
      message: 'Invalid quantum state format'
    })

    // Quantum gate validation rules
    this.validationRules.set('quantum-gate', {
      pattern: /\b(H|X|Y|Z|I|S|T|CNOT|CX|CZ|CY|SWAP|CCX|CCZ|TOFFOLI|FREDKIN|HADAMARD|PAULI-X|PAULI-Y|PAULI-Z|IDENTITY|PHASE|PI|RX|RY|RZ|U|CU|CRX|CRY|CRZ|CH|CS|CT)\b/g,
      validator: (match: string) => this.validateQuantumGate(match),
      message: 'Invalid quantum gate'
    })

    // Quantum function validation rules
    this.validationRules.set('quantum-function', {
      pattern: /\b(createQuantumState|createSuperposition|createEntanglement|performMeasurement|applyGate|quantumCircuit|simulateCircuit|optimizeCircuit|validateCircuit|measureQubit|resetQubit|initializeState|entangleQubits|swapQubits|controlledGate)\b/g,
      validator: (match: string) => this.validateQuantumFunction(match),
      message: 'Invalid quantum function'
    })

    // Quantum algorithm validation rules
    this.validationRules.set('quantum-algorithm', {
      pattern: /\b(grover|shor|qft|quantum-fourier|variational|vqe|qaoa|quantum-approximate|optimization|teleportation|dense-coding|error-correction|surface-code|shor-code|stein-code)\b/g,
      validator: (match: string) => this.validateQuantumAlgorithm(match),
      message: 'Invalid quantum algorithm'
    })
  }

  async validateCircuit(code: string): Promise<QuantumCircuitValidation> {
    const validation: QuantumCircuitValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      depth: 0,
      gateCount: 0,
      qubitCount: 0,
      optimizationSuggestions: []
    }

    try {
      // Parse circuit structure
      const circuit = this.parseCircuit(code)
      
      // Validate circuit components
      validation.errors.push(...this.validateCircuitStructure(circuit))
      validation.warnings.push(...this.validateCircuitPerformance(circuit))
      
      // Calculate metrics
      validation.depth = this.calculateCircuitDepth(circuit)
      validation.gateCount = this.countGates(circuit)
      validation.qubitCount = this.countQubits(circuit)
      validation.fidelity = this.estimateCircuitFidelity(circuit)
      
      // Generate optimization suggestions
      validation.optimizationSuggestions = this.generateOptimizationSuggestions(circuit)
      
      // Check overall validity
      validation.isValid = validation.errors.length === 0
      
    } catch (error) {
      validation.isValid = false
      validation.errors.push(`Circuit parsing error: ${error}`)
    }

    return validation
  }

  async validateDocument(document: vscode.TextDocument): Promise<QuantumValidationResult> {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    const text = document.getText()
    const lines = text.split('\n')

    // Validate each line
    lines.forEach((line, lineIndex) => {
      const lineValidation = this.validateLine(line, lineIndex)
      result.errors.push(...lineValidation.errors)
      result.warnings.push(...lineValidation.warnings)
      result.diagnostics.push(...lineValidation.diagnostics)
    })

    // Validate overall document structure
    const structureValidation = this.validateDocumentStructure(text)
    result.errors.push(...structureValidation.errors)
    result.warnings.push(...structureValidation.warnings)
    result.diagnostics.push(...structureValidation.diagnostics)

    // Calculate overall metrics
    result.fidelity = this.calculateDocumentFidelity(text)
    result.coherence = this.calculateDocumentCoherence(text)
    result.isValid = result.errors.length === 0

    return result
  }

  private validateLine(line: string, lineIndex: number): QuantumValidationResult {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('//')) {
      return result
    }

    // Apply validation rules
    this.validationRules.forEach((rule, ruleName) => {
      const matches = line.matchAll(rule.pattern)
      for (const match of matches) {
        if (match.index !== undefined) {
          const validation = rule.validator(match[0])
          if (!validation.isValid) {
            result.errors.push(validation.error || `Invalid ${ruleName}: ${match[0]}`)
            result.diagnostics.push({
              range: { start: match.index, end: match.index + match[0].length },
              message: validation.error || rule.message,
              severity: vscode.DiagnosticSeverity.Error,
              source: 'quantum-validator'
            })
          }
        }
      }
    })

    // Validate quantum state syntax
    const stateMatches = line.matchAll(/\|([^|]+)⟩/g)
    for (const match of stateMatches) {
      if (match.index !== undefined) {
        const stateValidation = this.validateQuantumState(match[1])
        if (!stateValidation.isValid) {
          result.errors.push(stateValidation.error || `Invalid quantum state: ${match[1]}`)
          result.diagnostics.push({
            range: { start: match.index, end: match.index + match[0].length },
            message: stateValidation.error || 'Invalid quantum state format',
            severity: vscode.DiagnosticSeverity.Error,
            source: 'quantum-validator'
          })
        }
      }
    }

    // Validate function calls
    const functionMatches = line.matchAll(/(\w+)\s*\(/g)
    for (const match of functionMatches) {
      if (match.index !== undefined) {
        const functionValidation = this.validateFunctionCall(match[1], line)
        if (!functionValidation.isValid) {
          result.errors.push(functionValidation.error || `Invalid function call: ${match[1]}`)
          result.diagnostics.push({
            range: { start: match.index, end: match.index + match[1].length },
            message: functionValidation.error || 'Invalid function call',
            severity: vscode.DiagnosticSeverity.Error,
            source: 'quantum-validator'
          })
        }
      }
    }

    return result
  }

  private validateDocumentStructure(text: string): QuantumValidationResult {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    // Check for balanced brackets
    const bracketValidation = this.validateBrackets(text)
    if (!bracketValidation.isValid) {
      result.errors.push(...bracketValidation.errors)
      result.diagnostics.push(...bracketValidation.diagnostics)
    }

    // Check for balanced parentheses
    const parenthesesValidation = this.validateParentheses(text)
    if (!parenthesesValidation.isValid) {
      result.errors.push(...parenthesesValidation.errors)
      result.diagnostics.push(...parenthesesValidation.diagnostics)
    }

    // Check quantum circuit structure
    const circuitValidation = this.validateQuantumCircuitStructure(text)
    if (!circuitValidation.isValid) {
      result.errors.push(...circuitValidation.errors)
      result.diagnostics.push(...circuitValidation.diagnostics)
    }

    return result
  }

  private validateQuantumState(state: string): { isValid: boolean, error?: string } {
    // Valid quantum states
    const validStates = ['0', '1', '+', '-', '+i', '-i', 'ψ', 'φ', 'θ']
    const validBellStates = ['Φ+', 'Φ-', 'Ψ+', 'Ψ-']

    // Check single qubit states
    if (validStates.includes(state)) {
      return { isValid: true }
    }

    // Check Bell states
    if (validBellStates.includes(state)) {
      return { isValid: true }
    }

    // Check computational basis states (multi-qubit)
    if (/^[01]+$/.test(state)) {
      return { isValid: true }
    }

    // Check parameterized states
    if (/^[ψφθαβγδ]$/.test(state)) {
      return { isValid: true }
    }

    return { isValid: false, error: `Invalid quantum state: ${state}` }
  }

  private validateQuantumGate(gate: string): { isValid: boolean, error?: string } {
    // Valid single-qubit gates
    const singleQubitGates = ['H', 'X', 'Y', 'Z', 'I', 'S', 'T', 'RX', 'RY', 'RZ', 'U']
    const twoQubitGates = ['CNOT', 'CX', 'CZ', 'CY', 'SWAP', 'CU', 'CRX', 'CRY', 'CRZ', 'CH', 'CS', 'CT']
    const threeQubitGates = ['CCX', 'CCZ', 'TOFFOLI', 'FREDKIN']
    const aliases = ['HADAMARD', 'PAULI-X', 'PAULI-Y', 'PAULI-Z', 'IDENTITY', 'PHASE', 'PI']

    if (singleQubitGates.includes(gate) || 
        twoQubitGates.includes(gate) || 
        threeQubitGates.includes(gate) || 
        aliases.includes(gate)) {
      return { isValid: true }
    }

    return { isValid: false, error: `Invalid quantum gate: ${gate}` }
  }

  private validateQuantumFunction(func: string): { isValid: boolean, error?: string } {
    const validFunctions = [
      'createQuantumState', 'createSuperposition', 'createEntanglement',
      'performMeasurement', 'applyGate', 'quantumCircuit', 'simulateCircuit',
      'optimizeCircuit', 'validateCircuit', 'measureQubit', 'resetQubit',
      'initializeState', 'entangleQubits', 'swapQubits', 'controlledGate'
    ]

    if (validFunctions.includes(func)) {
      return { isValid: true }
    }

    return { isValid: false, error: `Invalid quantum function: ${func}` }
  }

  private validateQuantumAlgorithm(algo: string): { isValid: boolean, error?: string } {
    const validAlgorithms = [
      'grover', 'shor', 'qft', 'quantum-fourier', 'variational', 'vqe',
      'qaoa', 'quantum-approximate', 'optimization', 'teleportation',
      'dense-coding', 'error-correction', 'surface-code', 'shor-code', 'stein-code'
    ]

    if (validAlgorithms.includes(algo)) {
      return { isValid: true }
    }

    return { isValid: false, error: `Invalid quantum algorithm: ${algo}` }
  }

  private validateFunctionCall(funcName: string, line: string): { isValid: boolean, error?: string } {
    // Check if function is a valid quantum function
    const functionValidation = this.validateQuantumFunction(funcName)
    if (!functionValidation.isValid) {
      return functionValidation
    }

    // Check parameter count (simplified)
    const openParen = line.indexOf('(')
    const closeParen = line.indexOf(')', openParen)
    if (openParen !== -1 && closeParen !== -1) {
      const params = line.substring(openParen + 1, closeParen)
      const paramCount = params.split(',').filter(p => p.trim() !== '').length
      
      // Basic parameter validation
      if (funcName === 'createQuantumState' && paramCount < 1) {
        return { isValid: false, error: `createQuantumState requires at least 1 parameter` }
      }
      if (funcName === 'applyGate' && paramCount < 1) {
        return { isValid: false, error: `applyGate requires at least 1 parameter` }
      }
    }

    return { isValid: true }
  }

  private validateBrackets(text: string): QuantumValidationResult {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    const stack: number[] = []
    const lines = text.split('\n')

    lines.forEach((line, lineIndex) => {
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex]
        const position = lineIndex * (line.length + 1) + charIndex

        if (char === '{') {
          stack.push(position)
        } else if (char === '}') {
          if (stack.length === 0) {
            result.errors.push('Unmatched closing brace')
            result.diagnostics.push({
              range: { start: position, end: position + 1 },
              message: 'Unmatched closing brace',
              severity: vscode.DiagnosticSeverity.Error,
              source: 'quantum-validator'
            })
          } else {
            stack.pop()
          }
        }
      }
    })

    if (stack.length > 0) {
      result.errors.push('Unmatched opening brace(s)')
      stack.forEach(position => {
        result.diagnostics.push({
          range: { start: position, end: position + 1 },
          message: 'Unmatched opening brace',
          severity: vscode.DiagnosticSeverity.Error,
          source: 'quantum-validator'
        })
      })
    }

    result.isValid = result.errors.length === 0
    return result
  }

  private validateParentheses(text: string): QuantumValidationResult {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    const stack: number[] = []
    const lines = text.split('\n')

    lines.forEach((line, lineIndex) => {
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex]
        const position = lineIndex * (line.length + 1) + charIndex

        if (char === '(') {
          stack.push(position)
        } else if (char === ')') {
          if (stack.length === 0) {
            result.errors.push('Unmatched closing parenthesis')
            result.diagnostics.push({
              range: { start: position, end: position + 1 },
              message: 'Unmatched closing parenthesis',
              severity: vscode.DiagnosticSeverity.Error,
              source: 'quantum-validator'
            })
          } else {
            stack.pop()
          }
        }
      }
    })

    if (stack.length > 0) {
      result.errors.push('Unmatched opening parenthesis(s)')
      stack.forEach(position => {
        result.diagnostics.push({
          range: { start: position, end: position + 1 },
          message: 'Unmatched opening parenthesis',
          severity: vscode.DiagnosticSeverity.Error,
          source: 'quantum-validator'
        })
      })
    }

    result.isValid = result.errors.length === 0
    return result
  }

  private validateQuantumCircuitStructure(text: string): QuantumValidationResult {
    const result: QuantumValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fidelity: 1.0,
      coherence: 1.0,
      diagnostics: []
    }

    // Check for quantum circuit definition
    const circuitMatch = text.match(/quantumCircuit\s*\(/)
    if (!circuitMatch) {
      result.warnings.push('No quantum circuit definition found')
      return result
    }

    // Validate circuit structure
    const lines = text.split('\n')
    let inCircuit = false
    let braceCount = 0

    lines.forEach((line, lineIndex) => {
      if (line.includes('quantumCircuit')) {
        inCircuit = true
      }

      if (inCircuit) {
        braceCount += (line.match(/{/g) || []).length
        braceCount -= (line.match(/}/g) || []).length

        // Validate gate applications
        const gateMatches = line.matchAll(/applyGate\s*\(\s*['"]?(\w+)['"]?/g)
        for (const match of gateMatches) {
          if (match.index !== undefined) {
            const gateValidation = this.validateQuantumGate(match[1])
            if (!gateValidation.isValid) {
              result.errors.push(`Invalid gate in circuit: ${match[1]}`)
              const position = lineIndex * (line.length + 1) + match.index
              result.diagnostics.push({
                range: { start: position, end: position + match[1].length },
                message: gateValidation.error || 'Invalid quantum gate',
                severity: vscode.DiagnosticSeverity.Error,
                source: 'quantum-validator'
              })
            }
          }
        }
      }

      if (inCircuit && braceCount === 0) {
        inCircuit = false
      }
    })

    result.isValid = result.errors.length === 0
    return result
  }

  private parseCircuit(code: string): any {
    // Simplified circuit parsing
    return {
      gates: this.extractGates(code),
      qubits: this.extractQubits(code),
      measurements: this.extractMeasurements(code)
    }
  }

  private validateCircuitStructure(circuit: any): string[] {
    const errors: string[] = []

    if (!circuit.gates || circuit.gates.length === 0) {
      errors.push('Circuit has no gates')
    }

    if (!circuit.qubits || circuit.qubits.length === 0) {
      errors.push('Circuit has no qubits defined')
    }

    // Validate gate sequences
    circuit.gates.forEach((gate: any, index: number) => {
      if (!gate.name) {
        errors.push(`Gate at position ${index} has no name`)
      }
      if (gate.target === undefined) {
        errors.push(`Gate '${gate.name}' at position ${index} has no target`)
      }
    })

    return errors
  }

  private validateCircuitPerformance(circuit: any): string[] {
    const warnings: string[] = []

    // Check circuit depth
    const depth = this.calculateCircuitDepth(circuit)
    if (depth > 50) {
      warnings.push(`Circuit depth (${depth}) is high, may affect fidelity`)
    }

    // Check gate count
    const gateCount = this.countGates(circuit)
    if (gateCount > 100) {
      warnings.push(`Gate count (${gateCount}) is high, consider optimization`)
    }

    // Check for optimization opportunities
    if (this.hasRedundantGates(circuit)) {
      warnings.push('Circuit contains redundant gates that can be optimized')
    }

    return warnings
  }

  private calculateCircuitDepth(circuit: any): number {
    // Simplified depth calculation
    return circuit.gates ? circuit.gates.length : 0
  }

  private countGates(circuit: any): number {
    return circuit.gates ? circuit.gates.length : 0
  }

  private countQubits(circuit: any): number {
    return circuit.qubits ? circuit.qubits.length : 0
  }

  private estimateCircuitFidelity(circuit: any): number {
    // Simplified fidelity estimation
    const gateCount = this.countGates(circuit)
    const baseFidelity = 0.99
    const fidelityDecay = Math.pow(0.999, gateCount)
    return baseFidelity * fidelityDecay
  }

  private generateOptimizationSuggestions(circuit: any): string[] {
    const suggestions: string[] = []

    if (this.hasRedundantGates(circuit)) {
      suggestions.push('Remove redundant gates')
    }

    if (this.canMergeGates(circuit)) {
      suggestions.push('Merge compatible gates')
    }

    if (this.canReorderGates(circuit)) {
      suggestions.push('Reorder gates for better parallelization')
    }

    return suggestions
  }

  private hasRedundantGates(circuit: any): boolean {
    // Simplified check for redundant gates
    if (!circuit.gates) return false
    
    for (let i = 0; i < circuit.gates.length - 1; i++) {
      const gate1 = circuit.gates[i]
      const gate2 = circuit.gates[i + 1]
      
      if (gate1.name === gate2.name && gate1.target === gate2.target) {
        if (gate1.name === 'X' || gate1.name === 'Y' || gate1.name === 'Z') {
          return true
        }
      }
    }
    
    return false
  }

  private canMergeGates(circuit: any): boolean {
    // Simplified check for gate merging opportunities
    return circuit.gates && circuit.gates.length > 3
  }

  private canReorderGates(circuit: any): boolean {
    // Simplified check for gate reordering opportunities
    return circuit.gates && circuit.gates.length > 2
  }

  private extractGates(code: string): any[] {
    const gates: any[] = []
    const gateMatches = code.matchAll(/applyGate\s*\(\s*['"]?(\w+)['"]?\s*,\s*(\d+)/g)
    
    for (const match of gateMatches) {
      gates.push({
        name: match[1],
        target: parseInt(match[2]),
        type: 'single-qubit'
      })
    }
    
    return gates
  }

  private extractQubits(code: string): number[] {
    const qubits: number[] = []
    const qubitMatches = code.matchAll(/qubit:\s*(\d+)/g)
    
    for (const match of qubitMatches) {
      qubits.push(parseInt(match[1]))
    }
    
    return [...new Set(qubits)].sort()
  }

  private extractMeasurements(code: string): any[] {
    const measurements: any[] = []
    const measurementMatches = code.matchAll(/performMeasurement\s*\(\s*(\d+)/g)
    
    for (const match of measurementMatches) {
      measurements.push({
        target: parseInt(match[1]),
        basis: 'computational'
      })
    }
    
    return measurements
  }

  private calculateDocumentFidelity(text: string): number {
    // Simplified fidelity calculation
    const gateCount = (text.match(/applyGate/g) || []).length
    const baseFidelity = 0.99
    const fidelityDecay = Math.pow(0.999, gateCount)
    return baseFidelity * fidelityDecay
  }

  private calculateDocumentCoherence(text: string): number {
    // Simplified coherence calculation
    const entanglementCount = (text.match(/createEntanglement/g) || []).length
    const baseCoherence = 0.98
    const coherenceDecay = Math.pow(0.995, entanglementCount)
    return baseCoherence * coherenceDecay
  }

  public updateConfiguration(config: vscode.WorkspaceConfiguration) {
    this.config = config
  }

  public dispose() {
    this.validationRules.clear()
  }
}

interface ValidationRule {
  pattern: RegExp
  validator: (match: string) => { isValid: boolean, error?: string }
  message: string
}
