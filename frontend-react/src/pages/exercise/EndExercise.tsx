import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ArrowRight, Award, BookOpen, RotateCcw } from 'lucide-react'
import { myAnswersApi } from '../../lib/api/my-answers'
import { queryKeys } from '../../lib/query/query-keys'
import { FocusHeader } from '../../lib/components/exercise/FocusHeader'
import { Button } from '../../lib/components/ui/Button'
import { buttonClassName } from '../../lib/components/ui/button-styles'
import { Spinner } from '../../lib/components/ui/Spinner'

export interface EndExercisePageProps {
  topicId: number
}

export function EndExercisePage({ topicId }: EndExercisePageProps) {
  const navigate = useNavigate()

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.myAnswers.byTopic(topicId),
    queryFn: () => myAnswersApi.getByTopic(topicId),
  })

  const unansweredCount = data ? Math.max(0, data.totalQuestions - data.answeredQuestions) : 0
  const topicName = data?.topic.name ?? 'Latihan'

  return (
    <>
      <FocusHeader topicName={topicName} onExit={() => navigate({ to: '/exercise' })} />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-600">Menyiapkan ringkasan latihan...</p>
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-neutral-300 bg-white p-8 text-center">
            <AlertCircle size={32} className="mx-auto text-neutral-900" />
            <p className="text-sm font-semibold text-neutral-900">
              {(error as Error)?.message || 'Gagal memuat ringkasan latihan.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/exercise" className={buttonClassName({ variant: 'outline', size: 'sm' })}>
                Kembali ke Katalog
              </Link>
              <Button size="sm" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        ) : data ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white">
                {unansweredCount > 0 ? <BookOpen size={28} /> : <Award size={28} />}
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                Latihan selesai
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                {unansweredCount > 0
                  ? `Masih ada ${unansweredCount} soal yang belum dijawab. Anda bisa melanjutkannya kapan saja.`
                  : 'Semua soal sudah Anda jawab. Tinjau rincian evaluasi untuk melihat bagian yang perlu diperkuat.'}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat label="Skor akhir" value={`${data.scorePercentage}%`} />
                <Stat
                  label="Soal dijawab"
                  value={`${data.answeredQuestions}/${data.totalQuestions}`}
                />
                <Stat label="Belum dijawab" value={String(unansweredCount)} />
              </div>

              <p className="mt-3 text-xs text-neutral-600">
                {data.totalScore} dari {data.maxPossibleScore} poin maksimal
              </p>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link
                  to="/myAnswers/$topicId"
                  params={{ topicId: String(topicId) }}
                  preload="intent"
                  className={buttonClassName({ size: 'md' })}
                >
                  <span>Lihat Rincian Jawaban</span>
                  <ArrowRight size={15} />
                </Link>

                {unansweredCount > 0 ? (
                  <Link
                    to="/exercise/$topicId"
                    params={{ topicId: String(topicId) }}
                    preload="intent"
                    className={buttonClassName({ variant: 'outline', size: 'md' })}
                  >
                    <RotateCcw size={15} />
                    <span>Kerjakan Soal Kosong</span>
                  </Link>
                ) : null}

                <Link
                  to="/exercise"
                  preload="intent"
                  className={buttonClassName({ variant: 'ghost', size: 'md' })}
                >
                  Kembali ke Katalog
                </Link>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-neutral-950">{value}</p>
    </div>
  )
}
