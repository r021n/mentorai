import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/Button'

export interface StickyActionBarProps {
  showPrev: boolean
  onPrev?: () => void
  primaryLabel: string
  onPrimary: () => void
  primaryDisabled?: boolean
  primaryIcon?: ReactNode
  hint?: string
}

export function StickyActionBar({
  showPrev,
  onPrev,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryIcon,
  hint,
}: StickyActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-neutral-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        <div>
          {showPrev ? (
            <Button variant="outline" size="sm" onClick={onPrev}>
              <ChevronLeft size={16} />
              <span>Sebelumnya</span>
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {hint ? (
            <span className="hidden text-xs font-medium text-neutral-600 sm:inline">{hint}</span>
          ) : null}
          <Button size="md" onClick={onPrimary} disabled={primaryDisabled}>
            <span>{primaryLabel}</span>
            {primaryIcon}
          </Button>
        </div>
      </div>
    </div>
  )
}
