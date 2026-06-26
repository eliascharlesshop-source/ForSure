'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/forsure-button'
import { Input } from '@/components/ui/forsure-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/forsure-card'
import { Badge } from '@/components/ui/forsure-badge'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import {
  FolderGit2,
  Plus,
  ArrowUpRight,
  Calendar,
  User,
  Tag,
  Zap,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react'

type OwnerProfile = {
  name: string
  avatar_url: string | null
}

type Project = {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
  owner_id: string
  profiles?: OwnerProfile
  created_at: string
  start_date?: string
  end_date?: string
  progress?: number
  priority?: 'low' | 'medium' | 'high'
  tech_stack?: string[]
  tags?: string[]
  visibility?: 'public' | 'private'
}

const statusConfig = {
  active: {
    label: 'Active',
    icon: Zap,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-green-500/10 text-green-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-400' },
  high: { label: 'High', color: 'bg-red-500/10 text-red-400' },
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')

  useEffect(() => {
    if (user) void fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('fs_access_token')
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Not authenticated',
          description: 'Please login to view projects',
        })
        return
      }
      const res = await fetch(
        `/api/v1/projects?search=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()
      if (!res.ok || !json.success)
        throw new Error(json.error || 'Failed to fetch projects')
      setProjects(json.data?.projects ?? [])
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load projects',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev])
  }

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'recent':
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        )
      case 'progress':
        return (b.progress || 0) - (a.progress || 0)
      default:
        return 0
    }
  })

  if (!user) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view projects
          </h1>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FolderGit2 className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Projects</h1>
              </div>
              <p className="text-muted-foreground">
                Manage and organize all your projects in one place
              </p>
            </div>
            <CreateProjectDialog onSuccess={handleProjectCreated} />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-secondary/30 border border-secondary/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium mb-2">
                Search projects
              </label>
              <Input
                id="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description..."
                className="bg-background"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-secondary/50 rounded-md text-sm"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === 'name'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('progress')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sortBy === 'progress'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Progress
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {sortedProjects.length === 0 && !loading ? (
          <div className="text-center py-12">
            <FolderGit2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {search
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first project'}
            </p>
            <CreateProjectDialog onSuccess={handleProjectCreated} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map(project => {
              const config = statusConfig[project.status]
              const StatusIcon = config.icon
              const priorityConfig_ =
                project.priority && priorityConfig[project.priority]

              return (
                <Card
                  key={project.id}
                  className="border-secondary/50 hover:border-primary/50 hover:bg-secondary/30 transition-all group cursor-pointer overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderGit2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <CardTitle className="text-lg truncate">
                            {project.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            className={`text-xs border ${config.color}`}
                            variant="outline"
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          {priorityConfig_ && (
                            <Badge
                              className={`text-xs ${priorityConfig_.color}`}
                              variant="secondary"
                            >
                              {priorityConfig_.label}
                            </Badge>
                          )}
                          {project.visibility && (
                            <Badge variant="secondary" className="text-xs">
                              {project.visibility}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>

                    {/* Progress Bar */}
                    {project.progress !== undefined && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tech_stack.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground border-t border-secondary/30 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Created{' '}
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {project.profiles && (
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5" />
                          <span>{project.profiles.name}</span>
                        </div>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Tag className="h-3.5 w-3.5 mt-0.5" />
                          <span>{project.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mt-4">Loading projects...</p>
          </div>
        )}
      </div>
    </div>
  )
}
