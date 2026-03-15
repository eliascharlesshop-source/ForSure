import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ForSureComponentProps } from '@/lib/ui-types'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-lg',
        outlined: 'border-2 border-border',
        ghost: 'border-transparent bg-transparent shadow-none',
        brand: 'border-brand-primary bg-brand-primary/10',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer transition-all hover:shadow-md hover:border-brand-primary',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
      fullWidth: false,
    },
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof ForSureComponentProps<HTMLDivElement>>,
    VariantProps<typeof cardVariants>,
    Omit<ForSureComponentProps<HTMLDivElement>, 'padding' | 'fullWidth'> {
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, fullWidth, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding, interactive, fullWidth }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ForSureComponentProps<HTMLDivElement>> & ForSureComponentProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<React.HTMLAttributes<HTMLHeadingElement>, keyof ForSureComponentProps<HTMLHeadingElement>> & ForSureComponentProps<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<React.HTMLAttributes<HTMLParagraphElement>, keyof ForSureComponentProps<HTMLParagraphElement>> & ForSureComponentProps<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ForSureComponentProps<HTMLDivElement>> & ForSureComponentProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ForSureComponentProps<HTMLDivElement>> & ForSureComponentProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
