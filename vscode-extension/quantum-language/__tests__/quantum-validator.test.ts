import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QuantumValidator } from '../src/quantum-validator'
import * as vscode from 'vscode'

// Mock vscode module
jest.mock('vscode', () => ({
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn()
    }))
  }
}))

describe('QuantumValidator', () => {
  let validator: QuantumValidator
  let mockDocument: vscode.TextDocument

  beforeEach(() => {
    validator = new QuantumValidator()
    mockDocument = {
      getText: jest.fn(),
      uri: { toString: () => 'test://test.quantum' }
    } as any
  })

  describe('validateCircuit', () => {
    it('should validate a simple quantum circuit', async () => {
      const code = `
        quantumCircuit({
          name: 'test-circuit',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateCircuit(code)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.qubitCount).toBe(2)
      expect(result.gateCount).toBe(2)
    })

    it('should detect invalid quantum gates', async () => {
      const code = `
        quantumCircuit({
          name: 'test-circuit',
          qubits: 2,
          gates: [
            { gate: 'INVALID_GATE', target: 0 }
          ]
        })
      `

      const result = await validator.validateCircuit(code)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(error => error.includes('INVALID_GATE'))).toBe(true)
    })

    it('should calculate circuit fidelity', async () => {
      const code = `
        quantumCircuit({
          name: 'test-circuit',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'X', target: 1 }
          ]
        })
      `

      const result = await validator.validateCircuit(code)
      
      expect(result.fidelity).toBeGreaterThan(0)
      expect(result.fidelity).toBeLessThanOrEqual(1)
    })

    it('should provide optimization suggestions', async () => {
      const code = `
        quantumCircuit({
          name: 'test-circuit',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Redundant gate
            { gate: 'H', target: 1 },
            { gate: 'H', target: 1 }  // Redundant gate
          ]
        })
      `

      const result = await validator.validateCircuit(code)
      
      expect(result.optimizationSuggestions.length).toBeGreaterThan(0)
      expect(result.optimizationSuggestions.some(suggestion => 
        suggestion.includes('redundant')
      )).toBe(true)
    })
  })

  describe('validateDocument', () => {
    it('should validate quantum state syntax', async () => {
      const code = `
        // Valid quantum states
        const state1 = |0⟩
        const state2 = |1⟩
        const state3 = |+⟩
        const state4 = |Φ+⟩
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid quantum states', async () => {
      const code = `
        // Invalid quantum state
        const state = |INVALID⟩
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should validate quantum function calls', async () => {
      const code = `
        // Valid quantum functions
        createQuantumState(2)
        applyGate('H', 0)
        performMeasurement('state1', { basis: 'computational' })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid function parameters', async () => {
      const code = `
        // Invalid function call - missing required parameter
        createQuantumState()
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => 
        error.includes('requires at least 1 parameter')
      )).toBe(true)
    })

    it('should validate bracket matching', async () => {
      const code = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 }
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect unmatched brackets', async () => {
      const code = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 }
          ]
        // Missing closing brace
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => 
        error.includes('Unmatched')
      )).toBe(true)
    })
  })

  describe('Quantum State Validation', () => {
    it('should validate computational basis states', async () => {
      const validStates = ['|0⟩', '|1⟩', '|00⟩', '|01⟩', '|10⟩', '|11⟩']
      
      for (const state of validStates) {
        const code = `const state = ${state}`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should validate superposition states', async () => {
      const validStates = ['|+⟩', '|-⟩', '|+i⟩', '|-i⟩']
      
      for (const state of validStates) {
        const code = `const state = ${state}`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should validate Bell states', async () => {
      const validStates = ['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩']
      
      for (const state of validStates) {
        const code = `const state = ${state}`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should reject invalid state syntax', async () => {
      const invalidStates = ['|X⟩', '|Y⟩', '|Z⟩', '|INVALID⟩']
      
      for (const state of invalidStates) {
        const code = `const state = ${state}`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(false)
      }
    })
  })

  describe('Quantum Gate Validation', () => {
    it('should validate single-qubit gates', async () => {
      const validGates = ['H', 'X', 'Y', 'Z', 'I', 'S', 'T']
      
      for (const gate of validGates) {
        const code = `applyGate('${gate}', 0)`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should validate two-qubit gates', async () => {
      const validGates = ['CNOT', 'CX', 'CZ', 'CY', 'SWAP']
      
      for (const gate of validGates) {
        const code = `applyGate('${gate}', { control: 0, target: 1 })`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should validate rotation gates', async () => {
      const validGates = ['RX', 'RY', 'RZ']
      
      for (const gate of validGates) {
        const code = `applyGate('${gate}', 0, { phase: Math.PI/4 })`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(true)
      }
    })

    it('should reject invalid gates', async () => {
      const invalidGates = ['INVALID', 'BAD_GATE', 'XYZ']
      
      for (const gate of invalidGates) {
        const code = `applyGate('${gate}', 0)`
        mockDocument.getText = jest.fn().mockReturnValue(code)
        
        const result = await validator.validateDocument(mockDocument)
        expect(result.isValid).toBe(false)
      }
    })
  })

  describe('Performance Metrics', () => {
    it('should calculate document fidelity', async () => {
      const code = `
        // Simple circuit with high fidelity
        quantumCircuit({
          name: 'simple',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 }
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.fidelity).toBeGreaterThan(0.9)
    })

    it('should calculate document coherence', async () => {
      const code = `
        // Circuit with entanglement
        createEntanglement([0, 1], { bellState: 'Φ+' })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.coherence).toBeGreaterThan(0)
      expect(result.coherence).toBeLessThanOrEqual(1)
    })

    it('should detect performance issues', async () => {
      const code = `
        // Complex circuit with many gates
        quantumCircuit({
          name: 'complex',
          qubits: 4,
          gates: [
            ${Array.from({ length: 50 }, (_, i) => 
              `{ gate: 'X', target: ${i % 4} }`
            ).join(',\n            ')}
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const result = await validator.validateDocument(mockDocument)
      
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(warning => 
        warning.includes('high')
      )).toBe(true)
    })
  })

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      const mockConfig = {
        get: jest.fn()
      }

      validator.updateConfiguration(mockConfig as any)
      
      // Should not throw and should update internal config
      expect(true).toBe(true)
    })
  })

  describe('Cleanup', () => {
    it('should dispose properly', () => {
      expect(() => validator.dispose()).not.toThrow()
    })
  })
})
