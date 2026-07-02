'use client'

import React, { useState, useCallback } from 'react'
import { FigmaToolbar, type StudioTool } from './figma-toolbar'
import { LeftSidebar } from './left-sidebar'
import { EditorCanvas } from './editor-canvas'
import { PropertiesPanel } from './properties-panel'
import { CliPanel } from './cli-panel'
import { cn } from '@/lib/utils'
import type { FileNode } from './file-structure-visualization'

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

interface StudioLayoutProps {
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
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
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
}

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 0
const RIGHT_PANEL_WIDTH = 240
const CLI_HEIGHT = 200

export function StudioLayout({
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
  mode,
  onModeChange,
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
}: StudioLayoutProps) {
  const [activeTool, setActiveTool] = useState<StudioTool>('select')
  const [leftVisible, setLeftVisible] = useState(true)
  const [rightVisible, setRightVisible] = useState(true)
  const [cliVisible, setCliVisible] = useState(true)
  const [selectedNode, setSelectedNode] = useState<{ path: string; node: FileNode } | null>(null)

  // Right panel resize
  const [rightWidth, setRightWidth] = useState(RIGHT_PANEL_WIDTH)

  const handleRightResize = useCallback((e: React.MouseEvent) => {
    const startX = e.clientX
    const startW = rightWidth
    const onMove = (me: MouseEvent) => {
      const delta = startX - me.clientX
      setRightWidth(Math.min(Math.max(startW + delta, 180), 400))
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
  }, [rightWidth])

  const leftWidth = leftVisible ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH

  return (
    <div className="flex flex-col h-full bg-[#020d0f] overflow-hidden">
      {/* Figma-style toolbar */}
      <FigmaToolbar
        projectName={projectDetails.name}
        activeTool={activeTool}
        onToolChange={setActiveTool}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        mode={mode}
        onModeChange={onModeChange}
        cliVisible={cliVisible}
        onCliToggle={() => setCliVisible(v => !v)}
        leftSidebarVisible={leftVisible}
        onLeftSidebarToggle={() => setLeftVisible(v => !v)}
        rightPanelVisible={rightVisible}
        onRightPanelToggle={() => setRightVisible(v => !v)}
      />

      {/* Three-panel body */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left sidebar — Layers / Components / Templates */}
        {leftVisible && (
          <LeftSidebar
            fileStructure={activeFileStructure}
            onFileStructureChange={onFileStructureChange}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
            onInsertSnippet={(snippet) => {
              // Pre-fill the chat input with the snippet
              onInputChange(snippet)
            }}
            style={{ width: leftWidth, flexShrink: 0 }}
            className="h-full"
          />
        )}

        {/* Left → center resize handle */}
        {leftVisible && (
          <div className="w-px bg-[#0A4D68]/30 hover:bg-[#8CFFE6]/30 hover:w-[3px] cursor-ew-resize transition-all flex-shrink-0" />
        )}

        {/* Center — editor canvas (grows to fill remaining) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Main editor area */}
          <EditorCanvas
            projectDetails={projectDetails}
            messages={messages}
            input={input}
            isLoading={isLoading}
            forSureFiles={forSureFiles}
            copiedId={copiedId}
            activeFileStructure={activeFileStructure}
            canUndo={canUndo}
            canRedo={canRedo}
            isDraftProject={isDraftProject}
            rightChatMessages={rightChatMessages}
            rightChatInput={rightChatInput}
            rightChatLoading={rightChatLoading}
            showRightChat={showRightChat}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            onCopy={onCopy}
            onForSureFilesChange={onForSureFilesChange}
            onFileStructureChange={onFileStructureChange}
            onUndo={onUndo}
            onRedo={onRedo}
            onRightChatInputChange={onRightChatInputChange}
            onRightChatSubmit={onRightChatSubmit}
            onEditProject={onEditProject}
            className={cn(
              'flex-1 min-h-0',
              cliVisible ? '' : 'h-full'
            )}
          />

          {/* CLI terminal — bottom of center column */}
          {cliVisible && (
            <CliPanel
              projectName={projectDetails.name}
              className="h-[200px] flex-shrink-0"
            />
          )}
        </div>

        {/* Center → right resize handle */}
        {rightVisible && (
          <div
            className="w-px bg-[#0A4D68]/30 hover:bg-[#8CFFE6]/30 hover:w-[3px] cursor-ew-resize transition-all flex-shrink-0"
            onMouseDown={handleRightResize}
          />
        )}

        {/* Right panel — Properties inspector */}
        {rightVisible && (
          <PropertiesPanel
            selectedNode={selectedNode}
            projectName={projectDetails.name}
            projectType={projectDetails.type}
            projectFramework={projectDetails.framework}
            projectLanguages={projectDetails.languages}
            style={{ width: rightWidth, flexShrink: 0 }}
            className="h-full"
          />
        )}
      </div>
    </div>
  )
}
