import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ExerciseTopicSummary } from '../../types/topic.types'
import { EXERCISE_STATUS_META } from '../../constants/exercise'
import { buttonClassName } from '../ui/button-styles'
import { ProgressBar } from '../ui/ProgressBar'

export interface ExerciseTopicListProps {
  topics: ExerciseTopicSummary[]
}

const rowGridClassName =
  'grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_70px_70px_150px] lg:items-center lg:gap-4'

export function ExerciseTopicList({ topics }: ExerciseTopicListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div
        className={`${rowGridClassName} hidden border-b border-neutral-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 lg:grid`}
      >
        <span>Topik</span>
        <span>Progres</span>
        <span>Soal</span>
        <span>Skor</span>
        <span className="text-right">Aksi</span>
      </div>

      <ul className="divide-y divide-neutral-200">
        {topics.map((topic) => {
          const meta = EXERCISE_STATUS_META[topic.status] ?? EXERCISE_STATUS_META.not_started
          const questionCount = topic.questionCount ?? 0
          const answeredCount = topic.answeredCount ?? 0
          const progressPercent =
            questionCount > 0 ? (answeredCount / questionCount) * 100 : 0
          const scoreLabel = answeredCount > 0 ? `${topic.scorePercentage ?? 0}%` : '—'

          return (
            <li key={topic.id} className="px-5 py-4 transition-colors hover:bg-neutral-50">
              <div className={rowGridClassName}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/exercise/$topicId"
                      params={{ topicId: String(topic.id) }}
                      preload="intent"
                      className="truncate text-sm font-semibold text-neutral-950 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                      {topic.name}
                    </Link>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.badgeClassName}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 lg:hidden">
                    <ProgressBar
                      percent={progressPercent}
                      label={`Progres ${topic.name}`}
                      className="h-1.5 max-w-[160px]"
                    />
                    <span className="text-xs tabular-nums text-neutral-600">
                      {answeredCount}/{questionCount}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs tabular-nums text-neutral-700">
                      Skor {scoreLabel}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <ProgressBar percent={progressPercent} label={`Progres ${topic.name}`} />
                  <p className="mt-1 text-[11px] tabular-nums text-neutral-600">
                    {Math.round(progressPercent)}%
                  </p>
                </div>

                <p className="hidden text-sm tabular-nums text-neutral-700 lg:block">
                  {answeredCount}/{questionCount}
                </p>

                <p className="hidden text-sm font-semibold tabular-nums text-neutral-900 lg:block">
                  {scoreLabel}
                </p>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="flex items-center gap-3">
                    {answeredCount > 0 ? (
                      <Link
                        to="/myAnswers/$topicId"
                        params={{ topicId: String(topic.id) }}
                        preload="intent"
                        className="text-xs font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline"
                      >
                        Riwayat
                      </Link>
                    ) : null}

                    {meta.actionLabel ? (
                      <Link
                        to="/exercise/$topicId"
                        params={{ topicId: String(topic.id) }}
                        preload="intent"
                        aria-label={`${meta.actionLabel} ${topic.name}`}
                        className={buttonClassName({ variant: 'outline', size: 'sm' })}
                      >
                        <span>{meta.actionLabel}</span>
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <span
                        className={buttonClassName({
                          variant: 'outline',
                          size: 'sm',
                          className: 'cursor-not-allowed opacity-50',
                        })}
                      >
                        Belum ada soal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
