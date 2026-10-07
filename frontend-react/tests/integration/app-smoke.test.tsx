import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../../src/App'

describe('Application smoke test', () => {
  it('renders the public shell once the session probe settles', async () => {
    window.location.hash = ''
    render(<App />)

    await waitFor(() => {
      expect(screen.getAllByText('MentorAI').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Tentang Kami & FAQ')).toBeInTheDocument()
    expect(screen.getByText('Masuk')).toBeInTheDocument()
    expect(screen.getByText('Daftar Akun')).toBeInTheDocument()
  })
})
