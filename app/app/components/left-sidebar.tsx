'use client'

import React, { useState } from 'react'
import {
  Layers,
  Package,
  LayoutTemplate,
  ChevronRight,
  MousePointerClick,
  Tag,
  Square,
  TextCursor,
  ToggleLeft,
  ListFilter,
  Code2,
  ArrowRight,
  Folder,
  File,
} from 'lucide-react'
import { FileStructureVisualization, type FileNode } from './file-structure-visualization'
import { Badge } from '@/components/ui/forsure-badge'
import { cn } from '@/lib/utils'

type SidebarTab = 'layers' | 'components' | 'templates'

interface ComponentItem {
  id: string
  name: string
  category: string
  icon: React.ElementType
  description: string
  snippet: string
  variants?: string[]
}

const FORSURE_COMPONENTS: ComponentItem[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    icon: MousePointerClick,
    description: 'Interactive button element',
    snippet: '<Button variant="default">Click me</Button>',
    variants: ['default', 'outline', 'ghost', 'brand'],
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'Labels',
    icon: Tag,
    description: 'Status and label badge',
    snippet: '<Badge variant="default">Label</Badge>',
    variants: ['default', 'secondary', 'outline', 'success'],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    icon: Square,
    description: 'Content container card',
    snippet: '<Card><CardHeader>Title</CardHeader><CardContent>Content</CardContent></Card>',
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Forms',
    icon: TextCursor,
    description: 'Text input field',
    snippet: '<Input placeholder="Enter text..." />',
  },
  {
    id: 'toggle',
    name: 'Toggle',
    category: 'Forms',
    icon: ToggleLeft,
    description: 'On/off toggle switch',
    snippet: '<Toggle />',
  },
  {
    id: 'list',
    name: 'List',
    category: 'Data',
    icon: ListFilter,
    description: 'Structured list component',
    snippet: '<ul><li>Item one</li><li>Item two</li></ul>',
  },
  {
    id: 'code-block',
    name: 'Code Block',
    category: 'Display',
    icon: Code2,
    description: 'Syntax-highlighted code',
    snippet: '<CodeExample language="forsure" code={`root:\n  - file.ts`} />',
  },
  {
    id: 'file-node',
    name: 'File Node',
    category: 'ForSure',
    icon: File,
    description: 'ForSure file node definition',
    snippet: '- Type: File\n  - Name: index.ts\n  <description>Entry point</description>',
  },
  {
    id: 'dir-node',
    name: 'Directory Node',
    category: 'ForSure',
    icon: Folder,
    description: 'ForSure directory node',
    snippet: '- Type: Directory\n  - Name: src/\n  <description>Source code</description>',
  },
]

const TEMPLATES = [
  { id: 'nextjs', name: 'Next.js App', icon: Code2, desc: 'App Router + TypeScript' },
  { id: 'react', name: 'React SPA', icon: Code2, desc: 'Vite + TypeScript' },
  { id: 'node-api', name: 'Node.js API', icon: Code2, desc: 'Express + TypeScript' },
  { id: 'monorepo', name: 'Monorepo', icon: Folder, desc: 'Turborepo structure' },
]

const CATEGORIES = ['All', 'Actions', 'Labels', 'Layout', 'Forms', 'Data', 'Display', 'ForSure']

interface LeftSidebarProps {
  fileStructure: FileNode
  onFileStructureChange?: (structure: FileNode) => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  readOnly?: boolean
  onInsertSnippet?: (snippet: string) => void
  className?: string
  style?: React.CSSProperties
}

