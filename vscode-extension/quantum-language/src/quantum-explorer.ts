import * as vscode from 'vscode'
import { QuantumMetrics } from './quantum-metrics'

export class QuantumExplorer {
  private provider: QuantumTreeDataProvider
  private treeView: vscode.TreeView<QuantumTreeItem>

  constructor(private context: vscode.ExtensionContext) {
    this.provider = new QuantumTreeDataProvider()
    this.treeView = vscode.window.createTreeView('quantumExplorer', {
      treeDataProvider: this.provider,
      showCollapseAll: true
    })

    // Register tree view commands
    this.registerCommands()
  }

  private registerCommands() {
    const commands = [
      vscode.commands.registerCommand('quantumExplorer.refresh', () => {
        this.provider.refresh()
      }),
      vscode.commands.registerCommand('quantumExplorer.validateCircuit', (item) => {
        vscode.commands.executeCommand('quantum.validateCircuit')
      }),
      vscode.commands.registerCommand('quantumExplorer.simulateCircuit', (item) => {
        vscode.commands.executeCommand('quantum.simulateCircuit')
      }),
      vscode.commands.registerCommand('quantumExplorer.optimizeCircuit', (item) => {
        vscode.commands.executeCommand('quantum.optimizeCircuit')
      }),
      vscode.commands.registerCommand('quantumExplorer.showMetrics', (item) => {
        vscode.commands.executeCommand('quantum.showQuantumMetrics')
      }),
      vscode.commands.registerCommand('quantumExplorer.generateDocs', (item) => {
        vscode.commands.executeCommand('quantum.generateDocumentation')
      })
    ]

    commands.forEach(command => this.context.subscriptions.push(command))
  }

  public dispose() {
    this.treeView.dispose()
  }
}

