import { beforeEach, describe, expect, it } from 'vitest'
import { api, ApiError } from '../../src/lib/api/client'
import { authApi } from '../../src/lib/api/auth'
import { exerciseApi } from '../../src/lib/api/exercise'
import { adminApi } from '../../src/lib/api/admin'

describe('API Client & Domain Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('ApiClient Core Mechanism', () => {
    it('should include Authorization Bearer token from localStorage', async () => {
      api.setToken('test-jwt-token-xyz')

      let capturedUrl = ''
      let capturedHeaders: any = {}

      globalThis.fetch = (async (url: string, opts: any) => {
        capturedUrl = url
        capturedHeaders = opts?.headers || {}
        return {
          ok: true,
          json: async () => ({ success: true, data: { status: 'ok' } }),
        }
      }) as unknown as typeof fetch

      const res = await api.get('/health')
      expect(res.data).toEqual({ status: 'ok' })
      expect(capturedUrl).toContain('/health')
      expect(capturedHeaders.Authorization).toBe('Bearer test-jwt-token-xyz')
    })

    it('should throw ApiError with status and message on failure', async () => {
      globalThis.fetch = (async () => ({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ success: false, message: 'Invalid credentials' }),
      })) as unknown as typeof fetch

      await expect(api.post('/auth/login', { username: 'bad', password: 'bad' })).rejects.toThrow(
        ApiError,
      )
    })
  })

  describe('authApi integration', () => {
    it('should set token upon successful login', async () => {
      globalThis.fetch = (async () => ({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            user: { id: 1, username: 'admin', role: 'admin' },
            token: 'auth-token-12345',
          },
        }),
      })) as unknown as typeof fetch

      const res = await authApi.login({ username: 'admin', password: '123' })
      expect(res.user.username).toBe('admin')
      expect(localStorage.getItem('token')).toBe('auth-token-12345')
    })

    it('should clear token on logout', async () => {
      api.setToken('auth-token-12345')
      expect(localStorage.getItem('token')).toBe('auth-token-12345')

      globalThis.fetch = (async () => ({
        ok: true,
        json: async () => ({ success: true, message: 'Logged out' }),
      })) as unknown as typeof fetch

      await authApi.logout()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('exerciseApi integration', () => {
    it('should submit student answer payload', async () => {
      let capturedBody: any
      let capturedUrl = ''

      globalThis.fetch = (async (url: string, opts: any) => {
        capturedUrl = url
        capturedBody = JSON.parse(opts?.body)
        return {
          ok: true,
          json: async () => ({ success: true, data: { answerId: 42 } }),
        }
      }) as unknown as typeof fetch

      const result = await exerciseApi.submitAnswer(10, 205, 'Ini jawaban tes siswa')
      expect(result.answerId).toBe(42)
      expect(capturedUrl).toContain('/exercise/10/submit')
      expect(capturedBody).toEqual({ questionId: 205, answer: 'Ini jawaban tes siswa' })
    })

    it('should request AI evaluation feedback', async () => {
      globalThis.fetch = (async () => ({
        ok: true,
        json: async () => ({
          success: true,
          data: { score: 3, feedback: 'Analisis konsep sangat akurat dan terstruktur.' },
        }),
      })) as unknown as typeof fetch

      const result = await exerciseApi.requestFeedback(10, 205)
      expect(result.score).toBe(3)
      expect(result.feedback).toContain('Analisis konsep')
    })
  })

  describe('adminApi integration', () => {
    it('should query raw answers with query params', async () => {
      let capturedUrl = ''

      globalThis.fetch = (async (url: string) => {
        capturedUrl = url
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: [{ id: 1, userId: 2, questionId: 10, topicId: 1, answer: 'Ans', score: 2 }],
          }),
        }
      }) as unknown as typeof fetch

      const res = await adminApi.getAnswers({ userId: 2, topicId: 1 })
      expect(res.length).toBe(1)
      expect(capturedUrl).toContain('userId=2&topicId=1')
    })

    it('should delete users bulk payload', async () => {
      let capturedBody: any
      let capturedUrl = ''

      globalThis.fetch = (async (url: string, opts: any) => {
        capturedUrl = url
        capturedBody = JSON.parse(opts?.body)
        return {
          ok: true,
          json: async () => ({ success: true, data: { deletedCount: 3 } }),
        }
      }) as unknown as typeof fetch

      const res = await adminApi.deleteUsers([1, 2, 3])
      expect(res.deletedCount).toBe(3)
      expect(capturedUrl).toContain('/admin/database/users/delete')
      expect(capturedBody).toEqual({ ids: [1, 2, 3] })
    })
  })
})
