const DRAFT_PREFIX = 'mentorai:exercise-draft'

export function exerciseDraftKey(
  userId: number | null | undefined,
  topicId: number,
  questionId: number,
): string {
  return `${DRAFT_PREFIX}:${userId ?? 'guest'}:${topicId}:${questionId}`
}

export function readExerciseDraft(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function writeExerciseDraft(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    if (value.trim().length === 0) {
      window.localStorage.removeItem(key)
      return
    }
    window.localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (private mode/quota); losing a draft should
    // never break the exercise flow.
  }
}

export function clearExerciseDraft(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage failures for the same reason as writes.
  }
}
