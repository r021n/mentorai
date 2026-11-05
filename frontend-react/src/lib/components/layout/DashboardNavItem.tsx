import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface DashboardNavItemProps {
  to: ComponentProps<typeof Link>['to']
  icon: LucideIcon
  label: string
  title?: string
  active?: boolean
  isCollapsed?: boolean
  onNavigate?: () => void
  trailing?: ReactNode
}

export function DashboardNavItem({
  to,
  icon: Icon,
  label,
  title,
  active = false,
  isCollapsed = false,
  onNavigate,
  trailing,
}: DashboardNavItemProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      preload="intent"
      title={title ?? label}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
        active
          ? 'bg-neutral-950 text-white shadow-xs'
          : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100',
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span className={cn('flex-1', isCollapsed && 'md:hidden')}>{label}</span>
      {trailing ? <span className={cn(isCollapsed && 'md:hidden')}>{trailing}</span> : null}
    </Link>
  )
}
