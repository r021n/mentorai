import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, ArrowLeft, HelpCircle } from 'lucide-react'
import { questionsApi } from '../../lib/api/questions'
import { topicsApi } from '../../lib/api/topics'
import type { Question } from '../../lib/types/question.types'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import { Button } from '../../lib/components/ui/Button'
import { Modal } from '../../lib/components/ui/Modal'
import { Spinner } from '../../lib/components/ui/Spinner'
import { QuestionFormModal } from './QuestionFormModal'

export function QuestionListPage({ topicId }: { topicId: string }) {
  const numericTopicId = Number(topicId)

  // Add / Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null)

  // Delete Confirm Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null)

  const queryClient = useQueryClient()

  const topicQuery = useQuery({
    queryKey: queryKeys.topics.detail(numericTopicId),
    queryFn: () => topicsApi.getById(numericTopicId),
  })
  const questionsQuery = useQuery({
    queryKey: queryKeys.questions.byTopic(numericTopicId),
    queryFn: () => questionsApi.getByTopic(numericTopicId),
  })

  const topic = topicQuery.data
  const questions = questionsQuery.data ?? []
  const isPending = topicQuery.isPending || questionsQuery.isPending
  const loadError = topicQuery.isError
    ? topicQuery.error
    : questionsQuery.isError
      ? questionsQuery.error
      : null

  useEffect(() => {
    if (loadError) {
      toast.error(loadError.message || 'Gagal memuat data soal.')
    }
  }, [loadError])

  const deleteMutation = useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: () => {
      toast.success('Soal berhasil dihapus.')
      setIsDeleteModalOpen(false)
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.detail(numericTopicId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.byTopic(numericTopicId) })
    },
    onError: (err) => toast.error(err.message || 'Gagal menghapus soal.'),
  })

  function openAddModal() {
    setQuestionToEdit(null)
    setIsFormModalOpen(true)
  }

  function openEditModal(q: Question) {
    setQuestionToEdit(q)
    setIsFormModalOpen(true)
  }

  function openDeleteModal(q: Question) {
    setDeletingQuestion(q)
    setIsDeleteModalOpen(true)
  }

  function handleSaved() {
    queryClient.invalidateQueries({ queryKey: queryKeys.topics.detail(numericTopicId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.byTopic(numericTopicId) })
  }

  function handleConfirmDelete() {
    if (!deletingQuestion) return
    deleteMutation.mutate(deletingQuestion.id)
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
              Daftar Soal: {topic?.name || 'Memuat...'}
            </h1>
            <p className="text-xs text-neutral-500">Total: {questions.length} butir pertanyaan</p>
          </div>

          <Button variant="primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Tambah Soal</span>
          </Button>
        </div>

        {isPending ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-500">Memuat butir-butir pertanyaan...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-4">
            <HelpCircle size={32} className="mx-auto text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">
              Belum Ada Soal Ditambahkan
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Tambahkan butir pertanyaan untuk topik ini agar siswa dapat mulai berlatih.
            </p>
            <Button variant="primary" size="sm" onClick={openAddModal}>
              <Plus size={14} />
              <span>Tambah Soal Baru</span>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4 min-w-[280px]">Pertanyaan</th>
                    <th className="py-3.5 px-4 w-28 text-center">Gambar</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Keterangan Konteks</th>
                    <th className="py-3.5 px-4 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {questions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-4 text-center font-mono text-neutral-500 align-top">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 text-neutral-900 align-top font-medium leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: q.question }} />
                      </td>
                      <td className="py-4 px-4 text-center align-top">
                        {q.pathImage ? (
                          <img
                            src={q.pathImage}
                            alt="Thumbnail"
                            className="h-12 w-16 object-cover rounded border border-neutral-200 mx-auto"
                          />
                        ) : (
                          <span className="text-neutral-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 align-top text-xs leading-relaxed">
                        {q.imageDescription || '-'}
                      </td>
                      <td className="py-4 px-4 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(q)}
                            className="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                            title="Edit Soal"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(q)}
                            className="p-1.5 border border-neutral-300 hover:bg-neutral-900 hover:text-white rounded-md text-neutral-800 transition-colors cursor-pointer"
                            title="Hapus Soal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={isFormModalOpen}
        topicId={numericTopicId}
        questionToEdit={questionToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={handleSaved}
      />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Hapus Butir Soal"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus butir soal ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
              <span>Hapus Soal</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
