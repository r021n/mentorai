<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '../../../lib/api/admin';
  import type { DbAnswer } from '../../../lib/types/admin.types';
  import { toast } from '../../../lib/stores/toast.svelte';
  import Button from '../../../lib/components/ui/Button.svelte';
  import Input from '../../../lib/components/ui/Input.svelte';
  import Modal from '../../../lib/components/ui/Modal.svelte';
  import Spinner from '../../../lib/components/ui/Spinner.svelte';
  import Badge from '../../../lib/components/ui/Badge.svelte';
  import { Filter, Trash2, Edit2, Database, RefreshCw } from '@lucide/svelte';

  let answers = $state<DbAnswer[]>([]);
  let isLoading = $state(true);
  let isProcessing = $state(false);

  // Filters
  let filterUserId = $state('');
  let filterQuestionId = $state('');
  let filterTopicId = $state('');

  // Bulk Selection
  let selectedIds = $state<number[]>([]);

  // Edit Modal
  let isEditModalOpen = $state(false);
  let editingAnswer = $state<DbAnswer | null>(null);
  let editAnswerText = $state('');
  let editFeedbackText = $state('');
  let editScore = $state(0);
  let editUserId = $state(0);
  let editQuestionId = $state(0);
  let editTopicId = $state(0);

  // Delete Confirm Modal
  let isDeleteModalOpen = $state(false);

  async function loadAnswers() {
    isLoading = true;
    try {
      const filters: { userId?: number; questionId?: number; topicId?: number } = {};
      if (filterUserId.trim()) filters.userId = Number(filterUserId.trim());
      if (filterQuestionId.trim()) filters.questionId = Number(filterQuestionId.trim());
      if (filterTopicId.trim()) filters.topicId = Number(filterTopicId.trim());

      answers = await adminApi.getAnswers(filters);
      selectedIds = selectedIds.filter((id) => answers.some((a) => a.id === id));
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat tabel jawaban.');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadAnswers();
  });

  function clearFilters() {
    filterUserId = '';
    filterQuestionId = '';
    filterTopicId = '';
    loadAnswers();
  }

  function toggleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      selectedIds = answers.map((a) => a.id);
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

  function openEditModal(a: DbAnswer) {
    editingAnswer = a;
    editAnswerText = a.answer || '';
    editFeedbackText = a.feedback || '';
    editScore = a.score;
    editUserId = a.userId;
    editQuestionId = a.questionId;
    editTopicId = a.topicId;
    isEditModalOpen = true;
  }

  async function handleSaveEdit(e: SubmitEvent) {
    e.preventDefault();
    if (!editingAnswer) return;

    isProcessing = true;
    try {
      await adminApi.editAnswer(editingAnswer.id, {
        answer: editAnswerText.trim() || null,
        feedback: editFeedbackText.trim() || null,
        score: Number(editScore),
        userId: Number(editUserId),
        questionId: Number(editQuestionId),
        topicId: Number(editTopicId),
      });
      toast.success('Data jawaban berhasil diperbarui.');
      isEditModalOpen = false;
      await loadAnswers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui jawaban.');
    } finally {
      isProcessing = false;
    }
  }

  async function handleConfirmDelete() {
    if (selectedIds.length === 0) return;
    isProcessing = true;
    try {
      const res = await adminApi.deleteAnswers(selectedIds);
      toast.success(`${res.deletedCount} jawaban berhasil dihapus.`);
      selectedIds = [];
      isDeleteModalOpen = false;
      await loadAnswers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus jawaban terpilih.');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
    <div>
      <div class="flex items-center gap-2">
        <Database size={20} class="text-neutral-900" />
        <h1 class="text-2xl font-bold text-neutral-950">Database Manager: Answers</h1>
      </div>
      <p class="text-xs sm:text-sm text-neutral-500 mt-1">
        Inspeksi, penyaringan data tingkat lanjut, dan perbaikan manual record jawaban siswa.
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

  <!-- Filter Form -->
  <div class="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
    <div class="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
      <Filter size={14} />
      <span>Filter Data Jawaban</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
      <Input
        id="f-user"
        placeholder="Filter User ID..."
        bind:value={filterUserId}
      />
      <Input
        id="f-topic"
        placeholder="Filter Topic ID..."
        bind:value={filterTopicId}
      />
      <Input
        id="f-question"
        placeholder="Filter Question ID..."
        bind:value={filterQuestionId}
      />
      <div class="flex items-center gap-2">
        <Button variant="primary" size="md" class="flex-1" onclick={loadAnswers}>
          <span>Terapkan</span>
        </Button>
        <Button variant="outline" size="md" onclick={clearFilters} title="Reset Filter">
          <RefreshCw size={14} />
        </Button>
      </div>
    </div>
  </div>

  <!-- Table -->
  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat data jawaban...</p>
    </div>
  {:else if answers.length === 0}
    <div class="py-16 text-center bg-white border border-neutral-200 rounded-xl p-6">
      <p class="text-sm font-semibold text-neutral-800">Tidak ada jawaban yang sesuai dengan filter.</p>
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
                  checked={selectedIds.length > 0 && selectedIds.length === answers.length}
                  class="rounded border-neutral-300 cursor-pointer"
                />
              </th>
              <th class="py-3.5 px-4 w-16 text-center">ID</th>
              <th class="py-3.5 px-4 w-28">User</th>
              <th class="py-3.5 px-4 w-24 text-center">Topic ID</th>
              <th class="py-3.5 px-4 w-24 text-center">Soal ID</th>
              <th class="py-3.5 px-4 min-w-[200px]">Jawaban</th>
              <th class="py-3.5 px-4 min-w-[200px]">Feedback AI</th>
              <th class="py-3.5 px-4 w-20 text-center">Skor</th>
              <th class="py-3.5 px-4 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each answers as a (a.id)}
              <tr class="hover:bg-neutral-50 transition-colors {selectedIds.includes(a.id) ? 'bg-neutral-50' : ''}">
                <td class="py-3.5 px-4 text-center align-top">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(a.id)}
                    onchange={() => toggleSelect(a.id)}
                    class="rounded border-neutral-300 cursor-pointer"
                  />
                </td>
                <td class="py-3.5 px-4 text-center font-mono text-neutral-500 align-top">{a.id}</td>
                <td class="py-3.5 px-4 align-top">
                  <span class="font-semibold text-neutral-900 block">{a.username || `User #${a.userId}`}</span>
                  <span class="text-[10px] text-neutral-400">ID: {a.userId}</span>
                </td>
                <td class="py-3.5 px-4 text-center font-mono text-neutral-600 align-top">{a.topicId}</td>
                <td class="py-3.5 px-4 text-center font-mono text-neutral-600 align-top">{a.questionId}</td>
                <td class="py-3.5 px-4 text-neutral-800 align-top leading-relaxed text-xs">
                  {a.answer || '-'}
                </td>
                <td class="py-3.5 px-4 text-neutral-600 align-top leading-relaxed text-xs">
                  {a.feedback || '-'}
                </td>
                <td class="py-3.5 px-4 text-center align-top">
                  <Badge variant="dark" size="sm">
                    {a.score}
                  </Badge>
                </td>
                <td class="py-3.5 px-4 text-center align-top">
                  <button
                    type="button"
                    onclick={() => openEditModal(a)}
                    class="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                    title="Edit Jawaban"
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

<!-- Edit Answer Modal -->
<Modal
  isOpen={isEditModalOpen}
  title="Edit Rekord Jawaban"
  onclose={() => (isEditModalOpen = false)}
  maxWidth="lg"
>
  <form onsubmit={handleSaveEdit} class="space-y-4">
    <div class="grid grid-cols-3 gap-3">
      <Input
        id="e-user-id"
        label="User ID"
        type="number"
        bind:value={editUserId as any}
        required
      />
      <Input
        id="e-topic-id"
        label="Topic ID"
        type="number"
        bind:value={editTopicId as any}
        required
      />
      <Input
        id="e-question-id"
        label="Question ID"
        type="number"
        bind:value={editQuestionId as any}
        required
      />
    </div>

    <div class="space-y-1.5">
      <label for="e-answer-text" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
        Jawaban Siswa
      </label>
      <textarea
        id="e-answer-text"
        bind:value={editAnswerText}
        rows={3}
        class="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-y"
      ></textarea>
    </div>

    <div class="space-y-1.5">
      <label for="e-feedback-text" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
        Umpan Balik AI
      </label>
      <textarea
        id="e-feedback-text"
        bind:value={editFeedbackText}
        rows={3}
        class="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-y"
      ></textarea>
    </div>

    <div class="space-y-1.5">
      <label for="e-score" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
        Skor (0 - 3)
      </label>
      <input
        id="e-score"
        type="number"
        min="0"
        max="3"
        bind:value={editScore}
        class="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
      />
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
        <span>Simpan Perubahan</span>
      </Button>
    </div>
  </form>
</Modal>

<!-- Delete Confirm Modal -->
<Modal
  isOpen={isDeleteModalOpen}
  title="Konfirmasi Hapus Jawaban"
  onclose={() => (isDeleteModalOpen = false)}
>
  <div class="space-y-4">
    <p class="text-sm text-neutral-700 leading-relaxed">
      Apakah Anda yakin ingin menghapus <strong class="text-neutral-950">{selectedIds.length} jawaban</strong> yang dipilih?
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
        <span>Ya, Hapus {selectedIds.length} Jawaban</span>
      </Button>
    </div>
  </div>
</Modal>
