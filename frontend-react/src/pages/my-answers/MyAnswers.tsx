import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, AlertCircle, Award } from 'lucide-react'
import { myAnswersApi } from '../../lib/api/my-answers'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import { Spinner } from '../../lib/components/ui/Spinner'
import { Badge } from '../../lib/components/ui/Badge'

export function MyAnswersPage({ topicId }: { topicId: string }) {
  const numericTopicId = Number(topicId)

  const { data: summary, isPending, isError, error } = useQuery({
    queryKey: queryKeys.myAnswers.byTopic(numericTopicId),
    queryFn: () => myAnswersApi.getByTopic(numericTopicId),
  })

  useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || 'Gagal memuat rekap nilai siswa.')
    }
  }, [isError, error])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <Link
            to="/exercise"
            preload="intent"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog Topik</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-950">
            Riwayat & Rekap Nilai: {summary?.topic.name || 'Memuat...'}
          </h1>
        </div>

        {summary ? (
          <div className="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl p-3 shadow-sm">
            <Award size={24} className="text-neutral-900" />
            <div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                Total Skor Akhir
              </p>
              <p className="text-xl font-extrabold text-neutral-950">
                {summary.scorePercentage}%
                <span className="text-xs font-normal text-neutral-500">
                  ({summary.totalScore} / {summary.maxPossibleScore} poin)
                </span>
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {isPending ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-neutral-500">Memuat rincian jawaban...</p>
        </div>
      ) : isError ? (
        <div className="p-8 bg-white border border-neutral-300 rounded-xl text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-neutral-900" />
          <p className="text-sm font-semibold text-neutral-900">
            {(error as Error)?.message || 'Gagal memuat rekap nilai siswa.'}
          </p>
          <Link
            to="/exercise"
            preload="intent"
            className="inline-block text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Kembali ke Katalog
          </Link>
        </div>
      ) : summary ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Total Soal</p>
              <p className="text-lg font-bold text-neutral-900 mt-0.5">
                {summary.totalQuestions}
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Soal Dijawab</p>
              <p className="text-lg font-bold text-neutral-900 mt-0.5">
                {summary.answeredQuestions}
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Persentase Penguasaan</p>
              <p className="text-lg font-bold text-neutral-900 mt-0.5">
                {summary.scorePercentage}%
              </p>
            </div>
          </div>

          {/* Answers Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Pertanyaan</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Jawaban Anda</th>
                    <th className="py-3.5 px-4 min-w-[260px]">Umpan Balik AI</th>
                    <th className="py-3.5 px-4 w-24 text-center">Skor (0-3)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {summary.answers.map((item, idx) => (
                    <tr key={item.questionId} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-4 text-center font-medium text-neutral-500 align-top">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 text-neutral-900 align-top space-y-2 font-medium leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: item.questionText }} />
                        {item.pathImage ? (
                          <img
                            src={item.pathImage}
                            alt="Soal"
                            className="max-h-24 rounded border border-neutral-200 object-contain"
                          />
                        ) : null}
                      </td>
                      <td className="py-4 px-4 text-neutral-800 align-top whitespace-pre-line leading-relaxed">
                        {item.studentAnswer || '-'}
                      </td>
                      <td className="py-4 px-4 text-neutral-700 align-top whitespace-pre-line leading-relaxed">
                        {item.feedback || 'Belum dievaluasi'}
                      </td>
                      <td className="py-4 px-4 text-center align-top">
                        <Badge variant={item.score > 0 ? 'dark' : 'outline'}>
                          {item.score} / 3
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
