import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Download, ArrowLeft, Users } from 'lucide-react'
import { adminApi } from '../../lib/api/admin'
import { topicsApi } from '../../lib/api/topics'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import { Button } from '../../lib/components/ui/Button'
import { Spinner } from '../../lib/components/ui/Spinner'
import { Badge } from '../../lib/components/ui/Badge'

export function StudentAnswersPage({ topicId }: { topicId: string }) {
  const numericTopicId = Number(topicId)
  const [isDownloading, setIsDownloading] = useState(false)

  const { data: topic, isPending: isTopicPending, error: topicError } = useQuery({
    queryKey: queryKeys.topics.detail(numericTopicId),
    queryFn: () => topicsApi.getById(numericTopicId),
  })

  const { data: matrix, isPending: isMatrixPending, error: matrixError } = useQuery({
    queryKey: queryKeys.admin.matrix(numericTopicId),
    queryFn: () => adminApi.getStudentsAnswersMatrix(numericTopicId),
  })

  const isLoading = isTopicPending || isMatrixPending

  useEffect(() => {
    if (matrixError) {
      toast.error(matrixError.message || 'Gagal memuat matriks jawaban siswa.')
    } else if (topicError) {
      toast.error(topicError.message || 'Gagal memuat matriks jawaban siswa.')
    }
  }, [matrixError, topicError])

  async function handleDownloadExcel() {
    if (!matrix || matrix.questions.length === 0) {
      toast.error('Tidak ada data soal untuk diunduh.')
      return
    }

    setIsDownloading(true)
    try {
      const blob = await adminApi.downloadExcelReport(numericTopicId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laporan_Topic_${numericTopicId}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Laporan Excel berhasil diunduh.')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunduh laporan Excel.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <Link
            to="/topics"
            preload="intent"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Topik</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-950">
            Matriks Evaluasi Siswa: {topic?.name || 'Memuat...'}
          </h1>
          <p className="text-xs text-neutral-500">
            Rekapitulasi lengkap jawaban dan umpan balik per butir pertanyaan untuk seluruh siswa.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleDownloadExcel}
          disabled={isDownloading || !matrix || matrix.students.length === 0}
        >
          {isDownloading ? (
            <>
              <Spinner size="sm" className="border-t-white" />
              <span>Mengunduh...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Unduh Jawaban Siswa (.xlsx)</span>
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-neutral-500">Memuat matriks evaluasi kelas...</p>
        </div>
      ) : !matrix || matrix.students.length === 0 ? (
        <div className="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
          <Users size={32} className="mx-auto text-neutral-400" />
          <h3 className="text-base font-semibold text-neutral-900">Belum Ada Jawaban Siswa</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Belum ada siswa yang mengirimkan jawaban untuk butir pertanyaan pada topik ini.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-neutral-100 sticky top-0 z-20 border-b border-neutral-200 text-neutral-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center sticky left-0 bg-neutral-100 z-30 border-r border-neutral-200">
                    No
                  </th>
                  <th className="py-3.5 px-4 min-w-[150px] sticky left-12 bg-neutral-100 z-30 border-r border-neutral-200">
                    Nama Siswa
                  </th>
                  {matrix.questions.map((_q, qIdx) => (
                    <th
                      key={qIdx}
                      className="py-3.5 px-4 min-w-[240px] border-r border-neutral-200 text-center"
                    >
                      Soal #{qIdx + 1}
                    </th>
                  ))}
                  <th className="py-3.5 px-4 w-28 text-center bg-neutral-100">Total Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {matrix.students.map((student, sIdx) => (
                  <tr key={student.userId} className="hover:bg-neutral-50 transition-colors">
                    {/* Row Number Sticky */}
                    <td className="py-4 px-4 text-center font-mono text-neutral-500 align-top sticky left-0 bg-white hover:bg-neutral-50 z-10 border-r border-neutral-200">
                      {sIdx + 1}
                    </td>

                    {/* Student Name Sticky */}
                    <td className="py-4 px-4 font-semibold text-neutral-950 align-top sticky left-12 bg-white hover:bg-neutral-50 z-10 border-r border-neutral-200">
                      {student.username}
                    </td>

                    {/* Answers Per Question */}
                    {matrix.questions.map((q) => {
                      const answerItem = student.answers[q.id]
                      return (
                        <td
                          key={q.id}
                          className="py-4 px-4 align-top border-r border-neutral-200 text-xs space-y-2"
                        >
                          {answerItem && answerItem.answer ? (
                            <>
                              <div>
                                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                                  Jawaban:
                                </span>
                                <p className="text-neutral-900 whitespace-pre-line leading-relaxed mt-0.5">
                                  {answerItem.answer}
                                </p>
                              </div>

                              <div className="pt-1.5 border-t border-neutral-100">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                                  Feedback:
                                </span>
                                <p className="text-neutral-600 whitespace-pre-line leading-relaxed mt-0.5">
                                  {answerItem.feedback || 'Belum ada umpan balik'}
                                </p>
                              </div>

                              <div className="pt-1">
                                <Badge variant="dark" size="sm">
                                  Skor: {answerItem.score}
                                </Badge>
                              </div>
                            </>
                          ) : (
                            <span className="text-neutral-400 italic">Belum dijawab</span>
                          )}
                        </td>
                      )
                    })}

                    {/* Total Score Percentage */}
                    <td className="py-4 px-4 text-center align-top font-bold text-neutral-950">
                      <span className="text-sm">{student.totalScore}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
