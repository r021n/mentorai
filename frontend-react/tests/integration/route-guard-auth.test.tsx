import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../../src/App'

describe('Route guard: auth', () => {
  it('redirects unauthenticated visitors away from protected routes', async () => {
    window.location.hash = '#/dashboard'
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Masuk Akun')).toBeInTheDocument()
    })

    expect(window.location.hash).toBe('#/login')
  })
})
