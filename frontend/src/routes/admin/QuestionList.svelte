<script lang="ts">
  import { onMount } from 'svelte';
  import { questionsApi } from '../../lib/api/questions';
  import { topicsApi } from '../../lib/api/topics';
  import type { Question } from '../../lib/types/question.types';
  import type { Topic } from '../../lib/types/topic.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Button from '../../lib/components/ui/Button.svelte';
  import Modal from '../../lib/components/ui/Modal.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import QuestionFormModal from './QuestionFormModal.svelte';
  import { Plus, Edit2, Trash2, ArrowLeft, HelpCircle } from '@lucide/svelte';

  interface Props {
    topicId: string;
  }

  let { topicId }: Props = $props();

  const numericTopicId = $derived(Number(topicId));

  let topic = $state<Topic | null>(null);
  let questions = $state<Question[]>([]);
  let isLoading = $state(true);
  let isSaving = $state(false);

  // Add / Edit Modal
  let isFormModalOpen = $state(false);
  let questionToEdit = $state<Question | null>(null);

  // Delete Confirm Modal
  let isDeleteModalOpen = $state(false);
  let deletingQuestion = $state<Question | null>(null);

  async function loadData() {
    isLoading = true;
    try {
      const [topicRes, questionsRes] = await Promise.all([
        topicsApi.getById(numericTopicId),
        questionsApi.getByTopic(numericTopicId),
      ]);
      topic = topicRes;
      questions = questionsRes;
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data soal.');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadData();
  });

  function openAddModal() {
    questionToEdit = null;
    isFormModalOpen = true;
  }

  function openEditModal(q: Question) {
    questionToEdit = q;
    isFormModalOpen = true;
  }

  function openDeleteModal(q: Question) {
    deletingQuestion = q;
    isDeleteModalOpen = true;
  }

  async function handleConfirmDelete() {
    if (!deletingQuestion) return;
    isSaving = true;
    try {
      await questionsApi.delete(deletingQuestion.id);
      toast.success('Soal berhasil dihapus.');
      isDeleteModalOpen = false;
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus soal.');
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Top Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
    <div class="space-y-1">
      <a
        href="#/topics"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Daftar Topik</span>
      </a>
      <h1 class="text-2xl font-bold text-neutral-950">
        Daftar Soal: {topic?.name || 'Memuat...'}
      </h1>
      <p class="text-xs text-neutral-500">
        Total: {questions.length} butir pertanyaan
      </p>
    </div>

    <Button variant="primary" onclick={openAddModal}>
      <Plus size={16} />
      <span>Tambah Soal</span>
    </Button>
  </div>

  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat butir-butir pertanyaan...</p>
    </div>
  {:else if questions.length === 0}
    <div class="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-4">
      <HelpCircle size={32} class="mx-auto text-neutral-400" />
      <h3 class="text-base font-semibold text-neutral-900">Belum Ada Soal Ditambahkan</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        Tambahkan butir pertanyaan untuk topik ini agar siswa dapat mulai berlatih.
      </p>
      <Button variant="primary" size="sm" onclick={openAddModal}>
        <Plus size={14} />
        <span>Tambah Soal Baru</span>
      </Button>
    </div>
  {:else}
    <div class="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">No</th>
              <th class="py-3.5 px-4 min-w-[280px]">Pertanyaan</th>
              <th class="py-3.5 px-4 w-28 text-center">Gambar</th>
              <th class="py-3.5 px-4 min-w-[180px]">Keterangan Konteks</th>
              <th class="py-3.5 px-4 text-center w-36">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each questions as q, idx (q.id)}
              <tr class="hover:bg-neutral-50 transition-colors">
                <td class="py-4 px-4 text-center font-mono text-neutral-500 align-top">
                  {idx + 1}
                </td>
                <td class="py-4 px-4 text-neutral-900 align-top font-medium leading-relaxed">
                  <div>{@html q.question}</div>
                </td>
                <td class="py-4 px-4 text-center align-top">
                  {#if q.pathImage}
                    <img
                      src={q.pathImage}
                      alt="Thumbnail"
                      class="h-12 w-16 object-cover rounded border border-neutral-200 mx-auto"
                    />
                  {:else}
                    <span class="text-neutral-400 text-xs">-</span>
                  {/if}
                </td>
                <td class="py-4 px-4 text-neutral-600 align-top text-xs leading-relaxed">
                  {q.imageDescription || '-'}
                </td>
                <td class="py-4 px-4 text-center align-top">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onclick={() => openEditModal(q)}
                      class="p-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-800 transition-colors cursor-pointer"
                      title="Edit Soal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onclick={() => openDeleteModal(q)}
                      class="p-1.5 border border-neutral-300 hover:bg-neutral-900 hover:text-white rounded-md text-neutral-800 transition-colors cursor-pointer"
                      title="Hapus Soal"
                    >
                      <Trash2 size={14} />
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

<!-- Question Form Modal -->
<QuestionFormModal
  isOpen={isFormModalOpen}
  topicId={numericTopicId}
  {questionToEdit}
  onclose={() => (isFormModalOpen = false)}
  onsaved={loadData}
/>

<!-- Delete Confirm Modal -->
<Modal
  isOpen={isDeleteModalOpen}
  title="Hapus Butir Soal"
  onclose={() => (isDeleteModalOpen = false)}
>
  <div class="space-y-4">
    <p class="text-sm text-neutral-700 leading-relaxed">
      Apakah Anda yakin ingin menghapus butir soal ini? Tindakan ini tidak dapat dibatalkan.
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
        <span>Hapus Soal</span>
      </Button>
    </div>
  </div>
</Modal>
