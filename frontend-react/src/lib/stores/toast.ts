import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration: number
}

export interface ToastStoreState {
  toasts: ToastItem[]
  show: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  dismiss: (id: string) => void
}

export const createToastStore = () =>
  create<ToastStoreState>()((set, get) => ({
    toasts: [],

    show(message, type = 'info', duration = 3500) {
      const id = Math.random().toString(36).substring(2, 9)
      const item: ToastItem = { id, type, message, duration }
      set((state) => ({ toasts: [...state.toasts, item] }))

      if (duration > 0) {
        setTimeout(() => {
          get().dismiss(id)
        }, duration)
      }
    },

    success(message, duration = 3500) {
      get().show(message, 'success', duration)
    },

    error(message, duration = 4500) {
      get().show(message, 'error', duration)
    },

    info(message, duration = 3500) {
      get().show(message, 'info', duration)
    },

    warning(message, duration = 4000) {
      get().show(message, 'warning', duration)
    },

    dismiss(id) {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    },
  }))

export const useToastStore = createToastStore()

/**
 * Singleton helper so components can fire notifications without subscribing:
 * `toast.success('Berhasil')`.
 */
export const toast = {
  show: (message: string, type?: ToastType, duration?: number) =>
    useToastStore.getState().show(message, type, duration),
  success: (message: string, duration?: number) =>
    useToastStore.getState().success(message, duration),
  error: (message: string, duration?: number) => useToastStore.getState().error(message, duration),
  info: (message: string, duration?: number) => useToastStore.getState().info(message, duration),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().warning(message, duration),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
}
