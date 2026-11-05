import type { ExerciseTopicStatus } from '../types/topic.types'

export interface ExerciseStatusMeta {
  label: string
  actionLabel: string | null
  badgeClassName: string
}

export const EXERCISE_STATUS_META: Record<ExerciseTopicStatus, ExerciseStatusMeta> = {
  empty: {
    label: 'Belum ada soal',
    actionLabel: null,
    badgeClassName: 'border-neutral-200 bg-neutral-100 text-neutral-600',
  },
  not_started: {
    label: 'Belum dimulai',
    actionLabel: 'Mulai',
    badgeClassName: 'border-neutral-300 bg-white text-neutral-700',
  },
  in_progress: {
    label: 'Sedang berjalan',
    actionLabel: 'Lanjutkan',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  completed: {
    label: 'Selesai',
    actionLabel: 'Tinjau',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
}

export const SCORE_RUBRIC = [
  { score: 0, label: 'Tidak tepat' },
  { score: 1, label: 'Kurang tepat' },
  { score: 2, label: 'Cukup tepat' },
  { score: 3, label: 'Sangat tepat' },
] as const

export function getScoreLabel(score: number): string {
  return SCORE_RUBRIC.find((item) => item.score === score)?.label ?? 'Belum dinilai'
}
