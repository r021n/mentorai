import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, Edit2, Database } from 'lucide-react'
import { adminApi } from '../../../lib/api/admin'
import type { DbUser } from '../../../lib/types/admin.types'
import { queryKeys } from '../../../lib/query/query-keys'
import { toast } from '../../../lib/stores/toast'
import { Button } from '../../../lib/components/ui/Button'
import { Input } from '../../../lib/components/ui/Input'
import { Modal } from '../../../lib/components/ui/Modal'
import { Spinner } from '../../../lib/components/ui/Spinner'
import { Badge } from '../../../lib/components/ui/Badge'
import { cn } from '../../../lib/utils/cn'

const EMPTY_USERS: DbUser[] = []

export function UsersManagerPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<DbUser | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editRole, setEditRole] = useState<'admin' | 'siswa'>('siswa')

  // Delete Confirm Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.admin.users(search),
    queryFn: () => (search.trim() ? adminApi.searchUsers(search.trim()) : adminApi.getAllUsers()),
  })
  const users = data ?? EMPTY_USERS

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  // remove selections no longer present
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds((prev) => prev.filter((id) => users.some((u) => u.id === id)))
  }, [users])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Gagal memuat tabel user.')
    }
  }, [isError, error])

  const editMutation = useMutation({
    mutationFn: (vars: {
      id: number
      data: { username: string; password?: string; role: 'admin' | 'siswa' }
    }) => adminApi.editUser(vars.id, vars.data),
    onSuccess: () => {
      toast.success('Data user berhasil diperbarui.')
      setIsEditModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) => toast.error(err.message || 'Gagal memperbarui data user.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => adminApi.deleteUsers(ids),
    onSuccess: (res) => {
      toast.success(`${res.deletedCount} user berhasil dihapus.`)
      setSelectedIds([])
      setIsDeleteModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) => toast.error(err.message || 'Gagal menghapus user terpilih.'),
  })

  function toggleSelectAll(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked
    if (checked) {
      setSelectedIds(users.map((u) => u.id))
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

  function openEditModal(u: DbUser) {
    setEditingUser(u)
    setEditUsername(u.username)
    setEditPassword('')
    setEditRole(u.role)
    setIsEditModalOpen(true)
  }

  function handleSaveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingUser) return
    if (!editUsername.trim()) {
      toast.error('Username tidak boleh kosong.')
      return
    }

    editMutation.mutate({
      id: editingUser.id,
      data: {
        username: editUsername.trim(),
        password: editPassword.trim() || undefined,
        role: editRole,
      },
    })
  }

  function handleConfirmDelete() {
    if (selectedIds.length === 0) return
    deleteMutation.mutate(selectedIds)
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <Database size={20} className="text-neutral-900" />
              <h1 className="text-2xl font-bold text-neutral-950">Database Manager: Users</h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Inspeksi dan pemeliharaan langsung tabel pengguna sistem MentorAI.
            </p>
          </div>

          {selectedIds.length > 0 ? (
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={14} />
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </Button>
          ) : null}
        </div>

        {/* Search Filter */}
        <div className="max-w-sm">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        {isPending ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-500">Memuat data user...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center bg-white border border-neutral-200 rounded-xl p-6">
            <p className="text-sm font-semibold text-neutral-800">Tidak ada user ditemukan.</p>
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
                        checked={selectedIds.length > 0 && selectedIds.length === users.length}
                        className="rounded border-neutral-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 w-16 text-center">ID</th>
                    <th className="py-3.5 px-4">Username</th>
                    <th className="py-3.5 px-4 w-28 text-center">Role</th>
                    <th className="py-3.5 px-4 w-36">Dibuat Pada</th>
                    <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className={cn(
                        'hover:bg-neutral-50 transition-colors',
                        selectedIds.includes(u.id) && 'bg-neutral-50',
                      )}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelect(u.id)}
                          className="rounded border-neutral-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-500">
                        {u.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-900">{u.username}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={u.role === 'admin' ? 'dark' : 'outline'}>{u.role}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                          title="Edit User"
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

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        title="Edit Data Pengguna"
        onClose={() => setIsEditModalOpen(false)}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            id="edit-user-name"
            label="Username"
            value={editUsername}
            onValueChange={setEditUsername}
            required
          />

          <Input
            id="edit-user-pass"
            type="password"
            label="Password Baru (Kosongkan jika tidak ingin diubah)"
            placeholder="Masukkan password baru..."
            value={editPassword}
            onValueChange={setEditPassword}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="edit-user-role"
              className="text-xs font-semibold text-neutral-800 uppercase tracking-wide block"
            >
              Peran / Role
            </label>
            <select
              id="edit-user-role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as 'admin' | 'siswa')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            >
              <option value="siswa">Siswa</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={editMutation.isPending}>
              {editMutation.isPending ? <Spinner size="sm" className="border-t-white" /> : null}
              <span>Perbarui Data</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus Massal"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Apakah Anda yakin ingin menghapus{' '}
            <strong className="text-neutral-950">{selectedIds.length} user</strong> yang dipilih?
            Tindakan ini akan menghapus akun beserta seluruh data riwayat jawaban terkait.
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
              <span>Ya, Hapus {selectedIds.length} User</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
