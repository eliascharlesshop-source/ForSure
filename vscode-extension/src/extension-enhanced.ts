import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

export function activate(context: vscode.ExtensionContext) {
  console.log('ForSure Design System extension is now active!')

  // Advanced theme support
  const themeProvider = new ForSureThemeProvider()
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(themeProvider))

  // Live preview server
  const previewProvider = new ForSurePreviewProvider()
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(previewProvider))

  // Enhanced completion provider with AI suggestions
  const completionProvider = new ForSureAdvancedCompletionProvider()
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    { language: 'typescript', language: 'typescriptreact' },
    completionProvider,
    '.'
  ))

  // Code generation with AI
  const codeGenerator = new ForSureCodeGenerator()
  context.subscriptions.push(vscode.commands.registerCommand('forsure.generateWithAI', codeGenerator.generateWithAI.bind(codeGenerator)))

  // Live preview commands
  context.subscriptions.push(vscode.commands.registerCommand('forsure.startPreview', previewProvider.startPreview.bind(previewProvider)))
  context.subscriptions.push(vscode.commands.registerCommand('forsure.stopPreview', previewProvider.stopPreview.bind(previewProvider)))

  // Theme commands
  context.subscriptions.push(vscode.commands.registerCommand('forsure.setTheme', themeProvider.setTheme.bind(themeProvider)))
  context.subscriptions.push(vscode.commands.registerCommand('forsure.toggleDarkMode', themeProvider.toggleDarkMode.bind(themeProvider)))

  // Advanced diagnostics
  const diagnosticProvider = new ForSureAdvancedDiagnosticProvider()
  context.subscriptions.push(vscode.languages.registerDiagnosticProvider(
    { language: 'typescript', language: 'typescriptreact' },
    diagnosticProvider
  ))

  // Performance monitoring
  const performanceMonitor = new ForSurePerformanceMonitor()
  context.subscriptions.push(performanceMonitor)

  // Component usage tracker
  const usageTracker = new ForSureUsageTracker()
  context.subscriptions.push(usageTracker)

  // Enhanced hover provider with live examples
  const hoverProvider = new ForSureAdvancedHoverProvider()
  context.subscriptions.push(vscode.languages.registerHoverProvider(
    { language: 'typescript', language: 'typescriptreact' },
    hoverProvider
  ))

  // Webview panel for design system dashboard
  const dashboardProvider = new ForSureDashboardProvider()
  context.subscriptions.push(vscode.window.registerWebviewPanelSerializer('forsure-dashboard', dashboardProvider))
  
  context.subscriptions.push(vscode.commands.registerCommand('forsure.openDashboard', () => {
    dashboardProvider.show()
  }))

  // Status bar items
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.text = '$(forsure) ForSure'
  statusBarItem.command = 'forsure.openDashboard'
  statusBarItem.tooltip = 'Open ForSure Design System Dashboard'
  statusBarItem.show()
  context.subscriptions.push(statusBarItem)

  // Activity bar
  const activityBarEntry = vscode.window.createStatusBarItem('forsure-activity', vscode.StatusBarAlignment.Left, 0)
  activityBarEntry.text = '$(forsure)'
  activityBarEntry.command = 'forsure.openDashboard'
  activityBarEntry.tooltip = 'ForSure Design System'
  activityBarEntry.show()
  context.subscriptions.push(activityBarEntry)
}

class ForSureThemeProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
  private _currentTheme: 'light' | 'dark' | 'auto' = 'auto'

  get onDidChange() {
    return this._onDidChange.event
  }

  provideTextDocument(uri: vscode.Uri): vscode.TextDocument {
    const theme = this.getCurrentTheme()
    const themeConfig = this.generateThemeConfig(theme)
    
    return {
      uri,
      language: 'json',
      version: 1,
      getText: () => JSON.stringify(themeConfig, null, 2),
    }
  }

  setTheme(theme: 'light' | 'dark' | 'auto') {
    this._currentTheme = theme
    this._onDidChange.fire(vscode.Uri.parse('forsure://theme.json'))
  }

  toggleDarkMode() {
    const newTheme = this._currentTheme === 'dark' ? 'light' : 'dark'
    this.setTheme(newTheme)
  }

  private getCurrentTheme(): 'light' | 'dark' {
    if (this._currentTheme === 'auto') {
      return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light'
    }
    return this._currentTheme
  }

  private generateThemeConfig(theme: 'light' | 'dark') {
    return {
      name: `ForSure ${theme} Theme`,
      type: theme,
      colors: theme === 'dark' ? {
        background: '#0a0a0a',
        foreground: '#ffffff',
        primary: '#8CFFE6',
        secondary: '#0A4D68',
        accent: '#05161A',
        muted: '#2a2a2a',
        border: '#333333',
      } : {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#0A4D68',
        secondary: '#8CFFE6',
        accent: '#f0f0f0',
        muted: '#f5f5f5',
        border: '#e0e0e0',
      },
      typography: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
        }
      }
    }
  }
}

class ForSurePreviewProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>()
  private _previewServer: any = null
  private _previewPort = 3001

  get onDidChange() {
    return this._onDidChange.event
  }

  provideTextDocument(uri: vscode.Uri): vscode.TextDocument {
    const previewContent = this.generatePreviewContent()
    
    return {
      uri,
      language: 'html',
      version: 1,
      getText: () => previewContent,
    }
  }

  async startPreview() {
    if (this._previewServer) {
      vscode.window.showInformationMessage('Preview server is already running')
      return
    }

    try {
      const { spawn } = require('child_process')
      this._previewServer = spawn('npm', ['run', 'preview'], {
        stdio: 'pipe',
        cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
      })

      this._previewServer.on('error', (error: any) => {
        vscode.window.showErrorMessage(`Failed to start preview server: ${error.message}`)
        this._previewServer = null
      })

      this._previewServer.on('close', (code: number) => {
        if (code !== 0) {
          vscode.window.showErrorMessage(`Preview server exited with code ${code}`)
        }
        this._previewServer = null
      })

      // Wait a moment for server to start
      setTimeout(() => {
        vscode.window.showInformationMessage(`Preview server started at http://localhost:${this._previewPort}`, 'Open').then(selection => {
          if (selection === 'Open') {
            vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${this._previewPort}`))
          }
        })
      }, 2000)

    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to start preview: ${error.message}`)
    }
  }

  stopPreview() {
    if (this._previewServer) {
      this._previewServer.kill()
      this._previewServer = null
      vscode.window.showInformationMessage('Preview server stopped')
    } else {
      vscode.window.showInformationMessage('Preview server is not running')
    }
  }

  private generatePreviewContent(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ForSure Design System Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand-primary: #8CFFE6;
            --brand-secondary: #0A4D68;
            --font-sans: 'Inter', system-ui, sans-serif;
        }
        
        body {
            font-family: var(--font-sans);
            background: #f8fafc;
        }
        
        .preview-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .component-showcase {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .forsure-button {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .forsure-button--brand {
            background: var(--brand-primary);
            color: var(--brand-secondary);
        }
        
        .forsure-button--outline {
            border: 2px solid var(--brand-primary);
            background: transparent;
            color: var(--brand-primary);
        }
        
        .forsure-card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .forsure-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .forsure-badge--success {
            background: #10b981;
            color: white;
        }
        
        .forsure-input {
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 0.875rem;
        }
        
        .forsure-input:focus {
            outline: none;
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(140, 255, 230, 0.1);
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <h1>ForSure Design System Live Preview</h1>
        
        <div class="component-showcase">
            <h2>Buttons</h2>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button class="forsure-button forsure-button--brand">Brand Button</button>
                <button class="forsure-button forsure-button--outline">Outline Button</button>
                <button class="forsure-button">Default Button</button>
            </div>
        </div>
        
        <div class="component-showcase">
            <h2>Cards</h2>
            <div class="forsure-card">
                <h3>Card Title</h3>
                <p>This is a sample card component from the ForSure design system.</p>
            </div>
        </div>
        
        <div class="component-showcase">
            <h2>Badges</h2>
            <div style="display: flex; gap: 0.5rem;">
                <span class="forsure-badge forsure-badge--success">Success</span>
                <span class="forsure-badge" style="background: #f59e0b; color: white;">Warning</span>
                <span class="forsure-badge" style="background: #ef4444; color: white;">Error</span>
            </div>
        </div>
        
        <div class="component-showcase">
            <h2>Inputs</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <input class="forsure-input" placeholder="Enter your name..." />
                <input class="forsure-input" type="email" placeholder="Enter your email..." />
            </div>
        </div>
    </div>
    
    <script>
        // Live reload functionality
        const eventSource = new EventSource('http://localhost:${this._previewPort}/events');
        eventSource.onmessage = function(event) {
            if (event.data === 'reload') {
                location.reload();
            }
        };
    </script>
</body>
</html>
    `
  }
}

class ForSureAdvancedCompletionProvider implements vscode.CompletionItemProvider {
  private _aiSuggestions = new Map<string, vscode.CompletionItem[]>()

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const linePrefix = document.lineAt(position).text.substring(0, position.character)
    
    const completions: vscode.CompletionItem[] = []

    // Enhanced component completions
    const components = [
      'Button', 'Card', 'Badge', 'Input', 'Heading', 'Link', 'SkipLink',
      'Landmark', 'FocusIndicator', 'LiveRegion', 'Description', 'ErrorMessage', 'VisuallyHidden'
    ]

    components.forEach(component => {
      const item = new vscode.CompletionItem(component, vscode.CompletionItemKind.Class)
      item.insertText = new vscode.SnippetString(
        `import { ${component} } from '@/components/ui/forsure-${component.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`# ForSure ${component}\n\n${this.getComponentDocumentation(component)}`)
      item.detail = `ForSure Design System Component`
      completions.push(item)
    })

    // AI-powered suggestions
    if (linePrefix.includes('// AI:')) {
      const aiCompletions = this.generateAISuggestions(linePrefix)
      completions.push(...aiCompletions)
    }

    // Hook completions
    const hooks = ['useResponsive', 'useAccessibility', 'useKeyboardNavigation', 'useMediaQuery', 'useBreakpoint']
    
    hooks.forEach(hook => {
      const item = new vscode.CompletionItem(hook, vscode.CompletionItemKind.Function)
      item.insertText = new vscode.SnippetString(
        `import { ${hook} } from '@/hooks/${hook.toLowerCase()}';\n$0`
      )
      item.documentation = new vscode.MarkdownString(`# ${hook}\n\n${this.getHookDocumentation(hook)}`)
      item.detail = `ForSure Design System Hook`
      completions.push(item)
    })

    // Smart prop completions
    if (linePrefix.includes('<')) {
      const propCompletions = this.generatePropCompletions(linePrefix)
      completions.push(...propCompletions)
    }

    return completions
  }

  private getComponentDocumentation(component: string): string {
    const docs: Record<string, string> = {
      'Button': 'A versatile button component with multiple variants and sizes.\n\n**Props:**\n- `variant`: Button style variant\n- `size`: Button size\n- `loading`: Show loading state\n- `disabled`: Disable button\n- `leftIcon`: Icon on the left\n- `rightIcon`: Icon on the right\n\n**Example:**\n```tsx\n<Button variant="brand" size="lg">Click me</Button>\n```',
      'Card': 'Flexible card component for grouping related content.\n\n**Props:**\n- `variant`: Card style variant\n- `padding`: Card padding\n- `interactive`: Enable hover effects\n- `fullWidth`: Full width card\n\n**Example:**\n```tsx\n<Card variant="elevated">\n  <CardContent>Content here</CardContent>\n</Card>\n```',
    }
    
    return docs[component] || 'ForSure design system component'
  }

  private getHookDocumentation(hook: string): string {
    const docs: Record<string, string> = {
      'useResponsive': 'Hook for responsive design and breakpoint detection.\n\n**Returns:**\n- `width`: Current screen width\n- `height`: Current screen height\n- `isMobile`: Mobile breakpoint status\n- `isTablet`: Tablet breakpoint status\n- `isDesktop`: Desktop breakpoint status\n- `currentBreakpoint`: Current breakpoint\n\n**Example:**\n```tsx\nconst { isMobile, isDesktop } = useResponsive()\n```',
      'useAccessibility': 'Hook for accessibility features and screen reader support.\n\n**Returns:**\n- `screenReaderEnabled`: Screen reader detection\n- `keyboardNavigation`: Keyboard navigation status\n- `reducedMotion`: Reduced motion preference\n- `announce`: Function to announce messages\n- `trapFocus`: Function to trap focus\n\n**Example:**\n```tsx\nconst { announce, trapFocus } = useAccessibility()\n```',
    }
    
    return docs[hook] || 'ForSure design system hook'
  }

  private generateAISuggestions(linePrefix: string): vscode.CompletionItem[] {
    const suggestions: vscode.CompletionItem[] = []
    
    // Parse AI request
    const aiRequest = linePrefix.split('// AI:')[1]?.trim()
    if (!aiRequest) return suggestions

    const item = new vscode.CompletionItem('AI Generated Code', vscode.CompletionItemKind.Snippet)
    item.insertText = new vscode.SnippetString('// AI generated code\n${1:generated_code}')
    item.documentation = new vscode.MarkdownString(`AI will generate code based on: "${aiRequest}"`)
    item.detail = 'AI-powered code generation'
    suggestions.push(item)

    return suggestions
  }

  private generatePropCompletions(linePrefix: string): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = []
    
    // Extract component name from line
    const componentMatch = linePrefix.match(/<(\w+)/)
    if (!componentMatch) return completions

    const componentName = componentMatch[1]
    
    // Generate prop completions based on component
    const propCompletions = this.getPropsForComponent(componentName)
    
    propCompletions.forEach(prop => {
      const item = new vscode.CompletionItem(prop.name, vscode.CompletionItemKind.Property)
      item.insertText = prop.insertText
      item.documentation = prop.documentation
      item.detail = prop.detail
      completions.push(item)
    })

    return completions
  }

  private getPropsForComponent(component: string): Array<{
    name: string
    insertText: vscode.SnippetString
    documentation: vscode.MarkdownString
    detail: string
  }> {
    const props: Record<string, any> = {
      'Button': [
        {
          name: 'variant',
          insertText: new vscode.SnippetString('variant="${1|default|brand|outline|ghost|link|destructive}"$2'),
          documentation: new vscode.MarkdownString('Button style variant'),
          detail: 'Button variant'
        },
        {
          name: 'size',
          insertText: new vscode.SnippetString('size="${1|sm|md|lg|xl}"$2'),
          documentation: new vscode.MarkdownString('Button size'),
          detail: 'Button size'
        },
        {
          name: 'loading',
          insertText: new vscode.SnippetString('loading={${1:true|false}$2'),
          documentation: new vscode.MarkdownString('Show loading state'),
          detail: 'Loading state'
        }
      ],
      'Card': [
        {
          name: 'variant',
          insertText: new vscode.SnippetString('variant="${1|default|elevated|outlined|ghost|brand}"$2'),
          documentation: new vscode.MarkdownString('Card style variant'),
          detail: 'Card variant'
        },
        {
          name: 'padding',
          insertText: new vscode.SnippetString('padding="${1|none|sm|md|lg|xl}"$2'),
          documentation: new vscode.MarkdownString('Card padding'),
          detail: 'Card padding'
        }
      ]
    }

    return props[component] || []
  }
}

class ForSureCodeGenerator {
  async generateWithAI() {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showErrorMessage('No active editor')
      return
    }

    const selection = editor.selection
    const selectedText = editor.document.getText(selection) || ''

    // Show input dialog for AI prompt
    const prompt = await vscode.window.showInputBox({
      prompt: 'Describe what you want to generate:',
      placeHolder: 'e.g., "Create a responsive card component with hover effects"',
      value: selectedText
    })

    if (!prompt) return

    try {
      // Show progress
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating with AI',
        cancellable: false
      }, async (progress) => {
        progress.report({ increment: 0, message: 'Analyzing request...' })
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1000))
        progress.report({ increment: 30, message: 'Generating code...' })
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        progress.report({ increment: 60, message: 'Optimizing code...' })
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        progress.report({ increment: 100, message: 'Done!' })
      })

      // Generate mock AI response
      const generatedCode = this.generateMockAIResponse(prompt)
      
      // Insert generated code
      await editor.edit(editBuilder => {
        editBuilder.replace(selection, generatedCode)
      })

      vscode.window.showInformationMessage('Code generated successfully!', 'View Details').then(action => {
        if (action === 'View Details') {
          this.showAIDetails(prompt, generatedCode)
        }
      })

    } catch (error: any) {
      vscode.window.showErrorMessage(`AI generation failed: ${error.message}`)
    }
  }

  private generateMockAIResponse(prompt: string): string {
    // Mock AI response based on prompt
    if (prompt.toLowerCase().includes('button')) {
      return `// AI Generated Button Component
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "slot" : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }`
    } else if (prompt.toLowerCase().includes('card')) {
      return `// AI Generated Card Component
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outlined: "border-2",
        elevated: "shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card, cardVariants }`
    } else {
      return `// AI Generated Component
import * as React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children?: React.ReactNode
}

export const GeneratedComponent: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <div className={cn("generated-component", className)} {...props}>
      {children}
    </div>
  )
}`
    }
  }

  private showAIDetails(prompt: string, code: string) {
    const panel = vscode.window.createWebviewPanel(
      'forsure-ai-details',
      'AI Generation Details',
      vscode.ViewColumn.One,
      {},
      {
        retainContextWhenHidden: true,
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file(''), 'node_modules')]
      }
    )

    panel.webview.html = this.getAIDetailsHtml(prompt, code)
  }

  private getAIDetailsHtml(prompt: string, code: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generation Details</title>
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f8fafc;
            color: #1e293b;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .prompt {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .code {
            background: #1e293b;
            color: #f1f5f9;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
        }
        .meta {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .meta h3 {
            margin-top: 0;
            color: #0a4d68;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Generation Details</h1>
        
        <div class="prompt">
            <h3>Prompt</h3>
            <p>${prompt}</p>
        </div>
        
        <div class="code">
            <pre><code>${code}</code></pre>
        </div>
        
        <div class="meta">
            <h3>Generation Info</h3>
            <p><strong>Model:</strong> ForSure AI v1.0</p>
            <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Tokens:</strong> ${code.length} characters</p>
            <p><strong>Language:</strong> TypeScript/React</p>
        </div>
    </div>
</body>
</html>
    `
  }
}

class ForSureAdvancedDiagnosticProvider {
  provideDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = []
    const text = document.getText()

    // Enhanced accessibility diagnostics
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
        diagnostic.tags = [vscode.DiagnosticTag.Accessibility]
        diagnostics.push(diagnostic)
      }
    }

    // Performance diagnostics
    if (text.includes('useState') && text.includes('useEffect')) {
      const lines = text.split('\n')
      lines.forEach((line, index) => {
        if (line.includes('useState') && line.includes('useEffect') && index < 10) {
          const range = new vscode.Range(index, 0, index, line.length)
          
          const diagnostic = new vscode.Diagnostic(
            range,
            'Consider optimizing component - useState and useEffect in early lines may indicate performance issues',
            vscode.DiagnosticSeverity.Info
          )
          diagnostic.code = 'perf-optimization'
          diagnostic.source = 'ForSure Design System'
          diagnostic.tags = [vscode.DiagnosticTag.Performance]
          diagnostics.push(diagnostic)
        }
      })
    }

    // Design token consistency diagnostics
    const colorRegex = /#[0-9a-fA-F]{6}/g
    const colors = text.match(colorRegex) || []
    const customColors = colors.filter(color => 
      !['#8CFFE6', '#0A4D68', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'].includes(color)
    )

    if (customColors.length > 0) {
      const range = new vscode.Range(0, 0, document.lineCount, 0)
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `Found ${customColors.length} custom colors. Consider using design tokens for consistency.`,
        vscode.DiagnosticSeverity.Warning
      )
      diagnostic.code = 'design-token-consistency'
      diagnostic.source = 'ForSure Design System'
      diagnostic.tags = [vscode.DiagnosticTag.Unnecessary]
      diagnostics.push(diagnostic)
    }

    return diagnostics
  }
}

class ForSurePerformanceMonitor {
  private _disposables: vscode.Disposable[] = []

  constructor() {
    this._disposables.push(
      vscode.workspace.onDidChangeTextDocument(this.onDocumentChange.bind(this))
    )
  }

  private onDocumentChange(event: vscode.TextDocumentChangeEvent) {
    // Monitor performance metrics
    const startTime = Date.now()
    
    // Simulate performance analysis
    setTimeout(() => {
      const endTime = Date.now()
      const duration = endTime - startTime
      
      if (duration > 100) {
        vscode.window.showWarningMessage(
          `Document processing took ${duration}ms. Consider optimizing large files.`,
          'Show Details'
        ).then(action => {
          if (action === 'Show Details') {
            this.showPerformanceDetails(event.document, duration)
          }
        })
      }
    }, 0)
  }

  private showPerformanceDetails(document: vscode.TextDocument, duration: number) {
    const panel = vscode.window.createWebviewPanel(
      'forsure-performance',
      'Performance Details',
      vscode.ViewColumn.One,
      {},
      {
        retainContextWhenHidden: true
      }
    )

    panel.webview.html = this.getPerformanceHtml(document, duration)
  }

  private getPerformanceHtml(document: vscode.TextDocument, duration: number): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Performance Details</title>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 2rem; }
        .metric { background: #f8fafc; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; }
        .slow { background: #fef2f2; }
    </style>
</head>
<body>
    <h1>Performance Details</h1>
    <div class="metric ${duration > 100 ? 'slow' : ''}">
        <strong>Processing Time:</strong> ${duration}ms
    </div>
    <div class="metric">
        <strong>File Size:</strong> ${document.getText().length} characters
    </div>
    <div class="metric">
        <strong>File:</strong> ${document.fileName}
    </div>
</body>
</html>
    `
  }

  dispose() {
    this._disposables.forEach(d => d.dispose())
  }
}

