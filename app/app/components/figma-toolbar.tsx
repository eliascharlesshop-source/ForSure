'use client'

import {
  MousePointer2,
  FolderPlus,
  FilePlus,
  Undo2,
  Redo2,
  Terminal,
  ChevronRight,
  Code2,
  Layers,
  Share2,
  Play,
  PanelLeftOpen,
  PanelRightOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import { cn } from '@/lib/utils'

export type StudioTool = 'select' | 'addFile' | 'addDir'

interface FigmaToolbarProps {
  projectName?: string
  activeTool: StudioTool
  onToolChange: (tool: StudioTool) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
  cliVisible: boolean
  onCliToggle: () => void
  leftSidebarVisible: boolean
  onLeftSidebarToggle: () => void
  rightPanelVisible: boolean
  onRightPanelToggle: () => void
  className?: string
}

const tools = [
  { id: 'select' as StudioTool, icon: MousePointer2, label: 'Select (V)' },
  { id: 'addFile' as StudioTool, icon: FilePlus, label: 'Add File (F)' },
  { id: 'addDir' as StudioTool, icon: FolderPlus, label: 'Add Directory (D)' },
]

export function FigmaToolbar({
  projectName,
  activeTool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  mode,
  onModeChange,
  cliVisible,
  onCliToggle,
  leftSidebarVisible,
  onLeftSidebarToggle,
  rightPanelVisible,
  onRightPanelToggle,
  className,
}: FigmaToolbarProps) {
  return (
    <div
      className={cn(
        'h-10 flex items-center px-2 gap-1 bg-[#05161A] border-b border-[#0A4D68]/50 flex-shrink-0 select-none',
        className
      )}
    >
      {/* Left: sidebar toggle + breadcrumb */}
      <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
        <Button
          variant="ghost"
          size="smIcon"
          className={cn(
            'h-7 w-7 text-[#8CFFE6]/50 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/30',
            leftSidebarVisible && 'text-[#8CFFE6] bg-[#0A4D68]/20'
          )}
          onClick={onLeftSidebarToggle}
          title="Toggle left sidebar"
        >
          <PanelLeftOpen className="h-3.5 w-3.5" />
        </Button>

        <div className="flex items-center gap-1 text-xs text-[#8CFFE6]/60 ml-1">
          <Layers className="h-3 w-3 text-[#8CFFE6]/40" />
          <span className="hidden sm:inline text-[#8CFFE6]/40">ForSure</span>
          <ChevronRight className="h-3 w-3 text-[#8CFFE6]/30 hidden sm:block" />
          <span className="text-[#8CFFE6]/80 font-medium truncate max-w-[140px]">
            {projectName || 'Untitled Project'}
          </span>
        </div>
      </div>

      {/* Center: tool group */}
      <div className="flex-1 flex items-center justify-center gap-0.5">
        <div className="flex items-center gap-0.5 bg-[#020d0f] border border-[#0A4D68]/40 rounded-md p-0.5">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onToolChange(id)}
              title={label}
              className={cn(
                'h-7 w-7 flex items-center justify-center rounded transition-all',
                activeTool === id
                  ? 'bg-[#8CFFE6] text-[#05161A]'
                  : 'text-[#8CFFE6]/50 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/30'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#0A4D68]/40 mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={cn(
              'h-7 w-7 flex items-center justify-center rounded transition-all',
              canUndo
                ? 'text-[#8CFFE6]/70 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/30'
                : 'text-[#0A4D68]/40 cursor-not-allowed'
            )}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={cn(
              'h-7 w-7 flex items-center justify-center rounded transition-all',
              canRedo
                ? 'text-[#8CFFE6]/70 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/30'
                : 'text-[#0A4D68]/40 cursor-not-allowed'
            )}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Right: mode toggle + CLI + panels */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Design / Dev mode toggle */}
        <div className="flex items-center bg-[#020d0f] border border-[#0A4D68]/40 rounded-md overflow-hidden">
          <button
            onClick={() => onModeChange('design')}
            className={cn(
              'h-7 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-all',
              mode === 'design'
                ? 'bg-[#8CFFE6] text-[#05161A]'
                : 'text-[#8CFFE6]/50 hover:text-[#8CFFE6]'
            )}
          >
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Design</span>
          </button>
          <button
            onClick={() => onModeChange('dev')}
            className={cn(
              'h-7 px-2.5 text-xs font-medium flex items-center gap-1.5 transition-all',
              mode === 'dev'
                ? 'bg-[#8CFFE6] text-[#05161A]'
                : 'text-[#8CFFE6]/50 hover:text-[#8CFFE6]'
            )}
          >
            <Code2 className="h-3 w-3" />
            <span className="hidden sm:inline">Dev</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#0A4D68]/40" />

        {/* CLI toggle */}
        <button
          onClick={onCliToggle}
          title="Toggle CLI terminal"
          className={cn(
            'h-7 w-7 flex items-center justify-center rounded transition-all',
            cliVisible
              ? 'text-[#8CFFE6] bg-[#0A4D68]/30'
              : 'text-[#8CFFE6]/40 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/20'
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
        </button>

        {/* Right panel toggle */}
        <button
          onClick={onRightPanelToggle}
          title="Toggle properties panel"
          className={cn(
            'h-7 w-7 flex items-center justify-center rounded transition-all',
            rightPanelVisible
              ? 'text-[#8CFFE6] bg-[#0A4D68]/30'
              : 'text-[#8CFFE6]/40 hover:text-[#8CFFE6] hover:bg-[#0A4D68]/20'
          )}
        >
          <PanelRightOpen className="h-3.5 w-3.5" />
        </button>

        {/* Run button */}
        <button
          title="Run generate"
          className="h-7 px-3 flex items-center gap-1.5 rounded bg-[#8CFFE6] text-[#05161A] text-xs font-semibold hover:bg-[#8CFFE6]/90 transition-colors"
        >
          <Play className="h-3 w-3 fill-current" />
          <span className="hidden sm:inline">Run</span>
        </button>
      </div>
    </div>
  )
}
