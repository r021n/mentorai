import type { ReactNode } from 'react'

export interface FocusLayoutProps {
  children?: ReactNode
}

/**
 * Full-height shell for focused sessions. It deliberately omits the dashboard
 * sidebar and topbar; each page owns its own compact header and actions.
 */
export function FocusLayout({ children }: FocusLayoutProps) {
  return (
    <div className="min-h-svh bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col">{children}</div>
    </div>
  )
}
