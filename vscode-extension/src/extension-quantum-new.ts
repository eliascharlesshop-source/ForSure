import * as vscode from 'vscode'
import { QuantumProvider } from './quantum-provider'
import { QuantumLivePreviewManager } from './quantum-live-preview'
import { QuantumIntelliSenseProvider } from './quantum-intellisense'
import { QuantumCodeGenerator } from './quantum-code-generator'
import { QuantumDiagnosticsProvider } from './quantum-diagnostics'
import { QuantumPerformanceMonitor } from './quantum-performance'
import { QuantumUsageTracker } from './quantum-usage'
import { QuantumHoverProvider } from './quantum-hover'
import { QuantumDashboardWebview } from './quantum-dashboard'
import { QuantumRefactoringProvider } from './quantum-refactoring'
import { QuantumTestingIntegration } from './quantum-testing'
import { QuantumStatusBarManager } from './quantum-status-bar'
import { QuantumActivityBarManager } from './quantum-activity-bar'
import { QuantumContextMenus } from './quantum-context-menus'
import { QuantumWorkspaceEvents } from './quantum-workspace-events'
import { QuantumConfigWatcher } from './quantum-config-watcher'

let quantumProvider: QuantumProvider
let livePreviewManager: QuantumLivePreviewManager
let intelliSenseProvider: QuantumIntelliSenseProvider
let codeGenerator: QuantumCodeGenerator
let diagnosticsProvider: QuantumDiagnosticsProvider
let performanceMonitor: QuantumPerformanceMonitor
let usageTracker: QuantumUsageTracker
let hoverProvider: QuantumHoverProvider
let dashboardWebview: QuantumDashboardWebview
let refactoringProvider: QuantumRefactoringProvider
let testingIntegration: QuantumTestingIntegration
let statusBarManager: QuantumStatusBarManager
let activityBarManager: QuantumActivityBarManager
let contextMenus: QuantumContextMenus
let workspaceEvents: QuantumWorkspaceEvents
let configWatcher: QuantumConfigWatcher

