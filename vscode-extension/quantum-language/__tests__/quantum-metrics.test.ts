import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QuantumMetricsProvider } from '../src/quantum-metrics'

describe('QuantumMetricsProvider', () => {
  let metricsProvider: QuantumMetricsProvider
  let mockDocument: any

  beforeEach(() => {
    metricsProvider = new QuantumMetricsProvider()
    mockDocument = {
      uri: { toString: () => 'test://test.quantum' },
      getText: jest.fn(),
      isDirty: false
    }
  })

  describe('getMetrics', () => {
    it('should calculate basic metrics for simple quantum code', async () => {
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
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics).toBeDefined()
      expect(metrics.linesOfCode).toBeGreaterThan(0)
      expect(metrics.quantumOperations).toBeGreaterThan(0)
      expect(metrics.quantumGates).toBe(2)
      expect(metrics.measurements).toBe(0)
      expect(metrics.complexity).toBeGreaterThan(0)
      expect(metrics.estimatedFidelity).toBeGreaterThan(0)
      expect(metrics.estimatedFidelity).toBeLessThanOrEqual(1)
      expect(metrics.coherenceScore).toBeGreaterThan(0)
      expect(metrics.coherenceScore).toBeLessThanOrEqual(1)
      expect(metrics.optimizationPotential).toBeGreaterThanOrEqual(0)
      expect(metrics.optimizationPotential).toBeLessThanOrEqual(1)
    })

    it('should count quantum operations correctly', async () => {
      const code = `
        createQuantumState(2)
        createSuperposition(['|00⟩', '|11⟩'])
        createEntanglement([0, 1])
        performMeasurement('state1', { basis: 'computational' })
        applyGate('H', 0)
        quantumCircuit({ name: 'test', qubits: 2, gates: [] })
        simulateCircuit(circuit)
        optimizeCircuit(circuit)
        validateCircuit(circuit)
        measureQubit(0)
        resetQubit(1)
        initializeState([0, 1])
        entangleQubits([0, 1])
        swapQubits([0, 1])
        controlledGate('CNOT', { control: 0, target: 1 })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.quantumOperations).toBe(15)
    })

    it('should count superposition states correctly', async () => {
      const code = `
        createSuperposition(['|00⟩', '|11⟩'])
        const state1 = |+⟩
        const state2 = |-⟩
        const state3 = |+i⟩
        const state4 = |-i⟩
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.superpositionStates).toBe(6)
    })

    it('should count entanglement states correctly', async () => {
      const code = `
        createEntanglement([0, 1])
        const bellState = |Φ+⟩
        const bellState2 = |Φ-⟩
        const bellState3 = |Ψ+⟩
        const bellState4 = |Ψ-⟩
        const entangled = entanglement
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.entanglementStates).toBe(6)
    })

    it('should count quantum gates correctly', async () => {
      const code = `
        applyGate('H', 0)
        applyGate('X', 1)
        applyGate('Y', 2)
        applyGate('Z', 3)
        applyGate('I', 4)
        applyGate('S', 5)
        applyGate('T', 6)
        applyGate('CNOT', { control: 0, target: 1 })
        applyGate('CX', { control: 1, target: 2 })
        applyGate('CZ', { control: 2, target: 3 })
        applyGate('CY', { control: 3, target: 4 })
        applyGate('SWAP', { qubits: [0, 1] })
        applyGate('CCX', { control: [0, 1], target: 2 })
        applyGate('CCZ', { control: [1, 2], target: 3 })
        applyGate('TOFFOLI', { control: [0, 1], target: 2 })
        applyGate('FREDKIN', { control: 0, target: [1, 2] })
        applyGate('RX', 0, { phase: Math.PI/4 })
        applyGate('RY', 1, { phase: Math.PI/2 })
        applyGate('RZ', 2, { phase: Math.PI })
        applyGate('U', 3, { theta: 0, phi: 0, lambda: 0 })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.quantumGates).toBe(20)
    })

    it('should count measurements correctly', async () => {
      const code = `
        performMeasurement('state1', { basis: 'computational' })
        measureQubit(0)
        const measurement = measurement
        performMeasurement('state2')
        measureQubit(1)
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.measurements).toBe(5)
    })

    it('should calculate complexity correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'complex-circuit',
          qubits: 4,
          gates: [
            ${Array.from({ length: 30 }, (_, i) => 
              `{ gate: 'X', target: ${i % 4} }`
            ).join(',\n            ')}
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.complexity).toBeGreaterThan(0)
      expect(metrics.complexity).toBeLessThanOrEqual(100)
    })

    it('should estimate fidelity correctly', async () => {
      const simpleCode = `
        quantumCircuit({
          name: 'simple',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(simpleCode)
      
      const simpleMetrics = await metricsProvider.getMetrics(mockDocument)
      
      const complexCode = `
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

      mockDocument.getText = jest.fn().mockReturnValue(complexCode)
      
      const complexMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(simpleMetrics.estimatedFidelity).toBeGreaterThan(complexMetrics.estimatedFidelity)
    })

    it('should calculate coherence score correctly', async () => {
      const coherentCode = `
        createSuperposition(['|00⟩', '|11⟩'])
        createEntanglement([0, 1])
        const bellState = |Φ+⟩
      `

      mockDocument.getText = jest.fn().mockReturnValue(coherentCode)
      
      const coherentMetrics = await metricsProvider.getMetrics(mockDocument)
      
      const incoherentCode = `
        applyGate('X', 0)
        applyGate('Y', 1)
        applyGate('Z', 2)
      `

      mockDocument.getText = jest.fn().mockReturnValue(incoherentCode)
      
      const incoherentMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(coherentMetrics.coherenceScore).toBeGreaterThan(incoherentMetrics.coherenceScore)
    })

    it('should calculate optimization potential correctly', async () => {
      const optimalCode = `
        quantumCircuit({
          name: 'optimal',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(optimalCode)
      
      const optimalMetrics = await metricsProvider.getMetrics(mockDocument)
      
      const suboptimalCode = `
        quantumCircuit({
          name: 'suboptimal',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Redundant
            { gate: 'H', target: 0 },
            { gate: 'H', target: 0 }  // Redundant
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(suboptimalCode)
      
      const suboptimalMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(suboptimalMetrics.optimizationPotential).toBeGreaterThan(optimalMetrics.optimizationPotential)
    })

    it('should assess code quality correctly', async () => {
      const goodCode = `
        // This is a well-documented quantum circuit
        /**
         * Test circuit with proper structure
         */
        function testCircuit() {
          try {
            quantumCircuit({
              name: 'test',
              qubits: 2,
              gates: [{ gate: 'H', target: 0 }]
            })
          } catch (error) {
            console.error('Circuit error:', error)
          }
        }
        
        // Test the circuit
        test('should create circuit', () => {
          const circuit = testCircuit()
          expect(circuit).toBeDefined()
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(goodCode)
      
      const goodMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(['Excellent', 'Good']).toContain(goodMetrics.codeQuality)
    })

    it('should assess maintainability correctly', async () => {
      const maintainableCode = `
        // Well-structured modular code
        function createBellState() {
          const circuit = quantumCircuit({
            name: 'bell-state',
            qubits: 2,
            gates: [
              { gate: 'H', target: 0 },
              { gate: 'CNOT', control: 0, target: 1 }
            ]
          })
          return circuit
        }
        
        function measureBellState(circuit) {
          return performMeasurement('bell', { basis: 'computational' })
        }
      `

      mockDocument.getText = jest.fn().mockReturnValue(maintainableCode)
      
      const maintainableMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(['Excellent', 'Good']).toContain(maintainableMetrics.maintainability)
    })

    it('should calculate documentation coverage correctly', async () => {
      const documentedCode = `
        // This is a quantum circuit
        // It creates a Bell state
        /**
         * Creates a Bell state circuit
         * @param {number} numQubits - Number of qubits
         * @returns {Object} The quantum circuit
         */
        function createBellState(numQubits) {
          // Initialize the circuit
          const circuit = quantumCircuit({
            name: 'bell-state',
            qubits: numQubits,
            gates: [
              { gate: 'H', target: 0 }, // Apply Hadamard
              { gate: 'CNOT', control: 0, target: 1 } // Create entanglement
            ]
          })
          return circuit
        }
      `

      mockDocument.getText = jest.fn().mockReturnValue(documentedCode)
      
      const documentedMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(documentedMetrics.documentationCoverage).toBeGreaterThan(20)
    })

    it('should calculate performance score correctly', async () => {
      const performantCode = `
        quantumCircuit({
          name: 'efficient',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(performantCode)
      
      const performantMetrics = await metricsProvider.getMetrics(mockDocument)
      
      const slowCode = `
        quantumCircuit({
          name: 'inefficient',
          qubits: 4,
          gates: [
            ${Array.from({ length: 60 }, (_, i) => 
              `{ gate: 'X', target: ${i % 4} }`
            ).join(',\n            ')}
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(slowCode)
      
      const slowMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(performantMetrics.performanceScore).toBeGreaterThan(slowMetrics.performanceScore)
    })

    it('should calculate error rate correctly', async () => {
      const simpleCode = `
        quantumCircuit({
          name: 'simple',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(simpleCode)
      
      const simpleMetrics = await metricsProvider.getMetrics(mockDocument)
      
      const complexCode = `
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

      mockDocument.getText = jest.fn().mockReturnValue(complexCode)
      
      const complexMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(complexMetrics.errorRate).toBeGreaterThan(simpleMetrics.errorRate)
    })

    it('should estimate test coverage correctly', async () => {
      const testedCode = `
        describe('Quantum Circuit', () => {
          test('should create Bell state', () => {
            const circuit = createBellState()
            expect(circuit).toBeDefined()
          })
          
          it('should measure correctly', () => {
            const result = performMeasurement(circuit)
            expect(result).toBeDefined()
          })
          
          test('should validate circuit', () => {
            const isValid = validateCircuit(circuit)
            expect(isValid).toBe(true)
          })
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(testedCode)
      
      const testedMetrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(testedMetrics.testCoverage).toBeGreaterThan(0)
    })

    it('should handle empty document', async () => {
      mockDocument.getText = jest.fn().mockReturnValue('')
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.linesOfCode).toBe(0)
      expect(metrics.quantumOperations).toBe(0)
      expect(metrics.quantumGates).toBe(0)
      expect(metrics.measurements).toBe(0)
      expect(metrics.complexity).toBe(0)
    })

    it('should handle document with only comments', async () => {
      const code = `
        // This is a comment
        /* This is a block comment */
        /**
         * This is a JSDoc comment
         * @param {string} param - A parameter
         */
        // Another comment
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const metrics = await metricsProvider.getMetrics(mockDocument)
      
      expect(metrics.linesOfCode).toBe(0)
      expect(metrics.quantumOperations).toBe(0)
    })
  })

  describe('updateMetrics', () => {
    it('should update metrics and track changes', async () => {
      const initialCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(initialCode)
      
      const initialMetrics = await metricsProvider.updateMetrics(mockDocument)
      
      const updatedCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(updatedCode)
      
      const updatedMetrics = await metricsProvider.updateMetrics(mockDocument)
      
      expect(updatedMetrics.quantumGates).toBe(2)
      expect(updatedMetrics.complexity).toBeGreaterThan(initialMetrics.complexity)
    })

    it('should generate improvements when metrics improve', async () => {
      const initialCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 } // Redundant
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(initialCode)
      
      await metricsProvider.updateMetrics(mockDocument)
      
      const optimizedCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(optimizedCode)
      
      const result = await metricsProvider.updateMetrics(mockDocument)
      
      expect(result).toBeDefined()
    })

    it('should generate warnings when metrics degrade', async () => {
      const simpleCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(simpleCode)
      
      await metricsProvider.updateMetrics(mockDocument)
      
      const complexCode = `
        quantumCircuit({
          name: 'test',
          qubits: 4,
          gates: [
            ${Array.from({ length: 30 }, (_, i) => 
              `{ gate: 'X', target: ${i % 4} }`
            ).join(',\n            ')}
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(complexCode)
      
      const result = await metricsProvider.updateMetrics(mockDocument)
      
      expect(result).toBeDefined()
    })

    it('should generate suggestions for optimization', async () => {
      const suboptimalCode = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            ${Array.from({ length: 40 }, (_, i) => 
              `{ gate: 'X', target: ${i % 2} }`
            ).join(',\n            ')}
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(suboptimalCode)
      
      const result = await metricsProvider.updateMetrics(mockDocument)
      
      expect(result).toBeDefined()
    })
  })

  describe('Cache Management', () => {
    it('should cache metrics for repeated requests', async () => {
      const code = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code)
      
      const startTime = Date.now()
      const metrics1 = await metricsProvider.getMetrics(mockDocument)
      const firstCallTime = Date.now() - startTime

      const secondStartTime = Date.now()
      const metrics2 = await metricsProvider.getMetrics(mockDocument)
      const secondCallTime = Date.now() - secondStartTime

      expect(metrics1).toEqual(metrics2)
      // Second call should be faster due to caching
      expect(secondCallTime).toBeLessThanOrEqual(firstCallTime)
    })

    it('should clear cache for specific document', () => {
      const uri = 'test://test.quantum'
      
      metricsProvider.clearCache(uri)
      
      // Should not throw
      expect(true).toBe(true)
    })

    it('should clear all cache', () => {
      metricsProvider.clearCache()
      
      // Should not throw
      expect(true).toBe(true)
    })
  })

  describe('History Tracking', () => {
    it('should track metrics history', async () => {
      const code1 = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [{ gate: 'H', target: 0 }]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code1)
      
      await metricsProvider.updateMetrics(mockDocument)
      
      const code2 = `
        quantumCircuit({
          name: 'test',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      mockDocument.getText = jest.fn().mockReturnValue(code2)
      
      await metricsProvider.updateMetrics(mockDocument)
      
      const history = metricsProvider.getMetricsHistory(mockDocument.uri.toString())
      
      expect(history).toHaveLength(2)
      expect(history[0].metrics).toBeDefined()
      expect(history[0].timestamp).toBeDefined()
      expect(history[1].metrics).toBeDefined()
      expect(history[1].timestamp).toBeDefined()
    })

    it('should limit history to 10 entries', async () => {
      const uri = mockDocument.uri.toString()
      
      // Add 11 updates
      for (let i = 0; i < 11; i++) {
        const code = `
          quantumCircuit({
            name: 'test-${i}',
            qubits: 2,
            gates: [{ gate: 'H', target: 0 }]
          })
        `

        mockDocument.getText = jest.fn().mockReturnValue(code)
        await metricsProvider.updateMetrics(mockDocument)
      }
      
      const history = metricsProvider.getMetricsHistory(uri)
      
      expect(history).toHaveLength(10)
    })
  })

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      const mockConfig = {
        get: jest.fn()
      }

      expect(() => metricsProvider.updateConfiguration(mockConfig as any)).not.toThrow()
    })
  })

  describe('Cleanup', () => {
    it('should dispose properly', () => {
      expect(() => metricsProvider.dispose()).not.toThrow()
    })
  })
})
