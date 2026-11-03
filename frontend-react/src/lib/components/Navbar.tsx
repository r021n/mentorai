import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowRight, BookOpen, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { selectIsAuthenticated, useAuthStore } from '../stores/auth'
import { cn } from '../utils/cn'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const currentPath = location.pathname

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  async function handleLogout() {
    closeMobileMenu()
    await logout()
    await navigate({ to: '/' })
  }

  const linkClass = (active: boolean) =>
    cn(
      'text-sm font-semibold transition-colors hover:text-neutral-950',
      active ? 'text-neutral-950 underline underline-offset-8 decoration-2' : 'text-neutral-600',
    )

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-neutral-950 font-bold text-lg tracking-tight hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <span>MentorAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className={linkClass(currentPath === '/')}>
              Beranda
            </Link>

            <Link to="/faq" preload="intent" className={linkClass(currentPath === '/faq')}>
              Tentang Kami & FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-neutral-100 rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-sm">
                  <span className="font-bold text-neutral-900">{user.username}</span>
                  <span className="text-xs uppercase font-bold text-neutral-600 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                    {user.role}
                  </span>
                </div>

                <Link
                  to="/dashboard"
                  preload="intent"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  <LayoutDashboard size={15} />
                  <span>Buka Dashboard</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar dari akun"
                  className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  preload="intent"
                  className="text-sm font-semibold px-4 py-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  preload="intent"
                  className="text-sm font-semibold px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block text-sm font-semibold py-2 text-neutral-800 hover:text-neutral-950"
          >
            Beranda
          </Link>
          <Link
            to="/faq"
            onClick={closeMobileMenu}
            preload="intent"
            className="block text-sm font-semibold py-2 text-neutral-800 hover:text-neutral-950"
          >
            Tentang Kami & FAQ
          </Link>

          <div className="pt-3 border-t border-neutral-200">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-neutral-950">{user.username}</p>
                    <p className="text-xs text-neutral-600 uppercase font-semibold">
                      {user.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-medium px-3 py-1.5 border border-neutral-300 rounded-lg text-neutral-700 hover:text-red-600 transition-colors"
                  >
                    Keluar
                  </button>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  preload="intent"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-950 text-white text-sm font-bold"
                >
                  <LayoutDashboard size={16} />
                  <span>Buka Dashboard Utama</span>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  preload="intent"
                  className="flex-1 text-center text-sm font-semibold py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  preload="intent"
                  className="flex-1 text-center text-sm font-semibold py-2.5 bg-neutral-950 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
