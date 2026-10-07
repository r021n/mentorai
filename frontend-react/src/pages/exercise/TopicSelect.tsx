import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, BookOpen, CheckCircle2, Play } from 'lucide-react'
import { exerciseApi } from '../../lib/api/exercise'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import { Spinner } from '../../lib/components/ui/Spinner'

export function TopicSelectPage() {
  const { data: topics = [], isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.exercise.topics(),
    queryFn: () => exerciseApi.getExerciseTopics(),
  })

  useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || 'Gagal memuat topik latihan.')
    }
  }, [isError, error])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950">Katalog Topik Latihan</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Pilih topik untuk menguji pemahaman konsep atau melihat catatan evaluasi sebelumnya.
          </p>
        </div>
      </div>

      {isPending ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-neutral-500">Memuat topik latihan...</p>
        </div>
      ) : isError ? (
        <div className="p-6 bg-white border border-neutral-300 rounded-xl text-center space-y-3">
          <AlertCircle size={28} className="mx-auto text-neutral-900" />
          <p className="text-sm font-semibold text-neutral-900">
            {(error as Error)?.message || 'Gagal memuat topik latihan.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      ) : topics.length === 0 ? (
        <div className="py-16 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
          <BookOpen size={32} className="mx-auto text-neutral-400" />
          <h3 className="text-base font-semibold text-neutral-900">Belum Ada Topik Tersedia</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Administrator belum menambahkan materi atau topik latihan. Silakan cek kembali beberapa
            saat lagi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between space-y-5 hover:border-neutral-900 transition-colors"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <BookOpen size={18} />
                </div>
                <h3 className="text-base font-bold text-neutral-950 leading-snug">{topic.name}</h3>
                {topic.questionCount !== undefined ? (
                  <p className="text-xs text-neutral-500">{topic.questionCount} Butir Soal Tersedia</p>
                ) : null}
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-2.5">
                <Link
                  to="/exercise/$topicId"
                  params={{ topicId: String(topic.id) }}
                  preload="intent"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Play size={14} />
                  <span>Mulai Latihan</span>
                </Link>

                <Link
                  to="/myAnswers/$topicId"
                  params={{ topicId: String(topic.id) }}
                  preload="intent"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-neutral-900 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  <CheckCircle2 size={14} />
                  <span>Lihat Jawabanku</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
