import type * as React from 'react'
import { cn } from '@/lib/utils'

type InputVariant = 'default' | 'secondary' | 'error' | 'muted'
type InputSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  icon?: React.ReactNode
  endElement?: React.ReactNode
}

const variantStyles: Record<InputVariant, string> = {
  default:
    "border bg-popover dark:bg-input/20 dark:border-input transition-[color,box-shadow]   ",
  secondary:
    "bg-secondary/20 focus:bg-secondary/10 active:bg-secondary/5 border-secondary/80 focus:border-secondary/40 focus:ring-secondary/40",
  error:
    "bg-input/20 focus:bg-destructive/10 active:bg-destructive/5 border-destructive/90 focus:border-destructive/40 focus:ring-destructive/40",
  muted:
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/50 border-input w-full min-w-0 px-3 py-1 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg border-0 bg-background pl-10 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-2 py-1 text-sm placeholder:text-sm",
  md: "h-10 px-3 py-1 text-base placeholder:text-base",
  lg: "h-11 px-3 py-2 text-base placeholder:text-base",
  xl: "h-13 px-3 py-2 text-base placeholder:text-base",
  "2xl": "h-15 px-3 py-2 text-base placeholder:text-lg",
  "3xl": "h-20 px-30 py-4 text-xl placeholder:text-xl rounded-none",
};

const iconPositionStyles: Record<InputSize, string> = {
  sm: 'left-2',
  md: 'left-3',
  lg: 'left-3',
  xl: 'left-4',
  '2xl': 'left-4',
  '3xl': 'left-6',
}

const iconPaddingStyles: Record<InputSize, string> = {
  sm: 'pl-7',
  md: 'pl-9',
  lg: 'pl-10',
  xl: 'pl-11',
  '2xl': 'pl-12',
  '3xl': 'pl-14',
}

function Input({
  className,
  type,
  variant = 'default',
  size = 'md',
  icon,
  endElement,
  ...props
}: InputProps) {
  const hasIcon = !!icon

  return (
    <div className={cn("relative flex-1", hasIcon && "group")}>
      {icon && (
        <span
          className={cn(
            "absolute top-1/2  -translate-y-1/2 text-muted-foreground/50 transition-opacity group-focus-within:opacity-70",
            iconPositionStyles[size],
          )}
        >
          {icon}
        </span>
      )}
      <input
        className={cn(
          "flex w-full min-w-0 rounded-lg border placeholder:text-sm shadow-xs outline-none transition-colors duration-100 ease-in-out",
          variant !== "muted" && variantStyles[variant],
          variant === "muted" && variantStyles.muted,
          sizeStyles[size],
          hasIcon && iconPaddingStyles[size],
          className,
        )}
        data-slot="input"
        type={type}
        {...props}
      />
      {endElement && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {endElement}
        </div>
      )}
    </div>
  );
}

export { Input, type InputProps, type InputSize }
