import * as vscode from 'vscode'

export interface QuantumMetrics {
  linesOfCode: number
  quantumOperations: number
  superpositionStates: number
  entanglementStates: number
  quantumGates: number
  measurements: number
  complexity: number
  estimatedFidelity: number
  coherenceScore: number
  optimizationPotential: number
  codeQuality: string
  maintainability: string
  documentationCoverage: number
  performanceScore: number
  errorRate: number
  testCoverage: number
}

export interface QuantumMetricsUpdate {
  timestamp: number
  metrics: QuantumMetrics
  improvements: string[]
  warnings: string[]
  suggestions: string[]
}

export class QuantumMetricsProvider {
  private config: vscode.WorkspaceConfiguration
  private metricsCache: Map<string, QuantumMetrics> = new Map()
  private updateHistory: Map<string, QuantumMetricsUpdate[]> = new Map()

  constructor() {
    this.config = vscode.workspace.getConfiguration('quantumLanguage')
  }

  async getMetrics(document: vscode.TextDocument): Promise<QuantumMetrics> {
    const uri = document.uri.toString()
    
    // Check cache first
    if (this.metricsCache.has(uri)) {
      const cached = this.metricsCache.get(uri)!
      const lastModified = document.isDirty ? Date.now() : (await vscode.workspace.fs.stat(document.uri)).mtime
      
      // Return cached metrics if file hasn't been modified
      if (lastModified <= (this.updateHistory.get(uri)?.[0]?.timestamp || 0)) {
        return cached
      }
    }

    // Calculate fresh metrics
    const metrics = await this.calculateMetrics(document)
    
    // Update cache
    this.metricsCache.set(uri, metrics)
    
    return metrics
  }

  async updateMetrics(document: vscode.TextDocument): Promise<QuantumMetrics> {
    const uri = document.uri.toString()
    const oldMetrics = this.metricsCache.get(uri)
    const newMetrics = await this.calculateMetrics(document)
    
    // Update cache
    this.metricsCache.set(uri, newMetrics)
    
    // Update history
    if (!this.updateHistory.has(uri)) {
      this.updateHistory.set(uri, [])
    }
    
    const history = this.updateHistory.get(uri)!
    const update: QuantumMetricsUpdate = {
      timestamp: Date.now(),
      metrics: newMetrics,
      improvements: [],
      warnings: [],
      suggestions: []
    }
    
    // Compare with old metrics to generate insights
    if (oldMetrics) {
      update.improvements = this.detectImprovements(oldMetrics, newMetrics)
      update.warnings = this.detectWarnings(oldMetrics, newMetrics)
      update.suggestions = this.generateSuggestions(newMetrics)
    }
    
    history.unshift(update)
    
    // Keep only last 10 updates
    if (history.length > 10) {
      history.splice(10)
    }
    
    return newMetrics
  }

  private async calculateMetrics(document: vscode.TextDocument): Promise<QuantumMetrics> {
    const text = document.getText()
    const lines = text.split('\n')
    
    // Basic metrics
    const linesOfCode = this.countLinesOfCode(lines)
    const quantumOperations = this.countQuantumOperations(text)
    const superpositionStates = this.countSuperpositionStates(text)
    const entanglementStates = this.countEntanglementStates(text)
    const quantumGates = this.countQuantumGates(text)
    const measurements = this.countMeasurements(text)
    
    // Advanced metrics
    const complexity = this.calculateComplexity(text)
    const estimatedFidelity = this.estimateFidelity(text)
    const coherenceScore = this.calculateCoherenceScore(text)
    const optimizationPotential = this.calculateOptimizationPotential(text)
    const codeQuality = this.assessCodeQuality(text)
    const maintainability = this.assessMaintainability(text)
    const documentationCoverage = this.calculateDocumentationCoverage(text)
    const performanceScore = this.calculatePerformanceScore(text)
    const errorRate = this.calculateErrorRate(text)
    const testCoverage = this.estimateTestCoverage(text)
    
    return {
      linesOfCode,
      quantumOperations,
      superpositionStates,
      entanglementStates,
      quantumGates,
      measurements,
      complexity,
      estimatedFidelity,
      coherenceScore,
      optimizationPotential,
      codeQuality,
      maintainability,
      documentationCoverage,
      performanceScore,
      errorRate,
      testCoverage
    }
  }

