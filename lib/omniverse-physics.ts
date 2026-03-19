/**
 * Omniverse Physics Simulation Tools
 * Real-time physics for vehicle design and testing
 */

import { PhysicsParams, Force, SimulationResult } from './omniverse-infrastructure'

export interface VehiclePhysicsConfig {
  mass: number
  centerOfMass: { x: number; y: number; z: number }
  dimensions: { length: number; width: number; height: number }
  wheelBase: number
  trackWidth: number
  suspension: {
    front: { stiffness: number; damping: number; travel: number }
    rear: { stiffness: number; damping: number; travel: number }
  }
  tires: {
    friction: number
    rollingResistance: number
    radius: number
  }
  aerodynamics: {
    dragCoefficient: number
    frontalArea: number
    liftCoefficient: number
  }
}

export interface TestScenario {
  id: string
  name: string
  type: 'acceleration' | 'braking' | 'cornering' | 'stability' | 'crash'
  environment: {
    surface: 'dry' | 'wet' | 'snow' | 'ice' | 'gravel'
    slope: number
    windSpeed: number
    windDirection: number
  }
  parameters: Record<string, any>
  successCriteria: {
    minAcceleration?: number
    maxBrakingDistance?: number
    maxLateralG?: number
    stabilityThreshold?: number
  }
}

export interface PhysicsTestResult {
  scenarioId: string
  timestamp: Date
  passed: boolean
  metrics: {
    acceleration: { max: number; average: number; timeTo60: number }
    braking: { distance: number; deceleration: number; timeToStop: number }
    cornering: { maxLateralG: number; radius: number; speed: number }
    stability: { rollAngle: number; pitchAngle: number; yawRate: number }
  }
  warnings: string[]
  errors: string[]
}

export class VehiclePhysicsSimulator {
  private config: VehiclePhysicsConfig
  private gravity: number = 9.81
  private airDensity: number = 1.225

  constructor(config: VehiclePhysicsConfig) {
    this.config = config
  }

