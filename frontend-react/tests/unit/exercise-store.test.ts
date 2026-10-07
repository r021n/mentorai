// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'
import {
  createExerciseStore,
  selectCurrentAnswerRecord,
  selectCurrentQuestion,
  selectIsFirstQuestion,
  selectIsLastQuestion,
  selectProgressPercent,
} from '../../src/lib/stores/exercise'
import type { Question } from '../../src/lib/types/question.types'
import type { AnswerRecord } from '../../src/lib/types/answer.types'
import type { ExerciseStoreState } from '../../src/lib/stores/exercise'

describe('ExerciseStore Tests', () => {
  let store: ReturnType<typeof createExerciseStore>
  let state: () => ExerciseStoreState

  const mockQuestions: Question[] = [
    { id: 101, question: 'Soal 1', pathImage: null, imageDescription: null },
    { id: 102, question: 'Soal 2', pathImage: null, imageDescription: null },
    { id: 103, question: 'Soal 3', pathImage: null, imageDescription: null },
  ]

  const mockExistingAnswers: AnswerRecord[] = [
    { id: 1, questionId: 101, answer: 'Jawaban Soal 1', feedback: 'Bagus', score: 3 },
  ]

  beforeEach(() => {
    store = createExerciseStore()
    state = () => store.getState()
  })

  it('should initialize with default state', () => {
    expect(state().questions).toEqual([])
    expect(state().currentIndex).toBe(0)
    expect(selectCurrentQuestion(state())).toBeNull()
    expect(selectProgressPercent(state())).toBe(0)
  })

  it('should load topic, questions, and existing answers correctly', () => {
    state().loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, mockExistingAnswers)

    expect(state().topicId).toBe(1)
    expect(state().topicName).toBe('Struktur Data')
    expect(state().questions.length).toBe(3)
    expect(selectCurrentQuestion(state())?.id).toBe(101)
    expect(state().answersMap[101]?.answer).toBe('Jawaban Soal 1')
    expect(selectCurrentAnswerRecord(state())?.score).toBe(3)
  })

  it('should navigate next and previous questions', () => {
    state().loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, [])
    expect(selectIsFirstQuestion(state())).toBe(true)
    expect(selectIsLastQuestion(state())).toBe(false)

    state().next()
    expect(state().currentIndex).toBe(1)
    expect(selectCurrentQuestion(state())?.id).toBe(102)
    expect(selectProgressPercent(state())).toBeCloseTo(66.67, 1)

    state().next()
    expect(state().currentIndex).toBe(2)
    expect(selectCurrentQuestion(state())?.id).toBe(103)
    expect(selectIsLastQuestion(state())).toBe(true)

    state().next()
    expect(state().currentIndex).toBe(2)

    state().prev()
    expect(state().currentIndex).toBe(1)

    state().goTo(0)
    expect(state().currentIndex).toBe(0)
    expect(selectIsFirstQuestion(state())).toBe(true)
  })

  it('should save answer records to answersMap', () => {
    state().loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, [])

    state().saveAnswerRecord(102, {
      answer: 'Ini jawaban kedua',
      score: 2,
      feedback: 'Cukup tepat',
    })

    expect(state().answersMap[102]).toBeDefined()
    expect(state().answersMap[102].answer).toBe('Ini jawaban kedua')
    expect(state().answersMap[102].score).toBe(2)
    expect(state().answersMap[102].feedback).toBe('Cukup tepat')
    expect(state().answersMap[102].questionId).toBe(102)
  })

  it('should track loading flags', () => {
    state().setSubmitting(true)
    state().setGeneratingFeedback(true)
    state().setLoadingText('Menganalisis jawaban Anda...')

    expect(state().isSubmitting).toBe(true)
    expect(state().isGeneratingFeedback).toBe(true)
    expect(state().loadingText).toBe('Menganalisis jawaban Anda...')

    state().loadData({ id: 1, name: 'Struktur Data' }, mockQuestions, [])
    expect(state().isSubmitting).toBe(false)
    expect(state().isGeneratingFeedback).toBe(false)
    expect(state().loadingText).toBe('')
  })
})
