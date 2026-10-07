import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// `globals` is disabled in vitest.config.ts, so Testing Library cannot hook
// into the framework lifecycle on its own.
afterEach(() => {
  cleanup()
})
