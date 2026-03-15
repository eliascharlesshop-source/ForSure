import * as vscode from 'vscode'
import { QuantumLanguageProvider } from './quantum-language-provider'
import { QuantumIntelliSenseProvider } from './quantum-intellisense'
import { QuantumValidator } from './quantum-validator'
import { QuantumSimulator } from './quantum-simulator'
import { QuantumOptimizer } from './quantum-optimizer'
import { QuantumMetricsProvider } from './quantum-metrics'
import { QuantumStatusBar } from './quantum-status-bar'
import { QuantumExplorer } from './quantum-explorer'

let languageProvider: QuantumLanguageProvider
let intelliSenseProvider: QuantumIntelliSenseProvider
let validator: QuantumValidator
let simulator: QuantumSimulator
let optimizer: QuantumOptimizer
let metricsProvider: QuantumMetricsProvider
let statusBar: QuantumStatusBar
let explorer: QuantumExplorer

export function activate(context: vscode.ExtensionContext) {
  console.log('ForSure Quantum Language Extension is now active!')

  // Initialize language provider
  languageProvider = new QuantumLanguageProvider(context)
  context.subscriptions.push(languageProvider)

  // Initialize IntelliSense provider
  intelliSenseProvider = new QuantumIntelliSenseProvider()
  context.subscriptions.push(intelliSenseProvider)

  // Initialize validator
  validator = new QuantumValidator()
  context.subscriptions.push(validator)

  // Initialize simulator
  simulator = new QuantumSimulator()
  context.subscriptions.push(simulator)

  // Initialize optimizer
  optimizer = new QuantumOptimizer()
  context.subscriptions.push(optimizer)

  // Initialize metrics provider
  metricsProvider = new QuantumMetricsProvider()
  context.subscriptions.push(metricsProvider)

  // Initialize status bar
  statusBar = new QuantumStatusBar()
  context.subscriptions.push(statusBar)

  // Initialize explorer
  explorer = new QuantumExplorer(context)
  context.subscriptions.push(explorer)

  // Register language providers
  const languageProviders = [
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider,
      '.'
    ),
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider,
      '.'
    ),
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider,
      '.'
    ),
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider
    ),
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider
    ),
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider
    ),
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider
    ),
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider
    ),
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider
    ),
    vscode.languages.registerDocumentSymbolProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider
    ),
    vscode.languages.registerDocumentSymbolProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider
    ),
    vscode.languages.registerDocumentSymbolProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider
    ),
    vscode.languages.registerDefinitionProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider
    ),
    vscode.languages.registerDefinitionProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider
    ),
    vscode.languages.registerDefinitionProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider
    ),
    vscode.languages.registerReferenceProvider(
      { scheme: 'file', language: 'quantum' },
      intelliSenseProvider
    ),
    vscode.languages.registerReferenceProvider(
      { scheme: 'file', language: 'quantum-circuit' },
      intelliSenseProvider
    ),
    vscode.languages.registerReferenceProvider(
      { scheme: 'file', language: 'quantum-algorithm' },
      intelliSenseProvider
    )
  ]

  languageProviders.forEach(provider => context.subscriptions.push(provider))

  // Register commands
  const commands = [
    vscode.commands.registerCommand('quantum.validateCircuit', () => {
      validateCurrentCircuit()
    }),
    vscode.commands.registerCommand('quantum.simulateCircuit', () => {
      simulateCurrentCircuit()
    }),
    vscode.commands.registerCommand('quantum.optimizeCircuit', () => {
      optimizeCurrentCircuit()
    }),
    vscode.commands.registerCommand('quantum.generateSuperposition', () => {
      generateSuperpositionState()
    }),
    vscode.commands.registerCommand('quantum.createEntanglement', () => {
      createEntanglementState()
    }),
    vscode.commands.registerCommand('quantum.performMeasurement', () => {
      performQuantumMeasurement()
    }),
    vscode.commands.registerCommand('quantum.showQuantumMetrics', () => {
      showQuantumMetrics()
    }),
    vscode.commands.registerCommand('quantum.toggleQuantumMode', () => {
      toggleQuantumMode()
    })
  ]

  commands.forEach(command => context.subscriptions.push(command))

  // Register diagnostic providers
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('quantum')
  context.subscriptions.push(diagnosticCollection)

  // Register code actions provider
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    { scheme: 'file', language: 'quantum' },
    {
      provideCodeActions(document, range, context) {
        const actions = []
        
        // Add quantum-specific code actions
        if (context.diagnostics.some(d => d.source === 'quantum-validator')) {
          actions.push({
            title: 'Fix Quantum Errors',
            kind: vscode.CodeActionKind.QuickFix,
            command: {
              command: 'quantum.fixErrors',
              title: 'Fix Quantum Errors'
            }
          })
        }

        actions.push({
          title: 'Optimize Quantum Circuit',
          kind: vscode.CodeActionKind.Refactor,
          command: {
            command: 'quantum.optimizeCircuit',
            title: 'Optimize Quantum Circuit'
          }
        })

        actions.push({
          title: 'Generate Quantum Documentation',
          kind: vscode.CodeActionKind.Refactor,
          command: {
            command: 'quantum.generateDocs',
            title: 'Generate Quantum Documentation'
          }
        })

        return actions
      }
    }
  )
  
  context.subscriptions.push(codeActionProvider)

  // Setup event listeners
  setupEventListeners(context)

  // Show activation message
  vscode.window.showInformationMessage(
    'ForSure Quantum Language Extension activated! ⚛️ Quantum computing features are now available.'
  )

  return {
    languageProvider,
    intelliSenseProvider,
    validator,
    simulator,
    optimizer,
    metricsProvider,
    statusBar,
    explorer
  }
}

