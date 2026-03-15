import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

// Import quantum language providers
import { QuantumLanguageProvider } from '../quantum-language/src/quantum-language-provider'
import { QuantumValidator } from '../quantum-language/src/quantum-validator'
import { QuantumSimulator } from '../quantum-language/src/quantum-simulator'
import { QuantumOptimizer } from '../quantum-language/src/quantum-optimizer'
import { QuantumMetricsProvider } from '../quantum-language/src/quantum-metrics'
import { QuantumStatusBar } from '../quantum-language/src/quantum-status-bar'
import { QuantumExplorer } from '../quantum-language/src/quantum-explorer'

export function activate(context: vscode.ExtensionContext) {
  console.log('ForSure Design System extension with quantum features is now active!')

  // Initialize quantum providers
  const quantumValidator = new QuantumValidator()
  const quantumSimulator = new QuantumSimulator()
  const quantumOptimizer = new QuantumOptimizer()
  const quantumMetricsProvider = new QuantumMetricsProvider()
  const quantumStatusBar = new QuantumStatusBar()
  const quantumExplorer = new QuantumExplorer(context)
  const quantumLanguageProvider = new QuantumLanguageProvider(
    quantumValidator,
    quantumSimulator,
    quantumOptimizer,
    quantumMetricsProvider,
    quantumStatusBar
  )

  // Register quantum commands
  const quantumCommands = [
    vscode.commands.registerCommand('forsure.quantum.validateCircuit', () => 
      quantumLanguageProvider.validateCircuit()),
    vscode.commands.registerCommand('forsure.quantum.simulateCircuit', () => 
      quantumLanguageProvider.simulateCircuit()),
    vscode.commands.registerCommand('forsure.quantum.optimizeCircuit', () => 
      quantumLanguageProvider.optimizeCircuit()),
    vscode.commands.registerCommand('forsure.quantum.generateSuperposition', () => 
      quantumLanguageProvider.generateSuperposition()),
    vscode.commands.registerCommand('forsure.quantum.createEntanglement', () => 
      quantumLanguageProvider.createEntanglement()),
    vscode.commands.registerCommand('forsure.quantum.performMeasurement', () => 
      quantumLanguageProvider.performMeasurement()),
    vscode.commands.registerCommand('forsure.quantum.showQuantumMetrics', () => 
      quantumLanguageProvider.showQuantumMetrics()),
    vscode.commands.registerCommand('forsure.quantum.toggleQuantumMode', () => 
      quantumLanguageProvider.toggleQuantumMode()),
    vscode.commands.registerCommand('forsure.quantum.generateDocumentation', () => 
      quantumLanguageProvider.generateDocumentation()),
    vscode.commands.registerCommand('forsure.quantum.exportCircuit', () => 
      quantumLanguageProvider.exportCircuit()),
    vscode.commands.registerCommand('forsure.quantum.importCircuit', () => 
      quantumLanguageProvider.importCircuit()),
    vscode.commands.registerCommand('forsure.quantum.benchmarkCircuit', () => 
      quantumLanguageProvider.benchmarkCircuit()),
    vscode.commands.registerCommand('forsure.quantum.visualizeCircuit', () => 
      quantumLanguageProvider.visualizeCircuit()),
    vscode.commands.registerCommand('forsure.quantum.analyzePerformance', () => 
      quantumLanguageProvider.analyzePerformance()),
    vscode.commands.registerCommand('forsure.quantum.optimizePerformance', () => 
      quantumLanguageProvider.optimizePerformance()),
    vscode.commands.registerCommand('forsure.quantum.runQuantumTests', () => 
      quantumLanguageProvider.runQuantumTests()),
    vscode.commands.registerCommand('forsure.quantum.debugCircuit', () => 
      quantumLanguageProvider.debugCircuit()),
    vscode.commands.registerCommand('forsure.quantum.profileCircuit', () => 
      quantumLanguageProvider.profileCircuit())
  ]

  // Register existing commands
  const generateComponentCommand = vscode.commands.registerCommand(
    'forsure.generateComponent',
    () => generateComponent()
  )

  const generateHookCommand = vscode.commands.registerCommand(
    'forsure.generateHook',
    () => generateHook()
  )

  const openDocsCommand = vscode.commands.registerCommand(
    'forsure.openDocs',
    () => openDocumentation()
  )

  const auditDesignSystemCommand = vscode.commands.registerCommand(
    'forsure.auditDesignSystem',
    () => auditDesignSystem()
  )

  const showTokensCommand = vscode.commands.registerCommand(
    'forsure.showTokens',
    () => showDesignTokens()
  )

  // Register completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'typescript', language: 'typescriptreact' },
    new ForSureCompletionProvider(),
    '.'
  )

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    { language: 'typescript', language: 'typescriptreact' },
    new ForSureHoverProvider()
  )

  // Register diagnostic provider
  const diagnosticProvider = vscode.languages.registerDiagnosticProvider(
    { language: 'typescript', language: 'typescriptreact' },
    new ForSureDiagnosticProvider()
  )

  // Register quantum language providers
  const quantumCompletionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'quantum', language: 'quantum-circuit', language: 'quantum-algorithm' },
    quantumLanguageProvider,
    '.'
  )

  const quantumHoverProvider = vscode.languages.registerHoverProvider(
    { language: 'quantum', language: 'quantum-circuit', language: 'quantum-algorithm' },
    quantumLanguageProvider
  )

  const quantumDiagnosticProvider = vscode.languages.registerDiagnosticProvider(
    { language: 'quantum', language: 'quantum-circuit', language: 'quantum-algorithm' },
    quantumLanguageProvider
  )

  context.subscriptions.push(
    ...quantumCommands,
    quantumStatusBar,
    quantumExplorer,
    quantumCompletionProvider,
    quantumHoverProvider,
    quantumDiagnosticProvider,
    generateComponentCommand,
    generateHookCommand,
    openDocsCommand,
    auditDesignSystemCommand,
    showTokensCommand,
    completionProvider,
    hoverProvider,
    diagnosticProvider
  )
}

class ForSureCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const linePrefix = document.lineAt(position).text.substring(0, position.character)
    
    // Component completions
    const components = [
      'Button', 'Card', 'Badge', 'Input', 'Heading', 'Link', 'SkipLink',
      'Landmark', 'FocusIndicator', 'LiveRegion', 'Description', 'ErrorMessage'
    ]

    // Quantum completions
    const quantumComponents = [
      'QuantumCircuit', 'QuantumSimulator', 'QuantumOptimizer', 'QuantumVisualizer',
      'QuantumState', 'QuantumGate', 'QuantumMeasurement', 'QuantumEntanglement'
    ]

    const completionItems: vscode.CompletionItem[] = []

    components.forEach(component => {
      const item = new vscode.CompletionItem(component, vscode.CompletionItemKind.Class)
      item.insertText = new vscode.SnippetString(
        `import { ${component} } from '@/components/ui/forsure-${component.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure ${component} component`)
      item.detail = `ForSure Design System Component`
      completionItems.push(item)
    })

    quantumComponents.forEach(component => {
      const item = new vscode.CompletionItem(component, vscode.CompletionItemKind.Class)
      item.insertText = new vscode.SnippetString(
        `import { ${component} } from '@/components/quantum/${component.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure Quantum ${component} component`)
      item.detail = `ForSure Quantum Design System Component`
      completionItems.push(item)
    })

    // Hook completions
    const hooks = ['useResponsive', 'useAccessibility', 'useKeyboardNavigation', 'useMediaQuery', 'useBreakpoint']
    
    // Quantum hook completions
    const quantumHooks = ['useQuantumCircuit', 'useQuantumSimulation', 'useQuantumState', 'useQuantumEntanglement']
    
    hooks.forEach(hook => {
      const item = new vscode.CompletionItem(hook, vscode.CompletionItemKind.Function)
      item.insertText = new vscode.SnippetString(
        `import { ${hook} } from '@/hooks/${hook.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure ${hook} hook`)
      item.detail = `ForSure Design System Hook`
      completionItems.push(item)
    })

    quantumHooks.forEach(hook => {
      const item = new vscode.CompletionItem(hook, vscode.CompletionItemKind.Function)
      item.insertText = new vscode.SnippetString(
        `import { ${hook} } from '@/hooks/quantum/${hook.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure Quantum ${hook} hook`)
      item.detail = `ForSure Quantum Design System Hook`
      completionItems.push(item)
    })

    // Utility completions
    const utilities = ['cn', 'getColorValue', 'getContrastRatio', 'getAccessibleColor', 'debounce', 'throttle']
    
    // Quantum utility completions
    const quantumUtilities = ['createQuantumState', 'applyGate', 'measureQubit', 'createEntanglement', 'simulateCircuit']
    
    utilities.forEach(utility => {
      const item = new vscode.CompletionItem(utility, vscode.CompletionItemKind.Function)
      item.insertText = new vscode.SnippetString(
        `import { ${utility} } from '@/lib/ui-utils';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure ${utility} utility`)
      item.detail = `ForSure Design System Utility`
      completionItems.push(item)
    })

    quantumUtilities.forEach(utility => {
      const item = new vscode.CompletionItem(utility, vscode.CompletionItemKind.Function)
      item.insertText = new vscode.SnippetString(
        `import { ${utility} } from '@/lib/quantum-utils';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`ForSure Quantum ${utility} utility`)
      item.detail = `ForSure Quantum Design System Utility`
      completionItems.push(item)
    })

    return completionItems
  }
}

class ForSureHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return undefined

    const word = document.getText(range)
    
    // Component documentation
    const componentDocs: Record<string, string> = {
      'Button': `# ForSure Button

A versatile button component with multiple variants and sizes.

## Props
- \`variant\`: 'default' | 'brand' | 'outline' | 'ghost' | 'link' | 'destructive'
- \`size\`: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
- \`loading\`: boolean
- \`disabled\`: boolean
- \`leftIcon\`: ReactNode
- \`rightIcon\`: ReactNode

## Example
\`\`\`tsx
<Button variant="brand" size="lg">Click me</Button>
\`\`\``,
      
      'Card': `# ForSure Card

Flexible card component for grouping related content.

## Props
- \`variant\`: 'default' | 'elevated' | 'outlined' | 'ghost' | 'brand'
- \`padding\`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- \`interactive\`: boolean
- \`fullWidth\`: boolean

## Example
\`\`\`tsx
<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
\`\`\``,
    }

    if (componentDocs[word]) {
      return new vscode.Hover(new vscode.MarkdownString(componentDocs[word]))
    }

    return undefined
  }
}

