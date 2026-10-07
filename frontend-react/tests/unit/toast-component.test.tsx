import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from '../../src/lib/components/Toast'
import { useToastStore } from '../../src/lib/stores/toast'

describe('Toast component', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('renders the message of every queued toast', () => {
    useToastStore.getState().show('Topik berhasil dibuat.', 'success', 0)
    useToastStore.getState().show('Gagal memuat data.', 'error', 0)

    render(<Toast />)

    expect(screen.getByText('Topik berhasil dibuat.')).toBeInTheDocument()
    expect(screen.getByText('Gagal memuat data.')).toBeInTheDocument()
  })

  it('dismisses a toast when its close button is pressed', async () => {
    const user = userEvent.setup()
    useToastStore.getState().warning('Peringatan penting', 0)

    render(<Toast />)
    expect(screen.getByText('Peringatan penting')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tutup notifikasi' }))

    expect(screen.queryByText('Peringatan penting')).not.toBeInTheDocument()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('renders nothing when the queue is empty', () => {
    const { container } = render(<Toast />)

    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0)
  })
})
