import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, ListFilter, Users, BookOpen } from 'lucide-react'
import { topicsApi } from '../../lib/api/topics'
import type { Topic } from '../../lib/types/topic.types'
import { queryKeys } from '../../lib/query/query-keys'
import { toast } from '../../lib/stores/toast'
import { Button } from '../../lib/components/ui/Button'
import { Input } from '../../lib/components/ui/Input'
import { Modal } from '../../lib/components/ui/Modal'
import { Spinner } from '../../lib/components/ui/Spinner'

export function TopicListPage() {
  // Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [topicNameInput, setTopicNameInput] = useState('')

  // Delete Confirm Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null)

  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: () => topicsApi.getAll(),
  })
  const topics = data ?? []

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Gagal memuat daftar topik.')
    }
  }, [isError, error])

  const saveMutation = useMutation({
    mutationFn: () => {
      const name = topicNameInput.trim()
      return editingTopic ? topicsApi.update(editingTopic.id, name) : topicsApi.create(name)
    },
    onSuccess: () => {
      toast.success(editingTopic ? 'Topik berhasil diperbarui.' : 'Topik berhasil dibuat.')
      setIsAddEditModalOpen(false)
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all })
    },
    onError: (err) => toast.error(err.message || 'Gagal menyimpan topik.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => topicsApi.delete(id),
    onSuccess: () => {
      toast.success('Topik berhasil dihapus.')
      setIsDeleteModalOpen(false)
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all })
    },
    onError: (err) => toast.error(err.message || 'Gagal menghapus topik.'),
  })

  function openAddModal() {
    setEditingTopic(null)
    setTopicNameInput('')
    setIsAddEditModalOpen(true)
  }

  function openEditModal(topic: Topic) {
    setEditingTopic(topic)
    setTopicNameInput(topic.name)
    setIsAddEditModalOpen(true)
  }

  function openDeleteModal(topic: Topic) {
    setDeletingTopic(topic)
    setIsDeleteModalOpen(true)
  }

  function handleSaveTopic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!topicNameInput.trim()) {
      toast.error('Nama topik wajib diisi.')
      return
    }
    saveMutation.mutate()
  }

  function handleConfirmDelete() {
    if (!deletingTopic) return
    deleteMutation.mutate(deletingTopic.id)
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl font-bold text-neutral-950">Manajemen Topik</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Kelola kategori topik pembelajaran, butir pertanyaan, dan evaluasi hasil belajar
              siswa.
            </p>
          </div>

          <Button variant="primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Tambah Topik</span>
          </Button>
        </div>

        {isPending ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-500">Memuat data topik...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-4">
            <BookOpen size={32} className="mx-auto text-neutral-400" />
            <h3 className="text-base font-semibold text-neutral-900">Belum Ada Topik</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Klik tombol "Tambah Topik" di atas untuk membuat materi topik latihan pertama Anda.
            </p>
            <Button variant="primary" size="sm" onClick={openAddModal}>
              <Plus size={14} />
              <span>Buat Topik Sekarang</span>
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">ID</th>
                    <th className="py-3.5 px-4">Nama Topik</th>
                    <th className="py-3.5 px-4 w-36">Dibuat Pada</th>
                    <th className="py-3.5 px-4 text-center w-72">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {topics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-500">
                        {topic.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-900">{topic.name}</td>
                      <td className="py-3.5 px-4 text-neutral-500 text-xs">
                        {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <Link
                            to="/topics/list/$topicId"
                            params={{ topicId: String(topic.id) }}
                            preload="intent"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800"
                          >
                            <ListFilter size={13} />
                            <span>Soal</span>
                          </Link>

                          <Link
                            to="/studentsAnswers/$topicId"
                            params={{ topicId: String(topic.id) }}
                            preload="intent"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800"
                          >
                            <Users size={13} />
                            <span>Matriks</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(topic)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800 cursor-pointer"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(topic)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors text-neutral-800 cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        title={editingTopic ? 'Edit Topik' : 'Tambah Topik Baru'}
        onClose={() => setIsAddEditModalOpen(false)}
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <Input
            id="topic-name"
            label="Nama Topik"
            placeholder="Contoh: Pemrograman Dasar Web"
            value={topicNameInput}
            onValueChange={setTopicNameInput}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddEditModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
              <span>Simpan</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus Topik"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus topik{' '}
            <strong className="text-neutral-950">"{deletingTopic?.name}"</strong>? Seluruh butir
            soal dan data evaluasi siswa yang terkait dengan topik ini akan ikut terhapus secara
            permanen.
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
              <span>Ya, Hapus Topik</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
