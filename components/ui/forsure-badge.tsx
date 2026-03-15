import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ForSureComponentProps } from '@/lib/ui-types'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning:
          'border-transparent bg-yellow-500 text-black hover:bg-yellow-600',
        info:
          'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        brand:
          'border-transparent bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/80',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-md',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'pill',
    },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof ForSureComponentProps<HTMLDivElement>>,
    VariantProps<typeof badgeVariants>,
    Omit<ForSureComponentProps<HTMLDivElement>, 'size' | 'shape'> {
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, shape }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