  private countLinesOfCode(lines: string[]): number {
    return lines.filter(line => 
      line.trim() !== '' && 
      !line.trim().startsWith('//') && 
      !line.trim().startsWith('/*') && 
      !line.trim().startsWith('*')
    ).length
  }

  private countQuantumOperations(text: string): number {
    const operations = [
      'createQuantumState',
      'createSuperposition',
      'createEntanglement',
      'performMeasurement',
      'applyGate',
      'quantumCircuit',
      'simulateCircuit',
      'optimizeCircuit',
      'validateCircuit',
      'measureQubit',
      'resetQubit',
      'initializeState',
      'entangleQubits',
      'swapQubits',
      'controlledGate'
    ]
    
    let count = 0
    for (const operation of operations) {
      const matches = text.matchAll(new RegExp(`\\b${operation}\\b`, 'g'))
      count += Array.from(matches).length
    }
    
    return count
  }

  private countSuperpositionStates(text: string): number {
    const patterns = [
      'createSuperposition',
      '|+⟩',
      '|-⟩',
      '|+i⟩',
      '|-i⟩',
      'superposition'
    ]
    
    let count = 0
    for (const pattern of patterns) {
      const matches = text.matchAll(new RegExp(pattern.replace(/[|⟩]/g, '\\$&'), 'g'))
      count += Array.from(matches).length
    }
    
    return count
  }

  private countEntanglementStates(text: string): number {
    const patterns = [
      'createEntanglement',
      '|Φ+⟩',
      '|Φ-⟩',
      '|Ψ+⟩',
      '|Ψ-⟩',
      'entanglement',
      'entangled'
    ]
    
    let count = 0
    for (const pattern of patterns) {
      const matches = text.matchAll(new RegExp(pattern.replace(/[|⟩]/g, '\\$&'), 'g'))
      count += Array.from(matches).length
    }
    
    return count
  }

  private countQuantumGates(text: string): number {
    const gates = [
      'H', 'X', 'Y', 'Z', 'I', 'S', 'T', 'CNOT', 'CX', 'CZ', 'CY', 'SWAP',
      'CCX', 'CCZ', 'TOFFOLI', 'FREDKIN', 'RX', 'RY', 'RZ', 'U', 'CU', 'CRX', 'CRY', 'CRZ'
    ]
    
    let count = 0
    for (const gate of gates) {
      const matches = text.matchAll(new RegExp(`\\b${gate}\\b`, 'g'))
      count += Array.from(matches).length
    }
    
    return count
  }

  private countMeasurements(text: string): number {
    const patterns = [
      'performMeasurement',
      'measureQubit',
      'measurement',
      'measure'
    ]
    
    let count = 0
    for (const pattern of patterns) {
      const matches = text.matchAll(new RegExp(`\\b${pattern}\\b`, 'g'))
      count += Array.from(matches).length
    }
    
    return count
  }

  private calculateComplexity(text: string): number {
    let complexity = 0
    
    // Base complexity from quantum operations
    complexity += this.countQuantumOperations(text) * 2
    
    // Additional complexity from entanglement
    complexity += this.countEntanglementStates(text) * 3
    
    // Additional complexity from controlled gates
    const controlledGates = text.match(/C[A-Z]/g) || []
    complexity += controlledGates.length * 2
    
    // Additional complexity from circuit depth
    const circuitMatches = text.match(/quantumCircuit\s*\([^)]*\)/g) || []
    for (const match of circuitMatches) {
      const gateMatches = match.match(/gate:/g) || []
      complexity += gateMatches.length
    }
    
