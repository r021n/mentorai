import { cn } from '../../utils/cn'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeDimensions: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8 border-3',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Memuat"
      className={cn(
        'inline-block rounded-full border-neutral-300 border-t-neutral-900 animate-spin',
        sizeDimensions[size],
        className,
      )}
    />
  )
}
