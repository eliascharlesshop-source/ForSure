import React from 'react'
import { cn } from '@/lib/utils'
import { ForSureComponentProps } from '@/lib/ui-types'

export interface SkipLinkProps extends ForSureComponentProps<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

/**
 * SkipLink component for WCAG 2.2 AA compliance
 * Provides keyboard navigation to skip directly to main content
 */
export const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
          'bg-brand-primary text-brand-primary-foreground px-4 py-2 rounded-md',
          'text-sm font-medium z-50 focus:outline-none focus:ring-2',
          'focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)
SkipLink.displayName = 'SkipLink'

export interface LandmarkProps extends ForSureComponentProps<HTMLElement> {
  as?: 'main' | 'section' | 'article' | 'aside' | 'nav' | 'header' | 'footer'
  ariaLabel?: string
  ariaLabelledby?: string
}

/**
 * Landmark component for semantic HTML structure
 * Ensures proper ARIA landmarks for screen readers
 */
export const Landmark = React.forwardRef<HTMLElement, LandmarkProps>(
  ({ as: Component = 'section', ariaLabel, ariaLabelledby, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={className}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Landmark.displayName = 'Landmark'

export interface HeadingProps extends ForSureComponentProps<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  visualLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Heading component with proper semantic hierarchy
 * Maintains heading structure while allowing visual styling flexibility
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, visualLevel, className, children, ...props }, ref) => {
    const HeadingTag = `h${level}` as const
    const visualClass = visualLevel ? `text-${getHeadingSize(visualLevel)}` : ''
    
    return (
      <HeadingTag
        ref={ref}
        className={cn(
          'font-semibold tracking-tight',
          getHeadingSize(level),
          visualClass,
          className
        )}
        {...props}
      >
        {children}
      </HeadingTag>
    )
  }
)
Heading.displayName = 'Heading'

function getHeadingSize(level: number): string {
  const sizes = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  }
  return sizes[level as keyof typeof sizes] || sizes[2]
}

export interface LinkProps extends Omit<ForSureComponentProps<HTMLAnchorElement>, 'href'> {
  href: string
  external?: boolean
  showExternalIcon?: boolean
}

/**
 * Accessible link component with proper external link indicators
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ external, showExternalIcon = true, className, children, href, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={external ? `${children} (opens in new tab)` : undefined}
        className={cn(
          'text-brand-primary hover:text-brand-primary/80 underline-offset-4 hover:underline',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
        {external && showExternalIcon && (
          <span className="inline-block ml-1" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    )
  }
)
Link.displayName = 'Link'

export interface FocusIndicatorProps extends ForSureComponentProps<HTMLDivElement> {
  children: React.ReactNode
  showOnFocus?: boolean
}

/**
 * Focus indicator component for better keyboard navigation visibility
 */
export const FocusIndicator = React.forwardRef<HTMLDivElement, FocusIndicatorProps>(
  ({ showOnFocus = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          showOnFocus && 'focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FocusIndicator.displayName = 'FocusIndicator'

export interface LiveRegionProps extends Omit<ForSureComponentProps<HTMLDivElement>, 'aria-relevant'> {
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  busy?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text' | 'additions removals' | 'removals additions' | 'removals text' | 'text additions' | 'text removals'
}

/**
 * Live region component for screen reader announcements
 * Ensures dynamic content changes are properly announced
 */
export const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ 
    politeness = 'polite', 
    atomic = false, 
    busy = false, 
    relevant = 'additions text',
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        aria-live={politeness}
        aria-atomic={atomic}
        aria-busy={busy}
        aria-relevant={relevant}
        className={cn('sr-only', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
LiveRegion.displayName = 'LiveRegion'

export interface DescriptionProps extends ForSureComponentProps<HTMLDivElement> {
  id: string
}

/**
 * Description component for form field descriptions
 * Links descriptions to form controls via aria-describedby
 */
export const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
  ({ id, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn('text-sm text-muted-foreground mt-1', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Description.displayName = 'Description'

export interface ErrorMessageProps extends ForSureComponentProps<HTMLDivElement> {
  id: string
}

/**
 * Error message component for form validation errors
 * Links errors to form controls via aria-describedby
 */
export const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ id, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        role="alert"
        aria-live="polite"
        className={cn('text-sm text-destructive mt-1', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ErrorMessage.displayName = 'ErrorMessage'

export interface VisuallyHiddenProps extends ForSureComponentProps<HTMLSpanElement> {
  children: React.ReactNode
}

/**
 * Visually hidden component for screen reader only content
 * Maintains accessibility while hiding content visually
 */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('sr-only', className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
VisuallyHidden.displayName = 'VisuallyHidden'
