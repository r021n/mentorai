import { LayoutGrid, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'

export interface FocusHeaderProps {
  topicName: string
  questionLabel?: string
  answeredLabel?: string
  progressPercent?: number
  onExit: () => void
  onOpenNavigator?: () => void
}

export function FocusHeader({
  topicName,
  questionLabel,
  answeredLabel,
  progressPercent,
  onExit,
  onOpenNavigator,
}: FocusHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            aria-label="Keluar dari latihan"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-neutral-600 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <X size={18} />
            <span className="hidden text-xs font-semibold sm:inline">Keluar</span>
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">{topicName}</p>
            {questionLabel || answeredLabel ? (
              <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-600">
                {[questionLabel, answeredLabel].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
        </div>

        {onOpenNavigator ? (
          <Button variant="outline" size="sm" onClick={onOpenNavigator} className="shrink-0">
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">Daftar Soal</span>
          </Button>
        ) : null}
      </div>

      {progressPercent !== undefined ? (
        <ProgressBar
          percent={progressPercent}
          label="Progres jawaban"
          className="-mb-px h-1 rounded-none bg-neutral-200"
        />
      ) : null}
    </header>
  )
}