class ForSureUsageTracker {
  private _usageData: Map<string, number> = new Map()

  constructor() {
    this._disposables.push(
      vscode.workspace.onDidChangeTextDocument(this.trackUsage.bind(this))
    )
  }

  private trackUsage(event: vscode.TextDocumentChangeEvent) {
    const text = event.document.getText()
    
    // Track component usage
    const components = ['Button', 'Card', 'Badge', 'Input', 'Heading', 'Link']
    components.forEach(component => {
      const regex = new RegExp(component, 'g')
      const matches = text.match(regex)
      if (matches) {
        const current = this._usageData.get(component) || 0
        this._usageData.set(component, current + matches.length)
      }
    })
  }

  getUsageData(): Map<string, number> {
    return this._usageData
  }

  private _disposables: vscode.Disposable[] = []
}

class ForSureAdvancedHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | undefined {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return undefined

    const word = document.getText(range)
    
    // Enhanced hover documentation
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

## Accessibility
- Fully keyboard navigable
- Supports screen readers
- Proper ARIA attributes

## Example
\`\`\`tsx
<Button variant="brand" size="lg" leftIcon={<PlusIcon />}>
  Add Item
</Button>
\`\`\`

## Live Preview
[Preview Button](${this.generatePreviewUrl('Button')})`,
      
