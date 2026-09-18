<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '../../../lib/api/admin';
  import type { DbUser } from '../../../lib/types/admin.types';
  import { toast } from '../../../lib/stores/toast.svelte';
  import Button from '../../../lib/components/ui/Button.svelte';
  import Input from '../../../lib/components/ui/Input.svelte';
  import Modal from '../../../lib/components/ui/Modal.svelte';
  import Spinner from '../../../lib/components/ui/Spinner.svelte';
  import Badge from '../../../lib/components/ui/Badge.svelte';
  import { Search, Trash2, Edit2, Database } from '@lucide/svelte';

  let users = $state<DbUser[]>([]);
  let searchQuery = $state('');
  let isLoading = $state(true);
  let isProcessing = $state(false);

  // Selection
  let selectedIds = $state<number[]>([]);

  // Edit Modal
  let isEditModalOpen = $state(false);
  let editingUser = $state<DbUser | null>(null);
  let editUsername = $state('');
  let editPassword = $state('');
  let editRole = $state<'admin' | 'siswa'>('siswa');

  // Delete Confirm Modal
  let isDeleteModalOpen = $state(false);

  async function loadUsers(query = '') {
    isLoading = true;
    try {
      if (query.trim()) {
        users = await adminApi.searchUsers(query.trim());
      } else {
        users = await adminApi.getAllUsers();
      }
      // remove selections no longer present
      selectedIds = selectedIds.filter((id) => users.some((u) => u.id === id));
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat tabel user.');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadUsers();
  });

  let searchTimeout: any;
  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadUsers(searchQuery);
    }, 300);
  }

  function toggleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      selectedIds = users.map((u) => u.id);
    } else {
      selectedIds = [];
    }
  }

  function toggleSelect(id: number) {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((item) => item !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
  }

  function openEditModal(u: DbUser) {
    editingUser = u;
    editUsername = u.username;
    editPassword = '';
    editRole = u.role as 'admin' | 'siswa';
    isEditModalOpen = true;
  }

  async function handleSaveEdit(e: SubmitEvent) {
    e.preventDefault();
    if (!editingUser) return;
    if (!editUsername.trim()) {
      toast.error('Username tidak boleh kosong.');
      return;
    }

    isProcessing = true;
    try {
      await adminApi.editUser(editingUser.id, {
        username: editUsername.trim(),
        password: editPassword.trim() || undefined,
        role: editRole,
      });
      toast.success('Data user berhasil diperbarui.');
      isEditModalOpen = false;
      await loadUsers(searchQuery);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui data user.');
    } finally {
      isProcessing = false;
    }
  }

  async function handleConfirmDelete() {
    if (selectedIds.length === 0) return;
    isProcessing = true;
    try {
      const res = await adminApi.deleteUsers(selectedIds);
      toast.success(`${res.deletedCount} user berhasil dihapus.`);
      selectedIds = [];
      isDeleteModalOpen = false;
      await loadUsers(searchQuery);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus user terpilih.');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
    <div>
      <div class="flex items-center gap-2">
        <Database size={20} class="text-neutral-900" />
        <h1 class="text-2xl font-bold text-neutral-950">Database Manager: Users</h1>
      </div>
      <p class="text-xs sm:text-sm text-neutral-500 mt-1">
        Inspeksi dan pemeliharaan langsung tabel pengguna sistem MentorAI.
      </p>
    </div>

    {#if selectedIds.length > 0}
      <Button
        variant="danger"
        size="sm"
        onclick={() => (isDeleteModalOpen = true)}
      >
        <Trash2 size={14} />
        <span>Hapus Terpilih ({selectedIds.length})</span>
      </Button>
    {/if}
  </div>

  <!-- Search Filter -->
  <div class="max-w-sm">
    <div class="relative">
      <Search size={16} class="absolute left-3.5 top-3 text-neutral-400" />
      <input
        type="text"
        placeholder="Cari berdasarkan username..."
        bind:value={searchQuery}
        oninput={handleSearchInput}
        class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
      />
    </div>
  </div>

  <!-- Table -->
  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat data user...</p>
    </div>
  {:else if users.length === 0}
    <div class="py-16 text-center bg-white border border-neutral-200 rounded-xl p-6">
      <p class="text-sm font-semibold text-neutral-800">Tidak ada user ditemukan.</p>
    </div>
  {:else}
    <div class="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  onchange={toggleSelectAll}
                  checked={selectedIds.length > 0 && selectedIds.length === users.length}
                  class="rounded border-neutral-300 cursor-pointer"
                />
              </th>
              <th class="py-3.5 px-4 w-16 text-center">ID</th>
              <th class="py-3.5 px-4">Username</th>
              <th class="py-3.5 px-4 w-28 text-center">Role</th>
              <th class="py-3.5 px-4 w-36">Dibuat Pada</th>
              <th class="py-3.5 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each users as u (u.id)}
              <tr class="hover:bg-neutral-50 transition-colors {selectedIds.includes(u.id) ? 'bg-neutral-50' : ''}">
                <td class="py-3.5 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    onchange={() => toggleSelect(u.id)}
                    class="rounded border-neutral-300 cursor-pointer"
                  />
                </td>
                <td class="py-3.5 px-4 text-center font-mono text-neutral-500">{u.id}</td>
                <td class="py-3.5 px-4 font-semibold text-neutral-900">{u.username}</td>
                <td class="py-3.5 px-4 text-center">
                  <Badge variant={u.role === 'admin' ? 'dark' : 'outline'}>
                    {u.role}
                  </Badge>
                </td>
                <td class="py-3.5 px-4 text-neutral-500 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onclick={() => openEditModal(u)}
                    class="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                    title="Edit User"
                  >
                    <Edit2 size={13} />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- Edit User Modal -->
<Modal
  isOpen={isEditModalOpen}
  title="Edit Data Pengguna"
  onclose={() => (isEditModalOpen = false)}
>
  <form onsubmit={handleSaveEdit} class="space-y-4">
    <Input
      id="edit-user-name"
      label="Username"
      bind:value={editUsername}
      required
    />

    <Input
      id="edit-user-pass"
      type="password"
      label="Password Baru (Kosongkan jika tidak ingin diubah)"
      placeholder="Masukkan password baru..."
      bind:value={editPassword}
    />

    <div class="space-y-1.5">
      <label for="edit-user-role" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
        Peran / Role
      </label>
      <select
        id="edit-user-role"
        bind:value={editRole}
        class="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      >
        <option value="siswa">Siswa</option>
        <option value="admin">Administrator</option>
      </select>
    </div>

    <div class="flex justify-end gap-2 pt-3 border-t border-neutral-200">
      <Button
        type="button"
        variant="outline"
        onclick={() => (isEditModalOpen = false)}
      >
        Batal
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isProcessing}
      >
        {#if isProcessing}
          <Spinner size="sm" class="border-t-white" />
        {/if}
        <span>Perbarui Data</span>
      </Button>
    </div>
  </form>
</Modal>

<!-- Delete Confirm Modal -->
<Modal
  isOpen={isDeleteModalOpen}
  title="Konfirmasi Hapus Massal"
  onclose={() => (isDeleteModalOpen = false)}
>
  <div class="space-y-4">
    <p class="text-sm text-neutral-700 leading-relaxed">
      Apakah Anda yakin ingin menghapus <strong class="text-neutral-950">{selectedIds.length} user</strong> yang dipilih? Tindakan ini akan menghapus akun beserta seluruh data riwayat jawaban terkait.
    </p>

    <div class="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onclick={() => (isDeleteModalOpen = false)}
      >
        Batal
      </Button>
      <Button
        type="button"
        variant="danger"
        disabled={isProcessing}
        onclick={handleConfirmDelete}
      >
        {#if isProcessing}
          <Spinner size="sm" class="border-t-white" />
        {/if}
        <span>Ya, Hapus {selectedIds.length} User</span>
      </Button>
    </div>
  </div>
</Modal>
