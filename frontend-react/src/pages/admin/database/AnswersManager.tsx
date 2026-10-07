import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Filter, Trash2, Edit2, Database, RefreshCw } from 'lucide-react'
import { adminApi } from '../../../lib/api/admin'
import type { AnswerFilters } from '../../../lib/api/admin'
import type { DbAnswer } from '../../../lib/types/admin.types'
import { queryKeys } from '../../../lib/query/query-keys'
import { toast } from '../../../lib/stores/toast'
import { Button } from '../../../lib/components/ui/Button'
import { Input } from '../../../lib/components/ui/Input'
import { Modal } from '../../../lib/components/ui/Modal'
import { Spinner } from '../../../lib/components/ui/Spinner'
import { Badge } from '../../../lib/components/ui/Badge'
import { cn } from '../../../lib/utils/cn'

const EMPTY_ANSWERS: DbAnswer[] = []

export function AnswersManagerPage() {
  // Filters
  const [filterUserId, setFilterUserId] = useState('')
  const [filterQuestionId, setFilterQuestionId] = useState('')
  const [filterTopicId, setFilterTopicId] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<AnswerFilters>({})

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAnswer, setEditingAnswer] = useState<DbAnswer | null>(null)
  const [editAnswerText, setEditAnswerText] = useState('')
  const [editFeedbackText, setEditFeedbackText] = useState('')
  const [editScore, setEditScore] = useState('0')
  const [editUserId, setEditUserId] = useState('0')
  const [editQuestionId, setEditQuestionId] = useState('0')
  const [editTopicId, setEditTopicId] = useState('0')

  // Delete Confirm Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.admin.answers(appliedFilters),
    queryFn: () => adminApi.getAnswers(appliedFilters),
  })
  const answers = data ?? EMPTY_ANSWERS

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Gagal memuat tabel jawaban.')
    }
  }, [isError, error])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds((prev) => prev.filter((id) => answers.some((a) => a.id === id)))
  }, [answers])

  const editMutation = useMutation({
    mutationFn: (vars: {
      id: number
      data: {
        answer: string | null
        feedback: string | null
        score: number
        userId: number
        questionId: number
        topicId: number
      }
    }) => adminApi.editAnswer(vars.id, vars.data),
    onSuccess: () => {
      toast.success('Data jawaban berhasil diperbarui.')
      setIsEditModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin', 'answers'] })
    },
    onError: (err) => toast.error(err.message || 'Gagal memperbarui jawaban.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => adminApi.deleteAnswers(ids),
    onSuccess: (res) => {
      toast.success(`${res.deletedCount} jawaban berhasil dihapus.`)
      setSelectedIds([])
      setIsDeleteModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin', 'answers'] })
    },
    onError: (err) => toast.error(err.message || 'Gagal menghapus jawaban terpilih.'),
  })

  function loadAnswers() {
    const filters: AnswerFilters = {}
    if (filterUserId.trim()) filters.userId = Number(filterUserId.trim())
    if (filterQuestionId.trim()) filters.questionId = Number(filterQuestionId.trim())
    if (filterTopicId.trim()) filters.topicId = Number(filterTopicId.trim())
    setAppliedFilters(filters)
  }

  function clearFilters() {
    setFilterUserId('')
    setFilterQuestionId('')
    setFilterTopicId('')
    setAppliedFilters({})
  }

  function toggleSelectAll(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked
    if (checked) {
      setSelectedIds(answers.map((a) => a.id))
    } else {
      setSelectedIds([])
    }
  }

  function toggleSelect(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  function openEditModal(a: DbAnswer) {
    setEditingAnswer(a)
    setEditAnswerText(a.answer || '')
    setEditFeedbackText(a.feedback || '')
    setEditScore(String(a.score))
    setEditUserId(String(a.userId))
    setEditQuestionId(String(a.questionId))
    setEditTopicId(String(a.topicId))
    setIsEditModalOpen(true)
  }

  function handleSaveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingAnswer) return

    editMutation.mutate({
      id: editingAnswer.id,
      data: {
        answer: editAnswerText.trim() || null,
        feedback: editFeedbackText.trim() || null,
        score: Number(editScore),
        userId: Number(editUserId),
        questionId: Number(editQuestionId),
        topicId: Number(editTopicId),
      },
    })
  }

  function handleConfirmDelete() {
    if (selectedIds.length === 0) return
    deleteMutation.mutate(selectedIds)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <Database size={20} className="text-neutral-900" />
              <h1 className="text-2xl font-bold text-neutral-950">Database Manager: Answers</h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Inspeksi, penyaringan data tingkat lanjut, dan perbaikan manual record jawaban siswa.
            </p>
          </div>

          {selectedIds.length > 0 ? (
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={14} />
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </Button>
          ) : null}
        </div>

        {/* Filter Form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
            <Filter size={14} />
            <span>Filter Data Jawaban</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input
              id="f-user"
              placeholder="Filter User ID..."
              value={filterUserId}
              onValueChange={setFilterUserId}
            />
            <Input
              id="f-topic"
              placeholder="Filter Topic ID..."
              value={filterTopicId}
              onValueChange={setFilterTopicId}
            />
            <Input
              id="f-question"
              placeholder="Filter Question ID..."
              value={filterQuestionId}
              onValueChange={setFilterQuestionId}
            />
            <div className="flex items-center gap-2">
              <Button variant="primary" size="md" className="flex-1" onClick={loadAnswers}>
                <span>Terapkan</span>
              </Button>
              <Button variant="outline" size="md" onClick={clearFilters} title="Reset Filter">
                <RefreshCw size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isPending ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-500">Memuat data jawaban...</p>
          </div>
        ) : answers.length === 0 ? (
          <div className="py-16 text-center bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-neutral-800">
              Tidak ada jawaban yang sesuai dengan filter.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={selectedIds.length > 0 && selectedIds.length === answers.length}
                        className="rounded border-neutral-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 w-16 text-center">ID</th>
                    <th className="py-3.5 px-4 w-28">User</th>
                    <th className="py-3.5 px-4 w-24 text-center">Topic ID</th>
                    <th className="py-3.5 px-4 w-24 text-center">Soal ID</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Jawaban</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Feedback AI</th>
                    <th className="py-3.5 px-4 w-20 text-center">Skor</th>
                    <th className="py-3.5 px-4 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {answers.map((a) => (
                    <tr
                      key={a.id}
                      className={cn(
                        'hover:bg-neutral-50 transition-colors',
                        selectedIds.includes(a.id) && 'bg-neutral-50',
                      )}
                    >
                      <td className="py-3.5 px-4 text-center align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(a.id)}
                          onChange={() => toggleSelect(a.id)}
                          className="rounded border-neutral-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-500 align-top">
                        {a.id}
                      </td>
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-neutral-900 block">
                          {a.username || `User #${a.userId}`}
                        </span>
                        <span className="text-[10px] text-neutral-400">ID: {a.userId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-600 align-top">
                        {a.topicId}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-600 align-top">
                        {a.questionId}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-800 align-top leading-relaxed text-xs">
                        {a.answer || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 align-top leading-relaxed text-xs">
                        {a.feedback || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center align-top">
                        <Badge variant="dark" size="sm">
                          {a.score}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center align-top">
                        <button
                          type="button"
                          onClick={() => openEditModal(a)}
                          className="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                          title="Edit Jawaban"
                        >
                          <Edit2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Answer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        title="Edit Rekord Jawaban"
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input
              id="e-user-id"
              label="User ID"
              type="number"
              value={editUserId}
              onValueChange={setEditUserId}
              required
            />
            <Input
              id="e-topic-id"
              label="Topic ID"
              type="number"
              value={editTopicId}
              onValueChange={setEditTopicId}
              required
            />
            <Input
              id="e-question-id"
              label="Question ID"
              type="number"
              value={editQuestionId}
              onValueChange={setEditQuestionId}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="e-answer-text"
              className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block"
            >
              Jawaban Siswa
            </label>
            <textarea
              id="e-answer-text"
              value={editAnswerText}
              onChange={(e) => setEditAnswerText(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="e-feedback-text"
              className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block"
            >
              Umpan Balik AI
            </label>
            <textarea
              id="e-feedback-text"
              value={editFeedbackText}
              onChange={(e) => setEditFeedbackText(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="e-score"
              className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block"
            >
              Skor (0 - 3)
            </label>
            <input
              id="e-score"
              type="number"
              min="0"
              max="3"
              value={editScore}
              onChange={(e) => setEditScore(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={editMutation.isPending}>
              {editMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus Jawaban"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus{' '}
            <strong className="text-neutral-950">{selectedIds.length} jawaban</strong> yang
            dipilih?
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
              <span>Ya, Hapus {selectedIds.length} Jawaban</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
