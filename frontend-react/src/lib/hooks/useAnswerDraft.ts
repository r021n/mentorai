import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearExerciseDraft,
  exerciseDraftKey,
  readExerciseDraft,
  writeExerciseDraft,
} from '../utils/exercise-draft'

const AUTOSAVE_DELAY_MS = 300

export interface UseAnswerDraftOptions {
  userId: number | null | undefined
  topicId: number
  questionId: number
  savedAnswer: string
}

export function useAnswerDraft({
  userId,
  topicId,
  questionId,
  savedAnswer,
}: UseAnswerDraftOptions) {
  const key = exerciseDraftKey(userId, topicId, questionId)
  const [draft, setDraftState] = useState(() => savedAnswer || readExerciseDraft(key))
  const keyRef = useRef(key)
  const draftRef = useRef(draft)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // Flush the previous question's pending draft before switching keys.
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
      writeExerciseDraft(keyRef.current, draftRef.current)
    }

    keyRef.current = key
    const nextDraft = savedAnswer || readExerciseDraft(key)
    draftRef.current = nextDraft
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftState(nextDraft)
  }, [key, savedAnswer])

  const setDraft = useCallback((value: string) => {
    draftRef.current = value
    setDraftState(value)

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    const targetKey = keyRef.current
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      writeExerciseDraft(targetKey, value)
    }, AUTOSAVE_DELAY_MS)
  }, [])

  const clearDraft = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    clearExerciseDraft(keyRef.current)
    draftRef.current = ''
    setDraftState('')
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
        writeExerciseDraft(keyRef.current, draftRef.current)
      }
    }
  }, [])

  const isDirty = draft.trim().length > 0 && draft.trim() !== savedAnswer.trim()

  return { draft, setDraft, clearDraft, isDirty }
}