export function activate(context: vscode.ExtensionContext) {
  console.log('ForSure Quantum Extension is now active!')

  // Initialize quantum provider
  quantumProvider = new QuantumProvider(context)
  context.subscriptions.push(quantumProvider)

  // Initialize live preview manager
  livePreviewManager = new QuantumLivePreviewManager(context, quantumProvider)
  context.subscriptions.push(livePreviewManager)

  // Initialize IntelliSense provider
  intelliSenseProvider = new QuantumIntelliSenseProvider(quantumProvider)
  context.subscriptions.push(intelliSenseProvider)

  // Initialize code generator
  codeGenerator = new QuantumCodeGenerator(quantumProvider)
  context.subscriptions.push(codeGenerator)

  // Initialize diagnostics provider
  diagnosticsProvider = new QuantumDiagnosticsProvider(quantumProvider)
  context.subscriptions.push(diagnosticsProvider)

  // Initialize performance monitor
  performanceMonitor = new QuantumPerformanceMonitor()
  context.subscriptions.push(performanceMonitor)

  // Initialize usage tracker
  usageTracker = new QuantumUsageTracker(context)
  context.subscriptions.push(usageTracker)

  // Initialize hover provider
  hoverProvider = new QuantumHoverProvider(quantumProvider)
  context.subscriptions.push(hoverProvider)

  // Initialize dashboard webview
  dashboardWebview = new QuantumDashboardWebview(context, quantumProvider)
  context.subscriptions.push(dashboardWebview)

  // Initialize refactoring provider
  refactoringProvider = new QuantumRefactoringProvider(quantumProvider)
  context.subscriptions.push(refactoringProvider)

  // Initialize testing integration
  testingIntegration = new QuantumTestingIntegration(quantumProvider)
  context.subscriptions.push(testingIntegration)

  // Initialize status bar manager
  statusBarManager = new QuantumStatusBarManager()
  context.subscriptions.push(statusBarManager)

  // Initialize activity bar manager
  activityBarManager = new QuantumActivityBarManager(context)
  context.subscriptions.push(activityBarManager)

  // Initialize context menus
  contextMenus = new QuantumContextMenus(quantumProvider)
  context.subscriptions.push(contextMenus)

  // Initialize workspace events
  workspaceEvents = new QuantumWorkspaceEvents(quantumProvider)
  context.subscriptions.push(workspaceEvents)

  // Initialize configuration watcher
  configWatcher = new QuantumConfigWatcher(quantumProvider)
  context.subscriptions.push(configWatcher)

  // Register commands
  const commands = [
    vscode.commands.registerCommand('forsure-quantum.startLivePreview', () => {
      livePreviewManager.startPreview()
    }),
    vscode.commands.registerCommand('forsure-quantum.stopLivePreview', () => {
      livePreviewManager.stopPreview()
    }),
    vscode.commands.registerCommand('forsure-quantum.generateComponent', () => {
      codeGenerator.generateComponent()
    }),
    vscode.commands.registerCommand('forsure-quantum.generateHook', () => {
      codeGenerator.generateHook()
    }),
    vscode.commands.registerCommand('forsure-quantum.generateUtility', () => {
      codeGenerator.generateUtility()
    }),
    vscode.commands.registerCommand('forsure-quantum.optimizeQuantum', () => {
      codeGenerator.optimizeQuantumCode()
    }),
    vscode.commands.registerCommand('forsure-quantum.createSuperposition', () => {
      codeGenerator.createSuperposition()
    }),
    vscode.commands.registerCommand('forsure-quantum.createEntanglement', () => {
      codeGenerator.createEntanglement()
    }),
    vscode.commands.registerCommand('forsure-quantum.performMeasurement', () => {
      codeGenerator.performMeasurement()
    }),
    vscode.commands.registerCommand('forsure-quantum.openDashboard', () => {
      dashboardWebview.show()
    }),
    vscode.commands.registerCommand('forsure-quantum.runDiagnostics', () => {
      diagnosticsProvider.runDiagnostics()
    }),
    vscode.commands.registerCommand('forsure-quantum.startPerformanceMonitoring', () => {
      performanceMonitor.start()
    }),
    vscode.commands.registerCommand('forsure-quantum.stopPerformanceMonitoring', () => {
      performanceMonitor.stop()
    }),
    vscode.commands.registerCommand('forsure-quantum.showUsageStats', () => {
      usageTracker.showStats()
    }),
    vscode.commands.registerCommand('forsure-quantum.refactorQuantum', () => {
      refactoringProvider.refactor()
    }),
    vscode.commands.registerCommand('forsure-quantum.runQuantumTests', () => {
      testingIntegration.runTests()
    }),
    vscode.commands.registerCommand('forsure-quantum.toggleTheme', () => {
      quantumProvider.toggleTheme()
    }),
    vscode.commands.registerCommand('forsure-quantum.enableQuantumMode', () => {
      quantumProvider.enableQuantumMode()
    }),
    vscode.commands.registerCommand('forsure-quantum.enableSuperpositionMode', () => {
      quantumProvider.enableSuperpositionMode()
    }),
    vscode.commands.registerCommand('forsure-quantum.enableEntanglementMode', () => {
      quantumProvider.enableEntanglementMode()
    }),
    vscode.commands.registerCommand('forsure-quantum.enableMeasurementMode', () => {
      quantumProvider.enableMeasurementMode()
    }),
    vscode.commands.registerCommand('forsure-quantum.verifyBlockchain', () => {
      quantumProvider.verifyBlockchain()
    }),
    vscode.commands.registerCommand('forsure-quantum.startRealTimeCollaboration', () => {
      quantumProvider.startRealTimeCollaboration()
    }),
    vscode.commands.registerCommand('forsure-quantum.stopRealTimeCollaboration', () => {
      quantumProvider.stopRealTimeCollaboration()
    })
  ]

  commands.forEach(command => context.subscriptions.push(command))

  // Register language providers
  const languageProviders = [
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
      intelliSenseProvider,
      '.'
    ),
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'javascript', pattern: '**/*.{js,jsx}' },
      intelliSenseProvider,
      '.'
    ),
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
      hoverProvider
    ),
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'javascript', pattern: '**/*.{js,jsx}' },
      hoverProvider
    ),
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
      refactoringProvider
    ),
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'javascript', pattern: '**/*.{js,jsx}' },
      refactoringProvider
    ),
    vscode.languages.registerDiagnosticProvider(
      { scheme: 'file', language: 'typescript', pattern: '**/*.{ts,tsx}' },
      diagnosticsProvider
    ),
    vscode.languages.registerDiagnosticProvider(
      { scheme: 'file', language: 'javascript', pattern: '**/*.{js,jsx}' },
      diagnosticsProvider
    )
  ]

  languageProviders.forEach(provider => context.subscriptions.push(provider))

  // Show activation message
  vscode.window.showInformationMessage(
    'ForSure Quantum Extension activated! ⚛️ Quantum computing features are now available.'
  )

  // Start performance monitoring by default
  performanceMonitor.start()

  // Start usage tracking
  usageTracker.start()

  return {
    quantumProvider,
    livePreviewManager,
    intelliSenseProvider,
    codeGenerator,
    diagnosticsProvider,
    performanceMonitor,
    usageTracker,
    hoverProvider,
    dashboardWebview,
    refactoringProvider,
    testingIntegration,
    statusBarManager,
    activityBarManager,
    contextMenus,
    workspaceEvents,
    configWatcher
  }
}

export function deactivate() {
  console.log('ForSure Quantum Extension is now deactivated')
  
  // Cleanup
  if (livePreviewManager) {
    livePreviewManager.stopPreview()
  }
  
  if (performanceMonitor) {
    performanceMonitor.stop()
  }
  
  if (usageTracker) {
    usageTracker.stop()
  }
  
  if (quantumProvider) {
    quantumProvider.cleanup()
  }
}
