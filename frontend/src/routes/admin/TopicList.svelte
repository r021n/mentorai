<script lang="ts">
  import { onMount } from 'svelte';
  import { topicsApi } from '../../lib/api/topics';
  import type { Topic } from '../../lib/types/topic.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Button from '../../lib/components/ui/Button.svelte';
  import Input from '../../lib/components/ui/Input.svelte';
  import Modal from '../../lib/components/ui/Modal.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import {
    Plus,
    Edit2,
    Trash2,
    ListFilter,
    Users,
    BookOpen
  } from '@lucide/svelte';

  let topics = $state<Topic[]>([]);
  let isLoading = $state(true);
  let isSaving = $state(false);

  // Modal State
  let isAddEditModalOpen = $state(false);
  let editingTopic = $state<Topic | null>(null);
  let topicNameInput = $state('');

  // Delete Confirm Modal
  let isDeleteModalOpen = $state(false);
  let deletingTopic = $state<Topic | null>(null);

  async function loadTopics() {
    isLoading = true;
    try {
      topics = await topicsApi.getAll();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat daftar topik.');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadTopics();
  });

  function openAddModal() {
    editingTopic = null;
    topicNameInput = '';
    isAddEditModalOpen = true;
  }

  function openEditModal(topic: Topic) {
    editingTopic = topic;
    topicNameInput = topic.name;
    isAddEditModalOpen = true;
  }

  function openDeleteModal(topic: Topic) {
    deletingTopic = topic;
    isDeleteModalOpen = true;
  }

  async function handleSaveTopic(e: SubmitEvent) {
    e.preventDefault();
    if (!topicNameInput.trim()) {
      toast.error('Nama topik wajib diisi.');
      return;
    }

    isSaving = true;
    try {
      if (editingTopic) {
        await topicsApi.update(editingTopic.id, topicNameInput.trim());
        toast.success('Topik berhasil diperbarui.');
      } else {
        await topicsApi.create(topicNameInput.trim());
        toast.success('Topik berhasil dibuat.');
      }
      isAddEditModalOpen = false;
      await loadTopics();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan topik.');
    } finally {
      isSaving = false;
    }
  }

  async function handleConfirmDelete() {
    if (!deletingTopic) return;
    isSaving = true;
    try {
      await topicsApi.delete(deletingTopic.id);
      toast.success('Topik berhasil dihapus.');
      isDeleteModalOpen = false;
      await loadTopics();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus topik.');
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
    <div>
      <h1 class="text-2xl font-bold text-neutral-950">Manajemen Topik</h1>
      <p class="text-xs sm:text-sm text-neutral-500 mt-1">
        Kelola kategori topik pembelajaran, butir pertanyaan, dan evaluasi hasil belajar siswa.
      </p>
    </div>

    <Button variant="primary" onclick={openAddModal}>
      <Plus size={16} />
      <span>Tambah Topik</span>
    </Button>
  </div>

  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat data topik...</p>
    </div>
  {:else if topics.length === 0}
    <div class="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-4">
      <BookOpen size={32} class="mx-auto text-neutral-400" />
      <h3 class="text-base font-semibold text-neutral-900">Belum Ada Topik</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        Klik tombol "Tambah Topik" di atas untuk membuat materi topik latihan pertama Anda.
      </p>
      <Button variant="primary" size="sm" onclick={openAddModal}>
        <Plus size={14} />
        <span>Buat Topik Sekarang</span>
      </Button>
    </div>
  {:else}
    <div class="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 w-16 text-center">ID</th>
              <th class="py-3.5 px-4">Nama Topik</th>
              <th class="py-3.5 px-4 w-36">Dibuat Pada</th>
              <th class="py-3.5 px-4 text-center w-72">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each topics as topic (topic.id)}
              <tr class="hover:bg-neutral-50 transition-colors">
                <td class="py-3.5 px-4 text-center font-mono text-neutral-500">{topic.id}</td>
                <td class="py-3.5 px-4 font-semibold text-neutral-900">{topic.name}</td>
                <td class="py-3.5 px-4 text-neutral-500 text-xs">
                  {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString('id-ID') : '-'}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-1.5 flex-wrap">
                    <a
                      href="#/topics/list/{topic.id}"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800"
                    >
                      <ListFilter size={13} />
                      <span>Soal</span>
                    </a>

                    <a
                      href="#/studentsAnswers/{topic.id}"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800"
                    >
                      <Users size={13} />
                      <span>Matriks</span>
                    </a>

                    <button
                      type="button"
                      onclick={() => openEditModal(topic)}
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-100 transition-colors text-neutral-800 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onclick={() => openDeleteModal(topic)}
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors text-neutral-800 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- Add / Edit Modal -->
<Modal
  isOpen={isAddEditModalOpen}
  title={editingTopic ? 'Edit Topik' : 'Tambah Topik Baru'}
  onclose={() => (isAddEditModalOpen = false)}
>
  <form onsubmit={handleSaveTopic} class="space-y-4">
    <Input
      id="topic-name"
      label="Nama Topik"
      placeholder="Contoh: Pemrograman Dasar Web"
      bind:value={topicNameInput}
      required
    />

    <div class="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onclick={() => (isAddEditModalOpen = false)}
      >
        Batal
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSaving}
      >
        {#if isSaving}
          <Spinner size="sm" class="border-t-white" />
        {/if}
        <span>Simpan</span>
      </Button>
    </div>
  </form>
</Modal>

<!-- Delete Confirm Modal -->
<Modal
  isOpen={isDeleteModalOpen}
  title="Konfirmasi Hapus Topik"
  onclose={() => (isDeleteModalOpen = false)}
>
  <div class="space-y-4">
    <p class="text-sm text-neutral-700 leading-relaxed">
      Apakah Anda yakin ingin menghapus topik <strong class="text-neutral-950">"{deletingTopic?.name}"</strong>? Seluruh butir soal dan data evaluasi siswa yang terkait dengan topik ini akan ikut terhapus secara permanen.
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
        disabled={isSaving}
        onclick={handleConfirmDelete}
      >
        {#if isSaving}
          <Spinner size="sm" class="border-t-white" />
        {/if}
        <span>Ya, Hapus Topik</span>
      </Button>
    </div>
  </div>
</Modal>
