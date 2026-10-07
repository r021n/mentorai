import { cn } from '../../utils/cn'

export interface ProgressBarProps {
  percent: number
  className?: string
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className={cn('w-full bg-neutral-200 h-2 rounded-full overflow-hidden', className)}>
      <div
        className="bg-neutral-900 h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
