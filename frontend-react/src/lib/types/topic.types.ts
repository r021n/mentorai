export interface Topic {
  id: number
  name: string
  createdAt?: string
  questionCount?: number
  completedCount?: number
}

export type ExerciseTopicStatus = 'empty' | 'not_started' | 'in_progress' | 'completed'

export interface ExerciseTopicSummary {
  id: number
  name: string
  questionCount: number
  answeredCount: number
  totalScore: number
  maxPossibleScore: number
  scorePercentage: number
  status: ExerciseTopicStatus
}
