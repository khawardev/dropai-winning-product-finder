import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap px-2 py-0.5 font-medium text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        background: 'bg-background text-primary hover:bg-background/90',
        destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/60 dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'w-fit border-0 bg-white/20 text-white backdrop-blur-sm',
        emerald: 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20',
        blue: 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20',
        orange: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
        fuchsia: 'bg-brand-fuchsia/10 text-brand-fuchsia border border-brand-fuchsia/20',
        cyan: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-lg',
        default: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'default',
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<'span'>,
  VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  shape,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      className={cn(badgeVariants({ variant, shape }), className)}
      data-slot="badge"
      {...props}
    />
  )
}

export { Badge, badgeVariants }