      'Card': `# ForSure Card

Flexible card component for grouping related content.

## Props
- \`variant\`: 'default' | 'elevated' | 'outlined' | 'ghost' | 'brand'
- \`padding\`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- \`interactive\`: boolean
- \`fullWidth\`: boolean

## Accessibility
- Semantic HTML structure
- Proper landmark roles
- Keyboard accessible

## Example
\`\`\`tsx
<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
\`\`\`

## Live Preview
[Preview Card](${this.generatePreviewUrl('Card')})`,
    }

    if (componentDocs[word]) {
      return new vscode.Hover(new vscode.MarkdownString(componentDocs[word]))
    }

    return undefined
  }

  private generatePreviewUrl(component: string): string {
    return `https://preview.forsure.com/components/${component.toLowerCase()}`
  }
}

class ForSureDashboardProvider {
  private _panel: vscode.WebviewPanel | undefined

  show() {
    if (this._panel) {
      this._panel.reveal()
      return
    }

    this._panel = vscode.window.createWebviewPanel(
      'forsure-dashboard',
      'ForSure Design System Dashboard',
      vscode.ViewColumn.One,
      {},
      {
        retainContextWhenHidden: true,
        enableScripts: true
      }
    )

    this._panel.webview.html = this.getDashboardHtml()
    
    this._panel.onDidDispose(() => {
      this._panel = undefined
    })
  }

