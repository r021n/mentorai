import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '../../src/lib/api/client'
import { myAnswersApi } from '../../src/lib/api/my-answers'

function mockGet(data: unknown) {
  vi.spyOn(api, 'get').mockResolvedValue({ success: true, data } as any)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('my-answers API contract normalization', () => {
  it('normalizes the legacy payload without topic and totals', async () => {
    mockGet({
      topicId: 3,
      answers: [
        { questionId: 10, questionText: 'Q', studentAnswer: 'A', feedback: null, score: 2 },
      ],
      totalScore: 2,
      maxPossibleScore: 9,
      percentageScore: 22,
    })

    const summary = await myAnswersApi.getByTopic(3)

    expect(summary.topic).toEqual({ id: 3, name: 'Latihan' })
    expect(summary.totalQuestions).toBe(3)
    expect(summary.answeredQuestions).toBe(1)
    expect(summary.totalScore).toBe(2)
    expect(summary.maxPossibleScore).toBe(9)
    expect(summary.scorePercentage).toBe(22)
    expect(summary.answers[0]).toMatchObject({ questionId: 10, score: 2, feedback: null })
  })

  it('normalizes a missing payload with the requested topic id', async () => {
    mockGet(undefined)

    const summary = await myAnswersApi.getByTopic(9)

    expect(summary.topic).toEqual({ id: 9, name: 'Latihan' })
    expect(summary.totalQuestions).toBe(0)
    expect(summary.answeredQuestions).toBe(0)
    expect(summary.answers).toEqual([])
    expect(summary.scorePercentage).toBe(0)
  })

  it('ignores malformed answer items', async () => {
    mockGet({ topicId: 4, answers: [null, 'oops', {}] })

    const summary = await myAnswersApi.getByTopic(4)

    expect(summary.answers).toHaveLength(3)
    for (const answer of summary.answers) {
      expect(answer.questionId).toBe(0)
      expect(answer.questionText).toBe('')
      expect(answer.studentAnswer).toBe('')
      expect(answer.score).toBe(0)
      expect(answer.feedback).toBeNull()
    }
  })

  it('keeps a valid new payload intact', async () => {
    mockGet({
      topicId: 5,
      topic: { id: 5, name: 'Struktur Data' },
      totalQuestions: 4,
      answeredQuestions: 2,
      totalScore: 4,
      maxPossibleScore: 12,
      scorePercentage: 33,
      answers: [
        {
          questionId: 1,
          questionText: 'Q',
          pathImage: null,
          studentAnswer: 'A',
          feedback: 'F',
          score: 2,
        },
      ],
    })

    const summary = await myAnswersApi.getByTopic(5)

    expect(summary.topic).toEqual({ id: 5, name: 'Struktur Data' })
    expect(summary.totalQuestions).toBe(4)
    expect(summary.answeredQuestions).toBe(2)
    expect(summary.scorePercentage).toBe(33)
  })
})
