import { api } from './client'
import type { MyAnswersSummary } from '../types/answer.types'

export const myAnswersApi = {
  async getByTopic(topicId: number): Promise<MyAnswersSummary> {
    const res = await api.get<MyAnswersSummary>(`/my-answers/${topicId}`)
    return res.data!
  },
}
