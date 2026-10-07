import { Link } from '@tanstack/react-router'
import { Award, ArrowRight, Home, BookOpen } from 'lucide-react'
import { useExerciseStore } from '../../lib/stores/exercise'

export function EndExercisePage() {
  const topicId = useExerciseStore((s) => s.topicId)

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="bg-white border border-neutral-300 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
          <Award size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950">Latihan Selesai!</h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            Hebat! Seluruh butir soal telah Anda kerjakan. Anda dapat meninjau rekapan nilai dan
            umpan balik lengkap kapan saja.
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-center gap-3">
          {topicId ? (
            <Link
              to="/myAnswers/$topicId"
              params={{ topicId: String(topicId) }}
              preload="intent"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <span>Lihat Nilai Saya</span>
              <ArrowRight size={15} />
            </Link>
          ) : null}

          <Link
            to="/exercise"
            preload="intent"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-neutral-900 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            <BookOpen size={15} />
            <span>Katalog Topik</span>
          </Link>

          <Link
            to="/"
            preload="intent"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-neutral-700 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <Home size={15} />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
