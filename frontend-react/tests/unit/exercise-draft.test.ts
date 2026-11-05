import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearExerciseDraft,
  exerciseDraftKey,
  readExerciseDraft,
  writeExerciseDraft,
} from '../../src/lib/utils/exercise-draft'

describe('exercise draft storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('scopes draft keys by user, topic, and question', () => {
    expect(exerciseDraftKey(7, 3, 11)).toBe('mentorai:exercise-draft:7:3:11')
    expect(exerciseDraftKey(undefined, 3, 11)).toBe('mentorai:exercise-draft:guest:3:11')
  })

  it('writes and reads a draft', () => {
    const key = exerciseDraftKey(7, 3, 11)
    writeExerciseDraft(key, 'Jawaban sementara')

    expect(readExerciseDraft(key)).toBe('Jawaban sementara')
  })

  it('removes the draft when the value is blank', () => {
    const key = exerciseDraftKey(7, 3, 11)
    writeExerciseDraft(key, 'Jawaban sementara')
    writeExerciseDraft(key, '   ')

    expect(readExerciseDraft(key)).toBe('')
  })

  it('clears a stored draft', () => {
    const key = exerciseDraftKey(7, 3, 11)
    writeExerciseDraft(key, 'Jawaban sementara')
    clearExerciseDraft(key)

    expect(readExerciseDraft(key)).toBe('')
  })
})
