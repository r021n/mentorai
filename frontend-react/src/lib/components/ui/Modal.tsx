import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const maxWidthClasses: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export function Modal({ isOpen, title, onClose, children, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity">
      <button
        type="button"
        aria-label="Tutup modal"
        className="fixed inset-0 w-full h-full cursor-default bg-transparent border-none"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full bg-white border border-neutral-300 rounded-xl shadow-2xl p-6 transition-opacity',
          maxWidthClasses[maxWidth],
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          {title ? <h3 className="text-base font-semibold text-neutral-900">{title}</h3> : <div />}
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
