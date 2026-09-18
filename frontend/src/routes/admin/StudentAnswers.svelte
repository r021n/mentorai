<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '../../lib/api/admin';
  import { topicsApi } from '../../lib/api/topics';
  import type { MatrixResponse } from '../../lib/types/admin.types';
  import type { Topic } from '../../lib/types/topic.types';
  import { toast } from '../../lib/stores/toast.svelte';
  import Button from '../../lib/components/ui/Button.svelte';
  import Spinner from '../../lib/components/ui/Spinner.svelte';
  import Badge from '../../lib/components/ui/Badge.svelte';
  import { Download, ArrowLeft, Users } from '@lucide/svelte';

  interface Props {
    topicId: string;
  }

  let { topicId }: Props = $props();

  const numericTopicId = $derived(Number(topicId));

  let topic = $state<Topic | null>(null);
  let matrix = $state<MatrixResponse | null>(null);
  let isLoading = $state(true);
  let isDownloading = $state(false);

  async function loadMatrix() {
    isLoading = true;
    try {
      const [topicRes, matrixRes] = await Promise.all([
        topicsApi.getById(numericTopicId),
        adminApi.getStudentsAnswersMatrix(numericTopicId),
      ]);
      topic = topicRes;
      matrix = matrixRes;
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat matriks jawaban siswa.');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadMatrix();
  });

  async function handleDownloadExcel() {
    if (!matrix || matrix.questions.length === 0) {
      toast.error('Tidak ada data soal untuk diunduh.');
      return;
    }

    isDownloading = true;
    try {
      const blob = await adminApi.downloadExcelReport(numericTopicId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Topic_${numericTopicId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Laporan Excel berhasil diunduh.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunduh laporan Excel.');
    } finally {
      isDownloading = false;
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
        Matriks Evaluasi Siswa: {topic?.name || 'Memuat...'}
      </h1>
      <p class="text-xs text-neutral-500">
        Rekapitulasi lengkap jawaban dan umpan balik per butir pertanyaan untuk seluruh siswa.
      </p>
    </div>

    <Button
      variant="primary"
      onclick={handleDownloadExcel}
      disabled={isDownloading || !matrix || matrix.students.length === 0}
    >
      {#if isDownloading}
        <Spinner size="sm" class="border-t-white" />
        <span>Mengunduh...</span>
      {:else}
        <Download size={16} />
        <span>Unduh Jawaban Siswa (.xlsx)</span>
      {/if}
    </Button>
  </div>

  {#if isLoading}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p class="text-xs text-neutral-500">Memuat matriks evaluasi kelas...</p>
    </div>
  {:else if !matrix || matrix.students.length === 0}
    <div class="py-20 text-center bg-white border border-neutral-200 rounded-xl p-8 space-y-3">
      <Users size={32} class="mx-auto text-neutral-400" />
      <h3 class="text-base font-semibold text-neutral-900">Belum Ada Jawaban Siswa</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        Belum ada siswa yang mengirimkan jawaban untuk butir pertanyaan pada topik ini.
      </p>
    </div>
  {:else}
    <div class="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto max-h-[75vh]">
        <table class="w-full text-left text-xs sm:text-sm border-collapse">
          <thead class="bg-neutral-100 sticky top-0 z-20 border-b border-neutral-200 text-neutral-800 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3.5 px-4 w-12 text-center sticky left-0 bg-neutral-100 z-30 border-r border-neutral-200">
                No
              </th>
              <th class="py-3.5 px-4 min-w-[150px] sticky left-12 bg-neutral-100 z-30 border-r border-neutral-200">
                Nama Siswa
              </th>
              {#each matrix.questions as _q, qIdx (qIdx)}
                <th class="py-3.5 px-4 min-w-[240px] border-r border-neutral-200 text-center">
                  Soal #{qIdx + 1}
                </th>
              {/each}
              <th class="py-3.5 px-4 w-28 text-center bg-neutral-100">
                Total Nilai
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {#each matrix.students as student, sIdx (student.userId)}
              <tr class="hover:bg-neutral-50 transition-colors">
                <!-- Row Number Sticky -->
                <td class="py-4 px-4 text-center font-mono text-neutral-500 align-top sticky left-0 bg-white hover:bg-neutral-50 z-10 border-r border-neutral-200">
                  {sIdx + 1}
                </td>

                <!-- Student Name Sticky -->
                <td class="py-4 px-4 font-semibold text-neutral-950 align-top sticky left-12 bg-white hover:bg-neutral-50 z-10 border-r border-neutral-200">
                  {student.username}
                </td>

                <!-- Answers Per Question -->
                {#each matrix.questions as q (q.id)}
                  {@const answerItem = student.answers[q.id]}
                  <td class="py-4 px-4 align-top border-r border-neutral-200 text-xs space-y-2">
                    {#if answerItem && answerItem.answer}
                      <div>
                        <span class="text-[10px] font-bold text-neutral-500 uppercase block">Jawaban:</span>
                        <p class="text-neutral-900 whitespace-pre-line leading-relaxed mt-0.5">
                          {answerItem.answer}
                        </p>
                      </div>

                      <div class="pt-1.5 border-t border-neutral-100">
                        <span class="text-[10px] font-bold text-neutral-500 uppercase block">Feedback:</span>
                        <p class="text-neutral-600 whitespace-pre-line leading-relaxed mt-0.5">
                          {answerItem.feedback || 'Belum ada umpan balik'}
                        </p>
                      </div>

                      <div class="pt-1">
                        <Badge variant="dark" size="sm">
                          Skor: {answerItem.score}
                        </Badge>
                      </div>
                    {:else}
                      <span class="text-neutral-400 italic">Belum dijawab</span>
                    {/if}
                  </td>
                {/each}

                <!-- Total Score Percentage -->
                <td class="py-4 px-4 text-center align-top font-bold text-neutral-950">
                  <span class="text-sm">{student.totalScore}%</span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
