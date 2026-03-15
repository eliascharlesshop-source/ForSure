'use client'

import * as React from 'react'
import { 
  ChevronDown, 
  Palette, 
  Code, 
  Layout, 
  Settings, 
  Users, 
  BarChart3,
  Plus,
  Save,
  Download,
  Share2,
  LogOut,
  HelpCircle,
  User,
  FolderOpen,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/forsure-button'
import { Badge } from '@/components/ui/forsure-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/forsure-input'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface MegaMenuProps {
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
  className?: string
}

export function MegaMenu({ mode, onModeChange, className }: MegaMenuProps) {
  const [showNewProjectDialog, setShowNewProjectDialog] = React.useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false)
  const [showProfileDialog, setShowProfileDialog] = React.useState(false)
  const [showExportDialog, setShowExportDialog] = React.useState(false)
  const [projectName, setProjectName] = React.useState('')
  const { toast } = useToast()

  const handleNewProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      })
      return
    }
    
    toast({
      title: "Project created",
      description: `Project "${projectName}" has been created successfully`,
    })
    
    setProjectName('')
    setShowNewProjectDialog(false)
  }

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your project is being exported...",
    })
    setShowExportDialog(false)
  }

  const handleSave = () => {
    toast({
      title: "Project saved",
      description: "All changes have been saved successfully",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Share link has been copied to clipboard",
    })
  }

  const handleProfileUpdate = () => {
    if (!projectName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your display name",
        variant: "destructive",
      })
      return
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
    
    setProjectName('')
    setShowProfileDialog(false)
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      DropdownMenu,
      null,
      React.createElement(
        DropdownMenuTrigger,
        { asChild: true },
        React.createElement(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "flex items-center gap-2 px-3 py-2 hover:bg-muted/50 relative",
          },
          React.createElement(
            "div",
            {
              className: "absolute -top-1 -right-1",
            },
            React.createElement(
              "div",
              {
                className: "w-2 h-2 bg-red-500 rounded-full flex items-center justify-center",
              },
              React.createElement(
                "span",
                {
                  className: "text-xs text-white font-bold",
                },
                "3"
              )
            )
          ),
          React.createElement(
            "div",
            {
              className: "flex items-center gap-2",
            },
            mode === 'design' 
              ? [
                  React.createElement(Palette, { key: "palette", className: "h-4 w-4" }),
                  React.createElement(
                    "span",
                    { key: "design-text", className: "font-medium" },
                    "Design Mode"
                  ),
                ]
              : [
                  React.createElement(Code, { key: "code", className: "h-4 w-4" }),
                  React.createElement(
                    "span",
                    { key: "dev-text", className: "font-medium" },
                    "Dev Mode"
                  ),
                ]
          ),
          React.createElement(ChevronDown, { className: "h-4 w-4 ml-1" })
        )
      ),
      React.createElement(
        DropdownMenuContent,
        { className: "w-80", align: "start", sideOffset: 8 },
        React.createElement(
          "div",
          { className: "p-2 border-b border-border" },
          React.createElement(
            "div",
            {
              className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
            },
            "Mode"
          ),
          React.createElement(
            "div",
            { className: "space-y-1" },
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => onModeChange('design'),
                className: cn(
                  "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors",
                  mode === 'design' ? "bg-muted" : "hover:bg-muted/50"
                ),
              },
              React.createElement(Palette, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Design Mode"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Visual whiteboard interface"
                )
              ),
              mode === 'design' 
                ? React.createElement(
                    Badge,
                    { variant: "default", className: "ml-auto bg-green-100 text-green-700" },
                    "Active"
                  )
                : null
            ),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => onModeChange('dev'),
                className: cn(
                  "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors",
                  mode === 'dev' ? "bg-muted" : "hover:bg-muted/50"
                ),
              },
              React.createElement(Code, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Dev Mode"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Classic development interface"
                )
              ),
              mode === 'dev' 
                ? React.createElement(
                    Badge,
                    { variant: "default", className: "ml-auto bg-blue-100 text-blue-700" },
                    "Active"
                  )
                : null
            )
          )
        ),
        React.createElement(
          "div",
          { className: "p-2 border-b border-border" },
          React.createElement(
            "div",
            {
              className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
            },
            "Quick Actions"
          ),
          React.createElement(
            "div",
            { className: "space-y-1" },
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => setShowNewProjectDialog(true),
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(Plus, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "New Project"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Create a new project"
                )
              )
            ),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: handleSave,
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(Save, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Save Project"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Save current work"
                )
              )
            ),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: handleShare,
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(Share2, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Share"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Copy share link"
                )
              )
            ),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => setShowExportDialog(true),
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(Download, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Export"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Download project files"
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "p-2" },
          React.createElement(
            "div",
            {
              className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
            },
            "Navigation"
          ),
          React.createElement(
            "div",
            { className: "space-y-1" },
            React.createElement(
              DropdownMenuSub,
              null,
              React.createElement(
                DropdownMenuSubTrigger,
                {
                  className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
                },
                React.createElement(Layout, { className: "h-4 w-4" }),
                React.createElement(
                  "div",
                  { className: "flex-1" },
                  React.createElement(
                    "div",
                    { className: "font-medium" },
                    "Workspace"
                  ),
                  React.createElement(
                    "div",
                    { className: "text-xs text-muted-foreground" },
                    "Projects & files"
                  )
                ),
                React.createElement(ChevronDown, { className: "h-4 w-4" })
              ),
              React.createElement(
                DropdownMenuSubContent,
                null,
                React.createElement(
                  DropdownMenuItem,
                  {
                    className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
                  },
                  React.createElement(FolderOpen, { className: "h-4 w-4" }),
                  React.createElement(
                    "div",
                    { className: "flex-1" },
                    React.createElement(
                      "div",
                      { className: "font-medium" },
                      "Dashboard"
                    ),
                    React.createElement(
                      "div",
                      { className: "text-xs text-muted-foreground" },
                      "Main dashboard view"
                    )
                  )
                ),
                React.createElement(
                  DropdownMenuItem,
                  {
                    className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
                  },
                  React.createElement(BarChart3, { className: "h-4 w-4" }),
                  React.createElement(
                    "div",
                    { className: "flex-1" },
                    React.createElement(
                      "div",
                      { className: "font-medium" },
                      "Analytics"
                    ),
                    React.createElement(
                      "div",
                      { className: "text-xs text-muted-foreground" },
                      "Usage & metrics"
                    )
                  )
                )
              )
            ),
            React.createElement(DropdownMenuSeparator),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => setShowSettingsDialog(true),
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(Settings, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Settings"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Preferences & config"
                )
              )
            ),
            React.createElement(
              DropdownMenuItem,
              {
                onClick: () => setShowProfileDialog(true),
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(User, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Profile"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Account settings"
                )
              )
            ),
            React.createElement(
              DropdownMenuItem,
              {
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(HelpCircle, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Help & Support"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Documentation & help"
                )
              )
            ),
            React.createElement(DropdownMenuSeparator),
            React.createElement(
              DropdownMenuItem,
              {
                className: "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted/50",
              },
              React.createElement(LogOut, { className: "h-4 w-4" }),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "font-medium" },
                  "Sign Out"
                ),
                React.createElement(
                  "div",
                  { className: "text-xs text-muted-foreground" },
                  "Log out of account"
                )
              )
            )
          )
        )
      )
    ),
    React.createElement(
      AlertDialog,
      {
        open: showNewProjectDialog,
        onOpenChange: setShowNewProjectDialog,
      },
      React.createElement(
        AlertDialogContent,
        null,
        React.createElement(
          AlertDialogHeader,
          null,
          React.createElement(
            AlertDialogTitle,
            null,
            "Create New Project"
          ),
          React.createElement(
            AlertDialogDescription,
            null,
            "Enter a name for your new project to get started."
          )
        ),
        React.createElement(
          "div",
          { className: "py-4" },
          React.createElement(Input, {
            placeholder: "Project name...",
            value: projectName,
            onChange: (e: any) => setProjectName(e.target.value),
            className: "w-full",
          })
        ),
        React.createElement(
          AlertDialogFooter,
          null,
          React.createElement(
            AlertDialogCancel,
            { onClick: () => setShowNewProjectDialog(false) },
            "Cancel"
          ),
          React.createElement(
            AlertDialogAction,
            { onClick: handleNewProject },
            "Create Project"
          )
        )
      )
    ),
    React.createElement(
      AlertDialog,
      {
        open: showExportDialog,
        onOpenChange: setShowExportDialog,
      },
      React.createElement(
        AlertDialogContent,
        null,
        React.createElement(
          AlertDialogHeader,
          null,
          React.createElement(
            AlertDialogTitle,
            null,
            "Export Project"
          ),
          React.createElement(
            AlertDialogDescription,
            null,
            "Choose your export format and destination."
          )
        ),
        React.createElement(
          "div",
          { className: "py-4 space-y-4" },
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Export Format"
            ),
            React.createElement(
              "select",
              { className: "w-full p-2 border rounded-md" },
              React.createElement("option", { value: "forsure" }, "ForSure (.forsure)"),
              React.createElement("option", { value: "json" }, "JSON (.json)"),
              React.createElement("option", { value: "zip" }, "ZIP Archive (.zip)")
            )
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Include Assets"
            ),
            React.createElement(
              "div",
              { className: "space-y-2" },
              React.createElement(
                "label",
                { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox", defaultChecked: true }),
                React.createElement("span", { className: "text-sm" }, "Images and media files")
              ),
              React.createElement(
                "label",
                { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox", defaultChecked: true }),
                React.createElement("span", { className: "text-sm" }, "Project history")
              ),
              React.createElement(
                "label",
                { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox" }),
                React.createElement("span", { className: "text-sm" }, "Component dependencies")
              )
            )
          )
        ),
        React.createElement(
          AlertDialogFooter,
          null,
          React.createElement(
            AlertDialogCancel,
            { onClick: () => setShowExportDialog(false) },
            "Cancel"
          ),
          React.createElement(
            AlertDialogAction,
            { onClick: handleExport },
            "Export Project"
          )
        )
      )
    ),
    React.createElement(
      AlertDialog,
      {
        open: showSettingsDialog,
        onOpenChange: setShowSettingsDialog,
      },
      React.createElement(
        AlertDialogContent,
        null,
        React.createElement(
          AlertDialogHeader,
          null,
          React.createElement(
            AlertDialogTitle,
            null,
            "Settings"
          ),
          React.createElement(
            AlertDialogDescription,
            null,
            "Customize your workspace preferences and behavior."
          )
        ),
        React.createElement(
          "div",
          { className: "py-4 space-y-6" },
          React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Theme"
            ),
            React.createElement(
              "select",
              { className: "w-full p-2 border rounded-md" },
              React.createElement("option", null, "Light"),
              React.createElement("option", null, "Dark"),
              React.createElement("option", null, "System")
            )
          ),
          React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Auto-save"
            ),
            React.createElement(
              "label",
              { className: "flex items-center gap-2" },
              React.createElement("input", { type: "checkbox", defaultChecked: true }),
              React.createElement("span", { className: "text-sm" }, "Enable auto-save every 5 minutes")
            )
          ),
          React.createElement(
            "div",
            { className: "space-y-4" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Notifications"
            ),
            React.createElement(
              "div",
              { className: "space-y-2" },
              React.createElement(
                "label",
                { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox", defaultChecked: true }),
                React.createElement("span", { className: "text-sm" }, "Desktop notifications")
              ),
              React.createElement(
                "label",
                { className: "flex items-center gap-2" },
                React.createElement("input", { type: "checkbox", defaultChecked: true }),
                React.createElement("span", { className: "text-sm" }, "Email notifications")
              )
            )
          )
        ),
        React.createElement(
          AlertDialogFooter,
          null,
          React.createElement(
            AlertDialogCancel,
            { onClick: () => setShowSettingsDialog(false) },
            "Cancel"
          ),
          React.createElement(
            AlertDialogAction,
            { onClick: () => setShowSettingsDialog(false) },
            "Save Settings"
          )
        )
      )
    ),
    React.createElement(
      AlertDialog,
      {
        open: showProfileDialog,
        onOpenChange: setShowProfileDialog,
      },
      React.createElement(
        AlertDialogContent,
        null,
        React.createElement(
          AlertDialogHeader,
          null,
          React.createElement(
            AlertDialogTitle,
            null,
            "Profile Settings"
          ),
          React.createElement(
            AlertDialogDescription,
            null,
            "Update your profile information and preferences."
          )
        ),
        React.createElement(
          "div",
          { className: "py-4 space-y-4" },
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Display Name"
            ),
            React.createElement(Input, {
              placeholder: "Enter your name...",
              value: projectName,
              onChange: (e: any) => setProjectName(e.target.value),
              className: "w-full",
            })
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Email"
            ),
            React.createElement(Input, {
              type: "email",
              placeholder: "your.email@example.com",
              defaultValue: "user@example.com",
              className: "w-full",
            })
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            React.createElement(
              "label",
              { className: "text-sm font-medium" },
              "Role"
            ),
            React.createElement(
              "select",
              { className: "w-full p-2 border rounded-md" },
              React.createElement("option", null, "Developer"),
              React.createElement("option", null, "Designer"),
              React.createElement("option", null, "Admin"),
              React.createElement("option", null, "Viewer")
            )
          )
        ),
        React.createElement(
          AlertDialogFooter,
          null,
          React.createElement(
            AlertDialogCancel,
            { onClick: () => setShowProfileDialog(false) },
            "Cancel"
          ),
          React.createElement(
            AlertDialogAction,
            { onClick: handleProfileUpdate },
            "Update Profile"
          )
        )
      )
    )
  )
}