function setupEventListeners(context: vscode.ExtensionContext) {
  // Document change listener for real-time validation
  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    if (isQuantumDocument(event.document)) {
      validateDocument(event.document)
    }
  })
  context.subscriptions.push(changeListener)

  // Active editor change listener
  const editorChangeListener = vscode.window.onDidChangeActiveEditor((editor) => {
    if (editor && isQuantumDocument(editor.document)) {
      updateQuantumMetrics(editor.document)
    }
  })
  context.subscriptions.push(editorChangeListener)

  // Configuration change listener
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('quantumLanguage')) {
      updateConfiguration()
    }
  })
  context.subscriptions.push(configChangeListener)
}

function isQuantumDocument(document: vscode.TextDocument): boolean {
  return document.languageId === 'quantum' || 
         document.languageId === 'quantum-circuit' || 
         document.languageId === 'quantum-algorithm'
}

async function validateCurrentCircuit() {
  const editor = vscode.window.activeTextEditor
  if (!editor || !isQuantumDocument(editor.document)) {
    vscode.window.showWarningMessage('No quantum circuit file is currently open.')
    return
  }

  try {
    const validation = await validator.validateCircuit(editor.document.getText())
    
    if (validation.isValid) {
      vscode.window.showInformationMessage(
        `✅ Quantum circuit is valid! Fidelity: ${validation.fidelity.toFixed(3)}`
      )
    } else {
      vscode.window.showErrorMessage(
        `❌ Quantum circuit validation failed: ${validation.errors.join(', ')}`
      )
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Validation error: ${error}`)
  }
}

async function simulateCurrentCircuit() {
  const editor = vscode.window.activeTextEditor
  if (!editor || !isQuantumDocument(editor.document)) {
    vscode.window.showWarningMessage('No quantum circuit file is currently open.')
    return
  }

  try {
    const simulation = await simulator.simulateCircuit(editor.document.getText())
    
    // Show simulation results in a new webview
    const panel = vscode.window.createWebviewPanel(
      'quantum-simulation',
      'Quantum Circuit Simulation',
      vscode.ViewColumn.One,
      { enableScripts: true }
    )

    panel.webview.html = generateSimulationHTML(simulation)
    
    vscode.window.showInformationMessage(
      `🔬 Simulation complete! Results shown in new panel.`
    )
  } catch (error) {
    vscode.window.showErrorMessage(`Simulation error: ${error}`)
  }
}

async function optimizeCurrentCircuit() {
  const editor = vscode.window.activeTextEditor
  if (!editor || !isQuantumDocument(editor.document)) {
    vscode.window.showWarningMessage('No quantum circuit file is currently open.')
    return
  }

  try {
    const optimization = await optimizer.optimizeCircuit(editor.document.getText())
    
    if (optimization.improved) {
      // Show diff and ask to apply
      const apply = await vscode.window.showInformationMessage(
        `🚀 Circuit optimized! Depth reduced by ${optimization.depthReduction}%, fidelity improved by ${optimization.fidelityImprovement}%`,
        'Apply Optimization',
        'Show Diff'
      )

      if (apply === 'Apply Optimization') {
        const editor = vscode.window.activeTextEditor
        if (editor) {
          editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length)
            )
            editBuilder.replace(fullRange, optimization.optimizedCode)
          })
        }
      } else if (apply === 'Show Diff') {
        // Show diff in new tab
        vscode.workspace.openTextDocument({
          content: optimization.diff,
          language: 'diff'
        }).then(doc => vscode.window.showTextDocument(doc))
      }
    } else {
      vscode.window.showInformationMessage('✅ Circuit is already optimal!')
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Optimization error: ${error}`)
  }
}