class ForSureDiagnosticProvider {
  provideDiagnostics(
    document: vscode.TextDocument
  ): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = []
    const text = document.getText()

    // Check for accessibility issues
    if (text.includes('<button') && !text.includes('aria-label') && !text.includes('aria-labelledby')) {
      const regex = /<button[^>]*>/g
      let match
      while ((match = regex.exec(text)) !== null) {
        const index = match.index
        const line = document.positionAt(index).line
        const range = new vscode.Range(line, 0, line, match[0].length)
        
        const diagnostic = new vscode.Diagnostic(
          range,
          'Button should have an accessible name (aria-label or aria-labelledby)',
          vscode.DiagnosticSeverity.Warning
        )
        diagnostic.code = 'a11y-button-name'
        diagnostic.source = 'ForSure Design System'
        diagnostics.push(diagnostic)
      }
    }

    // Check for missing alt text on images
    if (text.includes('<img') && !text.includes('alt=')) {
      const regex = /<img[^>]*>/g
      let match
      while ((match = regex.exec(text)) !== null) {
        const index = match.index
        const line = document.positionAt(index).line
        const range = new vscode.Range(line, 0, line, match[0].length)
        
        const diagnostic = new vscode.Diagnostic(
          range,
          'Image should have alt text for accessibility',
          vscode.DiagnosticSeverity.Warning
        )
        diagnostic.code = 'a11y-img-alt'
        diagnostic.source = 'ForSure Design System'
        diagnostics.push(diagnostic)
      }
    }

    return diagnostics
  }
}

async function generateComponent() {
  const name = await vscode.window.showInputBox({
    prompt: 'Enter component name',
    placeHolder: 'my-component'
  })

  if (!name) return

  const template = await vscode.window.showQuickPick([
    'Basic Component',
    'Form Component',
    'Layout Component',
    'Data Display Component'
  ], {
    placeHolder: 'Choose component template'
  })

  if (!template) return

  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath
  const componentPath = path.join(workspaceRoot, 'components/ui', `forsure-${name}.tsx`)

  // Generate component file
  const templateMap: Record<string, string> = {
    'Basic Component': 'basic',
    'Form Component': 'form',
    'Layout Component': 'layout',
    'Data Display Component': 'data'
  }

  const command = `forsure gen component -n ${name} -t ${templateMap[template]} --storybook --test --typescript`
  
  const terminal = vscode.window.createTerminal({
    name: 'ForSure CLI',
    cwd: workspaceRoot
  })
  
  terminal.sendText(command)
  terminal.show()
}

async function generateHook() {
  const name = await vscode.window.showInputBox({
    prompt: 'Enter hook name',
    placeHolder: 'useMyHook'
  })

  if (!name) return

  const template = await vscode.window.showQuickPick([
    'Basic Hook',
    'API Hook',
    'Form Hook',
    'Storage Hook'
  ], {
    placeHolder: 'Choose hook template'
  })

  if (!template) return

  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath
  
  const templateMap: Record<string, string> = {
    'Basic Hook': 'basic',
    'API Hook': 'api',
    'Form Hook': 'form',
    'Storage Hook': 'storage'
  }

  const command = `forsure gen hook -n ${name} -t ${templateMap[template]} --test --typescript`
  
  const terminal = vscode.window.createTerminal({
    name: 'ForSure CLI',
    cwd: workspaceRoot
  })
  
  terminal.sendText(command)
  terminal.show()
}

async function openDocumentation() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath
  const docsPath = path.join(workspaceRoot, 'app', 'interactive-docs', 'page.tsx')
  
  if (fs.existsSync(docsPath)) {
    const uri = vscode.Uri.file(docsPath)
    await vscode.window.showTextDocument(uri)
  } else {
    vscode.env.openExternal(vscode.Uri.parse('https://design-system.forsure.com'))
  }
}

async function auditDesignSystem() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath
  
  const terminal = vscode.window.createTerminal({
    name: 'ForSure CLI',
    cwd: workspaceRoot
  })
  
  terminal.sendText('forsure audit --report')
  terminal.show()
}

async function showDesignTokens() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder found')
    return
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath
  const tokensPath = path.join(workspaceRoot, 'lib', 'design-tokens.ts')
  
  if (fs.existsSync(tokensPath)) {
    const uri = vscode.Uri.file(tokensPath)
    await vscode.window.showTextDocument(uri)
  } else {
    vscode.window.showErrorMessage('Design tokens file not found')
  }
}

export function deactivate() {
  console.log('ForSure Design System extension with quantum features deactivated')
}
