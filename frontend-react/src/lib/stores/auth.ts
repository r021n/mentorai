import { create } from 'zustand'
import { authApi } from '../api/auth'
import type { User } from '../types/auth.types'

export interface AuthStoreState {
  user: User | null
  isLoading: boolean
  init: () => Promise<void>
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

export const createAuthStore = () =>
  create<AuthStoreState>()((set) => ({
    user: null,
    isLoading: true,

    async init() {
      set({ isLoading: true })
      try {
        const user = await authApi.getMe()
        set({ user })
      } catch {
        set({ user: null })
      } finally {
        set({ isLoading: false })
      }
    },

    setUser(user) {
      set({ user })
    },

    async logout() {
      try {
        await authApi.logout()
      } finally {
        set({ user: null })
      }
    },
  }))

export const useAuthStore = createAuthStore()

export const selectIsAuthenticated = (state: AuthStoreState): boolean => state.user !== null
export const selectIsAdmin = (state: AuthStoreState): boolean => state.user?.role === 'admin'
