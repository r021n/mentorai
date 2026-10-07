import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
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

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md font-medium',
  md: 'text-sm px-4 py-2 rounded-lg font-medium',
  lg: 'text-base px-6 py-2.5 rounded-lg font-medium',
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