async function generateSuperpositionState() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const qubits = await vscode.window.showInputBox({
    prompt: 'Enter number of qubits for superposition state:',
    placeHolder: '2',
    validateInput: value => {
      const num = parseInt(value)
      return isNaN(num) || num < 1 || num > 20 ? 'Please enter a number between 1 and 20' : null
    }
  })

  if (!qubits) return

  const numQubits = parseInt(qubits)
  const superpositionCode = generateSuperpositionCode(numQubits)

  editor.edit(editBuilder => {
    const position = editor.selection.active
    editBuilder.insert(position, superpositionCode)
  })

  vscode.window.showInformationMessage(`🌀 Generated superposition state for ${numQubits} qubits`)
}

async function createEntanglementState() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const entanglementType = await vscode.window.showQuickPick([
    'Bell State (2 qubits)',
    'GHZ State (3+ qubits)',
    'W State (3+ qubits)',
    'Custom Entanglement'
  ], {
    placeHolder: 'Select entanglement type'
  })

  if (!entanglementType) return

  let entanglementCode = ''
  
  switch (entanglementType) {
    case 'Bell State (2 qubits)':
      entanglementCode = generateBellStateCode()
      break
    case 'GHZ State (3+ qubits)':
      const ghzQubits = await vscode.window.showInputBox({
        prompt: 'Enter number of qubits for GHZ state:',
        placeHolder: '3',
        validateInput: value => {
          const num = parseInt(value)
          return isNaN(num) || num < 3 || num > 10 ? 'Please enter a number between 3 and 10' : null
        }
      })
      if (ghzQubits) {
        entanglementCode = generateGHZStateCode(parseInt(ghzQubits))
      }
      break
    case 'W State (3+ qubits)':
      const wQubits = await vscode.window.showInputBox({
        prompt: 'Enter number of qubits for W state:',
        placeHolder: '3',
        validateInput: value => {
          const num = parseInt(value)
          return isNaN(num) || num < 3 || num < 10 ? 'Please enter a number between 3 and 10' : null
        }
      })
      if (wQubits) {
        entanglementCode = generateWStateCode(parseInt(wQubits))
      }
      break
    case 'Custom Entanglement':
      entanglementCode = generateCustomEntanglementCode()
      break
  }

  if (entanglementCode) {
    editor.edit(editBuilder => {
      const position = editor.selection.active
      editBuilder.insert(position, entanglementCode)
    })

    vscode.window.showInformationMessage(`🔗 Created ${entanglementType}`)
  }
}

