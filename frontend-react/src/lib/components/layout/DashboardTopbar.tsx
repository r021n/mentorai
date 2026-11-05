import { ChevronRight, Menu } from 'lucide-react'
import { useCurrentPageTitle } from '../../router/page-title'

export interface DashboardTopbarProps {
  isSidebarOpen: boolean
  onOpenSidebar: () => void
}

export function DashboardTopbar({ isSidebarOpen, onOpenSidebar }: DashboardTopbarProps) {
  const title = useCurrentPageTitle()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
          className="p-2 -ml-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-neutral-400 hidden sm:inline">Workspace</span>
          <ChevronRight size={13} className="text-neutral-300 hidden sm:inline shrink-0" />
          <span className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight truncate">
            {title}
          </span>
        </div>
      </div>
    </header>
  )
}
