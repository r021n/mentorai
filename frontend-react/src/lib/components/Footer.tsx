import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center">
            <BookOpen size={14} />
          </div>
          <span>MentorAI &copy; 2026</span>
        </div>

        <p className="text-xs text-neutral-500 text-center sm:text-right">
          Platform Asesmen Interaktif Cerdas Berbasis AI. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  )
}
