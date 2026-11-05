import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '../../src/lib/api/client'
import { exerciseApi } from '../../src/lib/api/exercise'
import { EXERCISE_STATUS_META } from '../../src/lib/constants/exercise'

function mockGet(data: unknown) {
  vi.spyOn(api, 'get').mockResolvedValue({ success: true, data } as any)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('exercise API contract normalization', () => {
  it('normalizes legacy topics without progress fields', async () => {
    mockGet([{ id: 4, name: 'pencemaran udara' }])

    const topics = await exerciseApi.getExerciseTopics()

    expect(topics).toHaveLength(1)
    expect(topics[0].status).toBe('not_started')
    expect(topics[0].questionCount).toBe(0)
    expect(topics[0].answeredCount).toBe(0)
    expect(topics[0].maxPossibleScore).toBe(0)
    expect(topics[0].scorePercentage).toBe(0)
    expect(EXERCISE_STATUS_META[topics[0].status]).toBeDefined()
  })

  it('derives progress from counts when status is missing', async () => {
    mockGet([{ id: 1, name: 'Topik', questionCount: 4, answeredCount: 2, totalScore: 4 }])

    const [topic] = await exerciseApi.getExerciseTopics()

    expect(topic.status).toBe('in_progress')
    expect(topic.maxPossibleScore).toBe(12)
    expect(topic.scorePercentage).toBe(33)
    expect(EXERCISE_STATUS_META[topic.status]).toBeDefined()
  })

  it('falls back for unknown status values', async () => {
    mockGet([
      {
        id: 1,
        name: 'Topik',
        status: 'unknown-status',
        questionCount: 2,
        answeredCount: 2,
        totalScore: 4,
      },
    ])

    const [topic] = await exerciseApi.getExerciseTopics()

    expect(topic.status).toBe('completed')
    expect(EXERCISE_STATUS_META[topic.status]).toBeDefined()
  })

  it('ignores malformed items in the topics array', async () => {
    mockGet([
      null,
      'oops',
      {
        id: 2,
        name: 'Valid',
        status: 'completed',
        questionCount: 3,
        answeredCount: 3,
        totalScore: 6,
      },
    ])

    const topics = await exerciseApi.getExerciseTopics()

    expect(topics).toHaveLength(3)
    expect(topics[0].status).toBe('not_started')
    expect(topics[1].status).toBe('not_started')
    expect(topics[2].status).toBe('completed')
    expect(EXERCISE_STATUS_META[topics[0].status]).toBeDefined()
  })

  it('returns an empty list for a non-array topics payload', async () => {
    mockGet({ topics: [] })

    await expect(exerciseApi.getExerciseTopics()).resolves.toEqual([])
  })

  it('normalizes a missing exercise payload without throwing', async () => {
    mockGet(undefined)

    const data = await exerciseApi.getExerciseData(7)

    expect(data).toEqual({
      topic: { id: 7, name: 'Latihan' },
      questions: [],
      answers: [],
    })
  })

  it('normalizes malformed questions and answers', async () => {
    mockGet({ topic: { id: 2 }, questions: [null, {}], answers: [null, {}] })

    const data = await exerciseApi.getExerciseData(2)

    expect(data.topic).toEqual({ id: 2, name: 'Latihan' })
    expect(data.questions).toHaveLength(2)
    expect(data.questions[0]).toMatchObject({
      id: 0,
      question: '',
      pathImage: null,
      imageDescription: null,
    })
    expect(data.answers[0]).toMatchObject({
      questionId: 0,
      answer: '',
      feedback: null,
      score: 0,
    })
  })

  it('rejects an invalid AI feedback payload', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ success: true, data: {} } as any)

    await expect(exerciseApi.requestFeedback(1, 2)).rejects.toThrow(
      'Respons evaluasi AI tidak valid.',
    )
  })
})
