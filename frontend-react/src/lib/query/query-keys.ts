import type { AnswerFilters } from '../api/admin'

export const queryKeys = {
  topics: {
    all: ['topics'] as const,
    list: () => ['topics', 'list'] as const,
    detail: (id: number) => ['topics', 'detail', id] as const,
  },
  questions: {
    byTopic: (topicId: number) => ['questions', 'topic', topicId] as const,
  },
  exercise: {
    all: ['exercise'] as const,
    topics: () => ['exercise', 'topics'] as const,
    data: (topicId: number) => ['exercise', 'data', topicId] as const,
  },
  myAnswers: {
    byTopic: (topicId: number) => ['my-answers', topicId] as const,
  },
  admin: {
    users: (search: string) => ['admin', 'users', search] as const,
    answers: (filters: AnswerFilters) => ['admin', 'answers', filters] as const,
    matrix: (topicId: number) => ['admin', 'matrix', topicId] as const,
  },
}
