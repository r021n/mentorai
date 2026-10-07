import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../../src/App'

const { getMe } = vi.hoisted(() => ({ getMe: vi.fn() }))

vi.mock('../../src/lib/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getMe,
  },
}))

describe('Route guard: admin', () => {
  beforeEach(() => {
    getMe.mockReset()
    window.location.hash = ''
  })

  it('renders the dashboard shell for an admin user', async () => {
    getMe.mockResolvedValue({ id: 1, username: 'admin', role: 'admin' })
    window.location.hash = '#/topics'

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Kelola Topik Pembelajaran')).toBeInTheDocument()
    })

    expect(screen.getByText('Panel Pengajar')).toBeInTheDocument()
    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
  })

  it('bounces non-admin users from admin routes to the dashboard', async () => {
    getMe.mockResolvedValue({ id: 2, username: 'siswa', role: 'siswa' })
    window.location.hash = '#/database/users'

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Siswa Workspace')).toBeInTheDocument()
    })

    expect(window.location.hash).toBe('#/dashboard')
  })
})
