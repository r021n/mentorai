import { describe, expect, it } from 'vitest'
import { EXERCISE_STATUS_META, getScoreLabel } from '../../src/lib/constants/exercise'

describe('exercise status metadata', () => {
  it('maps every status to a label and action', () => {
    expect(EXERCISE_STATUS_META.empty.actionLabel).toBeNull()
    expect(EXERCISE_STATUS_META.not_started.actionLabel).toBe('Mulai')
    expect(EXERCISE_STATUS_META.in_progress.actionLabel).toBe('Lanjutkan')
    expect(EXERCISE_STATUS_META.completed.actionLabel).toBe('Tinjau')
  })

  it('returns the rubric label for a score', () => {
    expect(getScoreLabel(0)).toBe('Tidak tepat')
    expect(getScoreLabel(2)).toBe('Cukup tepat')
    expect(getScoreLabel(3)).toBe('Sangat tepat')
  })

  it('falls back when the score is unknown', () => {
    expect(getScoreLabel(99)).toBe('Belum dinilai')
  })
})
