'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/forsure-button'
import { Sparkles, ChevronLeft, ChevronRight, Palette, Code } from 'lucide-react'
import {
  ProjectDetailsForm,
  type ProjectDetails,
} from './components/project-details-form'
import { FormProgress } from './components/form-progress'
import { useSavedProjects } from './hooks/use-saved-projects'
import { ChatInterface } from './components/chat-interface'
import { VisualizationPanel } from './components/visualization-panel'
import { useFileStructureHistory } from './hooks/use-file-structure-history'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/contexts/subscription-context'
import { FeatureGate } from '@/components/feature-gate'
import { useToast } from '@/components/ui/use-toast'
import { useTopbar } from './components/topbar-provider'
import { Badge } from '@/components/ui/forsure-badge'

export default function ChatApp() {
  const { mode, onModeChange, newProjectTrigger } = useTopbar()
  const isDesignMode = mode === 'design'

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobilePanel, setShowMobilePanel] = useState<'chat' | 'viz' | 'secondary'>('chat')
  const [leftPanelWidth, setLeftPanelWidth] = useState(38)
  const [rightPanelWidth, setRightPanelWidth] = useState(28)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [forSureFiles, setForSureFiles] = useState<any[]>([])
  const [rightChatMessages, setRightChatMessages] = useState<any[]>([])
  const [rightChatInput, setRightChatInput] = useState('')
  const [rightChatLoading, setRightChatLoading] = useState(false)
  const [isDraftProject, setIsDraftProject] = useState(false)

  const COLLAPSED_W = 3

  const { toast } = useToast()
  const { isDemoMode } = useAuth()
  const { can, permissions } = useSubscription()

  const {
    savedProjects,
    saveProject,
    deleteProject,
    getProject,
    isLoaded,
  } = useSavedProjects()

  const {
    fileStructure: activeFileStructure,
    updateStructure,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  } = useFileStructureHistory({
    name: 'root',
    type: 'directory',
    children: [],
  })

  // ── Responsive ──────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Trigger new project from topbar button
  useEffect(() => {
    if (newProjectTrigger > 0) handleStartNewProject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newProjectTrigger])

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleFormComplete = (details: ProjectDetails) => {
    setProjectDetails(details)
    setEditingProject(false)
    setIsDraftProject(false)
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: isDemoMode
          ? `Welcome to the ForSure AI Demo! Working on "${details.name}" — a ${details.type} built with ${details.framework}. Full feature access is enabled.`
          : `Welcome to ForSure AI! Let's build "${details.name}" — a ${details.type} using ${details.framework} with ${details.languages.join(', ')}. How can I help with your project structure?`,
      },
    ])
    const root = { name: 'root', type: 'directory', children: [] }
    updateStructure(root, false)
    clearHistory(root)
    toast({ title: 'Project created', description: `"${details.name}" is ready.` })
  }

  const handleStartNewProject = () => {
    const max = permissions.maxProjects
    if (max !== -1 && savedProjects.length >= max) {
      toast({
        title: 'Project limit reached',
        description: `Your plan allows up to ${max} project${max === 1 ? '' : 's'}. Upgrade to create more.`,
        variant: 'destructive',
      })
      return
    }
    setProjectDetails(null)
    setEditingProject(false)
    setMessages([])
    setIsDraftProject(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you're asking about "${userMsg.content}". How can I help further with your project?`,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleRightChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rightChatInput.trim()) return
    const userMsg = { id: Date.now().toString(), role: 'user', content: rightChatInput }
    setRightChatMessages(prev => [...prev, userMsg])
    setRightChatInput('')
    setRightChatLoading(true)
    setTimeout(() => {
      setRightChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Design AI: Reviewing "${userMsg.content}" from a design perspective. I can help with layout, components, and visual structure.`,
        },
      ])
      setRightChatLoading(false)
    }, 1000)
  }

  // ── Panel resize ─────────────────────────────────────────────────────────
  const handleLeftResize = (e: React.MouseEvent) => {
    if (leftCollapsed) return
    const startX = e.clientX
    const startW = leftPanelWidth
    const onMove = (ev: MouseEvent) => {
      const cw = document.querySelector('.app-panels')?.clientWidth || 1
      setLeftPanelWidth(Math.min(Math.max(startW + ((ev.clientX - startX) / cw) * 100, 20), 60))
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

  const handleRightResize = (e: React.MouseEvent) => {
    if (rightCollapsed) return
    const startX = e.clientX
    const startW = rightPanelWidth
    const onMove = (ev: MouseEvent) => {
      const cw = document.querySelector('.app-panels')?.clientWidth || 1
      setRightPanelWidth(Math.min(Math.max(startW - ((ev.clientX - startX) / cw) * 100, 20), 50))
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

  // ── Derived widths ───────────────────────────────────────────────────────
  const lw = leftCollapsed ? COLLAPSED_W : leftPanelWidth
  const rw = showRightPanel ? (rightCollapsed ? COLLAPSED_W : rightPanelWidth) : 0
  const midW = 100 - lw - rw - 0.4 // tiny gap for resize handles

  // ── Views ────────────────────────────────────────────────────────────────
  const isNewProject = !projectDetails || editingProject

  // ── New Project view ─────────────────────────────────────────────────────
  if (isNewProject) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header strip */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/80">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {editingProject ? 'Edit Project' : 'New Project'}
            </span>
          </div>
          {/* Mode pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60">
            <button
              onClick={() => onModeChange('dev')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                !isDesignMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="h-3 w-3" /> Dev
            </button>
            <button
              onClick={() => onModeChange('design')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                isDesignMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Palette className="h-3 w-3" /> Design
            </button>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto">
          <div className="container py-10 max-w-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {editingProject ? 'Edit Project Details' : 'Create a New Project'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                {editingProject
                  ? 'Update your project information below.'
                  : "Tell us about your project and we'll set up your workspace with both design and dev tools ready."}
              </p>
            </div>

            <FormProgress
              steps={['Basics', 'Technical', 'Team & Goals', 'Review']}
              currentStep={0}
            />

            <ProjectDetailsForm
              onComplete={handleFormComplete}
              initialDetails={editingProject ? projectDetails : undefined}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Editor view (Design + Dev in one layout) ─────────────────────────────
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Thin project bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-3 py-1.5 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{projectDetails.name}</span>
          {isDraftProject && <Badge variant="outline" className="text-xs flex-shrink-0">Draft</Badge>}
          <span className="text-xs text-muted-foreground hidden sm:inline truncate">
            {projectDetails.type} · {projectDetails.framework} · {projectDetails.languages.join(', ')}
          </span>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-secondary/60 flex-shrink-0">
          <button
            onClick={() => onModeChange('dev')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              !isDesignMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="h-3 w-3" /> Dev
          </button>
          <button
            onClick={() => onModeChange('design')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              isDesignMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Palette className="h-3 w-3" /> Design
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground flex-shrink-0"
          onClick={() => setEditingProject(true)}
        >
          Edit project
        </Button>
      </div>

      {/* Mobile tab bar */}
      {isMobile && (
        <div className="flex-shrink-0 flex border-b border-border/40">
          {(['chat', 'viz', ...(showRightPanel ? ['secondary'] : [])] as const).map(panel => (
            <button
              key={panel}
              onClick={() => setShowMobilePanel(panel as any)}
              className={`flex-1 py-2 text-xs font-medium capitalize transition-colors border-b-2 ${
                showMobilePanel === panel
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {panel === 'viz' ? 'Structure' : panel === 'secondary' ? 'Design AI' : 'Chat'}
            </button>
          ))}
        </div>
      )}

      {/* Three-panel workspace */}
      {isMobile ? (
        <div className="flex-1 overflow-hidden">
          {showMobilePanel === 'chat' && (
            <ChatInterface
              messages={messages}
              input={input}
              isLoading={isLoading}
              projectDetails={projectDetails}
              forSureFiles={forSureFiles}
              onForSureFilesChange={setForSureFiles}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              onCopy={(text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }}
              copiedId={copied}
            />
          )}
          {showMobilePanel === 'viz' && (
            <VisualizationPanel
              projectDetails={projectDetails}
              activeFileStructure={activeFileStructure}
              onFileStructureChange={updateStructure}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
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
          )}
          {showMobilePanel === 'secondary' && (
            <FeatureGate feature="secondaryChat" featureLabel="Design AI Chat">
              <ChatInterface
                messages={rightChatMessages}
                input={rightChatInput}
                isLoading={rightChatLoading}
                projectDetails={projectDetails}
                forSureFiles={forSureFiles}
                onForSureFilesChange={setForSureFiles}
                onInputChange={setRightChatInput}
                onSubmit={handleRightChatSubmit}
                onCopy={(text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }}
                copiedId={copied}
              />
            </FeatureGate>
          )}
        </div>
      ) : (
        <div className="app-panels flex-1 flex overflow-hidden">

          {/* ── Left panel: Dev AI Chat ────────────────────────────────── */}
          <div
            className="flex flex-col h-full bg-background border-r border-border/40 relative overflow-hidden transition-all duration-200"
            style={{ width: `${lw}%` }}
          >
            {leftCollapsed ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <button
                  onClick={() => setLeftCollapsed(false)}
                  className="p-1.5 hover:bg-secondary rounded-md transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="text-[10px] text-muted-foreground [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
                  Dev Chat
                </span>
              </div>
            ) : (
              <>
                <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/20">
                  <div className="flex items-center gap-1.5">
                    <Code className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold">Dev AI</span>
                  </div>
                  <button
                    onClick={() => setLeftCollapsed(true)}
                    className="p-1 hover:bg-secondary rounded transition-colors"
                    title="Collapse"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    messages={messages}
                    input={input}
                    isLoading={isLoading}
                    projectDetails={projectDetails}
                    forSureFiles={forSureFiles}
                    onForSureFilesChange={setForSureFiles}
                    onInputChange={setInput}
                    onSubmit={handleSubmit}
                    onCopy={(text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }}
                    copiedId={copied}
                  />
                </div>
              </>
            )}
          </div>

          {/* Left resize handle */}
          <div
            className="w-1 hover:w-1.5 bg-border/40 hover:bg-primary/40 cursor-ew-resize transition-all flex-shrink-0 flex items-center justify-center"
            onMouseDown={handleLeftResize}
          >
            <div className="h-6 w-0.5 bg-border rounded-full" />
          </div>

          {/* ── Center panel: File Structure / Visualization ───────────── */}
          <div
            className="flex flex-col h-full overflow-hidden transition-all duration-200"
            style={{ width: `${midW}%` }}
          >
            <VisualizationPanel
              projectDetails={projectDetails}
              activeFileStructure={activeFileStructure}
              onFileStructureChange={updateStructure}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
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
              {!showRightPanel && can('secondaryChat') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRightPanel(true)}
                  className="ml-2 h-7 text-xs"
                >
                  Show Design AI
                </Button>
              )}
            </VisualizationPanel>
          </div>

          {/* Right resize handle */}
          {showRightPanel && (
            <div
              className="w-1 hover:w-1.5 bg-border/40 hover:bg-primary/40 cursor-ew-resize transition-all flex-shrink-0 flex items-center justify-center"
              onMouseDown={handleRightResize}
            >
              <div className="h-6 w-0.5 bg-border rounded-full" />
            </div>
          )}

          {/* ── Right panel: Design AI Chat ───────────────────────────── */}
          {showRightPanel && (
            <div
              className="flex flex-col h-full bg-background border-l border-border/40 relative overflow-hidden transition-all duration-200"
              style={{ width: `${rw}%` }}
            >
              {rightCollapsed ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={() => setRightCollapsed(false)}
                    className="p-1.5 hover:bg-secondary rounded-md transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] text-muted-foreground [writing-mode:vertical-lr] tracking-widest uppercase">
                    Design AI
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/20">
                    <div className="flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold">Design AI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRightCollapsed(true)}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                        title="Collapse"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setShowRightPanel(false)}
                        className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                        title="Hide panel"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <FeatureGate feature="secondaryChat" featureLabel="Design AI Chat">
                      <ChatInterface
                        messages={rightChatMessages}
                        input={rightChatInput}
                        isLoading={rightChatLoading}
                        projectDetails={projectDetails}
                        forSureFiles={forSureFiles}
                        onForSureFilesChange={setForSureFiles}
                        onInputChange={setRightChatInput}
                        onSubmit={handleRightChatSubmit}
                        onCopy={(text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000) }}
                        copiedId={copied}
                      />
                    </FeatureGate>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
