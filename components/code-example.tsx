'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/forsure-button'
import { Clipboard, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeExampleProps {
  code: string
  language?: string
  className?: string
  title?: string
  expandable?: boolean
  defaultExpanded?: boolean
}

export default function CodeExample({
  code,
  language = 'forsure',
  className,
  title,
  expandable = false,
  defaultExpanded = true,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const lines = code.split('\n').length
  const shouldBeExpandable = expandable && lines > 20

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden code-window bg-secondary-dark/50 border border-primary/20',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-secondary-dark/80 border-b border-primary/30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wide">
            {title || language}
          </span>
          {shouldBeExpandable && (
            <span className="text-xs text-muted-foreground">
              {lines} lines
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {shouldBeExpandable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 text-muted-foreground hover:text-white"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 text-primary hover:text-white hover:bg-secondary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          shouldBeExpandable && !isExpanded ? 'max-h-96' : ''
        )}
      >
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            borderRadius: 0,
            fontSize: '0.875rem',
            backgroundColor: 'transparent',
            lineHeight: '1.65',
            letterSpacing: '0.5px',
          }}
          wrapLongLines={true}
          showLineNumbers={language !== 'bash' && language !== 'text' && language !== 'forsure'}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {shouldBeExpandable && !isExpanded && (
        <div className="px-4 py-2 bg-secondary-dark/60 border-t border-primary/20 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-primary hover:text-white text-xs"
          >
            Show all {lines} lines
          </Button>
        </div>
      )}
    </div>
  )
}
