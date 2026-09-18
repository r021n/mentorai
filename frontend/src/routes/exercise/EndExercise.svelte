<script lang="ts">
  import { Award, ArrowRight, Home, BookOpen } from '@lucide/svelte';
  import { exerciseStore } from '../../lib/stores/exercise.svelte';
</script>

<div class="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
  <div class="bg-white border border-neutral-300 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
    <div class="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
      <Award size={32} />
    </div>

    <div class="space-y-2">
      <h1 class="text-2xl sm:text-3xl font-bold text-neutral-950">
        Latihan Selesai!
      </h1>
      <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
        Hebat! Seluruh butir soal telah Anda kerjakan. Anda dapat meninjau rekapan nilai dan umpan balik lengkap kapan saja.
      </p>
    </div>

    <div class="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-center gap-3">
      {#if exerciseStore.topicId}
        <a
          href="#/myAnswers/{exerciseStore.topicId}"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <span>Lihat Nilai Saya</span>
          <ArrowRight size={15} />
        </a>
      {/if}

      <a
        href="#/exercise"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-neutral-900 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
      >
        <BookOpen size={15} />
        <span>Katalog Topik</span>
      </a>

      <a
        href="#/"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-neutral-700 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
      >
        <Home size={15} />
        <span>Beranda</span>
      </a>
    </div>
  </div>
</div>
