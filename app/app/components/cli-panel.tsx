'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Terminal, X, Maximize2, Minimize2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/forsure-button'
import { cn } from '@/lib/utils'

interface CliLine {
  id: number
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'divider'
  text: string
}

interface CliPanelProps {
  className?: string
  projectName?: string
}

const FORSURE_COMMANDS: Record<string, (args: string[], projectName: string) => string[]> = {
  help: () => [
    '  ForSure CLI — available commands:',
    '',
    '  init [name]       Initialize a new ForSure project',
    '  validate          Validate current .forsure file syntax',
    '  generate          Generate file structure from active file',
    '  list              List all .forsure files in project',
    '  export [format]   Export structure as json | yaml | tree',
    '  version           Show ForSure CLI version',
    '  clear             Clear terminal output',
    '  help              Show this help message',
  ],
  init: (args, projectName) => {
    const name = args[0] || projectName || 'my-project'
    return [
      `  Initializing ForSure project: ${name}`,
      '',
      '  Creating project structure...',
      `  + ${name}/`,
      `  + ${name}/.forsure`,
      `  + ${name}/project.fs`,
      '',
      `  Project "${name}" initialized successfully.`,
      '  Run `forsure validate` to check your file structure.',
    ]
  },
  validate: (_, projectName) => [
    `  Validating ${projectName || 'project'} file structure...`,
    '',
    '  Checking syntax...',
    '  Checking node types...',
    '  Checking path references...',
    '',
    '  No errors found.',
    '  File structure is valid.',
  ],
  generate: (_, projectName) => [
    `  Generating file structure for ${projectName || 'project'}...`,
    '',
    '  Parsing .forsure definitions...',
    '  Resolving dependencies...',
    '  Writing output...',
    '',
    '  Generated 12 files, 4 directories.',
    '  Output written to ./dist/structure.json',
  ],
  list: (_, projectName) => [
    `  ForSure files in ${projectName || 'project'}:`,
    '',
    '  project.fs          (active)',
    '  components.fs',
    '  api-routes.fs',
    '',
    '  3 files found.',
  ],
  export: (args) => {
    const format = args[0] || 'json'
    const validFormats = ['json', 'yaml', 'tree']
    if (!validFormats.includes(format)) {
      return [`  Error: Unknown format "${format}". Use: json | yaml | tree`]
    }
    return [
      `  Exporting as ${format.toUpperCase()}...`,
      '',
      `  Output: ./export/structure.${format === 'yaml' ? 'yml' : format}`,
      '  Export complete.',
    ]
  },
  version: () => [
    '  ForSure CLI v1.4.2',
    '  Runtime: Node.js v20.x',
    '  Schema: ForSure Spec v2.1',
  ],
  clear: () => [],
}

const WELCOME_LINES: CliLine[] = [
  { id: 0, type: 'info', text: '  ForSure CLI v1.4.2 — ready' },
  { id: 1, type: 'info', text: '  Type `help` to see available commands.' },
  { id: 2, type: 'divider', text: '' },
]

export function CliPanel({ className, projectName }: CliPanelProps) {
  const [lines, setLines] = useState<CliLine[]>(WELCOME_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMaximized, setIsMaximized] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(10)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const nextId = () => {
    idRef.current += 1
    return idRef.current
  }

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [cmd, ...args] = trimmed.split(/\s+/)
    const newLines: CliLine[] = [
      { id: nextId(), type: 'input', text: trimmed },
    ]

    if (cmd === 'clear') {
      setLines(WELCOME_LINES)
      setHistory(prev => [trimmed, ...prev])
      setHistoryIndex(-1)
      setInput('')
      return
    }

    const handler = FORSURE_COMMANDS[cmd]
    if (handler) {
      const outputLines = handler(args, projectName || 'project')
      outputLines.forEach(line => {
        newLines.push({
          id: nextId(),
          type: line.toLowerCase().includes('error') ? 'error'
               : line.toLowerCase().includes('successfully') || line.toLowerCase().includes('complete') || line.toLowerCase().includes('valid') ? 'success'
               : 'output',
          text: line,
        })
      })
    } else {
      newLines.push({
        id: nextId(),
        type: 'error',
        text: `  Command not found: "${cmd}". Type \`help\` for available commands.`,
      })
    }

    newLines.push({ id: nextId(), type: 'divider', text: '' })
    setLines(prev => [...prev, ...newLines])
    setHistory(prev => [trimmed, ...prev])
    setHistoryIndex(-1)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      runCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(next)
      if (history[next]) setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-[#020d0f] border-t border-[#0A4D68]/60 font-mono text-xs',
        isMaximized && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#051820] border-b border-[#0A4D68]/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#8CFFE6]" />
          <span className="text-[#8CFFE6] text-xs font-medium tracking-wide">TERMINAL</span>
          <span className="text-[#0A4D68] text-xs">— forsure</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="smIcon"
            className="h-5 w-5 text-[#0A4D68] hover:text-[#8CFFE6] hover:bg-[#0A4D68]/20"
            onClick={() => setIsMaximized(v => !v)}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized
              ? <Minimize2 className="h-3 w-3" />
              : <Maximize2 className="h-3 w-3" />
            }
          </Button>
          <Button
            variant="ghost"
            size="smIcon"
            className="h-5 w-5 text-[#0A4D68] hover:text-red-400 hover:bg-red-400/10"
            onClick={() => setLines(WELCOME_LINES)}
            title="Clear"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 min-h-0 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map(line => (
          <div
            key={line.id}
            className={cn(
              'leading-5 whitespace-pre-wrap',
              line.type === 'divider' && 'h-px bg-[#0A4D68]/20 my-1',
              line.type === 'input' && 'text-white',
              line.type === 'output' && 'text-[#8CFFE6]/70',
              line.type === 'success' && 'text-[#8CFFE6]',
              line.type === 'error' && 'text-red-400',
              line.type === 'info' && 'text-[#0A4D68] brightness-150',
            )}
          >
            {line.type === 'input' ? (
              <span className="flex items-start gap-1">
                <span className="text-[#8CFFE6] select-none mt-0.5">$</span>
                <span>{line.text}</span>
              </span>
            ) : line.type !== 'divider' ? (
              line.text
            ) : null}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        className="flex items-center gap-2 px-2 py-2 border-t border-[#0A4D68]/30 flex-shrink-0"
        onClick={() => inputRef.current?.focus()}
      >
        <ChevronRight className="h-3.5 w-3.5 text-[#8CFFE6] flex-shrink-0" />
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-[#0A4D68] text-xs font-mono"
          placeholder="Enter a command..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
        <button
          onClick={() => runCommand(input)}
          className="text-[#0A4D68] hover:text-[#8CFFE6] transition-colors text-xs px-1"
        >
          run
        </button>
      </div>
    </div>
  )
}
