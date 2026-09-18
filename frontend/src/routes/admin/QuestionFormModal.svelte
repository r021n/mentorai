<script lang="ts">
  import { questionsApi } from '../../lib/api/questions';
  import type { Question } from '../../lib/types/question.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Modal from '../../lib/components/ui/Modal.svelte';
  import Button from '../../lib/components/ui/Button.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import { X, Image as ImageIcon } from '@lucide/svelte';

  interface Props {
    isOpen: boolean;
    topicId: number;
    questionToEdit: Question | null;
    onclose: () => void;
    onsaved: () => void;
  }

  let {
    isOpen,
    topicId,
    questionToEdit,
    onclose,
    onsaved,
  }: Props = $props();

  let questionText = $state('');
  let imageDescription = $state('');
  let selectedFile = $state<File | null>(null);
  let previewUrl = $state<string | null>(null);
  let isSaving = $state(false);

  $effect(() => {
    if (isOpen) {
      if (questionToEdit) {
        questionText = questionToEdit.question;
        imageDescription = questionToEdit.imageDescription || '';
        previewUrl = questionToEdit.pathImage || null;
      } else {
        questionText = '';
        imageDescription = '';
        previewUrl = null;
      }
      selectedFile = null;
    }
  });

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      selectedFile = file;
      previewUrl = URL.createObjectURL(file);
    }
  }

  function removeImage() {
    selectedFile = null;
    previewUrl = null;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Konten pertanyaan wajib diisi.');
      return;
    }

    isSaving = true;
    try {
      if (questionToEdit) {
        await questionsApi.update(questionToEdit.id, {
          question: questionText.trim(),
          imageDescription: imageDescription.trim() || null,
          image: selectedFile,
          pathImage: previewUrl ? previewUrl : null,
        });
        toast.success('Soal berhasil diperbarui.');
      } else {
        await questionsApi.create({
          topicId,
          question: questionText.trim(),
          imageDescription: imageDescription.trim() || null,
          image: selectedFile,
        });
        toast.success('Soal berhasil ditambahkan.');
      }
      onsaved();
      onclose();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan soal.');
    } finally {
      isSaving = false;
    }
  }
</script>

<Modal
  {isOpen}
  title={questionToEdit ? 'Edit Butir Soal' : 'Tambah Soal Baru'}
  {onclose}
  maxWidth="xl"
>
  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- Question Textarea -->
    <div class="space-y-1.5">
      <label for="q-text" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
        Pertanyaan / Soal <span class="text-neutral-900">*</span>
      </label>
      <textarea
        id="q-text"
        bind:value={questionText}
        placeholder="Tuliskan butir pertanyaan secara jelas..."
        rows={4}
        required
        class="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-y"
      ></textarea>
    </div>

    <!-- Image Upload & Preview -->
    <div class="space-y-2">
      <span class="text-xs font-semibold text-neutral-800 uppercase tracking-wide block">
        Gambar Pendukung (Opsional)
      </span>

      {#if previewUrl}
        <div class="relative w-full p-2 border border-neutral-300 rounded-lg bg-neutral-50 flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            class="max-h-48 object-contain rounded"
          />
          <button
            type="button"
            onclick={removeImage}
            aria-label="Hapus gambar"
            class="absolute top-2 right-2 p-1 bg-white border border-neutral-300 rounded-md text-neutral-600 hover:text-neutral-950 transition-colors shadow-sm cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      {:else}
        <label
          class="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-900 bg-neutral-50 cursor-pointer transition-colors"
        >
          <ImageIcon size={24} class="text-neutral-400" />
          <div class="text-center">
            <span class="text-xs font-semibold text-neutral-900">Pilih berkas gambar</span>
            <p class="text-[11px] text-neutral-500">Format PNG, JPG, GIF hingga 5MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onchange={handleFileChange}
            class="hidden"
          />
        </label>
      {/if}
    </div>

    <!-- Image Description -->
    <div class="space-y-1.5">
      <label for="img-desc" class="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
        Konteks Gambar (Untuk Panduan AI)
      </label>
      <textarea
        id="img-desc"
        bind:value={imageDescription}
        placeholder="Berikan keterangan konteks diagram atau gambar agar AI dapat mengevaluasi dengan akurat..."
        rows={2}
        class="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors resize-y"
      ></textarea>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end gap-2 pt-3 border-t border-neutral-200">
      <Button
        type="button"
        variant="outline"
        onclick={onclose}
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
        <span>Simpan Soal</span>
      </Button>
    </div>
  </form>
</Modal>
