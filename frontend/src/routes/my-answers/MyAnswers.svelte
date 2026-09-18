<script lang="ts">
  import { onMount } from 'svelte';
  import { myAnswersApi } from '../../lib/api/my-answers';
  import type { MyAnswersSummary } from '../../lib/types/answer.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import Badge from '../../lib/components/ui/Badge.svelte';
  import { ArrowLeft, AlertCircle, Award } from '@lucide/svelte';

  interface Props {
    topicId: string;
  }

  let { topicId }: Props = $props();

  let summary = $state<MyAnswersSummary | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state('');

  const numericTopicId = $derived(Number(topicId));

  onMount(async () => {
    try {
      summary = await myAnswersApi.getByTopic(numericTopicId);
    } catch (err: any) {
      errorMessage = err.message || 'Gagal memuat rekap nilai siswa.';
      toast.error(errorMessage);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Top Navigation & Title -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
    <div class="space-y-1">
      <a
        href="#/exercise"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Katalog Topik</span>
      </a>
      <h1 class="text-2xl font-bold text-neutral-950">
        Riwayat & Rekap Nilai: {summary?.topic.name || 'Memuat...'}
      </h1>
    </div>

    {#if summary}
      <div class="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl p-3 shadow-sm">
        <Award size={24} class="text-neutral-900" />
        <div>
          <p class="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Total Skor Akhir</p>
          <p class="text-xl font-extrabold text-neutral-950">
            {summary.scorePercentage}%
            <span class="text-xs font-normal text-neutral-500">
              ({summary.totalScore} / {summary.maxPossibleScore} poin)
            </span>
          </p>
        </div>
      </div>
    {/if}
  </div>

  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat rincian jawaban...</p>
    </div>
  {:else if errorMessage}
    <div class="p-8 bg-white border border-neutral-300 rounded-xl text-center space-y-3">
      <AlertCircle size={32} class="mx-auto text-neutral-900" />
      <p class="text-sm font-semibold text-neutral-900">{errorMessage}</p>
      <a
        href="#/exercise"
        class="inline-block text-xs px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Kembali ke Katalog
      </a>
    </div>
  {:else if summary}
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs text-neutral-500">Total Soal</p>
        <p class="text-lg font-bold text-neutral-900 mt-0.5">{summary.totalQuestions}</p>
      </div>

      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs text-neutral-500">Soal Dijawab</p>
        <p class="text-lg font-bold text-neutral-900 mt-0.5">{summary.answeredQuestions}</p>
      </div>

      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs text-neutral-500">Persentase Penguasaan</p>
        <p class="text-lg font-bold text-neutral-900 mt-0.5">{summary.scorePercentage}%</p>
      </div>
    </div>

    <!-- Answers Table -->
    <div class="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center">No</th>
              <th class="py-3.5 px-4 min-w-[200px]">Pertanyaan</th>
              <th class="py-3.5 px-4 min-w-[220px]">Jawaban Anda</th>
              <th class="py-3.5 px-4 min-w-[260px]">Umpan Balik AI</th>
              <th class="py-3.5 px-4 w-24 text-center">Skor (0-3)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each summary.answers as item, idx (item.questionId)}
              <tr class="hover:bg-neutral-50 transition-colors">
                <td class="py-4 px-4 text-center font-medium text-neutral-500 align-top">
                  {idx + 1}
                </td>
                <td class="py-4 px-4 text-neutral-900 align-top space-y-2 font-medium leading-relaxed">
                  <div>{@html item.questionText}</div>
                  {#if item.pathImage}
                    <img
                      src={item.pathImage}
                      alt="Soal"
                      class="max-h-24 rounded border border-neutral-200 object-contain"
                    />
                  {/if}
                </td>
                <td class="py-4 px-4 text-neutral-800 align-top whitespace-pre-line leading-relaxed">
                  {item.studentAnswer || '-'}
                </td>
                <td class="py-4 px-4 text-neutral-700 align-top whitespace-pre-line leading-relaxed">
                  {item.feedback || 'Belum dievaluasi'}
                </td>
                <td class="py-4 px-4 text-center align-top">
                  <Badge variant={item.score > 0 ? 'dark' : 'outline'}>
                    {item.score} / 3
                  </Badge>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
