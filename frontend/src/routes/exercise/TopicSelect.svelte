<script lang="ts">
  import { onMount } from 'svelte';
  import { exerciseApi } from '../../lib/api/exercise';
  import type { Topic } from '../../lib/types/topic.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import { BookOpen, Play, CheckCircle2, AlertCircle } from '@lucide/svelte';

  let topics = $state<Topic[]>([]);
  let isLoading = $state(true);
  let errorMessage = $state('');

  onMount(async () => {
    try {
      topics = await exerciseApi.getExerciseTopics();
    } catch (err: any) {
      errorMessage = err.message || 'Gagal memuat topik latihan.';
      toast.error(errorMessage);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
    <div>
      <h1 class="text-2xl font-bold text-neutral-950">Katalog Topik Latihan</h1>
      <p class="text-xs sm:text-sm text-neutral-500 mt-1">
        Pilih topik untuk menguji pemahaman konsep atau melihat catatan evaluasi sebelumnya.
      </p>
    </div>
  </div>

  {#if isLoading}
    <div class="py-20 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat topik latihan...</p>
    </div>
  {:else if errorMessage}
    <div class="p-6 bg-white border border-neutral-300 rounded-xl text-center space-y-3">
      <AlertCircle size={28} class="mx-auto text-neutral-900" />
      <p class="text-sm font-semibold text-neutral-900">{errorMessage}</p>
      <button
        type="button"
        onclick={() => window.location.reload()}
        class="text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Muat Ulang
      </button>
    </div>
  {:else if topics.length === 0}
    <div class="py-16 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
      <BookOpen size={32} class="mx-auto text-neutral-400" />
      <h3 class="text-base font-semibold text-neutral-900">Belum Ada Topik Tersedia</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        Administrator belum menambahkan materi atau topik latihan. Silakan cek kembali beberapa saat lagi.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each topics as topic (topic.id)}
        <div class="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between space-y-5 hover:border-neutral-900 transition-colors">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <BookOpen size={18} />
            </div>
            <h3 class="text-base font-bold text-neutral-950 leading-snug">
              {topic.name}
            </h3>
            {#if topic.questionCount !== undefined}
              <p class="text-xs text-neutral-500">
                {topic.questionCount} Butir Soal Tersedia
              </p>
            {/if}
          </div>

          <div class="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href="#/exercise/{topic.id}"
              class="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Play size={14} />
              <span>Mulai Latihan</span>
            </a>

            <a
              href="#/myAnswers/{topic.id}"
              class="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-neutral-900 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
            >
              <CheckCircle2 size={14} />
              <span>Lihat Jawabanku</span>
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