export class QuantumTreeDataProvider implements vscode.TreeDataProvider<QuantumTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<QuantumTreeItem | undefined | null | void> = new vscode.EventEmitter<QuantumTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<QuantumTreeItem | undefined | null | void> = this._onDidChangeTreeData.event

  private metrics: QuantumMetrics | undefined

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: QuantumTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: QuantumTreeItem): Thenable<QuantumTreeItem[]> {
    if (!element) {
      // Root level - show main categories
      return this.getRootItems()
    }

    switch (element.contextValue) {
      case 'quantum-circuits':
        return this.getCircuitItems()
      case 'quantum-states':
        return this.getStateItems()
      case 'quantum-gates':
        return this.getGateItems()
      case 'quantum-metrics':
        return this.getMetricsItems()
      case 'quantum-algorithms':
        return this.getAlgorithmItems()
      default:
        return Promise.resolve([])
    }
  }

  private async getRootItems(): Promise<QuantumTreeItem[]> {
    const editor = vscode.window.activeTextEditor
    const isQuantumFile = editor && this.isQuantumDocument(editor.document)

    const items: QuantumTreeItem[] = []

    if (isQuantumFile) {
      items.push(new QuantumTreeItem(
        'Active Circuit',
        vscode.TreeItemCollapsibleState.Expanded,
        'quantum-circuits',
        {
          command: 'quantumExplorer.validateCircuit',
          title: 'Validate Circuit'
        }
      ))
    }

    items.push(
      new QuantumTreeItem(
        'Quantum States',
        vscode.TreeItemCollapsibleState.Collapsed,
        'quantum-states'
      ),
      new QuantumTreeItem(
        'Quantum Gates',
        vscode.TreeItemCollapsibleState.Collapsed,
        'quantum-gates'
      ),
      new QuantumTreeItem(
        'Quantum Algorithms',
        vscode.TreeItemCollapsibleState.Collapsed,
        'quantum-algorithms'
      ),
      new QuantumTreeItem(
        'Performance Metrics',
        vscode.TreeItemCollapsibleState.Collapsed,
        'quantum-metrics'
      )
    )

    return items
  }

  private async getCircuitItems(): Promise<QuantumTreeItem[]> {
    const editor = vscode.window.activeTextEditor
    if (!editor || !this.isQuantumDocument(editor.document)) {
      return []
    }

    const items: QuantumTreeItem[] = []

    // Circuit validation
    items.push(new QuantumTreeItem(
      'Validate Circuit',
      vscode.TreeItemCollapsibleState.None,
      'circuit-validation',
      {
        command: 'quantumExplorer.validateCircuit',
        title: 'Validate Circuit'
      },
      'Check circuit for errors and warnings'
    ))

    // Circuit simulation
    items.push(new QuantumTreeItem(
      'Simulate Circuit',
      vscode.TreeItemCollapsibleState.None,
      'circuit-simulation',
      {
        command: 'quantumExplorer.simulateCircuit',
        title: 'Simulate Circuit'
      },
      'Run quantum circuit simulation'
    ))

    // Circuit optimization
    items.push(new QuantumTreeItem(
      'Optimize Circuit',
      vscode.TreeItemCollapsibleState.None,
      'circuit-optimization',
      {
        command: 'quantumExplorer.optimizeCircuit',
        title: 'Optimize Circuit'
      },
      'Optimize circuit for better performance'
    ))

    // Generate documentation
    items.push(new QuantumTreeItem(
      'Generate Documentation',
      vscode.TreeItemCollapsibleState.None,
      'circuit-documentation',
      {
        command: 'quantumExplorer.generateDocs',
        title: 'Generate Documentation'
      },
      'Generate circuit documentation'
    ))

    return items
  }

  private async getStateItems(): Promise<QuantumTreeItem[]> {
    const states = [
      { name: '|0⟩', description: 'Computational basis state |0⟩' },
      { name: '|1⟩', description: 'Computational basis state |1⟩' },
      { name: '|+⟩', description: 'Plus state (|0⟩ + |1⟩)/√2' },
      { name: '|-⟩', description: 'Minus state (|0⟩ - |1⟩)/√2' },
      { name: '|+i⟩', description: 'Plus-i state (|0⟩ + i|1⟩)/√2' },
      { name: '|-i⟩', description: 'Minus-i state (|0⟩ - i|1⟩)/√2' },
      { name: '|Φ+⟩', description: 'Bell state Φ+ = (|00⟩ + |11⟩)/√2' },
      { name: '|Φ-⟩', description: 'Bell state Φ- = (|00⟩ - |11⟩)/√2' },
      { name: '|Ψ+⟩', description: 'Bell state Ψ+ = (|01⟩ + |10⟩)/√2' },
      { name: '|Ψ-⟩', description: 'Bell state Ψ- = (|01⟩ - |10⟩)/√2' }
    ]

    return states.map(state => 
      new QuantumTreeItem(
        state.name,
        vscode.TreeItemCollapsibleState.None,
        'quantum-state',
        undefined,
        state.description
      )
    )
  }

  private async getGateItems(): Promise<QuantumTreeItem[]> {
    const gates = [
      { name: 'H', description: 'Hadamard gate - creates superposition', category: 'single-qubit' },
      { name: 'X', description: 'Pauli-X gate - bit flip', category: 'single-qubit' },
      { name: 'Y', description: 'Pauli-Y gate - bit and phase flip', category: 'single-qubit' },
      { name: 'Z', description: 'Pauli-Z gate - phase flip', category: 'single-qubit' },
      { name: 'I', description: 'Identity gate - no operation', category: 'single-qubit' },
      { name: 'S', description: 'Phase gate - π/2 phase shift', category: 'single-qubit' },
      { name: 'T', description: 'T gate - π/4 phase shift', category: 'single-qubit' },
      { name: 'CNOT', description: 'Controlled-NOT gate', category: 'two-qubit' },
      { name: 'CX', description: 'Controlled-X gate (alias for CNOT)', category: 'two-qubit' },
      { name: 'CZ', description: 'Controlled-Z gate', category: 'two-qubit' },
      { name: 'CY', description: 'Controlled-Y gate', category: 'two-qubit' },
      { name: 'SWAP', description: 'SWAP gate - exchanges two qubit states', category: 'two-qubit' },
      { name: 'CCX', description: 'Toffoli gate - controlled-controlled-X', category: 'three-qubit' },
      { name: 'CCZ', description: 'Controlled-controlled-Z gate', category: 'three-qubit' },
      { name: 'RX', description: 'Rotation around X-axis', category: 'rotation' },
      { name: 'RY', description: 'Rotation around Y-axis', category: 'rotation' },
      { name: 'RZ', description: 'Rotation around Z-axis', category: 'rotation' },
      { name: 'U', description: 'Universal single-qubit gate', category: 'universal' }
    ]

    return gates.map(gate => 
      new QuantumTreeItem(
        gate.name,
        vscode.TreeItemCollapsibleState.None,
        'quantum-gate',
        undefined,
        gate.description
      )
    )
  }

  private async getAlgorithmItems(): Promise<QuantumTreeItem[]> {
    const algorithms = [
      { name: 'Grover', description: 'Grover\'s search algorithm for unstructured search' },
      { name: 'Shor', description: 'Shor\'s algorithm for integer factorization' },
      { name: 'QFT', description: 'Quantum Fourier Transform' },
      { name: 'VQE', description: 'Variational Quantum Eigensolver' },
      { name: 'QAOA', description: 'Quantum Approximate Optimization Algorithm' },
      { name: 'Teleportation', description: 'Quantum teleportation protocol' },
      { name: 'Dense Coding', description: 'Quantum dense coding protocol' },
      { name: 'Error Correction', description: 'Quantum error correction codes' }
    ]

    return algorithms.map(algo => 
      new QuantumTreeItem(
        algo.name,
        vscode.TreeItemCollapsibleState.None,
        'quantum-algorithm',
        undefined,
        algo.description
      )
    )
  }

  private async getMetricsItems(): Promise<QuantumTreeItem[]> {
    const editor = vscode.window.activeTextEditor
    if (!editor || !this.isQuantumDocument(editor.document)) {
      return []
    }

    const items: QuantumTreeItem[] = []

    // Show metrics
    items.push(new QuantumTreeItem(
      'Show Detailed Metrics',
      vscode.TreeItemCollapsibleState.None,
      'metrics-detail',
      {
        command: 'quantumExplorer.showMetrics',
        title: 'Show Metrics'
      },
      'View comprehensive quantum metrics'
    ))

    // Performance analysis
    items.push(new QuantumTreeItem(
      'Performance Analysis',
      vscode.TreeItemCollapsibleState.None,
      'performance-analysis',
      {
        command: 'quantum.analyzePerformance',
        title: 'Analyze Performance'
      },
      'Analyze circuit performance'
    ))

    // Benchmark
    items.push(new QuantumTreeItem(
      'Run Benchmark',
      vscode.TreeItemCollapsibleState.None,
      'benchmark',
      {
        command: 'quantum.benchmarkCircuit',
        title: 'Run Benchmark'
      },
      'Benchmark circuit performance'
    ))

    return items
  }

  private isQuantumDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'quantum' || 
           document.languageId === 'quantum-circuit' || 
           document.languageId === 'quantum-algorithm'
  }
}

export class QuantumTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly command?: vscode.Command,
    public readonly tooltip?: string
  ) {
    super(label, collapsibleState)
    this.tooltip = tooltip
    this.command = command
  }
}
