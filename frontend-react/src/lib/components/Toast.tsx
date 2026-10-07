import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '../stores/toast'

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const

export function Toast() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const Icon = icons[item.type]

        return (
          <div
            key={item.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white border border-neutral-900 rounded-lg shadow-lg text-neutral-900 transition-opacity"
            role="alert"
          >
            <div className="mt-0.5 shrink-0">
              <Icon size={18} className="text-neutral-900" />
            </div>

            <div className="flex-1 text-sm font-medium leading-relaxed">{item.message}</div>

            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Tutup notifikasi"
              className="text-neutral-500 hover:text-neutral-900 cursor-pointer p-0.5 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
