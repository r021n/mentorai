import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  ChevronRight,
  Database,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from 'lucide-react'
import { selectIsAdmin, useAuthStore } from '../../stores/auth'
import { useCurrentPageTitle } from '../../router/page-title'
import { cn } from '../../utils/cn'

export interface DashboardLayoutProps {
  children?: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const title = useCurrentPageTitle()

  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore(selectIsAdmin)
  const logout = useAuthStore((state) => state.logout)

  const currentPath = location.pathname

  const isDashboardActive = currentPath === '/dashboard'
  const isExerciseActive =
    currentPath === '/exercise' ||
    currentPath.startsWith('/exercise/') ||
    currentPath === '/endExercise' ||
    currentPath.startsWith('/myAnswers/')
  const isTopicsActive =
    currentPath === '/topics' ||
    currentPath.startsWith('/topics/list/') ||
    currentPath.startsWith('/studentsAnswers/')
  const isUsersActive = currentPath === '/database/users'
  const isAnswersActive = currentPath === '/database/answers'

  function closeMobileSidebar() {
    setIsMobileSidebarOpen(false)
  }

  async function handleLogout() {
    closeMobileSidebar()
    await logout()
    await navigate({ to: '/' })
  }

  const navItemClass = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
      active ? 'bg-neutral-950 text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100',
    )

  return (
    <div className="min-h-screen flex bg-neutral-100 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {isMobileSidebarOpen ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup Menu Sidebar"
          onClick={closeMobileSidebar}
          onKeyDown={(event) => event.key === 'Escape' && closeMobileSidebar()}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      ) : null}

      <aside
        className={cn(
          'fixed md:sticky top-0 inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 h-screen',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isDesktopCollapsed ? 'md:w-20' : 'w-64 md:w-64',
        )}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200 bg-white">
          <Link
            to="/dashboard"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen size={18} />
            </div>
            {!isDesktopCollapsed ? (
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base tracking-tight text-neutral-950">MentorAI</span>
                <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                  {isAdmin ? 'Admin Portal' : 'Siswa Workspace'}
                </span>
              </div>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 md:hidden"
            aria-label="Tutup navigasi"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {!isDesktopCollapsed ? (
              <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Navigasi Utama
              </p>
            ) : null}

            <Link
              to="/dashboard"
              onClick={closeMobileSidebar}
              preload="intent"
              title="Dashboard"
              className={navItemClass(isDashboardActive)}
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {!isDesktopCollapsed ? <span>Dashboard</span> : null}
            </Link>

            <Link
              to="/exercise"
              onClick={closeMobileSidebar}
              preload="intent"
              title="Katalog Latihan Soal"
              className={navItemClass(isExerciseActive)}
            >
              <GraduationCap size={18} className="shrink-0" />
              {!isDesktopCollapsed ? <span>Latihan Soal</span> : null}
            </Link>
          </div>

          {isAdmin ? (
            <div className="space-y-1 pt-2 border-t border-neutral-100">
              {!isDesktopCollapsed ? (
                <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Panel Pengajar
                </p>
              ) : null}

              <Link
                to="/topics"
                onClick={closeMobileSidebar}
                preload="intent"
                title="Kelola Topik & Soal"
                className={navItemClass(isTopicsActive)}
              >
                <Shield size={18} className="shrink-0" />
                {!isDesktopCollapsed ? <span>Kelola Topik & Soal</span> : null}
              </Link>

              <Link
                to="/database/users"
                onClick={closeMobileSidebar}
                preload="intent"
                title="Database Pengguna"
                className={navItemClass(isUsersActive)}
              >
                <Users size={18} className="shrink-0" />
                {!isDesktopCollapsed ? <span>Data Siswa / User</span> : null}
              </Link>

              <Link
                to="/database/answers"
                onClick={closeMobileSidebar}
                preload="intent"
                title="Database Log Jawaban"
                className={navItemClass(isAnswersActive)}
              >
                <Database size={18} className="shrink-0" />
                {!isDesktopCollapsed ? <span>Data Jawaban AI</span> : null}
              </Link>
            </div>
          ) : null}

          <div className="space-y-1 pt-2 border-t border-neutral-100">
            {!isDesktopCollapsed ? (
              <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Halaman Umum
              </p>
            ) : null}

            <Link
              to="/"
              onClick={closeMobileSidebar}
              title="Ke Landing Page"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all"
            >
              <Home size={18} className="shrink-0" />
              {!isDesktopCollapsed ? (
                <>
                  <span className="flex-1">Landing Page</span>
                  <ExternalLink size={13} className="text-neutral-400" />
                </>
              ) : null}
            </Link>

            <Link
              to="/faq"
              onClick={closeMobileSidebar}
              preload="intent"
              title="Bantuan & FAQ"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all"
            >
              <HelpCircle size={18} className="shrink-0" />
              {!isDesktopCollapsed ? <span>Bantuan & FAQ</span> : null}
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
          {user ? (
            <div
              className={cn(
                'flex items-center gap-2 p-2 rounded-xl bg-white border border-neutral-200',
                isDesktopCollapsed ? 'justify-center' : 'justify-between',
              )}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user.username.slice(0, 1).toUpperCase()}
                </div>
                {!isDesktopCollapsed ? (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-neutral-950 truncate leading-snug">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                      {user.role}
                    </span>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari akun"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              className="p-2 -ml-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 md:hidden"
            >
              <Menu size={20} />
            </button>

            <button
              type="button"
              onClick={() => setIsDesktopCollapsed((collapsed) => !collapsed)}
              aria-label="Toggle lebar sidebar"
              className="hidden md:flex p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100"
              title={isDesktopCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
            >
              <Menu size={18} />
            </button>

            <div className="h-4 w-px bg-neutral-200 hidden md:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-400 hidden sm:inline">Workspace</span>
              <ChevronRight size={13} className="text-neutral-300 hidden sm:inline" />
              <h1 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              <Home size={14} />
              <span>Lihat Beranda</span>
            </Link>

            {user ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-700">
                <span
                  className={cn('w-2 h-2 rounded-full', isAdmin ? 'bg-amber-500' : 'bg-emerald-500')}
                />
                <span>{user.role.toUpperCase()}</span>
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
