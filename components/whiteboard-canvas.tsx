'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
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
  Pen,
  Square,
  Circle,
  Type,
  Move,
  Hand,
  Eraser,
  Download,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Palette,
  MousePointer,
  Save,
  Share2,
  Layers,
  Grid3X3,
} from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface DrawingElement {
  id: string
  type: 'pen' | 'rectangle' | 'circle' | 'text' | 'line'
  points: Point[]
  color: string
  strokeWidth: number
  text?: string
  startX?: number
  startY?: number
  endX?: number
  endY?: number
}

interface WhiteboardCanvasProps {
  onSave?: (elements: DrawingElement[]) => void
  onLoad?: (elements: DrawingElement[]) => void
  onShare?: () => void
  className?: string
}

export default function WhiteboardCanvas({
  onSave,
  onLoad,
  onShare,
  className = '',
}: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<
    'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'move' | 'select'
  >('pen')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null
  )
  const [history, setHistory] = useState<DrawingElement[][]>([])
  const [historyStep, setHistoryStep] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<Point>({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const colors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#FFC0CB',
  ]

  const strokeWidths = [1, 2, 3, 5, 8, 12]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const container = containerRef.current
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        redrawCanvas()
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    redrawCanvas()
  }, [elements, currentElement, zoom, pan, showGrid])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Apply transformations
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height)
    }

    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element)
    })

    // Draw current element being drawn
    if (currentElement) {
      drawElement(ctx, currentElement)
    }

    // Restore context state
    ctx.restore()
  }, [elements, currentElement, zoom, pan, showGrid])

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    ctx.setLineDash([5, 5])

    const gridSize = 20
    const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize
    const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize
    const endX = startX + width / zoom + gridSize
    const endY = startY + height / zoom + gridSize

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
      ctx.stroke()
    }

    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
      ctx.stroke()
    }

    ctx.setLineDash([])
  }

  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    ctx.strokeStyle = element.color
    ctx.lineWidth = element.strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    switch (element.type) {
      case 'pen':
        if (element.points.length > 0) {
          ctx.beginPath()
          ctx.moveTo(element.points[0].x, element.points[0].y)
          element.points.forEach(point => {
            ctx.lineTo(point.x, point.y)
          })
          ctx.stroke()
        }
        break

      case 'rectangle':
        if (
          element.startX !== undefined &&
          element.startY !== undefined &&
          element.endX !== undefined &&
          element.endY !== undefined
        ) {
          ctx.beginPath()
          ctx.rect(
            element.startX,
            element.startY,
            element.endX - element.startX,
            element.endY - element.startY
          )
          ctx.stroke()
        }
        break

      case 'circle':
        if (
          element.startX !== undefined &&
          element.startY !== undefined &&
          element.endX !== undefined &&
          element.endY !== undefined
        ) {
          const radius = Math.sqrt(
            Math.pow(element.endX - element.startX, 2) +
              Math.pow(element.endY - element.startY, 2)
          )
          ctx.beginPath()
          ctx.arc(element.startX, element.startY, radius, 0, 2 * Math.PI)
          ctx.stroke()
        }
        break

      case 'line':
        if (
          element.startX !== undefined &&
          element.startY !== undefined &&
          element.endX !== undefined &&
          element.endY !== undefined
        ) {
          ctx.beginPath()
          ctx.moveTo(element.startX, element.startY)
          ctx.lineTo(element.endX, element.endY)
          ctx.stroke()
        }
        break

      case 'text':
        if (element.text && element.points.length > 0) {
          ctx.font = `${element.strokeWidth * 8}px Arial`
          ctx.fillStyle = element.color
          ctx.fillText(element.text, element.points[0].x, element.points[0].y)
        }
        break
    }
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)

    if (currentTool === 'move' || e.button === 1) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    setIsDrawing(true)

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: currentTool === 'eraser' ? 'pen' : currentTool,
      points: [pos],
      color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
      strokeWidth: currentTool === 'eraser' ? strokeWidth * 3 : strokeWidth,
      startX: pos.x,
      startY: pos.y,
      endX: pos.x,
      endY: pos.y,
    }

    if (currentTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        newElement.text = text
        setCurrentElement(newElement)
      } else {
        setIsDrawing(false)
        return
      }
    } else {
      setCurrentElement(newElement)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    if (!isDrawing || !currentElement) return

    const pos = getMousePos(e)

    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentElement(prev => {
        if (!prev) return null
        return {
          ...prev,
          points: [...prev.points, pos],
        }
      })
    } else if (
      currentTool === 'rectangle' ||
      currentTool === 'circle' ||
      currentTool === 'line'
    ) {
      setCurrentElement(prev => {
        if (!prev) return null
        return {
          ...prev,
          endX: pos.x,
          endY: pos.y,
        }
      })
    }
  }

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    if (!isDrawing || !currentElement) return

    const newElements = [...elements, currentElement]
    setElements(newElements)
    setCurrentElement(null)
    setIsDrawing(false)

    // Add to history
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1
      setHistoryStep(newStep)
      setElements(history[newStep] || [])
    }
  }

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1
      setHistoryStep(newStep)
      setElements(history[newStep])
    }
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      setElements([])
      setCurrentElement(null)
      const newHistory = [...history, []]
      setHistory(newHistory)
      setHistoryStep(newHistory.length - 1)
    }
  }

  const handleSave = () => {
    try {
      const data = JSON.stringify(elements)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'whiteboard.json'
      a.click()
      URL.revokeObjectURL(url)

      if (onSave) {
        onSave(elements)
      }
    } catch (error) {
      console.error('Error saving whiteboard:', error)
    }
  }

  const handleLoad = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setIsLoading(true)
        const reader = new FileReader()
        reader.onload = e => {
          try {
            const loadedElements = JSON.parse(e.target?.result as string)
            setElements(loadedElements)
            const newHistory = [...history, loadedElements]
            setHistory(newHistory)
            setHistoryStep(newHistory.length - 1)

            if (onLoad) {
              onLoad(loadedElements)
            }
          } catch (error) {
            console.error('Error loading whiteboard:', error)
            alert(
              'Error loading file. Please ensure it is a valid whiteboard file.'
            )
          } finally {
            setIsLoading(false)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Toolbar */}
      <Card className="m-2 border-[3px] border-border rounded-xl">
        <CardContent className="p-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Drawing Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant={currentTool === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('select')}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'pen' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('pen')}
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'rectangle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('rectangle')}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('circle')}
              >
                <Circle className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('text')}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'eraser' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('eraser')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                variant={currentTool === 'move' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTool('move')}
              >
                <Hand className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
            </div>

            {/* Color and Stroke */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {colors.slice(0, 5).map(color => (
                  <Button
                    key={color}
                    variant={currentColor === color ? 'default' : 'outline'}
                    size="sm"
                    className="w-6 h-6 p-0"
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Select
                value={strokeWidth.toString()}
                onValueChange={v => setStrokeWidth(Number(v))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strokeWidths.map(width => (
                    <SelectItem key={width} value={width.toString()}>
                      {width}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyStep <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant={showGrid ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <Maximize className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoad}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Container */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ cursor: currentTool === 'move' ? 'grab' : 'crosshair' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 bg-white border-[3px] border-border rounded-xl"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={e => e.preventDefault()}
          />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm font-medium">Loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
