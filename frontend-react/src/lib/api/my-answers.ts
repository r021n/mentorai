import { api } from './client'
import type { MyAnswerItem, MyAnswersSummary } from '../types/answer.types'
import {
  asArray,
  asFiniteNumber,
  asNullableText,
  asObject,
  asText,
  isFiniteNumber,
} from '../utils/normalize'

function normalizeAnswerItem(item: unknown): MyAnswerItem {
  const record = asObject<MyAnswerItem>(item)

  return {
    questionId: asFiniteNumber(record.questionId),
    questionText: asText(record.questionText),
    pathImage: asNullableText(record.pathImage),
    studentAnswer: asText(record.studentAnswer),
    feedback: asNullableText(record.feedback),
    score: asFiniteNumber(record.score),
  }
}

function normalizeMyAnswersSummary(input: unknown, requestedTopicId: number): MyAnswersSummary {
  const record = asObject<MyAnswersSummary & { percentageScore?: number }>(input)
  const answers = asArray<unknown>(record.answers).map(normalizeAnswerItem)
  const topic = asObject<{ id: number; name: string }>(record.topic)
  const topicId = asFiniteNumber(record.topicId, asFiniteNumber(topic.id, requestedTopicId))

  const totalQuestions = asFiniteNumber(
    record.totalQuestions,
    isFiniteNumber(record.maxPossibleScore)
      ? Math.round(record.maxPossibleScore / 3)
      : answers.length,
  )
  const maxPossibleScore = asFiniteNumber(record.maxPossibleScore, totalQuestions * 3)
  const totalScore = asFiniteNumber(
    record.totalScore,
    answers.reduce((sum, item) => sum + item.score, 0),
  )
  const scorePercentage = asFiniteNumber(
    record.scorePercentage ?? record.percentageScore,
    maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0,
  )

  return {
    topicId,
    topic: {
      id: asFiniteNumber(topic.id, topicId),
      name: asText(topic.name, 'Latihan'),
    },
    totalQuestions,
    answeredQuestions: asFiniteNumber(record.answeredQuestions, answers.length),
    totalScore,
    maxPossibleScore,
    scorePercentage,
    answers,
  }
}

export const myAnswersApi = {
  async getByTopic(topicId: number): Promise<MyAnswersSummary> {
    const res = await api.get<unknown>(`/my-answers/${topicId}`)
    return normalizeMyAnswersSummary(res.data, topicId)
  },
}
