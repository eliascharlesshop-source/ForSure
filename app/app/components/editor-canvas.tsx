'use client'

import React, { useState } from 'react'
import {
  MessageSquare,
  FolderTree,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { ChatInterface } from './chat-interface'
import { VisualizationPanel } from './visualization-panel'
import { cn } from '@/lib/utils'
import type { FileNode } from './file-structure-visualization'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import { FeatureGate } from '@/components/feature-gate'

type EditorTab = 'chat' | 'structure'

interface ForSureFile {
  name: string
  content: string
  isActive?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ProjectDetails {
  name: string
  type: string
  framework: string
  languages: string[]
  description?: string
  industry?: string
  stage?: string
  teamSize?: string
  timeline?: string
  goals?: string[]
}

interface EditorCanvasProps {
  projectDetails: ProjectDetails
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  forSureFiles: ForSureFile[]
  copiedId?: string | null
  activeFileStructure: FileNode
  canUndo: boolean
  canRedo: boolean
  isDraftProject?: boolean
  rightChatMessages: ChatMessage[]
  rightChatInput: string
  rightChatLoading: boolean
  showRightChat: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCopy: (text: string, id: string) => void
  onForSureFilesChange: (files: ForSureFile[]) => void
  onFileStructureChange: (structure: FileNode) => void
  onUndo: () => void
  onRedo: () => void
  onRightChatInputChange: (value: string) => void
  onRightChatSubmit: (e: React.FormEvent) => void
  onEditProject?: () => void
  className?: string
}

export function EditorCanvas({
  projectDetails,
  messages,
  input,
  isLoading,
  forSureFiles,
  copiedId,
  activeFileStructure,
  canUndo,
  canRedo,
  isDraftProject,
  rightChatMessages,
  rightChatInput,
  rightChatLoading,
  showRightChat,
  onInputChange,
  onSubmit,
  onCopy,
  onForSureFilesChange,
  onFileStructureChange,
  onUndo,
  onRedo,
  onRightChatInputChange,
  onRightChatSubmit,
  onEditProject,
  className,
}: EditorCanvasProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('chat')
  const [chatPanelWidth, setChatPanelWidth] = useState(45)
  const [chatCollapsed, setChatCollapsed] = useState(false)

  const tabs: { id: EditorTab; icon: React.ElementType; label: string }[] = [
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'structure', icon: FolderTree, label: 'Structure' },
  ]

  const handleResizeChat = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startWidth = chatPanelWidth

    const onMove = (me: MouseEvent) => {
      const containerEl = document.getElementById('editor-canvas-inner')
      const containerWidth = containerEl?.clientWidth || 1
      const newWidth = startWidth + ((me.clientX - startX) / containerWidth) * 100
      setChatPanelWidth(Math.min(Math.max(newWidth, 25), 75))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div className={cn('flex flex-col bg-[#020d0f] overflow-hidden', className)}>
      {/* Canvas tab bar */}
      <div className="flex items-center justify-between px-3 bg-[#051820] border-b border-[#0A4D68]/40 flex-shrink-0">
        {/* File-like tabs */}
        <div className="flex items-center gap-0">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all',
                activeTab === id
                  ? 'border-[#8CFFE6] text-[#8CFFE6] bg-[#020d0f]'
                  : 'border-transparent text-[#8CFFE6]/40 hover:text-[#8CFFE6]/70 hover:bg-[#0A4D68]/10'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {id === 'chat' && messages.length > 0 && (
                <span className="h-4 w-4 rounded-full bg-[#8CFFE6]/20 text-[#8CFFE6] text-[9px] flex items-center justify-center font-mono">
                  {messages.filter(m => m.role === 'user').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project badge + edit */}
        <div className="flex items-center gap-2 py-1">
          {isDraftProject && (
            <Badge
              variant="outline"
              size="sm"
              className="text-[10px] text-[#8CFFE6]/50 border-[#0A4D68]/50"
            >
              Draft
            </Badge>
          )}
          <div className="flex items-center gap-1 text-[10px] text-[#8CFFE6]/40">
            <Sparkles className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{projectDetails.name}</span>
            <span className="text-[#0A4D68]">·</span>
            <span>{projectDetails.framework}</span>
          </div>
          {onEditProject && (
            <button
              onClick={onEditProject}
              className="text-[10px] text-[#8CFFE6]/30 hover:text-[#8CFFE6]/60 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Canvas body */}
      {activeTab === 'chat' ? (
        /* Split chat + structure horizontally */
        <div id="editor-canvas-inner" className="flex-1 flex overflow-hidden min-h-0">
          {/* Chat panel */}
          {!chatCollapsed && (
            <div
              className="flex flex-col bg-[#020d0f] overflow-hidden relative"
              style={{ width: `${chatPanelWidth}%` }}
            >
              {/* Chat collapse button */}
              <button
                onClick={() => setChatCollapsed(true)}
                className="absolute top-2 right-2 z-10 h-6 w-6 rounded bg-[#0A4D68]/20 hover:bg-[#0A4D68]/40 flex items-center justify-center text-[#8CFFE6]/40 hover:text-[#8CFFE6] transition-all"
                title="Collapse chat"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <ChatInterface
                messages={messages}
                input={input}
                isLoading={isLoading}
                projectDetails={projectDetails}
                forSureFiles={forSureFiles}
                onForSureFilesChange={onForSureFilesChange}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
                onCopy={onCopy}
                copiedId={copiedId}
              />
            </div>
          )}

          {/* Collapsed chat strip */}
          {chatCollapsed && (
            <div className="w-8 bg-[#051820] border-r border-[#0A4D68]/30 flex flex-col items-center py-3 flex-shrink-0">
              <button
                onClick={() => setChatCollapsed(false)}
                className="h-6 w-6 rounded bg-[#0A4D68]/20 hover:bg-[#0A4D68]/40 flex items-center justify-center text-[#8CFFE6]/40 hover:text-[#8CFFE6] transition-all"
                title="Expand chat"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="mt-3 writing-mode-vertical text-[9px] text-[#8CFFE6]/30 uppercase tracking-widest font-medium">
                Chat
              </div>
            </div>
          )}

          {/* Resize handle */}
          {!chatCollapsed && (
            <div
              className="w-1 hover:w-1.5 bg-[#0A4D68]/30 hover:bg-[#8CFFE6]/30 cursor-ew-resize transition-all flex-shrink-0"
              onMouseDown={handleResizeChat}
            />
          )}

          {/* Visualization panel */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <VisualizationPanel
              projectDetails={projectDetails}
              activeFileStructure={activeFileStructure}
              onFileStructureChange={onFileStructureChange}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={onUndo}
              onRedo={onRedo}
              onFormatAll={() => {}}
              currentTeam={null}
              onMergeVersions={() => {}}
              onCreateBranch={() => {}}
              onSwitchBranch={() => {}}
              onDeleteBranch={() => {}}
              onRenameBranch={() => {}}
              onCreateTag={() => {}}
              onDeleteTag={() => {}}
              onUpdateTag={() => {}}
              onMoveTag={() => {}}
            >
              {showRightChat && (
                <FeatureGate feature="secondaryChat" featureLabel="Secondary AI Chat">
                  <div className="flex flex-col h-full border-l border-[#0A4D68]/30 w-[40%] flex-shrink-0">
                    <div className="px-3 py-2 border-b border-[#0A4D68]/30 flex items-center justify-between flex-shrink-0">
                      <span className="text-xs font-medium text-[#8CFFE6]/70">Secondary AI</span>
                      <X className="h-3.5 w-3.5 text-[#8CFFE6]/30" />
                    </div>
                    <ChatInterface
                      messages={rightChatMessages}
                      input={rightChatInput}
                      isLoading={rightChatLoading}
                      projectDetails={projectDetails}
                      forSureFiles={forSureFiles}
                      onForSureFilesChange={onForSureFilesChange}
                      onInputChange={onRightChatInputChange}
                      onSubmit={onRightChatSubmit}
                      onCopy={onCopy}
                      copiedId={copiedId}
                    />
                  </div>
                </FeatureGate>
              )}
            </VisualizationPanel>
          </div>
        </div>
      ) : (
        /* Full structure panel */
        <div className="flex-1 overflow-hidden min-h-0">
          <VisualizationPanel
            projectDetails={projectDetails}
            activeFileStructure={activeFileStructure}
            onFileStructureChange={onFileStructureChange}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onFormatAll={() => {}}
            currentTeam={null}
            onMergeVersions={() => {}}
            onCreateBranch={() => {}}
            onSwitchBranch={() => {}}
            onDeleteBranch={() => {}}
            onRenameBranch={() => {}}
            onCreateTag={() => {}}
            onDeleteTag={() => {}}
            onUpdateTag={() => {}}
            onMoveTag={() => {}}
          />
        </div>
      )}
    </div>
  )
}
