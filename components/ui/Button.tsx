'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer rounded-xl select-none items-center justify-center gap-2 whitespace-nowrap font-medium text-sm outline-none backdrop-blur-sm transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm",
        background:
          "bg-background text-primary hover:bg-background/90 active:bg-background/95",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/80 focus-visible:ring-destructive/20 active:bg-destructive/90",
        outline:
          "whitespace-nowrap flex-shrink-0 ios-press text-muted-foreground bg-background border border-border dark:border-white/20 hover:text-foreground active:bg-background/90 active:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary",
        ghost:
          "text-muted-foreground hover:bg-muted/50 hover:text-accent-foreground active:bg-muted/70 active:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30",
        "soft-text":
          "text-primary hover:bg-primary/5 hover:text-primary active:bg-primary/20",
        filter:
          "whitespace-nowrap flex-shrink-0 ios-press text-muted-foreground bg-background border border-border dark:border-white/20 shadow-sm hover:text-foreground",
        blue: "h-11 md:h-10 transition-[background-color,box-shadow] duration-100 disabled:cursor-not-allowed text-sm ios-press focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center justify-center bg-blue-500/15 dark:bg-blue-500/20 hover:bg-blue-500/25 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/30 focus-visible:ring-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 gap-1.5 px-3 text-sm",
        xs: "h-7 gap-1.5 px-2 text-sm",
        lg: "h-11 px-5",
        xl: "h-12 px-5 gap-2",
        "2xl": "h-14 px-6 gap-2.5",
        "3xl": "h-16 px-8 gap-3 text-lg",
        icon: "size-10",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
        "icon-xl": "size-12",
        fab: "size-14 rounded-full shadow-2xl",
      },
      shape: {
        default: "rounded-xl",
        pill: "rounded-full",
        lg: "rounded-xl",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      glow: {
        true: "shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      glow: false,
    },
  },
);

const MotionSlot = motion.create(Slot)

function Button({
  className,
  variant,
  size,
  shape,
  glow,
  asChild = false,
  children,
  effect,
  contentKey,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    effect?: "change"
    contentKey?: string | number
  }) {
  const Comp = asChild ? MotionSlot : (motion.button as any)

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, shape, glow, className }))}
      data-slot="button"
      {...(props as any)}
    >
      {effect === "change" ? (
        <AnimatePresence mode="wait">
          <motion.span
            key={contentKey}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
