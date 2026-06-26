'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/forsure-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/forsure-input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Plus, Loader2 } from 'lucide-react'

interface CreateProjectDialogProps {
  onSuccess?: (project: any) => void
  trigger?: React.ReactNode
}

export function CreateProjectDialog({
  onSuccess,
  trigger,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as const,
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required',
        variant: 'destructive',
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'Project description is required',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('fs_access_token')

      if (!token) {
        toast({
          title: 'Error',
          description: 'Not authenticated',
          variant: 'destructive',
        })
        return
      }

      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create project')
      }

      toast({
        title: 'Success',
        description: 'Project created successfully',
      })

      setFormData({
        title: '',
        description: '',
        status: 'active',
      })

      setOpen(false)

      if (onSuccess) {
        onSuccess(json.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace. You can edit details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Project Name
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g., Website Redesign"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe your project..."
              disabled={loading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-2"
            >
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={value =>
                handleChange('status', value)
              }
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
