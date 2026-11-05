import { useState } from 'react'
import type { ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'

export interface DashboardLayoutProps {
  children?: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  function openMobileSidebar() {
    setIsMobileSidebarOpen(true)
  }

  function closeMobileSidebar() {
    setIsMobileSidebarOpen(false)
  }

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

      <DashboardSidebar isMobileOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar isSidebarOpen={isMobileSidebarOpen} onOpenSidebar={openMobileSidebar} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
