import type { AnswerRecord } from '../../types/answer.types'
import type { Question } from '../../types/question.types'
import { cn } from '../../utils/cn'
import { Modal } from '../ui/Modal'

export interface QuestionNavigatorProps {
  isOpen: boolean
  questions: Question[]
  answersMap: Record<number, AnswerRecord>
  currentIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

export function QuestionNavigator({
  isOpen,
  questions,
  answersMap,
  currentIndex,
  onSelect,
  onClose,
}: QuestionNavigatorProps) {
  function selectQuestion(index: number) {
    onSelect(index)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} title="Daftar Soal" onClose={onClose} maxWidth="lg">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {questions.map((question, index) => {
          const isAnswered = Boolean(answersMap[question.id]?.answer)
          const isCurrent = index === currentIndex

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => selectQuestion(index)}
              aria-label={`Soal ${index + 1}, ${isAnswered ? 'sudah dijawab' : 'belum dijawab'}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex h-11 items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                isAnswered
                  ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100',
                isCurrent ? 'ring-2 ring-neutral-900 ring-offset-2' : null,
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-neutral-900" />
          Sudah dijawab
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-neutral-300 bg-white" />
          Belum dijawab
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-2 ring-neutral-900 ring-offset-1" />
          Soal saat ini
        </span>
      </div>
    </Modal>
  )
}
