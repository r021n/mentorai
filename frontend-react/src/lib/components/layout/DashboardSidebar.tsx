import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Database,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Users,
  X,
} from 'lucide-react'
import { selectIsAdmin, useAuthStore } from '../../stores/auth'
import { cn } from '../../utils/cn'
import { DashboardNavItem } from './DashboardNavItem'

export interface DashboardSidebarProps {
  isMobileOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ isMobileOpen, onClose }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

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

  async function handleLogout() {
    onClose()
    await logout()
    await navigate({ to: '/' })
  }

  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        'fixed md:sticky top-0 inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 h-screen w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isCollapsed ? 'md:w-20' : 'md:w-64',
      )}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-200 bg-white">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen size={18} />
          </div>
          <div className={cn('flex flex-col leading-none', isCollapsed && 'md:hidden')}>
            <span className="font-bold text-base tracking-tight text-neutral-950">MentorAI</span>
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
              {isAdmin ? 'Admin Portal' : 'Siswa Workspace'}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 md:hidden"
          aria-label="Tutup navigasi"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          <p
            className={cn(
              'px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2',
              isCollapsed && 'md:hidden',
            )}
          >
            Navigasi Utama
          </p>

          <DashboardNavItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={isDashboardActive}
            isCollapsed={isCollapsed}
            onNavigate={onClose}
          />

          <DashboardNavItem
            to="/exercise"
            icon={GraduationCap}
            label="Latihan Soal"
            title="Katalog Latihan Soal"
            active={isExerciseActive}
            isCollapsed={isCollapsed}
            onNavigate={onClose}
          />
        </div>

        {isAdmin ? (
          <div className="space-y-1 pt-2 border-t border-neutral-100">
            <p
              className={cn(
                'px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2',
                isCollapsed && 'md:hidden',
              )}
            >
              Panel Pengajar
            </p>

            <DashboardNavItem
              to="/topics"
              icon={Shield}
              label="Kelola Topik & Soal"
              title="Kelola Topik & Soal"
              active={isTopicsActive}
              isCollapsed={isCollapsed}
              onNavigate={onClose}
            />

            <DashboardNavItem
              to="/database/users"
              icon={Users}
              label="Data Siswa / User"
              title="Database Pengguna"
              active={isUsersActive}
              isCollapsed={isCollapsed}
              onNavigate={onClose}
            />

            <DashboardNavItem
              to="/database/answers"
              icon={Database}
              label="Data Jawaban AI"
              title="Database Log Jawaban"
              active={isAnswersActive}
              isCollapsed={isCollapsed}
              onNavigate={onClose}
            />
          </div>
        ) : null}

        <div className="space-y-1 pt-2 border-t border-neutral-100">
          <p
            className={cn(
              'px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2',
              isCollapsed && 'md:hidden',
            )}
          >
            Halaman Umum
          </p>

          <DashboardNavItem
            to="/"
            icon={Home}
            label="Landing Page"
            title="Ke Landing Page"
            isCollapsed={isCollapsed}
            onNavigate={onClose}
            trailing={<ExternalLink size={13} className="text-neutral-400" />}
          />

          <DashboardNavItem
            to="/faq"
            icon={HelpCircle}
            label="Bantuan & FAQ"
            title="Bantuan & FAQ"
            isCollapsed={isCollapsed}
            onNavigate={onClose}
          />
        </div>
      </div>

      <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
        <button
          type="button"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          title={isCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
          aria-label={isCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
          className={cn(
            'hidden md:flex w-full items-center gap-2 rounded-xl px-3 py-2 mb-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors',
            isCollapsed ? 'justify-center' : null,
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} className="shrink-0" />
          ) : (
            <PanelLeftClose size={18} className="shrink-0" />
          )}
          {!isCollapsed ? <span>Perkecil Sidebar</span> : null}
        </button>

        {user ? (
          <div
            className={cn(
              'flex items-center justify-between gap-2 rounded-xl bg-white border border-neutral-200 p-2',
              isCollapsed && 'md:flex-col md:p-1.5',
            )}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <div className={cn('flex flex-col min-w-0', isCollapsed && 'md:hidden')}>
                <span className="text-xs font-bold text-neutral-950 truncate leading-snug">
                  {user.username}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  {user.role}
                </span>
              </div>
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
  )
}
