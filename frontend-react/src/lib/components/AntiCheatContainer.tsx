import type { ClipboardEvent, MouseEvent, ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface AntiCheatContainerProps {
  className?: string
  children?: ReactNode
}

export function AntiCheatContainer({ className, children }: AntiCheatContainerProps) {
  function preventCopy(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  function preventContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  return (
    <div
      className={cn('select-none no-copy-text', className)}
      onCopy={preventCopy}
      onCut={preventCopy}
      onContextMenu={preventContextMenu}
    >
      {children}
    </div>
  )
}
