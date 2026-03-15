import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QuantumSimulator } from '../src/quantum-simulator'

describe('QuantumSimulator', () => {
  let simulator: QuantumSimulator

  beforeEach(() => {
    simulator = new QuantumSimulator()
  })

  describe('simulateCircuit', () => {
    it('should simulate a simple quantum circuit', async () => {
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

      const result = await simulator.simulateCircuit(code)
      
      expect(result).toBeDefined()
      expect(result.qubits).toBe(2)
      expect(result.gates).toBe(2)
      expect(result.fidelity).toBeGreaterThan(0)
      expect(result.fidelity).toBeLessThanOrEqual(1)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
      expect(result.executionTime).toBeGreaterThan(0)
    })

    it('should simulate a Hadamard gate', async () => {
      const code = `
        quantumCircuit({
          name: 'hadamard-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.qubits).toBe(1)
      expect(result.gates).toBe(1)
      expect(result.stateVector).toHaveLength(2) // 2^1 qubits
      
      // After H gate, state should be in superposition
      expect(Math.abs(result.stateVector[0])).toBeCloseTo(1/Math.sqrt(2), 5)
      expect(Math.abs(result.stateVector[1])).toBeCloseTo(1/Math.sqrt(2), 5)
    })

    it('should simulate a Pauli-X gate', async () => {
      const code = `
        quantumCircuit({
          name: 'pauli-x-test',
          qubits: 1,
          gates: [
            { gate: 'X', target: 0 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.qubits).toBe(1)
      expect(result.gates).toBe(1)
      expect(result.stateVector).toHaveLength(2)
      
      // After X gate, state should be |1⟩
      expect(Math.abs(result.stateVector[0])).toBeCloseTo(0, 5)
      expect(Math.abs(result.stateVector[1])).toBeCloseTo(1, 5)
    })

    it('should simulate a CNOT gate', async () => {
      const code = `
        quantumCircuit({
          name: 'cnot-test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.qubits).toBe(2)
      expect(result.gates).toBe(2)
      expect(result.stateVector).toHaveLength(4) // 2^2 qubits
      
      // Should create Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2
      expect(Math.abs(result.stateVector[0])).toBeCloseTo(1/Math.sqrt(2), 5)
      expect(Math.abs(result.stateVector[3])).toBeCloseTo(1/Math.sqrt(2), 5)
      expect(Math.abs(result.stateVector[1])).toBeCloseTo(0, 5)
      expect(Math.abs(result.stateVector[2])).toBeCloseTo(0, 5)
    })

    it('should simulate rotation gates', async () => {
      const code = `
        quantumCircuit({
          name: 'rotation-test',
          qubits: 1,
          gates: [
            { gate: 'RX', target: 0, phase: Math.PI/2 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.qubits).toBe(1)
      expect(result.gates).toBe(1)
      expect(result.stateVector).toHaveLength(2)
      
      // RX(π/2) should rotate the state
      expect(Math.abs(result.stateVector[0])).toBeCloseTo(Math.cos(Math.PI/4), 5)
      expect(Math.abs(result.stateVector[1])).toBeCloseTo(Math.sin(Math.PI/4), 5)
    })

    it('should handle measurements', async () => {
      const code = `
        quantumCircuit({
          name: 'measurement-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ],
          measurements: [
            { qubit: 0, basis: 'computational' }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.measurements).toHaveLength(1)
      expect(result.measurements[0].qubit).toBe(0)
      expect(result.measurements[0].basis).toBe('computational')
      expect(result.measurements[0].probability).toBeGreaterThan(0)
      expect(result.measurements[0].probability).toBeLessThanOrEqual(1)
    })

    it('should provide optimization suggestions', async () => {
      const code = `
        quantumCircuit({
          name: 'complex-circuit',
          qubits: 3,
          gates: [
            ${Array.from({ length: 30 }, (_, i) => 
              `{ gate: 'X', target: ${i % 3} }`
            ).join(',\n            ')}
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(suggestion => 
        suggestion.includes('optimization')
      )).toBe(true)
    })

    it('should handle invalid circuit gracefully', async () => {
      const invalidCode = `
        quantumCircuit({
          name: 'invalid-circuit',
          qubits: -1, // Invalid qubit count
          gates: [
            { gate: 'INVALID_GATE', target: 999 }
          ]
        })
      `

      await expect(simulator.simulateCircuit(invalidCode)).rejects.toThrow()
    })
  })

  describe('performMeasurement', () => {
    it('should perform measurement on superposition state', async () => {
      const code = `
        quantumCircuit({
          name: 'measurement-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ],
          measurements: [
            { qubit: 0, basis: 'computational' }
          ]
        })
      `

      const result = await simulator.performMeasurement(code)
      
      expect(result).toBeDefined()
      expect(result.basis).toBe('computational')
      expect(result.collapsed).toBe(true)
      expect(result.probability).toBeGreaterThan(0)
      expect(result.probability).toBeLessThanOrEqual(1)
      expect(result.fidelity).toBeGreaterThan(0)
      expect(result.fidelity).toBeLessThanOrEqual(1)
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
      expect(result.result).toMatch(/\|[01]\⟩/)
    })

    it('should calculate measurement uncertainty', async () => {
      const code = `
        quantumCircuit({
          name: 'uncertainty-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ],
          measurements: [
            { qubit: 0, basis: 'computational' }
          ]
        })
      `

      const result = await simulator.performMeasurement(code)
      
      expect(result.uncertainty).toBeGreaterThan(0)
      expect(result.uncertainty).toBeLessThanOrEqual(0.5) // Maximum uncertainty for equal superposition
    })

    it('should calculate post-measurement state', async () => {
      const code = `
        quantumCircuit({
          name: 'post-measurement-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ],
          measurements: [
            { qubit: 0, basis: 'computational' }
          ]
        })
      `

      const result = await simulator.performMeasurement(code)
      
      expect(result.postState).toBeDefined()
      expect(result.postState).toMatch(/\|[01]\⟩/)
      expect(result.coherence).toBeGreaterThan(0)
      expect(result.coherence).toBeLessThanOrEqual(1)
      expect(result.purity).toBeGreaterThan(0)
      expect(result.purity).toBeLessThanOrEqual(1)
    })
  })

  describe('State Vector Operations', () => {
    it('should initialize state vector correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'initialization-test',
          qubits: 3,
          gates: []
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.stateVector).toHaveLength(8) // 2^3 qubits
      expect(Math.abs(result.stateVector[0])).toBeCloseTo(1, 5) // |000⟩ state
      result.stateVector.slice(1).forEach(amplitude => {
        expect(Math.abs(amplitude)).toBeCloseTo(0, 5)
      })
    })

    it('should maintain state vector normalization', async () => {
      const code = `
        quantumCircuit({
          name: 'normalization-test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'H', target: 1 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      // State vector should remain normalized
      const norm = Math.sqrt(
        result.stateVector.reduce((sum, amplitude) => 
          sum + Math.abs(amplitude) ** 2, 0
        )
      )
      expect(norm).toBeCloseTo(1, 5)
    })
  })

  describe('Performance Metrics', () => {
    it('should track execution time', async () => {
      const code = `
        quantumCircuit({
          name: 'performance-test',
          qubits: 4,
          gates: [
            ${Array.from({ length: 20 }, (_, i) => 
              `{ gate: 'H', target: ${i % 4} }`
            ).join(',\n            ')}
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.executionTime).toBeGreaterThan(0)
      expect(result.executionTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should calculate circuit depth', async () => {
      const code = `
        quantumCircuit({
          name: 'depth-test',
          qubits: 3,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 },
            { gate: 'CNOT', control: 1, target: 2 },
            { gate: 'H', target: 2 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.depth).toBe(4)
    })

    it('should estimate fidelity correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'fidelity-test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      expect(result.fidelity).toBeGreaterThan(0.9) // Should be high for simple circuit
      expect(result.fidelity).toBeLessThanOrEqual(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle empty circuit', async () => {
      const code = ``

      const result = await simulator.simulateCircuit(code)
      
      expect(result.qubits).toBe(0)
      expect(result.gates).toBe(0)
      expect(result.stateVector).toHaveLength(1) // |⟩ state
    })

    it('should handle malformed circuit', async () => {
      const malformedCode = `
        this is not a valid quantum circuit
      `

      await expect(simulator.simulateCircuit(malformedCode)).rejects.toThrow()
    })

    it('should handle invalid gate parameters', async () => {
      const code = `
        quantumCircuit({
          name: 'invalid-params-test',
          qubits: 2,
          gates: [
            { gate: 'RX', target: 0, phase: 'invalid' }
          ]
        })
      `

      const result = await simulator.simulateCircuit(code)
      
      // Should handle gracefully and use default values
      expect(result).toBeDefined()
      expect(result.gates).toBe(1)
    })
  })

  describe('Caching', () => {
    it('should cache simulation results', async () => {
      const code = `
        quantumCircuit({
          name: 'cache-test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 }
          ]
        })
      `

      const startTime = Date.now()
      const result1 = await simulator.simulateCircuit(code)
      const firstExecutionTime = Date.now() - startTime

      const secondStartTime = Date.now()
      const result2 = await simulator.simulateCircuit(code)
      const secondExecutionTime = Date.now() - secondStartTime

      expect(result1).toEqual(result2)
      // Second execution should be faster due to caching
      expect(secondExecutionTime).toBeLessThanOrEqual(firstExecutionTime)
    })
  })

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      const mockConfig = {
        get: jest.fn()
      }

      expect(() => simulator.updateConfiguration(mockConfig as any)).not.toThrow()
    })
  })

  describe('Cleanup', () => {
    it('should dispose properly', () => {
      expect(() => simulator.dispose()).not.toThrow()
    })
  })
})
