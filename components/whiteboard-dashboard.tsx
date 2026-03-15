'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/forsure-button'
import { Card, CardContent } from '@/components/ui/forsure-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  Layers,
  Settings,
  Save,
  Share2,
  Download,
  Upload,
  Palette,
  Grid3X3,
  Zap,
  Target,
  Activity,
  FileText,
  Code,
  FolderOpen,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
} from 'lucide-react'
import WhiteboardCanvas from './whiteboard-canvas'

interface Project {
  id: string
  name: string
  details: {
    name: string
    type: string
    framework: string
    languages: string[]
    description?: string
  }
  createdAt: string
  lastUpdated?: string
  favorite?: boolean
}

interface WhiteboardDashboardProps {
  projects: Project[]
  onNewProject: () => void
  onSelectProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onQuickCreateProject: (projectData: any) => void
  onStartChat: (initialMessages: any[]) => void
  isLoaded: boolean
}

export default function WhiteboardDashboard({
  projects,
  onNewProject,
  onSelectProject,
  onDeleteProject,
  onQuickCreateProject,
  onStartChat,
  isLoaded,
}: WhiteboardDashboardProps) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(25)
  const [rightPanelWidth, setRightPanelWidth] = useState(25)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [activeLeftTab, setActiveLeftTab] = useState<
    'projects' | 'recent' | 'favorites'
  >('projects')
  const [activeRightTab, setActiveRightTab] = useState<
    'tools' | 'layers' | 'properties'
  >('tools')
  const [searchQuery, setSearchQuery] = useState('')
  const [whiteboardElements, setWhiteboardElements] = useState<any[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const collapsedPanelWidth = 3

  // Responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setLeftPanelCollapsed(true)
        setRightPanelCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Error handling for whiteboard operations
  const handleWhiteboardError = (errorMessage: string) => {
    setError(errorMessage)
    setTimeout(() => setError(null), 5000)
  }

  const handleLeftResize = (e: React.MouseEvent) => {
    if (leftPanelCollapsed) return

    const startX = e.clientX
    const startWidth = leftPanelWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth
      const newWidth =
        startWidth + ((moveEvent.clientX - startX) / containerWidth) * 100
      const constrainedWidth = Math.min(Math.max(newWidth, 15), 45)
      setLeftPanelWidth(constrainedWidth)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  const handleRightResize = (e: React.MouseEvent) => {
    if (rightPanelCollapsed) return

    const startX = e.clientX
    const startWidth = rightPanelWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = window.innerWidth
      const newWidth =
        startWidth - ((moveEvent.clientX - startX) / containerWidth) * 100
      const constrainedWidth = Math.min(Math.max(newWidth, 15), 45)
      setRightPanelWidth(constrainedWidth)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  const filteredProjects = projects.filter(
    project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.details?.framework
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  const recentProjects = projects.slice(0, 5)
  const favoriteProjects = projects.filter(p => p.favorite)

  const handleWhiteboardSave = (elements: any[]) => {
    try {
      setWhiteboardElements(elements)
      console.log('Whiteboard saved:', elements)
    } catch (err) {
      handleWhiteboardError('Failed to save whiteboard data')
    }
  }

  const handleWhiteboardShare = () => {
    try {
      console.log('Sharing whiteboard with elements:', whiteboardElements)
      // Implement share functionality
    } catch (err) {
      handleWhiteboardError('Failed to share whiteboard')
    }
  }

  // Add error display
  const renderErrorAlert = () => {
    if (!error) return null
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    )
  }

  const renderLeftPanel = () => (
    <div
      className={`h-full bg-background border-r-[3px] border-border transition-all duration-300 flex flex-col ${
        leftPanelCollapsed ? 'w-12' : ''
      }`}
      style={{
        width: leftPanelCollapsed
          ? `${collapsedPanelWidth}%`
          : `${leftPanelWidth}%`,
        borderRadius: leftPanelCollapsed ? '0 8px 8px 0' : '0',
      }}
    >
      {/* Left Panel Header */}
      {!leftPanelCollapsed && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Studio</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeLeftTab === 'projects'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveLeftTab('projects')}
            >
              Projects
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeLeftTab === 'recent'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveLeftTab('recent')}
            >
              Recent
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeLeftTab === 'favorites'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveLeftTab('favorites')}
            >
              Favorites
            </button>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {leftPanelCollapsed && (
        <div className="p-2 flex flex-col items-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftPanelCollapsed(false)}
            className="rotate-90"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Left Panel Content */}
      {!leftPanelCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          {activeLeftTab === 'projects' && (
            <div className="space-y-2">
              {filteredProjects.map(project => (
                <Card
                  key={project.id}
                  className="border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onSelectProject(project.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.details.framework}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={e => {
                          e.stopPropagation()
                          // Toggle favorite
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found
                </div>
              )}
            </div>
          )}

          {activeLeftTab === 'recent' && (
            <div className="space-y-2">
              {recentProjects.map(project => (
                <Card
                  key={project.id}
                  className="border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onSelectProject(project.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.details.framework}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeLeftTab === 'favorites' && (
            <div className="space-y-2">
              {favoriteProjects.map(project => (
                <Card
                  key={project.id}
                  className="border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onSelectProject(project.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.details.framework}
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {favoriteProjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No favorite projects
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Left Panel Footer */}
      {!leftPanelCollapsed && (
        <div className="p-4 border-t border-border">
          <Button onClick={onNewProject} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      )}
    </div>
  )

  const renderRightPanel = () => (
    <div
      className={`h-full bg-background border-l-[3px] border-border transition-all duration-300 flex flex-col ${
        rightPanelCollapsed ? 'w-12' : ''
      }`}
      style={{
        width: rightPanelCollapsed
          ? `${collapsedPanelWidth}%`
          : `${rightPanelWidth}%`,
        borderRadius: rightPanelCollapsed ? '8px 0 0 8px' : '0',
      }}
    >
      {/* Right Panel Header */}
      {!rightPanelCollapsed && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Tools</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRightTab === 'tools'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveRightTab('tools')}
            >
              Tools
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRightTab === 'layers'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveRightTab('layers')}
            >
              Layers
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeRightTab === 'properties'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => setActiveRightTab('properties')}
            >
              Properties
            </button>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {rightPanelCollapsed && (
        <div className="p-2 flex flex-col items-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelCollapsed(false)}
            className="-rotate-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Right Panel Content */}
      {!rightPanelCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          {activeRightTab === 'tools' && (
            <div className="space-y-4">
              <Card className="border border-border">
                <CardContent className="p-3">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Whiteboard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-3">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Studio Tools
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Code Generator
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Live Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeRightTab === 'layers' && (
            <div className="space-y-2">
              <Card className="border border-border">
                <CardContent className="p-3">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="p-2 bg-muted rounded">Background</div>
                    <div className="p-2 bg-muted rounded">Grid</div>
                    <div className="p-2 bg-muted rounded">Drawings</div>
                    <div className="p-2 bg-muted rounded">Text</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeRightTab === 'properties' && (
            <div className="space-y-4">
              <Card className="border border-border">
                <CardContent className="p-3">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Properties
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Canvas Size</label>
                      <Select defaultValue="auto">
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="1920x1080">1920x1080</SelectItem>
                          <SelectItem value="1280x720">1280x720</SelectItem>
                          <SelectItem value="800x600">800x600</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Grid Size</label>
                      <Select defaultValue="20">
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10px</SelectItem>
                          <SelectItem value="20">20px</SelectItem>
                          <SelectItem value="40">40px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-background relative">
      {/* Error Alert */}
      {renderErrorAlert()}

      {/* Left Panel */}
      {renderLeftPanel()}

      {/* Left Resize Handle - Hidden on mobile */}
      {!isMobile && !leftPanelCollapsed && (
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-ew-resize transition-colors"
          onMouseDown={handleLeftResize}
          style={{ borderLeft: '3px solid var(--border)' }}
        />
      )}

      {/* Middle Panel - Whiteboard Canvas */}
      <div className="flex-1 flex flex-col relative">
        <WhiteboardCanvas
          onSave={handleWhiteboardSave}
          onShare={handleWhiteboardShare}
          className="border-2 border-border rounded-xl m-2"
        />

        {/* Mobile Panel Toggles */}
        {isMobile && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className="bg-background/80 backdrop-blur"
            >
              <ChevronRight
                className={`h-4 w-4 ${leftPanelCollapsed ? '' : 'rotate-180'}`}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="bg-background/80 backdrop-blur"
            >
              <ChevronLeft
                className={`h-4 w-4 ${rightPanelCollapsed ? '' : 'rotate-180'}`}
              />
            </Button>
          </div>
        )}
      </div>

      {/* Right Resize Handle - Hidden on mobile */}
      {!isMobile && !rightPanelCollapsed && (
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-ew-resize transition-colors"
          onMouseDown={handleRightResize}
          style={{ borderRight: '3px solid var(--border)' }}
        />
      )}

      {/* Right Panel */}
      {renderRightPanel()}
    </div>
  )
}