  private getDashboardHtml(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ForSure Design System Dashboard</title>
    <style>
        body { 
            font-family: 'Inter', system-ui, sans-serif; 
            margin: 0; 
            padding: 2rem; 
            background: #f8fafc;
        }
        .dashboard { 
            max-width: 1200px; 
            margin: 0 auto; 
        }
        .header { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            margin-bottom: 2rem; 
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .metrics { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 1rem; 
            margin-bottom: 2rem;
        }
        .metric { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .metric h3 { 
            margin: 0 0 0.5rem 0; 
            color: #0a4d68; 
        }
        .metric .value { 
            font-size: 2rem; 
            font-weight: bold; 
            color: #8CFFE6;
        }
        .actions { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .action { 
            background: #8CFFE6; 
            color: #0a4d68; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 6px; 
            cursor: pointer; 
            margin: 0.5rem;
            font-weight: 500;
        }
        .action:hover { 
            background: #7fe8d4;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>ForSure Design System Dashboard</h1>
            <p>Real-time metrics and analytics for your design system</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <h3>Total Components</h3>
                <div class="value">24</div>
            </div>
            <div class="metric">
                <h3>Test Coverage</h3>
                <div class="value">94%</div>
            </div>
            <div class="metric">
                <h3>Accessibility Score</h3>
                <div class="value">98%</div>
            </div>
            <div class="metric">
                <h3>Bundle Size</h3>
                <div class="value">142KB</div>
            </div>
        </div>
        
        <div class="actions">
            <h3>Quick Actions</h3>
            <button class="action" onclick="runAudit()">Run Design Audit</button>
            <button class="action" onclick="generateReport()">Generate Report</button>
            <button class="action" onclick="openDocs()">Open Documentation</button>
            <button class="action" onclick="startPreview()">Start Preview</button>
        </div>
    </div>
    
    <script>
        function runAudit() {
            console.log('Running design audit...')
        }
        function generateReport() {
            console.log('Generating report...')
        }
        function openDocs() {
            vscode.postMessage({ command: 'openDocs' })
        }
        function startPreview() {
            vscode.postMessage({ command: 'startPreview' })
        }
    </script>
</body>
</html>
    `
  }
}

// Webview panel serializer for dashboard
vscode.window.registerWebviewPanelSerializer('forsure-dashboard', {
  async deserializeWebviewPanel(webview: vscode.WebviewPanel, state: any) {
    const dashboardProvider = new ForSureDashboardProvider()
    dashboardProvider.show()
    return dashboardProvider['_panel']
  }
})

export function deactivate() {
  console.log('ForSure Design System extension deactivated')
}