  // Acceleration Test
  runAccelerationTest(scenario: TestScenario): PhysicsTestResult {
    const results: SimulationResult[] = []
    const dt = 0.016 // 60 FPS
    let velocity = 0
    let distance = 0
    let time = 0
    const maxTime = 30 // seconds

    while (time < maxTime && velocity < 100) { // Max 100 m/s
      const tractionForce = this.calculateTractionForce(velocity, scenario.environment.surface)
      const dragForce = this.calculateDragForce(velocity)
      const rollingResistance = this.calculateRollingResistance(velocity)
      
      const netForce = tractionForce - dragForce - rollingResistance
      const acceleration = netForce / this.config.mass
      
      velocity += acceleration * dt
      distance += velocity * dt
      time += dt

      results.push({
        frame: Math.floor(time * 60),
        timestamp: time,
        position: { x: distance, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        velocity: { x: velocity, y: 0, z: 0 }
      })
    }

    const metrics = this.calculateAccelerationMetrics(results)
    const passed = this.evaluateAccelerationSuccess(metrics, scenario.successCriteria)

    return {
      scenarioId: scenario.id,
      timestamp: new Date(),
      passed,
      metrics,
      warnings: [],
      errors: []
    }
  }

  // Braking Test
  runBrakingTest(scenario: TestScenario, initialSpeed: number): PhysicsTestResult {
    const results: SimulationResult[] = []
    const dt = 0.016
    let velocity = initialSpeed
    let distance = 0
    let time = 0

    while (velocity > 0.1 && time < 30) {
      const brakingForce = this.calculateBrakingForce(scenario.environment.surface)
      const dragForce = this.calculateDragForce(velocity)
      const rollingResistance = this.calculateRollingResistance(velocity)
      
      const totalForce = brakingForce + dragForce + rollingResistance
      const deceleration = totalForce / this.config.mass
      
      velocity = Math.max(0, velocity - deceleration * dt)
      distance += velocity * dt
      time += dt

      results.push({
        frame: Math.floor(time * 60),
        timestamp: time,
        position: { x: distance, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        velocity: { x: velocity, y: 0, z: 0 }
      })
    }

    const metrics = this.calculateBrakingMetrics(results, initialSpeed)
    const passed = this.evaluateBrakingSuccess(metrics, scenario.successCriteria)

    return {
      scenarioId: scenario.id,
      timestamp: new Date(),
      passed,
      metrics,
      warnings: [],
      errors: []
    }
  }

  // Cornering Test
  runCorneringTest(scenario: TestScenario, cornerRadius: number, entrySpeed: number): PhysicsTestResult {
    const results: SimulationResult[] = []
    const dt = 0.016
    let speed = entrySpeed
    let angle = 0
    let time = 0
    const maxAngle = Math.PI / 2 // 90 degrees

    while (angle < maxAngle && time < 30) {
      const lateralAcceleration = (speed * speed) / cornerRadius
      const maxLateralForce = this.config.tires.friction * this.config.mass * this.gravity
      const actualLateralForce = Math.min(maxLateralForce, this.config.mass * lateralAcceleration)
      
      const actualLateralAcceleration = actualLateralForce / this.config.mass
      const angularVelocity = speed / cornerRadius
      
      angle += angularVelocity * dt
      speed = Math.max(10, speed - this.calculateSpeedLoss(actualLateralAcceleration) * dt)
      time += dt

      const x = cornerRadius * Math.cos(angle)
      const z = cornerRadius * Math.sin(angle)

      results.push({
        frame: Math.floor(time * 60),
        timestamp: time,
        position: { x, y: 0, z },
        rotation: { x: 0, y: angle, z: 0 },
        velocity: { x: -speed * Math.sin(angle), y: 0, z: speed * Math.cos(angle) }
      })
    }

    const metrics = this.calculateCorneringMetrics(results)
    const passed = this.evaluateCorneringSuccess(metrics, scenario.successCriteria)

    return {
      scenarioId: scenario.id,
      timestamp: new Date(),
      passed,
      metrics,
      warnings: [],
      errors: []
    }
  }

  // Stability Test
  runStabilityTest(scenario: TestScenario): PhysicsTestResult {
    const results: SimulationResult[] = []
    const dt = 0.016
    let time = 0
    const testDuration = 10 // seconds

    // Simulate various stability scenarios
    while (time < testDuration) {
      const rollAngle = this.calculateRollAngle(scenario.environment, time)
      const pitchAngle = this.calculatePitchAngle(scenario.environment, time)
      const yawRate = this.calculateYawRate(scenario.environment, time)

      results.push({
        frame: Math.floor(time * 60),
        timestamp: time,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: rollAngle, y: pitchAngle, z: yawRate },
        velocity: { x: 0, y: 0, z: 0 }
      })

      time += dt
    }

    const metrics = this.calculateStabilityMetrics(results)
    const passed = this.evaluateStabilitySuccess(metrics, scenario.successCriteria)

    return {
      scenarioId: scenario.id,
      timestamp: new Date(),
      passed,
      metrics,
      warnings: [],
      errors: []
    }
  }

  // Helper Methods
  private calculateTractionForce(velocity: number, surface: string): number {
    const surfaceCoefficients = {
      dry: 0.9,
      wet: 0.6,
      snow: 0.3,
      ice: 0.1,
      gravel: 0.5
    }
    
    const maxTraction = surfaceCoefficients[surface] * this.config.mass * this.gravity
    const motorForce = this.config.mass * 3 // 3g max acceleration
    
    return Math.min(maxTraction, motorForce)
  }

  private calculateDragForce(velocity: number): number {
    return 0.5 * this.airDensity * this.config.aerodynamics.dragCoefficient * 
           this.config.aerodynamics.frontalArea * velocity * velocity
  }

  private calculateRollingResistance(velocity: number): number {
    return this.config.tires.rollingResistance * this.config.mass * this.gravity * 
           (1 + 0.01 * velocity) // Speed-dependent rolling resistance
  }

  private calculateBrakingForce(surface: string): number {
    const surfaceCoefficients = {
      dry: 0.8,
      wet: 0.5,
      snow: 0.2,
      ice: 0.08,
      gravel: 0.4
    }
    
    return surfaceCoefficients[surface] * this.config.mass * this.gravity
  }

  private calculateSpeedLoss(lateralAcceleration: number): number {
    // Simplified model for speed loss during cornering
    return lateralAcceleration * 0.1
  }

  private calculateRollAngle(environment: any, time: number): number {
    // Simulate roll dynamics based on maneuvers
    return Math.sin(time * 2) * 5 // degrees
  }

  private calculatePitchAngle(environment: any, time: number): number {
    // Simulate pitch dynamics during acceleration/braking
    return Math.sin(time * 1.5) * 3 // degrees
  }

  private calculateYawRate(environment: any, time: number): number {
    // Simulate yaw rate during maneuvers
    return Math.cos(time * 3) * 10 // degrees/second
  }

  // Metrics Calculation
  private calculateAccelerationMetrics(results: SimulationResult[]): any {
    const accelerations = results.map((r, i) => {
      if (i === 0) return 0
      const dt = results[i].timestamp - results[i - 1].timestamp
      const dv = r.velocity.x - results[i - 1].velocity.x
      return dv / dt
    })

    const maxAcceleration = Math.max(...accelerations)
    const averageAcceleration = accelerations.reduce((a, b) => a + b, 0) / accelerations.length
    
    const timeTo60 = results.find(r => r.velocity.x >= 26.8224)?.timestamp || 0 // 60 mph = 26.8224 m/s

    return {
      acceleration: { max: maxAcceleration, average: averageAcceleration, timeTo60 }
    }
  }

  private calculateBrakingMetrics(results: SimulationResult[], initialSpeed: number): any {
    const brakingDistance = results[results.length - 1]?.position.x || 0
    const deceleration = initialSpeed * initialSpeed / (2 * brakingDistance)
    const timeToStop = results[results.length - 1]?.timestamp || 0

    return {
      braking: { distance: brakingDistance, deceleration, timeToStop }
    }
  }

  private calculateCorneringMetrics(results: SimulationResult[]): any {
    const lateralAccelerations = results.map(r => {
      return Math.sqrt(r.velocity.x * r.velocity.x + r.velocity.z * r.velocity.z) ** 2 / 50 // Assuming 50m radius
    })

    const maxLateralG = Math.max(...lateralAccelerations) / this.gravity

    return {
      cornering: { maxLateralG, radius: 50, speed: 20 }
    }
  }

  private calculateStabilityMetrics(results: SimulationResult[]): any {
    const rollAngles = results.map(r => r.rotation.x)
    const pitchAngles = results.map(r => r.rotation.y)
    const yawRates = results.map(r => r.rotation.z)

    return {
      stability: {
        rollAngle: Math.max(...rollAngles.map(Math.abs)),
        pitchAngle: Math.max(...pitchAngles.map(Math.abs)),
        yawRate: Math.max(...yawRates.map(Math.abs))
      }
    }
  }

  // Success Evaluation
  private evaluateAccelerationSuccess(metrics: any, criteria: any): boolean {
    if (criteria.minAcceleration) {
      return metrics.acceleration.max >= criteria.minAcceleration
    }
    return true
  }

  private evaluateBrakingSuccess(metrics: any, criteria: any): boolean {
    if (criteria.maxBrakingDistance) {
      return metrics.braking.distance <= criteria.maxBrakingDistance
    }
    return true
  }

  private evaluateCorneringSuccess(metrics: any, criteria: any): boolean {
    if (criteria.maxLateralG) {
      return metrics.cornering.maxLateralG <= criteria.maxLateralG
    }
    return true
  }

  private evaluateStabilitySuccess(metrics: any, criteria: any): boolean {
    if (criteria.stabilityThreshold) {
      return metrics.stability.rollAngle <= criteria.stabilityThreshold &&
             metrics.stability.pitchAngle <= criteria.stabilityThreshold
    }
    return true
  }
}

export const createVehiclePhysicsConfig = (): VehiclePhysicsConfig => ({
  mass: 1500, // kg
  centerOfMass: { x: 0, y: 0.5, z: 0 },
  dimensions: { length: 4.5, width: 1.8, height: 1.4 },
  wheelBase: 2.7,
  trackWidth: 1.5,
  suspension: {
    front: { stiffness: 35000, damping: 3000, travel: 0.2 },
    rear: { stiffness: 32000, damping: 2800, travel: 0.2 }
  },
  tires: {
    friction: 0.9,
    rollingResistance: 0.015,
    radius: 0.3
  },
  aerodynamics: {
    dragCoefficient: 0.3,
    frontalArea: 2.2,
    liftCoefficient: -0.1
  }
})
