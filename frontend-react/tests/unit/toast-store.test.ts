// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createToastStore } from '../../src/lib/stores/toast'

describe('ToastStore Tests', () => {
  it('should add toasts and auto-dismiss after duration', async () => {
    const store = createToastStore()
    expect(store.getState().toasts).toEqual([])

    store.getState().success('Operasi berhasil', 30)
    expect(store.getState().toasts.length).toBe(1)
    expect(store.getState().toasts[0].message).toBe('Operasi berhasil')
    expect(store.getState().toasts[0].type).toBe('success')

    await new Promise((r) => setTimeout(r, 60))
    expect(store.getState().toasts.length).toBe(0)
  })

  it('should allow manually dismissing a toast by ID', () => {
    const store = createToastStore()
    store.getState().error('Terjadi kesalahan', 0)

    expect(store.getState().toasts.length).toBe(1)
    const toastId = store.getState().toasts[0].id

    store.getState().dismiss(toastId)
    expect(store.getState().toasts.length).toBe(0)
  })

  it('should expose helper shortcuts for every toast type', () => {
    const store = createToastStore()

    store.getState().info('Info singkat', 0)
    store.getState().warning('Peringatan', 0)
    store.getState().show('Pesan custom', 'success', 0)

    expect(store.getState().toasts.map((t) => t.type)).toEqual(['info', 'warning', 'success'])
  })
})