async function performQuantumMeasurement() {
  const editor = vscode.window.activeTextEditor
  if (!editor || !isQuantumDocument(editor.document)) {
    vscode.window.showWarningMessage('No quantum file is currently open.')
    return
  }

  try {
    const measurement = await simulator.performMeasurement(editor.document.getText())
    
    const result = await vscode.window.showInformationMessage(
      `📏 Measurement Result: ${measurement.result}\nProbability: ${(measurement.probability * 100).toFixed(2)}%\nFidelity: ${(measurement.fidelity * 100).toFixed(2)}%`,
      'Show Details',
      'Apply Collapse'
    )

    if (result === 'Show Details') {
      // Show detailed measurement results
      const panel = vscode.window.createWebviewPanel(
        'quantum-measurement',
        'Quantum Measurement Details',
        vscode.ViewColumn.One,
        { enableScripts: true }
      )

      panel.webview.html = generateMeasurementHTML(measurement)
    } else if (result === 'Apply Collapse') {
      // Apply state collapse to document
      const collapsedCode = applyStateCollapse(editor.document.getText(), measurement)
      editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
          editor.document.positionAt(0),
          editor.document.positionAt(editor.document.getText().length)
        )
        editBuilder.replace(fullRange, collapsedCode)
      })
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Measurement error: ${error}`)
  }
}

async function showQuantumMetrics() {
  const editor = vscode.window.activeTextEditor
  if (!editor || !isQuantumDocument(editor.document)) {
    vscode.window.showWarningMessage('No quantum file is currently open.')
    return
  }

  const metrics = await metricsProvider.getMetrics(editor.document)
  
  const panel = vscode.window.createWebviewPanel(
    'quantum-metrics',
    'Quantum Metrics',
    vscode.ViewColumn.One,
    { enableScripts: true }
  )

  panel.webview.html = generateMetricsHTML(metrics)
}

function toggleQuantumMode() {
  const config = vscode.workspace.getConfiguration('quantumLanguage')
  const currentMode = config.get('quantumMode', 'enabled')
  const newMode = currentMode === 'enabled' ? 'disabled' : 'enabled'
  
  config.update('quantumMode', newMode, vscode.ConfigurationTarget.Global)
  
  vscode.window.showInformationMessage(
    `Quantum mode ${newMode === 'enabled' ? 'enabled' : 'disabled'}`
  )
}

function validateDocument(document: vscode.TextDocument) {
  if (!isQuantumDocument(document)) return

  validator.validateDocument(document).then(validation => {
    const diagnostics = validation.diagnostics.map(diag => new vscode.Diagnostic(
      new vscode.Range(
        document.positionAt(diag.range.start),
        document.positionAt(diag.range.end)
      ),
      diag.message,
      diag.severity,
      diag.source
    ))

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('quantum')
    diagnosticCollection.set(document.uri, diagnostics)
  })
}

function updateQuantumMetrics(document: vscode.TextDocument) {
  if (!isQuantumDocument(document)) return

  metricsProvider.updateMetrics(document).then(metrics => {
    statusBar.updateMetrics(metrics)
  })
}

function updateConfiguration() {
  // Update all providers with new configuration
  const config = vscode.workspace.getConfiguration('quantumLanguage')
  
  languageProvider.updateConfiguration(config)
  intelliSenseProvider.updateConfiguration(config)
  validator.updateConfiguration(config)
  simulator.updateConfiguration(config)
  optimizer.updateConfiguration(config)
  metricsProvider.updateConfiguration(config)
}

// Helper functions for code generation
function generateSuperpositionCode(numQubits: number): string {
  const states = Array.from({ length: Math.pow(2, numQubits) }, (_, i) => 
    `|${i.toString(2).padStart(numQubits, '0')}⟩`
  ).join(', ')
  
  const amplitudes = Array.from({ length: Math.pow(2, numQubits) }, () => 
    '1/√' + Math.pow(2, numQubits).toString()
  ).join(', ')

  return `// Superposition state for ${numQubits} qubits
createSuperposition([${states}], {
  amplitudes: [${amplitudes}],
  normalization: 1.0,
  coherence: 0.98,
  phase: 0
})`
}

function generateBellStateCode(): string {
  return `// Bell state |Φ+⟩ = (|00⟩ + |11⟩) / √2
