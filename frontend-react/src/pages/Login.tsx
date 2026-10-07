import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { authApi } from '../lib/api/auth'
import { useAuthStore } from '../lib/stores/auth'
import { toast } from '../lib/stores/toast'
import { Button } from '../lib/components/ui/Button'
import { Input } from '../lib/components/ui/Input'
import { Spinner } from '../lib/components/ui/Spinner'

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan password wajib diisi.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const res = await authApi.login({ username: username.trim(), password: password.trim() })
      setUser(res.user)
      toast.success(`Selamat datang kembali, ${res.user.username}!`)
      await navigate({ to: '/dashboard' })
    } catch (error: any) {
      const message = error.message || 'Login gagal. Periksa kembali username dan password Anda.'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-300 rounded-xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-xl bg-neutral-900 text-white flex items-center justify-center">
            <LogIn size={22} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-950">Masuk Akun</h2>
          <p className="text-xs text-neutral-500">
            Masukkan kredensial akun MentorAI Anda untuk melanjutkan
          </p>
        </div>

        {errorMessage ? (
          <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 leading-normal">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="username"
            label="Username"
            placeholder="Masukkan username"
            value={username}
            onValueChange={setUsername}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onValueChange={setPassword}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-2.5" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="border-t-white" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-200">
          <p className="text-xs text-neutral-600">
            Belum memiliki akun?{' '}
            <Link to="/register" preload="intent" className="font-semibold text-neutral-950 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
