import * as vscode from 'vscode'

export class QuantumIntelliSenseProvider implements 
  vscode.CompletionItemProvider,
  vscode.HoverProvider,
  vscode.SignatureHelpProvider,
  vscode.DefinitionProvider,
  vscode.ReferenceProvider,
  vscode.DocumentSymbolProvider {

  private quantumFunctions: Map<string, vscode.CompletionItem> = new Map()
  private quantumGates: Map<string, vscode.CompletionItem> = new Map()
  private quantumStates: Map<string, vscode.CompletionItem> = new Map()
  private quantumAlgorithms: Map<string, vscode.CompletionItem> = new Map()

  constructor() {
    this.initializeQuantumFunctions()
    this.initializeQuantumGates()
    this.initializeQuantumStates()
    this.initializeQuantumAlgorithms()
  }

  // Completion Item Provider
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.CompletionItem[] {
    const completionItems: vscode.CompletionItem[] = []

    // Add quantum functions
    this.quantumFunctions.forEach(item => completionItems.push(item))

    // Add quantum gates
    this.quantumGates.forEach(item => completionItems.push(item))

    // Add quantum states
    this.quantumStates.forEach(item => completionItems.push(item))

    // Add quantum algorithms
    this.quantumAlgorithms.forEach(item => completionItems.push(item))

    // Add contextual completions
    const line = document.lineAt(position).text
    const linePrefix = line.substring(0, position.character)

    if (linePrefix.includes('create')) {
      completionItems.push(...this.getCreationCompletions())
    }

    if (linePrefix.includes('apply')) {
      completionItems.push(...this.getApplicationCompletions())
    }

    if (linePrefix.includes('measure')) {
      completionItems.push(...this.getMeasurementCompletions())
    }

    return completionItems
  }

  // Hover Provider
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Hover | undefined {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return undefined

    const word = document.getText(range)

    // Check for quantum functions
    if (this.quantumFunctions.has(word)) {
      const item = this.quantumFunctions.get(word)!
      return new vscode.Hover(
        new vscode.MarkdownString(`### ${item.label}\n\n${item.documentation}\n\n**Parameters:** ${item.detail || 'None'}`)
      )
    }

    // Check for quantum gates
    if (this.quantumGates.has(word)) {
      const item = this.quantumGates.get(word)!
      return new vscode.Hover(
        new vscode.MarkdownString(`### ${item.label}\n\n${item.documentation}\n\n**Matrix:** ${item.detail || 'N/A'}`)
      )
    }

    // Check for quantum states
    if (this.quantumStates.has(word)) {
      const item = this.quantumStates.get(word)!
      return new vscode.Hover(
        new vscode.MarkdownString(`### ${item.label}\n\n${item.documentation}`)
      )
    }

    return undefined
  }

  // Signature Help Provider
  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.SignatureHelpContext
  ): vscode.SignatureHelp | undefined {
    const line = document.lineAt(position).text
    const linePrefix = line.substring(0, position.character)

    // Check for function calls
    const functionMatch = linePrefix.match(/(\w+)\s*\(/)
    if (!functionMatch) return undefined

    const functionName = functionMatch[1]
    const signature = this.getFunctionSignature(functionName)

    if (signature) {
      return {
        signatures: [signature],
        activeSignature: 0,
        activeParameter: this.getActiveParameter(linePrefix)
      }
    }

    return undefined
  }

  // Definition Provider
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Location | undefined {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return undefined

    const word = document.getText(range)

    // For now, return the current position as definition
    // In a real implementation, this would navigate to the actual definition
    return new vscode.Location(document.uri, range)
  }

  // Reference Provider
  provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): vscode.Location[] {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return []

    const word = document.getText(range)
    const references: vscode.Location[] = []

    // Find all occurrences of the word in the document
    const text = document.getText()
    const lines = text.split('\n')

    lines.forEach((line, index) => {
      const matches = line.matchAll(new RegExp(word, 'g'))
      matches.forEach(match => {
        if (match.index !== undefined) {
          const startPos = new vscode.Position(index, match.index)
          const endPos = new vscode.Position(index, match.index + word.length)
          references.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)))
        }
      })
    })

    return references
  }

  // Document Symbol Provider
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.DocumentSymbol[] {
    const symbols: vscode.DocumentSymbol[] = []
    const text = document.getText()

    // Find quantum functions
    const functionMatches = text.matchAll(/function\s+(\w+)\s*\([^)]*\)\s*\{/g)
    functionMatches.forEach(match => {
      const name = match[1]
      const index = match.index!
      const position = document.positionAt(index)
      
      const symbol = new vscode.DocumentSymbol(
        name,
        'Quantum Function',
        vscode.SymbolKind.Function,
        new vscode.Range(position, position),
        new vscode.Range(position, position)
      )
      symbols.push(symbol)
    })

    // Find quantum circuits
    const circuitMatches = text.matchAll(/quantumCircuit\s*\(\s*\{[^}]*\}\s*\)/g)
    circuitMatches.forEach(match => {
      const index = match.index!
      const position = document.positionAt(index)
      
      const symbol = new vscode.DocumentSymbol(
        'Quantum Circuit',
        'Quantum Circuit Definition',
        vscode.SymbolKind.Class,
        new vscode.Range(position, position),
        new vscode.Range(position, position)
      )
      symbols.push(symbol)
    })

    return symbols
  }

  private initializeQuantumFunctions() {
    const functions = [
      {
        name: 'createQuantumState',
        documentation: 'Creates a quantum state with specified parameters',
        detail: 'qubits: number, options: QuantumStateOptions',
        insertText: 'createQuantumState(${1:qubits}, { amplitudes: [${2:amplitudes}], phase: ${3:phase}, coherence: ${4:coherence} })'
      },
      {
        name: 'createSuperposition',
        documentation: 'Creates a quantum superposition state',
        detail: 'states: string[], options: SuperpositionOptions',
        insertText: 'createSuperposition([${1:states}], { amplitudes: [${2:amplitudes}], normalization: ${3:1.0} })'
      },
      {
        name: 'createEntanglement',
        documentation: 'Creates quantum entanglement between qubits',
        detail: 'qubits: number[], options: EntanglementOptions',
        insertText: 'createEntanglement([${1:qubits}], { bellState: \'${2:Φ+}\', maximallyEntangled: ${3:true} })'
      },
      {
        name: 'performMeasurement',
        documentation: 'Performs quantum measurement on specified state',
        detail: 'stateId: string, options: MeasurementOptions',
        insertText: 'performMeasurement(\'${1:stateId}\', { basis: \'${2:computational}\', collapse: ${3:true} })'
      },
      {
        name: 'applyGate',
        documentation: 'Applies a quantum gate to specified qubit(s)',
        detail: 'gate: string, target: number | { control: number, target: number }, options?: GateOptions',
        insertText: 'applyGate(\'${1:H}\', ${2:target}, { phase: ${3:0}, amplitude: ${4:1.0} })'
      },
      {
        name: 'quantumCircuit',
        documentation: 'Creates a quantum circuit with specified configuration',
        detail: 'config: CircuitConfig',
        insertText: 'quantumCircuit({ name: \'${1:circuitName}\', qubits: ${2:2}, gates: [${3:gates}] })'
      },
      {
        name: 'simulateCircuit',
        documentation: 'Simulates execution of a quantum circuit',
        detail: 'circuit: QuantumCircuit, shots?: number',
        insertText: 'simulateCircuit(${1:circuit}, ${2:shots})'
      },
      {
        name: 'optimizeCircuit',
        documentation: 'Optimizes a quantum circuit for better performance',
        detail: 'circuit: QuantumCircuit, options?: OptimizationOptions',
        insertText: 'optimizeCircuit(${1:circuit}, { depth: ${2:true}, fidelity: ${3:true} })'
      },
      {
        name: 'validateCircuit',
        documentation: 'Validates quantum circuit for correctness and feasibility',
        detail: 'circuit: QuantumCircuit',
        insertText: 'validateCircuit(${1:circuit})'
      },
      {
        name: 'measureQubit',
        documentation: 'Measures a single qubit in specified basis',
        detail: 'qubit: number, basis?: string',
        insertText: 'measureQubit(${1:qubit}, \'${2:computational}\')'
      },
      {
        name: 'resetQubit',
        documentation: 'Resets a qubit to |0⟩ state',
        detail: 'qubit: number',
        insertText: 'resetQubit(${1:qubit})'
      },
      {
        name: 'initializeState',
        documentation: 'Initializes qubits to specified state',
        detail: 'qubits: number[], state?: string',
        insertText: 'initializeState([${1:qubits}], \'${2:|0⟩}\')'
      },
      {
        name: 'entangleQubits',
        documentation: 'Creates entanglement between specified qubits',
        detail: 'qubits: number[], options?: EntanglementOptions',
        insertText: 'entangleQubits([${1:qubits}], { maximallyEntangled: ${2:true} })'
      },
      {
        name: 'swapQubits',
        documentation: 'Swaps the states of two qubits',
        detail: 'qubit1: number, qubit2: number',
        insertText: 'swapQubits(${1:qubit1}, ${2:qubit2})'
      },
      {
        name: 'controlledGate',
        documentation: 'Applies a controlled quantum gate',
        detail: 'gate: string, control: number, target: number, options?: GateOptions',
        insertText: 'controlledGate(\'${1:CNOT}\', ${2:control}, ${3:target}, { phase: ${4:0} })'
      }
    ]

    functions.forEach(func => {
      const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function)
      item.documentation = new vscode.MarkdownString(func.documentation)
      item.detail = func.detail
      item.insertText = new vscode.SnippetString(func.insertText)
      this.quantumFunctions.set(func.name, item)
    })
  }

  private initializeQuantumGates() {
    const gates = [
      {
        name: 'H',
        documentation: 'Hadamard gate - creates superposition',
        detail: 'Matrix: 1/√2 * [[1, 1], [1, -1]]',
        insertText: 'H'
      },
      {
        name: 'X',
        documentation: 'Pauli-X gate - bit flip',
        detail: 'Matrix: [[0, 1], [1, 0]]',
        insertText: 'X'
      },
      {
        name: 'Y',
        documentation: 'Pauli-Y gate - bit and phase flip',
        detail: 'Matrix: [[0, -i], [i, 0]]',
        insertText: 'Y'
      },
      {
        name: 'Z',
        documentation: 'Pauli-Z gate - phase flip',
        detail: 'Matrix: [[1, 0], [0, -1]]',
        insertText: 'Z'
      },
      {
        name: 'I',
        documentation: 'Identity gate - no operation',
        detail: 'Matrix: [[1, 0], [0, 1]]',
        insertText: 'I'
      },
      {
        name: 'S',
        documentation: 'Phase gate - π/2 phase shift',
        detail: 'Matrix: [[1, 0], [0, i]]',
        insertText: 'S'
      },
      {
        name: 'T',
        documentation: 'T gate - π/4 phase shift',
        detail: 'Matrix: [[1, 0], [0, exp(iπ/4)]]',
        insertText: 'T'
      },
      {
        name: 'CNOT',
        documentation: 'Controlled-NOT gate',
        detail: 'Controlled bit flip',
        insertText: 'CNOT'
      },
      {
        name: 'CX',
        documentation: 'Controlled-X gate (alias for CNOT)',
        detail: 'Controlled bit flip',
        insertText: 'CX'
      },
      {
        name: 'CZ',
        documentation: 'Controlled-Z gate',
        detail: 'Controlled phase flip',
        insertText: 'CZ'
      },
      {
        name: 'CY',
        documentation: 'Controlled-Y gate',
        detail: 'Controlled bit and phase flip',
        insertText: 'CY'
      },
      {
        name: 'SWAP',
        documentation: 'SWAP gate - exchanges two qubit states',
        detail: 'State exchange',
        insertText: 'SWAP'
      },
      {
        name: 'CCX',
        documentation: 'Toffoli gate - controlled-controlled-X',
        detail: 'Triple-controlled bit flip',
        insertText: 'CCX'
      },
      {
        name: 'CCZ',
        documentation: 'Controlled-controlled-Z gate',
        detail: 'Triple-controlled phase flip',
        insertText: 'CCZ'
      },
      {
        name: 'RX',
        documentation: 'Rotation around X-axis',
        detail: 'exp(-iθX/2)',
        insertText: 'RX(θ)'
      },
      {
        name: 'RY',
        documentation: 'Rotation around Y-axis',
        detail: 'exp(-iθY/2)',
        insertText: 'RY(θ)'
      },
      {
        name: 'RZ',
        documentation: 'Rotation around Z-axis',
        detail: 'exp(-iθZ/2)',
        insertText: 'RZ(θ)'
      },
      {
        name: 'U',
        documentation: 'Universal single-qubit gate',
        detail: 'U(θ, φ, λ)',
        insertText: 'U(θ, φ, λ)'
      },
      {
        name: 'CU',
        documentation: 'Controlled universal gate',
        detail: 'Controlled-U(θ, φ, λ)',
        insertText: 'CU(θ, φ, λ)'
      },
      {
        name: 'CH',
        documentation: 'Controlled Hadamard gate',
        detail: 'Controlled superposition',
        insertText: 'CH'
      },
      {
        name: 'CS',
        documentation: 'Controlled phase gate',
        detail: 'Controlled π/2 phase shift',
        insertText: 'CS'
      },
      {
        name: 'CT',
        documentation: 'Controlled T gate',
        detail: 'Controlled π/4 phase shift',
        insertText: 'CT'
      }
    ]

    gates.forEach(gate => {
      const item = new vscode.CompletionItem(gate.name, vscode.CompletionItemKind.Keyword)
      item.documentation = new vscode.MarkdownString(gate.documentation)
      item.detail = gate.detail
      item.insertText = gate.insertText
      this.quantumGates.set(gate.name, item)
    })
  }

  private initializeQuantumStates() {
    const states = [
      {
        name: '|0⟩',
        documentation: 'Computational basis state |0⟩',
        insertText: '|0⟩'
      },
      {
        name: '|1⟩',
        documentation: 'Computational basis state |1⟩',
        insertText: '|1⟩'
      },
      {
        name: '|+⟩',
        documentation: 'Plus state (|0⟩ + |1⟩)/√2',
        insertText: '|+⟩'
      },
      {
        name: '|-⟩',
        documentation: 'Minus state (|0⟩ - |1⟩)/√2',
        insertText: '|-⟩'
      },
      {
        name: '|+i⟩',
        documentation: 'Plus-i state (|0⟩ + i|1⟩)/√2',
        insertText: '|+i⟩'
      },
      {
        name: '|-i⟩',
        documentation: 'Minus-i state (|0⟩ - i|1⟩)/√2',
        insertText: '|-i⟩'
      },
      {
        name: '|ψ⟩',
        documentation: 'General quantum state',
        insertText: '|ψ⟩'
      },
      {
        name: '|φ⟩',
        documentation: 'General quantum state',
        insertText: '|φ⟩'
      },
      {
        name: '|θ⟩',
        documentation: 'Parameterized quantum state',
        insertText: '|θ⟩'
      },
      {
        name: '|Φ+⟩',
        documentation: 'Bell state Φ+ = (|00⟩ + |11⟩)/√2',
        insertText: '|Φ+⟩'
      },
      {
        name: '|Φ-⟩',
        documentation: 'Bell state Φ- = (|00⟩ - |11⟩)/√2',
        insertText: '|Φ-⟩'
      },
      {
        name: '|Ψ+⟩',
        documentation: 'Bell state Ψ+ = (|01⟩ + |10⟩)/√2',
        insertText: '|Ψ+⟩'
      },
      {
        name: '|Ψ-⟩',
        documentation: 'Bell state Ψ- = (|01⟩ - |10⟩)/√2',
        insertText: '|Ψ-⟩'
      }
    ]

    states.forEach(state => {
      const item = new vscode.CompletionItem(state.name, vscode.CompletionItemKind.Constant)
      item.documentation = new vscode.MarkdownString(state.documentation)
      item.insertText = state.insertText
      this.quantumStates.set(state.name, item)
    })
  }

  private initializeQuantumAlgorithms() {
    const algorithms = [
      {
        name: 'grover',
        documentation: 'Grover\'s search algorithm for unstructured search',
        insertText: 'groversAlgorithm(oracle, n, iterations)'
      },
      {
        name: 'shor',
        documentation: 'Shor\'s algorithm for integer factorization',
        insertText: 'shorsAlgorithm(N, a)'
      },
      {
        name: 'qft',
        documentation: 'Quantum Fourier Transform',
        insertText: 'quantumFourierTransform(qubits)'
      },
      {
        name: 'vqe',
        documentation: 'Variational Quantum Eigensolver',
        insertText: 'variationalQuantumEigensolver(hamiltonian, ansatz)'
      },
      {
        name: 'qaoa',
        documentation: 'Quantum Approximate Optimization Algorithm',
        insertText: 'quantumApproximateOptimization(costFunction, p)'
      },
      {
        name: 'teleportation',
        documentation: 'Quantum teleportation protocol',
        insertText: 'quantumTeleportation(state, aliceQubits, bobQubit)'
      },
      {
        name: 'dense-coding',
        documentation: 'Quantum dense coding protocol',
        insertText: 'denseCoding(message, entangledQubits)'
      },
      {
        name: 'error-correction',
        documentation: 'Quantum error correction codes',
        insertText: 'quantumErrorCorrection(dataQubits, ancillaQubits, code)'
      }
    ]

    algorithms.forEach(algo => {
      const item = new vscode.CompletionItem(algo.name, vscode.CompletionItemKind.Method)
      item.documentation = new vscode.MarkdownString(algo.documentation)
      item.insertText = new vscode.SnippetString(algo.insertText)
      this.quantumAlgorithms.set(algo.name, item)
    })
  }

  private getCreationCompletions(): vscode.CompletionItem[] {
    return [
      new vscode.CompletionItem('createQuantumState', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('createSuperposition', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('createEntanglement', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('quantumCircuit', vscode.CompletionItemKind.Class),
      new vscode.CompletionItem('initializeState', vscode.CompletionItemKind.Function)
    ]
  }

  private getApplicationCompletions(): vscode.CompletionItem[] {
    return [
      new vscode.CompletionItem('applyGate', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('controlledGate', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('entangleQubits', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('swapQubits', vscode.CompletionItemKind.Function)
    ]
  }

  private getMeasurementCompletions(): vscode.CompletionItem[] {
    return [
      new vscode.CompletionItem('performMeasurement', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('measureQubit', vscode.CompletionItemKind.Function),
      new vscode.CompletionItem('measureAll', vscode.CompletionItemKind.Function)
    ]
  }

  private getFunctionSignature(functionName: string): vscode.SignatureInformation | undefined {
    const signatures: Record<string, vscode.SignatureInformation> = {
      'createQuantumState': new vscode.SignatureInformation(
        'createQuantumState(qubits, options)',
        'Creates a quantum state with specified parameters',
        [
          new vscode.ParameterInformation(0, 'qubits: number - Number of qubits in the state'),
          new vscode.ParameterInformation(1, 'options: QuantumStateOptions - Configuration options')
        ]
      ),
      'createSuperposition': new vscode.SignatureInformation(
        'createSuperposition(states, options)',
        'Creates a quantum superposition state',
        [
          new vscode.ParameterInformation(0, 'states: string[] - Array of basis states'),
          new vscode.ParameterInformation(1, 'options: SuperpositionOptions - Configuration options')
        ]
      ),
      'createEntanglement': new vscode.SignatureInformation(
        'createEntanglement(qubits, options)',
        'Creates quantum entanglement between qubits',
        [
          new vscode.ParameterInformation(0, 'qubits: number[] - Array of qubit indices'),
          new vscode.ParameterInformation(1, 'options: EntanglementOptions - Configuration options')
        ]
      ),
      'performMeasurement': new vscode.SignatureInformation(
        'performMeasurement(stateId, options)',
        'Performs quantum measurement on specified state',
        [
          new vscode.ParameterInformation(0, 'stateId: string - Identifier of the state to measure'),
          new vscode.ParameterInformation(1, 'options: MeasurementOptions - Measurement configuration')
        ]
      ),
      'applyGate': new vscode.SignatureInformation(
        'applyGate(gate, target, options?)',
        'Applies a quantum gate to specified qubit(s)',
        [
          new vscode.ParameterInformation(0, 'gate: string - Gate name (H, X, Y, Z, CNOT, etc.)'),
          new vscode.ParameterInformation(1, 'target: number | { control: number, target: number } - Target qubit(s)'),
          new vscode.ParameterInformation(2, 'options?: GateOptions - Optional gate parameters')
        ]
      )
    }

    return signatures[functionName]
  }

  private getActiveParameter(linePrefix: string): number {
    const openParens = (linePrefix.match(/\(/g) || []).length
    const closeParens = (linePrefix.match(/\)/g) || []).length
    const commas = (linePrefix.match(/,/g) || []).length

    return openParens - closeParens > 0 ? commas : 0
  }

  public updateConfiguration(config: vscode.WorkspaceConfiguration) {
    // Update provider based on configuration changes
    const enableIntelliSense = config.get('enableIntelliSense', true)
    const autoCompleteFunctions = config.get('autoCompleteQuantumFunctions', true)

    if (!enableIntelliSense) {
      this.quantumFunctions.clear()
      this.quantumGates.clear()
      this.quantumStates.clear()
      this.quantumAlgorithms.clear()
    } else {
      this.initializeQuantumFunctions()
      this.initializeQuantumGates()
      this.initializeQuantumStates()
      this.initializeQuantumAlgorithms()
    }
  }

  public dispose() {
    this.quantumFunctions.clear()
    this.quantumGates.clear()
    this.quantumStates.clear()
    this.quantumAlgorithms.clear()
  }
}