    return Math.min(complexity, 100) // Cap at 100
  }

  private estimateFidelity(text: string): number {
    const gateCount = this.countQuantumGates(text)
    const entanglementCount = this.countEntanglementStates(text)
    const measurementCount = this.countMeasurements(text)
    
    // Base fidelity
    let fidelity = 0.99
    
    // Fidelity decay based on gate count
    fidelity *= Math.pow(0.999, gateCount)
    
    // Fidelity decay based on entanglement
    fidelity *= Math.pow(0.998, entanglementCount)
    
    // Fidelity decay based on measurements
    fidelity *= Math.pow(0.999, measurementCount)
    
    return Math.max(fidelity, 0.5) // Minimum fidelity of 0.5
  }

  private calculateCoherenceScore(text: string): number {
    const superpositionCount = this.countSuperpositionStates(text)
    const entanglementCount = this.countEntanglementStates(text)
    const totalOperations = this.countQuantumOperations(text)
    
    if (totalOperations === 0) return 1.0
    
    // Coherence based on ratio of coherent operations
    const coherentOperations = superpositionCount + entanglementCount
    const coherenceRatio = coherentOperations / totalOperations
    
    return Math.min(coherenceRatio * 1.2, 1.0) // Slight boost for good coherence
  }

  private calculateOptimizationPotential(text: string): number {
    let potential = 0
    
    // Check for redundant patterns
    const redundantPatterns = [
      /(X\|X)/g,
      /(H\|H)/g,
      /(Z\|Z)/g
    ]
    
    for (const pattern of redundantPatterns) {
      const matches = text.match(pattern) || []
      potential += matches.length * 0.1
    }
    
    // Check for optimization opportunities
    if (this.countQuantumGates(text) > 20) {
      potential += 0.2
    }
    
    if (this.countMeasurements(text) > 5) {
      potential += 0.1
    }
    
    return Math.min(potential, 1.0)
  }

  private assessCodeQuality(text: string): string {
    let score = 0
    
    // Check for proper documentation
    if (text.includes('//') || text.includes('/*')) {
      score += 1
    }
    
    // Check for proper structure
    if (text.includes('quantumCircuit') || text.includes('function')) {
      score += 1
    }
    
    // Check for error handling
    if (text.includes('try') || text.includes('catch')) {
      score += 1
    }
    
    // Check for testing
    if (text.includes('test') || text.includes('spec')) {
      score += 1
    }
    
    if (score >= 3) return 'Excellent'
    if (score >= 2) return 'Good'
    if (score >= 1) return 'Fair'
    return 'Poor'
  }

  private assessMaintainability(text: string): string {
    let score = 0
    
    // Check for modular structure
    const functions = (text.match(/function\s+\w+/g) || []).length
    if (functions > 0) score += 1
    
    // Check for clear naming
    const descriptiveNames = (text.match(/\b[a-zA-Z][a-zA-Z0-9_]{2,}\b/g) || []).length
    if (descriptiveNames > 10) score += 1
    
    // Check for reasonable length
    const lines = text.split('\n').length
    if (lines < 200) score += 1
    
    // Check for comments
    const comments = (text.match(/\/\//g) || []).length
    if (comments > 5) score += 1
    
    if (score >= 3) return 'Excellent'
    if (score >= 2) return 'Good'
    if (score >= 1) return 'Fair'
    return 'Poor'
  }

  private calculateDocumentationCoverage(text: string): number {
    const lines = text.split('\n')
    const codeLines = this.countLinesOfCode(lines)
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') || 
      line.trim().startsWith('*')
    ).length
    
    if (codeLines === 0) return 0
    
    return Math.min((commentLines / codeLines) * 100, 100)
  }

  private calculatePerformanceScore(text: string): number {
    let score = 100
    
    // Penalty for high gate count
    const gateCount = this.countQuantumGates(text)
    if (gateCount > 50) score -= 10
    else if (gateCount > 30) score -= 5
    
    // Penalty for high complexity
    const complexity = this.calculateComplexity(text)
    if (complexity > 80) score -= 15
    else if (complexity > 60) score -= 10
    else if (complexity > 40) score -= 5
    
    // Penalty for low fidelity
    const fidelity = this.estimateFidelity(text)
    if (fidelity < 0.8) score -= 20
    else if (fidelity < 0.9) score -= 10
    
    return Math.max(score, 0)
  }

  private calculateErrorRate(text: string): number {
    // Simulated error rate based on complexity and gate count
    const complexity = this.calculateComplexity(text)
    const gateCount = this.countQuantumGates(text)
    
    let errorRate = 0.01 // Base error rate
    
    // Error rate increases with complexity
    errorRate += complexity * 0.0001
    
    // Error rate increases with gate count
    errorRate += gateCount * 0.00001
    
    return Math.min(errorRate, 0.1) // Cap at 10%
  }

  private estimateTestCoverage(text: string): number {
    // Look for test-related patterns
    const testPatterns = [
      /test/g,
      /spec/g,
      /describe/g,
      /it\(/g,
      /expect/g,
      /assert/g
    ]
    
    let testIndicators = 0
    for (const pattern of testPatterns) {
      const matches = text.match(pattern) || []
      testIndicators += matches.length
    }
    
    // Estimate coverage based on test indicators vs code complexity
    const complexity = this.calculateComplexity(text)
    const estimatedCoverage = Math.min((testIndicators * 10) / (complexity + 1), 100)
    
    return estimatedCoverage
  }

  private detectImprovements(old: QuantumMetrics, newMetrics: QuantumMetrics): string[] {
    const improvements: string[] = []
    
    if (newMetrics.estimatedFidelity > old.estimatedFidelity) {
      improvements.push(`Fidelity improved by ${((newMetrics.estimatedFidelity - old.estimatedFidelity) * 100).toFixed(2)}%`)
    }
    
    if (newMetrics.complexity < old.complexity) {
      improvements.push(`Complexity reduced by ${old.complexity - newMetrics.complexity}`)
    }
    
    if (newMetrics.optimizationPotential < old.optimizationPotential) {
      improvements.push(`Optimization potential reduced by ${((old.optimizationPotential - newMetrics.optimizationPotential) * 100).toFixed(2)}%`)
    }
    
    if (newMetrics.documentationCoverage > old.documentationCoverage) {
      improvements.push(`Documentation coverage increased by ${(newMetrics.documentationCoverage - old.documentationCoverage).toFixed(2)}%`)
    }
    
    return improvements
  }

  private detectWarnings(old: QuantumMetrics, newMetrics: QuantumMetrics): string[] {
    const warnings: string[] = []
    
    if (newMetrics.estimatedFidelity < old.estimatedFidelity) {
      warnings.push(`Fidelity decreased by ${((old.estimatedFidelity - newMetrics.estimatedFidelity) * 100).toFixed(2)}%`)
    }
    
    if (newMetrics.complexity > old.complexity) {
      warnings.push(`Complexity increased by ${newMetrics.complexity - old.complexity}`)
    }
    
    if (newMetrics.errorRate > old.errorRate) {
      warnings.push(`Error rate increased by ${((newMetrics.errorRate - old.errorRate) * 100).toFixed(2)}%`)
    }
    
    if (newMetrics.quantumGates > old.quantumGates + 10) {
      warnings.push(`Gate count increased significantly (${newMetrics.quantumGates - old.quantumGates} gates)`)
    }
    
    return warnings
  }

  private generateSuggestions(metrics: QuantumMetrics): string[] {
    const suggestions: string[] = []
    
    if (metrics.optimizationPotential > 0.3) {
      suggestions.push('Consider optimizing circuit for better performance')
    }
    
    if (metrics.estimatedFidelity < 0.9) {
      suggestions.push('Low fidelity detected, consider error correction')
    }
    
    if (metrics.documentationCoverage < 20) {
      suggestions.push('Add more documentation to improve maintainability')
    }
    
    if (metrics.testCoverage < 50) {
      suggestions.push('Increase test coverage for better reliability')
    }
    
    if (metrics.complexity > 70) {
      suggestions.push('High complexity detected, consider refactoring')
    }
    
    if (metrics.quantumGates > 30) {
      suggestions.push('Large number of gates, consider circuit optimization')
    }
    
    if (metrics.measurements > 5) {
      suggestions.push('Multiple measurements may affect coherence')
    }
    
    return suggestions
  }

  public getMetricsHistory(uri: string): QuantumMetricsUpdate[] {
    return this.updateHistory.get(uri) || []
  }

  public clearCache(uri?: string) {
    if (uri) {
      this.metricsCache.delete(uri)
      this.updateHistory.delete(uri)
    } else {
      this.metricsCache.clear()
      this.updateHistory.clear()
    }
  }

  public updateConfiguration(config: vscode.WorkspaceConfiguration) {
    this.config = config
  }

  public dispose() {
    this.metricsCache.clear()
    this.updateHistory.clear()
  }
}
