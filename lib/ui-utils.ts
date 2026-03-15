import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { colors, spacing, typography, breakpoints } from './design-tokens'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createResponsiveClasses(
  mobile: string,
  tablet?: string,
  desktop?: string,
  wide?: string
) {
  return cn(
    mobile,
    tablet && `md:${tablet}`,
    desktop && `lg:${desktop}`,
    wide && `xl:${wide}`
  )
}

export function createVariantClasses(
  base: string,
  variants: Record<string, string>,
  variant?: string
) {
  if (!variant || !variants[variant]) return base
  return cn(base, variants[variant])
}

export function getColorValue(colorPath: string): string {
  const keys = colorPath.split('.')
  let value: any = colors
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) {
      console.warn(`Color path "${colorPath}" not found in design tokens`)
      return '#000000'
    }
  }
  
  return value as string
}

export function getSpacingValue(size: keyof typeof spacing): string {
  return spacing[size] || spacing[4]
}

export function getTypographyClasses(
  size: keyof typeof typography.fontSize,
  weight: keyof typeof typography.fontWeight = 'normal',
  align: 'left' | 'center' | 'right' | 'justify' = 'left'
) {
  const [fontSize, lineHeight] = typography.fontSize[size]
  return cn(
    `text-[${fontSize}] leading-[${lineHeight}]`,
    `font-${weight}`,
    `text-${align}`
  )
}

export function createBreakpointClasses(
  breakpoint: keyof typeof breakpoints,
  className: string
) {
  return `${breakpoint}:${className}`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 1
  
  const luminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)
  
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
}

export function getAccessibleColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF')
  const blackContrast = getContrastRatio(backgroundColor, '#000000')
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(prefix = 'forsure'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function camelCase(str: string): string {
  return str
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^[A-Z]/, letter => letter.toLowerCase())
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function arrayToMap<T, K extends keyof T>(
  array: T[],
  key: K
): Map<T[K], T> {
  return new Map(array.map(item => [item[key], item]))
}

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    for (const key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false
    }
    return true
  }
  return false
}
