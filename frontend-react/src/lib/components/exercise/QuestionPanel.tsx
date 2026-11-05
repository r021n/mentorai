import { Check } from 'lucide-react'
import type { Question } from '../../types/question.types'
import { AntiCheatContainer } from '../AntiCheatContainer'
import { Badge } from '../ui/Badge'

export interface QuestionPanelProps {
  question: Question
  isAnswered: boolean
}

export function QuestionPanel({ question, isAnswered }: QuestionPanelProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <AntiCheatContainer className="space-y-4">
        {isAnswered ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <Check size={12} />
              Sudah dijawab
            </Badge>
          </div>
        ) : null}

        <div
          className="prose max-w-none text-base font-medium leading-relaxed text-neutral-950 sm:text-lg"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />

        {question.pathImage ? (
          <div className="pt-2">
            <img
              src={question.pathImage}
              alt={question.imageDescription || 'Ilustrasi soal'}
              className="mx-auto max-h-[50vh] rounded-lg border border-neutral-200 object-contain"
              loading="lazy"
            />
            {question.imageDescription ? (
              <p className="mt-1.5 text-center text-xs italic text-neutral-600">
                {question.imageDescription}
              </p>
            ) : null}
          </div>
        ) : null}
      </AntiCheatContainer>
    </section>
  )
}
