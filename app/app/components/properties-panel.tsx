'use client'

import React, { useState } from 'react'
import {
  Settings2,
  Folder,
  File,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  FilePlus,
  FolderPlus,
  MousePointerSquare,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/forsure-badge'
import { cn } from '@/lib/utils'
import type { FileNode } from './file-structure-visualization'

interface PropertiesPanelProps {
  selectedNode?: { path: string; node: FileNode } | null
  projectName?: string
  projectType?: string
  projectFramework?: string
  projectLanguages?: string[]
  onRenameNode?: (path: string, newName: string) => void
  onDeleteNode?: (path: string) => void
  className?: string
  style?: React.CSSProperties
}

interface SectionProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ label, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#0A4D68]/30 last:border-b-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#8CFFE6]/50 hover:text-[#8CFFE6]/80 transition-colors"
      >
        {label}
        {open
          ? <ChevronDown className="h-3 w-3" />
          : <ChevronRight className="h-3 w-3" />
        }
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

function PropRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1">
      <span className="text-[10px] text-[#8CFFE6]/40 flex-shrink-0 pt-0.5">{label}</span>
      <span className={cn(
        'text-xs text-[#8CFFE6]/90 text-right truncate max-w-[140px]',
        mono && 'font-mono text-[10px]'
      )}>
        {value}
      </span>
    </div>
  )
}

export function PropertiesPanel({
  selectedNode,
  projectName,
  projectType,
  projectFramework,
  projectLanguages,
  onRenameNode,
  onDeleteNode,
  className,
  style,
}: PropertiesPanelProps) {
  const [renamingName, setRenamingName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)

  const startRename = () => {
    if (!selectedNode) return
    setRenamingName(selectedNode.node.name)
    setIsRenaming(true)
  }

  const commitRename = () => {
    if (selectedNode && renamingName.trim() && onRenameNode) {
      onRenameNode(selectedNode.path, renamingName.trim())
    }
    setIsRenaming(false)
  }

  const handleDelete = () => {
    if (selectedNode && onDeleteNode) {
      onDeleteNode(selectedNode.path)
    }
  }

  const nodeDepth = selectedNode ? selectedNode.path.split('/').length - 1 : 0
  const childCount = selectedNode?.node.children?.length ?? 0

  return (
    <div
      style={style}
      className={cn(
        'flex flex-col bg-[#051820] border-l border-[#0A4D68]/40 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#0A4D68]/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Settings2 className="h-3.5 w-3.5 text-[#8CFFE6]/60" />
          <span className="text-xs font-semibold text-[#8CFFE6]/80 tracking-wide">Properties</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Nothing selected */}
        {!selectedNode ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 px-4 text-center">
            <MousePointerSquare className="h-8 w-8 text-[#0A4D68]/60" />
            <p className="text-xs text-[#8CFFE6]/30 leading-relaxed">
              Select a file or directory in the Layers panel to inspect its properties.
            </p>
          </div>
        ) : (
          <>
            {/* Node identity */}
            <Section label="Node" defaultOpen>
              {/* Name row */}
              <div className="flex items-center gap-2 mb-2.5 mt-0.5">
                <div className="h-6 w-6 rounded bg-[#0A4D68]/30 flex items-center justify-center flex-shrink-0">
                  {selectedNode.node.type === 'directory'
                    ? <Folder className="h-3.5 w-3.5 text-[#8CFFE6]/60" />
                    : <File className="h-3.5 w-3.5 text-[#8CFFE6]/60" />
                  }
                </div>
                {isRenaming ? (
                  <input
                    value={renamingName}
                    onChange={e => setRenamingName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) commitRename()
                      if (e.key === 'Escape') setIsRenaming(false)
                    }}
                    autoFocus
                    className="flex-1 bg-[#020d0f] border border-[#8CFFE6]/40 rounded px-2 py-1 text-xs text-[#8CFFE6] outline-none font-mono"
                  />
                ) : (
                  <span
                    className="flex-1 text-sm font-semibold text-[#8CFFE6] truncate font-mono cursor-pointer hover:text-[#8CFFE6]/80"
                    onClick={startRename}
                    title="Click to rename"
                  >
                    {selectedNode.node.name}
                  </span>
                )}
              </div>

              <PropRow label="Type" value={
                <Badge
                  variant="outline"
                  size="sm"
                  className={cn(
                    'text-[10px] border-[#0A4D68]/60',
                    selectedNode.node.type === 'directory'
                      ? 'text-[#8CFFE6]/70'
                      : 'text-[#8CFFE6]/50'
                  )}
                >
                  {selectedNode.node.type}
                </Badge>
              } />
              <PropRow label="Path" value={selectedNode.path} mono />
              <PropRow label="Depth" value={String(nodeDepth)} />
              {selectedNode.node.type === 'directory' && (
                <PropRow label="Children" value={String(childCount)} />
              )}
            </Section>

            {/* Description */}
            {selectedNode.node.description && (
              <Section label="Description">
                <p className="text-xs text-[#8CFFE6]/60 leading-relaxed">
                  {selectedNode.node.description}
                </p>
              </Section>
            )}

            {/* ForSure attributes */}
            <Section label="ForSure" defaultOpen={false}>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5 p-2 rounded bg-[#020d0f] border border-[#0A4D68]/20">
                  <Info className="h-3 w-3 text-[#8CFFE6]/30 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#8CFFE6]/40 leading-relaxed">
                    ForSure attributes like{' '}
                    <span className="font-mono text-[#8CFFE6]/60">{'<description>'}</span>,{' '}
                    <span className="font-mono text-[#8CFFE6]/60">Type</span>, and{' '}
                    <span className="font-mono text-[#8CFFE6]/60">Name</span>{' '}
                    are managed via the chat editor.
                  </p>
                </div>
              </div>
            </Section>

            {/* Actions */}
            <Section label="Actions" defaultOpen>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={startRename}
                  className="flex items-center gap-2 px-2.5 py-2 rounded bg-[#020d0f] border border-[#0A4D68]/20 hover:border-[#8CFFE6]/30 text-xs text-[#8CFFE6]/70 hover:text-[#8CFFE6] transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Rename node
                </button>

                {selectedNode.node.type === 'directory' && (
                  <>
                    <button className="flex items-center gap-2 px-2.5 py-2 rounded bg-[#020d0f] border border-[#0A4D68]/20 hover:border-[#8CFFE6]/30 text-xs text-[#8CFFE6]/70 hover:text-[#8CFFE6] transition-all">
                      <FilePlus className="h-3.5 w-3.5" />
                      Add child file
                    </button>
                    <button className="flex items-center gap-2 px-2.5 py-2 rounded bg-[#020d0f] border border-[#0A4D68]/20 hover:border-[#8CFFE6]/30 text-xs text-[#8CFFE6]/70 hover:text-[#8CFFE6] transition-all">
                      <FolderPlus className="h-3.5 w-3.5" />
                      Add child directory
                    </button>
                  </>
                )}

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-2.5 py-2 rounded bg-[#020d0f] border border-red-500/20 hover:border-red-500/50 text-xs text-red-400/60 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete node
                </button>
              </div>
            </Section>
          </>
        )}

        {/* Project info at bottom */}
        {projectName && (
          <div className="mt-auto border-t border-[#0A4D68]/30">
            <Section label="Project" defaultOpen={false}>
              <PropRow label="Name" value={projectName} />
              {projectType && <PropRow label="Type" value={projectType} />}
              {projectFramework && <PropRow label="Framework" value={projectFramework} />}
              {projectLanguages && (
                <PropRow
                  label="Languages"
                  value={projectLanguages.join(', ')}
                />
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}
