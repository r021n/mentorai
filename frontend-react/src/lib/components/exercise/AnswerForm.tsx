import type { SyntheticEvent } from 'react'
import { Check, CloudUpload } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface AnswerFormProps {
  value: string
  onChange: (value: string) => void
  wordCount: number
  isSaved: boolean
  isSubmitting: boolean
  minWords?: number
}

export function AnswerForm({
  value,
  onChange,
  wordCount,
  isSaved,
  isSubmitting,
  minWords = 2,
}: AnswerFormProps) {
  function preventAction(event: SyntheticEvent) {
    event.preventDefault()
  }

  const hasEnoughWords = wordCount >= minWords

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="answer-input"
          className="text-xs font-bold uppercase tracking-wider text-neutral-900"
        >
          Jawaban Anda
        </label>
        <span
          className={cn(
            'text-xs tabular-nums',
            hasEnoughWords ? 'font-medium text-neutral-700' : 'text-neutral-600',
          )}
        >
          {wordCount} kata
          {!isSaved && !hasEnoughWords ? ` (minimal ${minWords})` : null}
        </span>
      </div>

      <textarea
        id="answer-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isSaved || isSubmitting}
        readOnly={isSaved}
        onPaste={preventAction}
        onDrop={preventAction}
        placeholder="Ketikkan jawaban Anda secara mandiri di sini (minimal 2 kata)..."
        rows={6}
        className="w-full resize-y rounded-xl border border-neutral-300 bg-white p-4 text-sm leading-relaxed text-neutral-900 transition-colors placeholder:text-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-700"
      />

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-600">
        {isSaved ? (
          <>
            <Check size={13} className="text-emerald-700" />
            <span>Jawaban final tersimpan dan tidak dapat diubah.</span>
          </>
        ) : value.trim().length > 0 ? (
          <>
            <CloudUpload size={13} />
            <span>Draft tersimpan otomatis di perangkat ini.</span>
          </>
        ) : (
          <span>Jawaban dikunci setelah dikirim.</span>
        )}
      </div>
    </section>
  )
}
