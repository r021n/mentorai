import { create } from 'zustand'
import type { AnswerRecord } from '../types/answer.types'
import type { Question } from '../types/question.types'

export interface ExerciseStoreState {
  topicId: number
  topicName: string
  questions: Question[]
  answersMap: Record<number, AnswerRecord>
  currentIndex: number
  isSubmitting: boolean
  isGeneratingFeedback: boolean
  loadingText: string

  loadData: (
    topic: { id: number; name: string },
    questions: Question[],
    existingAnswers: AnswerRecord[],
  ) => void
  saveAnswerRecord: (questionId: number, record: Partial<AnswerRecord>) => void
  setSubmitting: (value: boolean) => void
  setGeneratingFeedback: (value: boolean) => void
  setLoadingText: (value: string) => void
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}

export const createExerciseStore = () =>
  create<ExerciseStoreState>()((set, get) => ({
    topicId: 0,
    topicName: '',
    questions: [],
    answersMap: {},
    currentIndex: 0,
    isSubmitting: false,
    isGeneratingFeedback: false,
    loadingText: '',

    loadData(topic, questions, existingAnswers) {
      const map: Record<number, AnswerRecord> = {}
      for (const ans of existingAnswers) {
        map[ans.questionId] = ans
      }
      set({
        topicId: topic.id,
        topicName: topic.name,
        questions,
        answersMap: map,
        currentIndex: 0,
        isSubmitting: false,
        isGeneratingFeedback: false,
        loadingText: '',
      })
    },

    saveAnswerRecord(questionId, record) {
      const existing = get().answersMap[questionId] || {
        questionId,
        answer: '',
        feedback: null,
        score: 0,
      }
      set((state) => ({
        answersMap: {
          ...state.answersMap,
          [questionId]: { ...existing, ...record },
        },
      }))
    },

    setSubmitting(value) {
      set({ isSubmitting: value })
    },

    setGeneratingFeedback(value) {
      set({ isGeneratingFeedback: value })
    },

    setLoadingText(value) {
      set({ loadingText: value })
    },

    next() {
      const { currentIndex, questions } = get()
      if (currentIndex < questions.length - 1) {
        set({ currentIndex: currentIndex + 1 })
      }
    },

    prev() {
      const { currentIndex } = get()
      if (currentIndex > 0) {
        set({ currentIndex: currentIndex - 1 })
      }
    },

    goTo(index) {
      const { questions } = get()
      if (index >= 0 && index < questions.length) {
        set({ currentIndex: index })
      }
    },
  }))

export const useExerciseStore = createExerciseStore()

export const selectCurrentQuestion = (state: ExerciseStoreState): Question | null =>
  state.questions[state.currentIndex] ?? null

export const selectProgressPercent = (state: ExerciseStoreState): number =>
  state.questions.length > 0
    ? ((state.currentIndex + 1) / state.questions.length) * 100
    : 0

export const selectIsFirstQuestion = (state: ExerciseStoreState): boolean =>
  state.currentIndex === 0

export const selectIsLastQuestion = (state: ExerciseStoreState): boolean =>
  state.questions.length > 0 && state.currentIndex === state.questions.length - 1

export const selectCurrentAnswerRecord = (state: ExerciseStoreState): AnswerRecord | null => {
  const question = selectCurrentQuestion(state)
  return question ? state.answersMap[question.id] ?? null : null
}
