import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps {
  variant?: 'default' | 'outline' | 'dark'
  size?: 'sm' | 'md'
  className?: string
  children?: ReactNode
}

const variantClasses: Record<'default' | 'outline' | 'dark', string> = {
  default: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
  outline: 'bg-white text-neutral-800 border border-neutral-300',
  dark: 'bg-neutral-900 text-white border border-neutral-900',
}

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
  md: 'text-sm px-3 py-1 rounded-full font-medium',
}

export function Badge({ variant = 'default', size = 'sm', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
