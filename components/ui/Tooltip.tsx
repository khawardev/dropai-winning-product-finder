'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import type * as React from 'react'
import { cn } from '@/lib/utils'

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

const tooltipVariants = cva(
  "z-50 mb-2 w-fit max-w-sm  origin-(--radix-tooltip-content-transform-origin) select-none rounded-xl border bg-popover px-3 py-1.5 font-medium text-sm shadow-md backdrop-blur-sm dark:bg-accent",
  {
    variants: {
      variant: {
        default: "bg-popover text-foreground dark:bg-accent",
        success: "border-green-700 bg-green-600 dark:bg-green-600 text-white",
        warning: "border-yellow-600 bg-yellow-500 dark:bg-yellow-500 text-black",
        error: "border-red-700 bg-red-600 dark:bg-red-600 text-white",
        info: "border-blue-700 bg-blue-600 dark:bg-blue-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const blurFadeVariants = {
  hidden: {
    opacity: 0,
    y: 4,
    filter: 'blur(4px)',
    scale: 0.96
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1
  },
}

function TooltipContent({
  className,
  sideOffset = 0,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(tooltipVariants({ variant }), className)}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={blurFadeVariants}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
        >
          {children}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
