'use client'

import * as React from 'react'
import { Palette, Code } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

interface DesignDevToggleProps {
  mode: 'design' | 'dev'
  onModeChange: (mode: 'design' | 'dev') => void
  className?: string
}

export function DesignDevToggle({ mode, onModeChange, className }: DesignDevToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value === 'design' || value === 'dev') {
          onModeChange(value)
        }
      }}
      className={cn(
        'bg-muted/50 border border-border rounded-lg p-1',
        className
      )}
    >
      <ToggleGroupItem
        value="design"
        className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        aria-label="Design mode"
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium">Design</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dev"
        className="flex items-center gap-2 px-3 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        aria-label="Development mode"
      >
        <Code className="h-4 w-4" />
        <span className="text-sm font-medium">Dev</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