createEntanglement([0, 1], {
  bellState: 'Φ+',
  maximallyEntangled: true,
  fidelity: 0.99,
  correlation: 1.0
})`
}

function generateGHZStateCode(numQubits: number): string {
  const zeroState = '|' + '0'.repeat(numQubits) + '⟩'
  const oneState = '|' + '1'.repeat(numQubits) + '⟩'
  
  return `// GHZ state for ${numQubits} qubits
createSuperposition([${zeroState}, ${oneState}], {
  amplitudes: [1/√2, 1/√2],
  normalization: 1.0,
  coherence: 0.98,
  maximallyEntangled: true
})`
}

function generateWStateCode(numQubits: number): string {
  const states = Array.from({ length: numQubits }, (_, i) => 
    '|' + '0'.repeat(i) + '1' + '0'.repeat(numQubits - i - 1) + '⟩'
  ).join(', ')
  
  const amplitudes = Array.from({ length: numQubits }, () => '1/√' + numQubits.toString()).join(', ')

  return `// W state for ${numQubits} qubits
createSuperposition([${states}], {
  amplitudes: [${amplitudes}],
  normalization: 1.0,
  coherence: 0.97,
  entanglement: false
})`
}

function generateCustomEntanglementCode(): string {
  return `// Custom entanglement
createEntanglement([0, 1, 2], {
  bellState: 'custom',
  maximallyEntangled: false,
  fidelity: 0.95,
  correlation: 0.8,
  strength: 0.7
})`
}

function applyStateCollapse(code: string, measurement: any): string {
  // Simple state collapse - in real implementation would be more sophisticated
  return code + `\n\n// State collapsed to: ${measurement.result}
// Probability: ${(measurement.probability * 100).toFixed(2)}%
// Fidelity: ${(measurement.fidelity * 100).toFixed(2)}%`
}

