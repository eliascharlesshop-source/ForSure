import * as vscode from 'vscode'

export class QuantumStatusBar {
  private statusBarItem: vscode.StatusBarItem
  private fidelityItem: vscode.StatusBarItem
  private performanceItem: vscode.StatusBarItem
  private metrics: any = {}

  constructor() {
    // Main status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    )
    this.statusBarItem.name = 'Quantum Status'
    this.statusBarItem.command = 'quantum.showQuantumMetrics'
    this.statusBarItem.tooltip = 'Click to show detailed quantum metrics'
    this.statusBarItem.show()

    // Fidelity indicator
    this.fidelityItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      101
    )
    this.fidelityItem.name = 'Quantum Fidelity'
    this.fidelityItem.tooltip = 'Current circuit fidelity'
    this.fidelityItem.show()

    // Performance indicator
    this.performanceItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      102
    )
    this.performanceItem.name = 'Quantum Performance'
    this.performanceItem.tooltip = 'Circuit performance metrics'
    this.performanceItem.show()
  }

  updateMetrics(metrics: any) {
    this.metrics = metrics
    
    // Update main status bar
    const status = this.getQuantumStatus(metrics)
    this.statusBarItem.text = `$(pulse) Quantum: ${status}`
    this.statusBarItem.backgroundColor = this.getStatusColor(metrics)

    // Update fidelity indicator
    const fidelity = metrics.estimatedFidelity || 0
    const fidelityText = `${(fidelity * 100).toFixed(1)}%`
    const fidelityIcon = fidelity > 0.9 ? '$(check)' : fidelity > 0.8 ? '$(warning)' : '$(error)'
    this.fidelityItem.text = `${fidelityIcon} Fidelity: ${fidelityText}`
    this.fidelityItem.color = fidelity > 0.9 ? undefined : fidelity > 0.8 ? '#ffcc00' : '#ff4444'

    // Update performance indicator
    const performance = metrics.performanceScore || 0
    const performanceText = `${performance.toFixed(0)}`
    const performanceIcon = performance > 80 ? '$(rocket)' : performance > 60 ? '$(zap)' : '$(alert)'
    this.performanceItem.text = `${performanceIcon} Performance: ${performanceText}`
    this.performanceItem.color = performance > 80 ? undefined : performance > 60 ? '#ffcc00' : '#ff4444'
  }

  private getQuantumStatus(metrics: any): string {
    const fidelity = metrics.estimatedFidelity || 0
    const complexity = metrics.complexity || 0
    const gates = metrics.quantumGates || 0

    if (fidelity > 0.95 && complexity < 50) {
      return 'Optimal'
    } else if (fidelity > 0.9 && complexity < 70) {
      return 'Good'
    } else if (fidelity > 0.8) {
      return 'Fair'
    } else {
      return 'Needs Optimization'
    }
  }

  private getStatusColor(metrics: any): vscode.ThemeColor | undefined {
    const fidelity = metrics.estimatedFidelity || 0
    
    if (fidelity > 0.9) {
      return undefined // Default color
    } else if (fidelity > 0.8) {
      return new vscode.ThemeColor('statusBarItem.warningBackground')
    } else {
      return new vscode.ThemeColor('statusBarItem.errorBackground')
    }
  }

  public updateConfiguration(config: vscode.WorkspaceConfiguration) {
    const showMetrics = config.get('showQuantumMetrics', true)
    
    if (showMetrics) {
      this.statusBarItem.show()
      this.fidelityItem.show()
      this.performanceItem.show()
    } else {
      this.statusBarItem.hide()
      this.fidelityItem.hide()
      this.performanceItem.hide()
    }
  }

  public dispose() {
    this.statusBarItem.dispose()
    this.fidelityItem.dispose()
    this.performanceItem.dispose()
  }
}
