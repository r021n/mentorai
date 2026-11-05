import { api } from './client'
import type { AnswerRecord, ExerciseDataResponse } from '../types/answer.types'
import type { Question } from '../types/question.types'
import type { ExerciseTopicStatus, ExerciseTopicSummary } from '../types/topic.types'
import {
  asArray,
  asFiniteNumber,
  asNullableText,
  asObject,
  asText,
  isFiniteNumber,
} from '../utils/normalize'

const EXERCISE_TOPIC_STATUSES: ExerciseTopicStatus[] = [
  'empty',
  'not_started',
  'in_progress',
  'completed',
]

export interface SubmitAnswerResult {
  answerId: number
}

export interface AiFeedbackResult {
  score: number
  feedback: string
}

function isExerciseTopicStatus(value: unknown): value is ExerciseTopicStatus {
  return typeof value === 'string' && (EXERCISE_TOPIC_STATUSES as string[]).includes(value)
}

/**
 * Keeps the UI safe during a rolling deploy where an older backend may still
 * return topics without progress fields.
 */
function normalizeExerciseTopic(topic: unknown): ExerciseTopicSummary {
  const record = asObject<ExerciseTopicSummary>(topic)
  const hasQuestionCount = isFiniteNumber(record.questionCount)
  const questionCount = asFiniteNumber(record.questionCount)
  const answeredCount = isFiniteNumber(record.answeredCount)
    ? Math.min(questionCount, Math.max(0, record.answeredCount))
    : 0
  const totalScore = asFiniteNumber(record.totalScore)
  const maxPossibleScore = asFiniteNumber(record.maxPossibleScore, questionCount * 3)
  const scorePercentage = asFiniteNumber(
    record.scorePercentage,
    maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0,
  )

  const status = isExerciseTopicStatus(record.status)
    ? record.status
    : !hasQuestionCount
      ? 'not_started'
      : questionCount === 0
        ? 'empty'
        : answeredCount === 0
          ? 'not_started'
          : answeredCount >= questionCount
            ? 'completed'
            : 'in_progress'

  return {
    id: asFiniteNumber(record.id),
    name: asText(record.name, 'Topik'),
    questionCount,
    answeredCount,
    totalScore,
    maxPossibleScore,
    scorePercentage,
    status,
  }
}

function normalizeQuestion(question: unknown): Question {
  const record = asObject<Question>(question)

  return {
    id: asFiniteNumber(record.id),
    question: asText(record.question),
    pathImage: asNullableText(record.pathImage),
    imageDescription: asNullableText(record.imageDescription),
    topicId: isFiniteNumber(record.topicId) ? record.topicId : undefined,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : undefined,
  }
}

function normalizeAnswerRecord(answer: unknown): AnswerRecord {
  const record = asObject<AnswerRecord>(answer)

  return {
    id: isFiniteNumber(record.id) ? record.id : undefined,
    questionId: asFiniteNumber(record.questionId),
    answer: asText(record.answer),
    feedback: asNullableText(record.feedback),
    score: asFiniteNumber(record.score),
    userId: isFiniteNumber(record.userId) ? record.userId : undefined,
    topicId: isFiniteNumber(record.topicId) ? record.topicId : undefined,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : undefined,
  }
}

function normalizeExerciseData(input: unknown, requestedTopicId: number): ExerciseDataResponse {
  const record = asObject<ExerciseDataResponse>(input)
  const topic = asObject<{ id: number; name: string }>(record.topic)

  return {
    topic: {
      id: asFiniteNumber(topic.id, requestedTopicId),
      name: asText(topic.name, 'Latihan'),
    },
    questions: asArray<unknown>(record.questions).map(normalizeQuestion),
    answers: asArray<unknown>(record.answers).map(normalizeAnswerRecord),
  }
}

export const exerciseApi = {
  async getExerciseTopics(): Promise<ExerciseTopicSummary[]> {
    const res = await api.get<unknown>('/exercise/topics')
    return asArray<unknown>(res.data).map(normalizeExerciseTopic)
  },

  async getExerciseData(topicId: number): Promise<ExerciseDataResponse> {
    const res = await api.get<unknown>(`/exercise/${topicId}`)
    return normalizeExerciseData(res.data, topicId)
  },

  async submitAnswer(
    topicId: number,
    questionId: number,
    answer: string,
  ): Promise<SubmitAnswerResult> {
    const res = await api.post<unknown>(`/exercise/${topicId}/submit`, {
      questionId,
      answer,
    })
    const data = asObject<SubmitAnswerResult>(res.data)
    return { answerId: asFiniteNumber(data.answerId) }
  },

  async requestFeedback(topicId: number, questionId: number): Promise<AiFeedbackResult> {
    const res = await api.post<unknown>(`/exercise/${topicId}/feedback`, {
      questionId,
    })
    const data = asObject<AiFeedbackResult>(res.data)

    if (typeof data.feedback !== 'string' || data.feedback.trim().length === 0) {
      throw new Error('Respons evaluasi AI tidak valid.')
    }

    return {
      score: asFiniteNumber(data.score),
      feedback: data.feedback,
    }
  },
}