function generateSimulationHTML(simulation: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Quantum Circuit Simulation</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .metric { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .result { font-weight: bold; color: #007acc; }
    </style>
</head>
<body>
    <h1>🔬 Quantum Circuit Simulation Results</h1>
    
    <div class="metric">
        <h3>Circuit Information</h3>
        <p>Qubits: <span class="result">${simulation.qubits}</span></p>
        <p>Gates: <span class="result">${simulation.gates}</span></p>
        <p>Depth: <span class="result">${simulation.depth}</span></p>
    </div>
    
    <div class="metric">
        <h3>Performance Metrics</h3>
        <p>Fidelity: <span class="result">${(simulation.fidelity * 100).toFixed(3)}%</span></p>
        <p>Coherence: <span class="result">${(simulation.coherence * 100).toFixed(3)}%</span></p>
        <p>Success Probability: <span class="result">${(simulation.probability * 100).toFixed(3)}%</span></p>
    </div>
    
    <div class="metric">
        <h3>Measurement Results</h3>
        <p>State: <span class="result">${simulation.result}</span></p>
        <p>Probability: <span class="result">${(simulation.probability * 100).toFixed(3)}%</span></p>
        <p>Confidence: <span class="result">${(simulation.confidence * 100).toFixed(3)}%</span></p>
    </div>
    
    <div class="metric">
        <h3>Optimization Suggestions</h3>
        <ul>
            ${simulation.suggestions.map((s: string) => `<li>${s}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`
}

function generateMeasurementHTML(measurement: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Quantum Measurement Details</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .metric { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .result { font-weight: bold; color: #007acc; }
    </style>
</head>
<body>
    <h1>📏 Quantum Measurement Details</h1>
    
    <div class="metric">
        <h3>Measurement Information</h3>
        <p>Basis: <span class="result">${measurement.basis}</span></p>
        <p>Result: <span class="result">${measurement.result}</span></p>
        <p>State Collapsed: <span class="result">${measurement.collapsed ? 'Yes' : 'No'}</span></p>
    </div>
    
    <div class="metric">
        <h3>Probabilistic Information</h3>
        <p>Probability: <span class="result">${(measurement.probability * 100).toFixed(3)}%</span></p>
        <p>Confidence: <span class="result">${(measurement.confidence * 100).toFixed(3)}%</span></p>
        <p>Uncertainty: <span class="result">${(measurement.uncertainty * 100).toFixed(3)}%</span></p>
    </div>
    
    <div class="metric">
        <h3>Quality Metrics</h3>
        <p>Fidelity: <span class="result">${(measurement.fidelity * 100).toFixed(3)}%</span></p>
        <p>Accuracy: <span class="result">${(measurement.accuracy * 100).toFixed(3)}%</span></p>
        <p>Precision: <span class="result">${(measurement.precision * 100).toFixed(3)}%</span></p>
    </div>
    
    <div class="metric">
        <h3>Post-Measurement State</h3>
        <p>State: <span class="result">${measurement.postState}</span></p>
        <p>Coherence: <span class="result">${(measurement.coherence * 100).toFixed(3)}%</span></p>
        <p>Purity: <span class="result">${(measurement.purity * 100).toFixed(3)}%</span></p>
    </div>
</body>
</html>`
}

function generateMetricsHTML(metrics: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Quantum Metrics</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .metric { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .result { font-weight: bold; color: #007acc; }
        .progress { width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: #007acc; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <h1>📊 Quantum Code Metrics</h1>
    
    <div class="metric">
        <h3>Code Statistics</h3>
        <p>Lines of Code: <span class="result">${metrics.linesOfCode}</span></p>
        <p>Quantum Operations: <span class="result">${metrics.quantumOperations}</span></p>
        <p>Complexity Score: <span class="result">${metrics.complexity}</span></p>
    </div>
    
    <div class="metric">
        <h3>Quantum Features</h3>
        <p>Superposition States: <span class="result">${metrics.superpositionStates}</span></p>
        <p>Entanglement States: <span class="result">${metrics.entanglementStates}</span></p>
        <p>Quantum Gates: <span class="result">${metrics.quantumGates}</span></p>
        <p>Measurements: <span class="result">${metrics.measurements}</span></p>
    </div>
    
    <div class="metric">
        <h3>Performance Indicators</h3>
        <p>Estimated Fidelity: <span class="result">${(metrics.estimatedFidelity * 100).toFixed(3)}%</span></p>
        <div class="progress">
            <div class="progress-bar" style="width: ${metrics.estimatedFidelity * 100}%"></div>
        </div>
        <p>Coherence Score: <span class="result">${(metrics.coherenceScore * 100).toFixed(3)}%</span></p>
        <div class="progress">
            <div class="progress-bar" style="width: ${metrics.coherenceScore * 100}%"></div>
        </div>
        <p>Optimization Potential: <span class="result">${(metrics.optimizationPotential * 100).toFixed(3)}%</span></p>
        <div class="progress">
            <div class="progress-bar" style="width: ${metrics.optimizationPotential * 100}%"></div>
        </div>
    </div>
    
    <div class="metric">
        <h3>Quality Assessment</h3>
        <p>Code Quality: <span class="result">${metrics.codeQuality}</span></p>
        <p>Maintainability: <span class="result">${metrics.maintainability}</span></p>
        <p>Documentation Coverage: <span class="result">${(metrics.documentationCoverage * 100).toFixed(1)}%</span></p>
        <div class="progress">
            <div class="progress-bar" style="width: ${metrics.documentationCoverage * 100}%"></div>
        </div>
    </div>
</body>
</html>`
}

export function deactivate() {
  console.log('ForSure Quantum Language Extension is now deactivated')
  
  // Cleanup resources
  if (languageProvider) {
    languageProvider.dispose()
  }
  if (intelliSenseProvider) {
    intelliSenseProvider.dispose()
  }
  if (validator) {
    validator.dispose()
  }
  if (simulator) {
    simulator.dispose()
  }
  if (optimizer) {
    optimizer.dispose()
  }
  if (metricsProvider) {
    metricsProvider.dispose()
  }
  if (statusBar) {
    statusBar.dispose()
  }
  if (explorer) {
    explorer.dispose()
  }
}
