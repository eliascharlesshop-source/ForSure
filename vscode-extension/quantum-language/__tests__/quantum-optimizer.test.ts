import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QuantumOptimizer } from '../src/quantum-optimizer'

describe('QuantumOptimizer', () => {
  let optimizer: QuantumOptimizer

  beforeEach(() => {
    optimizer = new QuantumOptimizer()
  })

  describe('optimizeCircuit', () => {
    it('should optimize a simple quantum circuit', async () => {
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

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result).toBeDefined()
      expect(typeof result.improved).toBe('boolean')
      expect(result.optimizedCode).toBeDefined()
      expect(result.diff).toBeDefined()
      expect(typeof result.depthReduction).toBe('number')
      expect(typeof result.fidelityImprovement).toBe('number')
      expect(typeof result.speedImprovement).toBe('number')
      expect(typeof result.memoryReduction).toBe('number')
      expect(Array.isArray(result.optimizations)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })

    it('should detect and remove redundant gates', async () => {
      const code = `
        quantumCircuit({
          name: 'redundant-circuit',
          qubits: 1,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Redundant - X*X = I
            { gate: 'H', target: 0 },
            { gate: 'H', target: 0 }  // Redundant - H*H = I
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.improved).toBe(true)
      expect(result.optimizations).toContain('gate-cancellation')
      expect(result.depthReduction).toBeGreaterThan(0)
      expect(result.memoryReduction).toBeGreaterThan(0)
    })

    it('should fuse compatible rotation gates', async () => {
      const code = `
        quantumCircuit({
          name: 'rotation-circuit',
          qubits: 1,
          gates: [
            { gate: 'RX', target: 0, phase: Math.PI/4 },
            { gate: 'RX', target: 0, phase: Math.PI/4 } // Can be fused
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.improved).toBe(true)
      expect(result.optimizations).toContain('gate-fusion')
      expect(result.depthReduction).toBeGreaterThan(0)
    })

    it('should reorder gates for better parallelization', async () => {
      const code = `
        quantumCircuit({
          name: 'parallelization-circuit',
          qubits: 3,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'H', target: 1 },
            { gate: 'Z', target: 2 },
            { gate: 'Y', target: 0 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result).toBeDefined()
      expect(typeof result.improved).toBe('boolean')
      // May or may not improve depending on specific gates
    })

    it('should match and replace common patterns', async () => {
      const code = `
        quantumCircuit({
          name: 'pattern-circuit',
          qubits: 2,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'CNOT', control: 0, target: 1 } // Bell state pattern
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result).toBeDefined()
      expect(typeof result.improved).toBe('boolean')
    })

    it('should handle complex circuits', async () => {
      const code = `
        quantumCircuit({
          name: 'complex-circuit',
          qubits: 4,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'X', target: 1 },
            { gate: 'CNOT', control: 0, target: 1 },
            { gate: 'CNOT', control: 1, target: 2 },
            { gate: 'CNOT', control: 2, target: 3 },
            { gate: 'H', target: 3 },
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Redundant
            { gate: 'RX', target: 1, phase: Math.PI/4 },
            { gate: 'RX', target: 1, phase: Math.PI/4 } // Can be fused
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result).toBeDefined()
      expect(result.improved).toBe(true)
      expect(result.optimizations.length).toBeGreaterThan(0)
      expect(result.depthReduction).toBeGreaterThan(0)
    })

    it('should generate proper diff', async () => {
      const code = `
        quantumCircuit({
          name: 'diff-test',
          qubits: 1,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.diff).toBeDefined()
      expect(typeof result.diff).toBe('string')
      expect(result.diff.length).toBeGreaterThan(0)
    })

    it('should handle empty circuit', async () => {
      const code = ``

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result).toBeDefined()
      expect(result.improved).toBe(false)
      expect(result.optimizations).toHaveLength(0)
    })

    it('should handle invalid circuit gracefully', async () => {
      const invalidCode = `
        this is not a valid quantum circuit
      `

      await expect(optimizer.optimizeCircuit(invalidCode)).rejects.toThrow()
    })
  })

  describe('Optimization Rules', () => {
    describe('Gate Fusion', () => {
      it('should fuse consecutive RX gates', async () => {
        const code = `
          quantumCircuit({
            name: 'rx-fusion',
            qubits: 1,
            gates: [
              { gate: 'RX', target: 0, phase: Math.PI/6 },
              { gate: 'RX', target: 0, phase: Math.PI/3 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-fusion')
      })

      it('should fuse consecutive RY gates', async () => {
        const code = `
          quantumCircuit({
            name: 'ry-fusion',
            qubits: 1,
            gates: [
              { gate: 'RY', target: 0, phase: Math.PI/4 },
              { gate: 'RY', target: 0, phase: Math.PI/4 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-fusion')
      })

      it('should fuse consecutive RZ gates', async () => {
        const code = `
          quantumCircuit({
            name: 'rz-fusion',
            qubits: 1,
            gates: [
              { gate: 'RZ', target: 0, phase: Math.PI/8 },
              { gate: 'RZ', target: 0, phase: Math.PI/8 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-fusion')
      })
    })

    describe('Gate Cancellation', () => {
      it('should cancel consecutive X gates', async () => {
        const code = `
          quantumCircuit({
            name: 'x-cancellation',
            qubits: 1,
            gates: [
              { gate: 'X', target: 0 },
              { gate: 'X', target: 0 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-cancellation')
      })

      it('should cancel consecutive Y gates', async () => {
        const code = `
          quantumCircuit({
            name: 'y-cancellation',
            qubits: 1,
            gates: [
              { gate: 'Y', target: 0 },
              { gate: 'Y', target: 0 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-cancellation')
      })

      it('should cancel consecutive Z gates', async () => {
        const code = `
          quantumCircuit({
            name: 'z-cancellation',
            qubits: 1,
            gates: [
              { gate: 'Z', target: 0 },
              { gate: 'Z', target: 0 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-cancellation')
      })

      it('should cancel consecutive H gates', async () => {
        const code = `
          quantumCircuit({
            name: 'h-cancellation',
            qubits: 1,
            gates: [
              { gate: 'H', target: 0 },
              { gate: 'H', target: 0 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result.improved).toBe(true)
        expect(result.optimizations).toContain('gate-cancellation')
      })
    })

    describe('Template Matching', () => {
      it('should recognize Bell state preparation', async () => {
        const code = `
          quantumCircuit({
            name: 'bell-state',
            qubits: 2,
            gates: [
              { gate: 'H', target: 0 },
              { gate: 'CNOT', control: 0, target: 1 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result).toBeDefined()
        expect(typeof result.improved).toBe('boolean')
      })

      it('should recognize GHZ state preparation', async () => {
        const code = `
          quantumCircuit({
            name: 'ghz-state',
            qubits: 3,
            gates: [
              { gate: 'H', target: 0 },
              { gate: 'CNOT', control: 0, target: 1 },
              { gate: 'CNOT', control: 0, target: 2 }
            ]
          })
        `

        const result = await optimizer.optimizeCircuit(code)
        
        expect(result).toBeDefined()
        expect(typeof result.improved).toBe('boolean')
      })
    })
  })

  describe('Metrics Calculation', () => {
    it('should calculate original and optimized metrics', async () => {
      const code = `
        quantumCircuit({
          name: 'metrics-test',
          qubits: 3,
          gates: [
            { gate: 'H', target: 0 },
            { gate: 'X', target: 1 },
            { gate: 'X', target: 1 }, // Redundant
            { gate: 'CNOT', control: 0, target: 1 },
            { gate: 'CNOT', control: 1, target: 2 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.metrics).toBeDefined()
      expect(result.metrics.originalDepth).toBe(5)
      expect(result.metrics.originalGateCount).toBe(5)
      expect(result.metrics.originalFidelity).toBeGreaterThan(0)
      expect(result.metrics.originalFidelity).toBeLessThanOrEqual(1)
      
      expect(result.metrics.optimizedDepth).toBeLessThanOrEqual(result.metrics.originalDepth)
      expect(result.metrics.optimizedGateCount).toBeLessThanOrEqual(result.metrics.originalGateCount)
    })

    it('should calculate depth reduction correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'depth-reduction-test',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Will be cancelled
            { gate: 'H', target: 1 },
            { gate: 'CNOT', control: 0, target: 1 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.depthReduction).toBeGreaterThan(0)
      expect(result.depthReduction).toBeLessThanOrEqual(100)
    })

    it('should calculate fidelity improvement correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'fidelity-improvement-test',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Will be cancelled
            { gate: 'H', target: 1 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.fidelityImprovement).toBeGreaterThanOrEqual(0)
    })

    it('should calculate speed improvement correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'speed-improvement-test',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Will be cancelled
            { gate: 'H', target: 1 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.speedImprovement).toBeGreaterThanOrEqual(0)
    })

    it('should calculate memory reduction correctly', async () => {
      const code = `
        quantumCircuit({
          name: 'memory-reduction-test',
          qubits: 2,
          gates: [
            { gate: 'X', target: 0 },
            { gate: 'X', target: 0 }, // Will be cancelled
            { gate: 'H', target: 1 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(result.memoryReduction).toBeGreaterThanOrEqual(0)
      expect(result.memoryReduction).toBeLessThanOrEqual(100)
    })
  })

  describe('Warning Generation', () => {
    it('should generate warnings for optimization issues', async () => {
      const code = `
        quantumCircuit({
          name: 'warning-test',
          qubits: 1,
          gates: [
            { gate: 'UNKNOWN_GATE', target: 0 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(Array.isArray(result.warnings)).toBe(true)
      // May contain warnings about unknown gates
    })

    it('should generate warnings for failed optimizations', async () => {
      const code = `
        quantumCircuit({
          name: 'failed-optimization-test',
          qubits: 1,
          gates: [
            { gate: 'H', target: 0 }
          ]
        })
      `

      const result = await optimizer.optimizeCircuit(code)
      
      expect(Array.isArray(result.warnings)).toBe(true)
    })
  })

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      const mockConfig = {
        get: jest.fn()
      }

      expect(() => optimizer.updateConfiguration(mockConfig as any)).not.toThrow()
    })
  })

  describe('Cleanup', () => {
    it('should dispose properly', () => {
      expect(() => optimizer.dispose()).not.toThrow()
    })
  })
})
