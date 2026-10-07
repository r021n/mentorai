import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { authApi } from '../lib/api/auth'
import { toast } from '../lib/stores/toast'
import { Button } from '../lib/components/ui/Button'
import { Input } from '../lib/components/ui/Input'
import { Spinner } from '../lib/components/ui/Spinner'

export function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Semua field wajib diisi.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password.')
      return
    }

    if (password.length < 3) {
      setErrorMessage('Password minimal harus 3 karakter.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await authApi.register({
        username: username.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      })
      toast.success('Pendaftaran berhasil! Silakan masuk ke akun Anda.')
      await navigate({ to: '/login' })
    } catch (error: any) {
      const message = error.message || 'Pendaftaran gagal. Silakan coba lagi.'
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
            <UserPlus size={22} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-950">Daftar Akun Baru</h2>
          <p className="text-xs text-neutral-500">
            Daftarkan akun siswa untuk mulai belajar dan berlatih
          </p>
        </div>

        {errorMessage ? (
          <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 leading-normal">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            id="username"
            label="Username"
            placeholder="Pilih username unik"
            value={username}
            onValueChange={setUsername}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Minimal 3 karakter"
            value={password}
            onValueChange={setPassword}
            required
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Konfirmasi Password"
            placeholder="Ulangi password di atas"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-2.5" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="border-t-white" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <span>Daftar Sekarang</span>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-200">
          <p className="text-xs text-neutral-600">
            Sudah memiliki akun?{' '}
            <Link to="/login" preload="intent" className="font-semibold text-neutral-950 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
