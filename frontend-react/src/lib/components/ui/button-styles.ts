import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900 disabled:bg-neutral-300 disabled:border-neutral-300 disabled:text-neutral-500',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400',
  outline:
    'bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-300 disabled:border-neutral-200 disabled:text-neutral-300',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-300',
  danger:
    'bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white border border-neutral-900 disabled:opacity-40',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md font-medium',
  md: 'text-sm px-4 py-2 rounded-lg font-medium',
  lg: 'text-base px-6 py-2.5 rounded-lg font-medium',
}

interface ButtonClassNameOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/** Shared by Button and Link elements so every action keeps the same vocabulary. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
