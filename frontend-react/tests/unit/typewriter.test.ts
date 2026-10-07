// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { animateFeedback } from '../../src/lib/utils/typewriter'

describe('Typewriter Feedback Utility Tests', () => {
  it('should immediately call onTick and onComplete if text is empty', () => {
    let tickValue = ''
    let completed = false

    animateFeedback(
      '',
      (val) => {
        tickValue = val
      },
      () => {
        completed = true
      },
    )

    expect(tickValue).toBe('')
    expect(completed).toBe(true)
  })

  it('should progressively reveal text and call onComplete when finished', async () => {
    const text = 'MentorAI'
    const ticks: string[] = []

    await new Promise<void>((resolve) => {
      animateFeedback(
        text,
        (partial) => {
          ticks.push(partial)
        },
        () => {
          resolve()
        },
        5,
      )
    })

    expect(ticks.length).toBe(text.length)
    expect(ticks[ticks.length - 1]).toBe('MentorAI')
  })

  it('should stop revealing characters when cancel function is called', async () => {
    const text = 'Kalimat yang sangat panjang sekali untuk diuji'
    let lastPartial = ''

    const cancel = animateFeedback(
      text,
      (partial) => {
        lastPartial = partial
      },
      () => {},
      10,
    )

    await new Promise((r) => setTimeout(r, 35))
    const capturedLength = lastPartial.length
    expect(capturedLength).toBeGreaterThan(0)

    cancel()

    await new Promise((r) => setTimeout(r, 50))
    expect(lastPartial.length).toBe(capturedLength)
  })
})