export function LeftSidebar({
  fileStructure,
  onFileStructureChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  readOnly,
  onInsertSnippet,
  className,
  style,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('layers')
  const [activeCategory, setActiveCategory] = useState('All')
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)

  const tabs: { id: SidebarTab; icon: React.ElementType; label: string }[] = [
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'components', icon: Package, label: 'Components' },
    { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  ]

  const filtered =
    activeCategory === 'All'
      ? FORSURE_COMPONENTS
      : FORSURE_COMPONENTS.filter(c => c.category === activeCategory)

  const handleInsert = (item: ComponentItem) => {
    if (onInsertSnippet) {
      onInsertSnippet(item.snippet)
    }
    navigator.clipboard.writeText(item.snippet).catch(() => {})
    setCopiedSnippet(item.id)
    setTimeout(() => setCopiedSnippet(null), 1500)
  }

  return (
    <div
      style={style}
      className={cn(
        'flex flex-col bg-[#051820] border-r border-[#0A4D68]/40 overflow-hidden',
        className
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#0A4D68]/40 flex-shrink-0">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            title={label}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2',
              activeTab === id
                ? 'border-[#8CFFE6] text-[#8CFFE6] bg-[#0A4D68]/10'
                : 'border-transparent text-[#8CFFE6]/40 hover:text-[#8CFFE6]/70 hover:bg-[#0A4D68]/10'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Layers tab — file tree */}
        {activeTab === 'layers' && (
          <div className="h-full">
            <FileStructureVisualization
              structure={fileStructure}
              onStructureChange={onFileStructureChange}
              readOnly={readOnly}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
              className="h-full"
            />
          </div>
        )}

        {/* Components tab */}
        {activeTab === 'components' && (
          <div className="flex flex-col h-full">
            {/* Category filter */}
            <div className="px-2 py-2 border-b border-[#0A4D68]/30 flex-shrink-0">
              <div className="flex gap-1 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium transition-all',
                      activeCategory === cat
                        ? 'bg-[#8CFFE6] text-[#05161A]'
                        : 'bg-[#0A4D68]/20 text-[#8CFFE6]/60 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/40'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Component grid */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filtered.map(item => {
                const Icon = item.icon
                const isCopied = copiedSnippet === item.id
                return (
                  <div
                    key={item.id}
                    className="group flex items-start gap-2.5 p-2.5 rounded-md bg-[#020d0f] border border-[#0A4D68]/20 hover:border-[#8CFFE6]/30 transition-all cursor-default"
                  >
                    <div className="h-7 w-7 rounded bg-[#0A4D68]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-[#8CFFE6]/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#8CFFE6]/90">{item.name}</span>
                        <Badge
                          variant="outline"
                          size="sm"
                          className="text-[10px] px-1 py-0 text-[#8CFFE6]/40 border-[#0A4D68]/60"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-[#8CFFE6]/40 mt-0.5 leading-relaxed">{item.description}</p>
                      {item.variants && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {item.variants.map(v => (
                            <span
                              key={v}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#0A4D68]/20 text-[#8CFFE6]/40"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleInsert(item)}
                      title="Copy snippet"
                      className={cn(
                        'flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all opacity-0 group-hover:opacity-100',
                        isCopied
                          ? 'bg-[#8CFFE6]/20 text-[#8CFFE6]'
                          : 'bg-[#0A4D68]/30 text-[#8CFFE6]/60 hover:bg-[#8CFFE6]/20 hover:text-[#8CFFE6]'
                      )}
                    >
                      {isCopied ? 'Copied' : (
                        <>
                          Insert
                          <ArrowRight className="h-2.5 w-2.5" />
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Templates tab */}
        {activeTab === 'templates' && (
          <div className="p-3 space-y-2">
            <p className="text-[10px] text-[#8CFFE6]/40 uppercase tracking-widest font-medium mb-3 px-0.5">
              Starter Templates
            </p>
            {TEMPLATES.map(tmpl => {
              const Icon = tmpl.icon
              return (
                <button
                  key={tmpl.id}
                  className="w-full flex items-center gap-3 p-3 rounded-md bg-[#020d0f] border border-[#0A4D68]/20 hover:border-[#8CFFE6]/30 transition-all text-left group"
                >
                  <div className="h-8 w-8 rounded bg-[#0A4D68]/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#8CFFE6]/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#8CFFE6]/90">{tmpl.name}</p>
                    <p className="text-[10px] text-[#8CFFE6]/40">{tmpl.desc}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#8CFFE6]/30 group-hover:text-[#8CFFE6]/60 transition-colors flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
