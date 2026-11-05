import { useEffect, useRef } from 'react'
import { AlertCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { getScoreLabel } from '../../constants/exercise'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

export type FeedbackState = 'idle' | 'loading' | 'ready' | 'error'

export interface FeedbackPanelProps {
  state: FeedbackState
  feedback: string | null
  score: number | null
  loadingText: string
  isLastQuestion: boolean
  onRetry: () => void
  onNext: () => void
}

export function FeedbackPanel({
  state,
  feedback,
  score,
  loadingText,
  isLastQuestion,
  onRetry,
  onNext,
}: FeedbackPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousStateRef = useRef(state)

  useEffect(() => {
    const previousState = previousStateRef.current
    previousStateRef.current = state

    const shouldScroll =
      (previousState === 'idle' && state === 'loading') ||
      (previousState === 'loading' && (state === 'ready' || state === 'error'))

    if (!shouldScroll) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 1023px)').matches) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    panelRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
    })
  }, [state])

  if (state === 'idle') {
    return (
      <div className="hidden rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 lg:block">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
          <Sparkles size={15} />
          <span>Evaluasi AI</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Kirim jawaban Anda untuk melihat evaluasi dan skor dari AI.
        </p>
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <div
        ref={panelRef}
        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
          <Sparkles size={15} />
          <span>Evaluasi AI</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5 text-sm text-neutral-700">
          <Spinner size="sm" />
          <span>{loadingText || 'Menganalisis jawaban Anda...'}</span>
        </div>
        <div className="mt-4 space-y-2" aria-hidden="true">
          <div className="h-2.5 w-full animate-pulse rounded-full bg-neutral-100" />
          <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div
        ref={panelRef}
        className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5"
        aria-live="polite"
      >
        <div className="flex items-start gap-2.5">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-800" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-950">Evaluasi AI belum selesai</p>
            <p className="text-sm leading-relaxed text-neutral-700">
              Koneksi ke AI terputus. Jawaban Anda sudah tersimpan, jadi Anda tidak perlu
              mengetik ulang.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
          <RefreshCw size={14} />
          <span>Coba Lagi</span>
        </Button>
      </div>
    )
  }

  const numericScore = score ?? 0

  return (
    <div
      ref={panelRef}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-950">
          <Sparkles size={15} />
          <span>Evaluasi AI</span>
        </div>
        <Badge variant="dark">
          Skor {numericScore} / 3
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-neutral-700">{getScoreLabel(numericScore)}</p>
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={
                dot < numericScore
                  ? 'h-2 w-2 rounded-full bg-neutral-900'
                  : 'h-2 w-2 rounded-full bg-neutral-200'
              }
            />
          ))}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-800">
        {feedback}
      </p>

      <Button variant="secondary" size="sm" onClick={onNext} className="mt-4 w-full">
        <span>{isLastQuestion ? 'Selesai Latihan' : 'Lanjut ke Soal Berikutnya'}</span>
        <ArrowRight size={14} />
      </Button>
    </div>
  )
}
