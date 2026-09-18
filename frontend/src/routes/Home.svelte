<script lang="ts">
  import { authStore } from '../lib/stores/auth.svelte';
  import { ShieldCheck, Sparkles, BarChart3, ArrowRight } from '@lucide/svelte';
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
  <!-- Hero Section -->
  <section class="max-w-3xl mx-auto text-center space-y-6">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 bg-white text-xs font-medium text-neutral-800">
      <Sparkles size={14} class="text-neutral-900" />
      <span>Sistem Evaluasi Berbasis AI Mutakhir 2026</span>
    </div>

    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
      Tingkatkan Pemahaman Belajar Melalui Evaluasi Interaktif
    </h1>

    <p class="text-base sm:text-lg text-neutral-600 leading-relaxed">
      MentorAI mendampingi proses belajar Anda dengan pertanyaan konseptual terstruktur dan umpan balik langsung dari AI untuk memperkuat pemahaman mendalam tanpa manipulasi jawaban.
    </p>

    <div class="pt-2 flex flex-wrap items-center justify-center gap-4">
      {#if authStore.isAuthenticated}
        <a
          href="#/exercise"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-950 text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          <span>Mulai Latihan Sekarang</span>
          <ArrowRight size={16} />
        </a>
      {:else}
        <a
          href="#/login"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-950 text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          <span>Masuk ke Akun</span>
          <ArrowRight size={16} />
        </a>
        <a
          href="#/register"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-neutral-900 font-medium text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors"
        >
          <span>Daftar Siswa Baru</span>
        </a>
      {/if}
    </div>
  </section>

  <!-- Feature Highlights -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white border border-neutral-200 rounded-xl p-6 space-y-3 hover:border-neutral-900 transition-colors">
      <div class="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
        <ShieldCheck size={20} />
      </div>
      <h3 class="text-base font-semibold text-neutral-900">Integritas & Anti-Kecurangan</h3>
      <p class="text-sm text-neutral-600 leading-relaxed">
        Sistem memblokir copy-paste pada soal dan jawaban, mendorong siswa untuk merumuskan pemikiran dan pemahaman konsep secara orisinal.
      </p>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl p-6 space-y-3 hover:border-neutral-900 transition-colors">
      <div class="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
        <Sparkles size={20} />
      </div>
      <h3 class="text-base font-semibold text-neutral-900">Evaluasi AI Bertahap</h3>
      <p class="text-sm text-neutral-600 leading-relaxed">
        Analisis jawaban secara dua tahap dengan feedback objektif, saran pengembangan, dan skor kuantitatif 0-3 untuk setiap butir soal.
      </p>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl p-6 space-y-3 hover:border-neutral-900 transition-colors">
      <div class="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
        <BarChart3 size={20} />
      </div>
      <h3 class="text-base font-semibold text-neutral-900">Matriks & Rekap Nilai</h3>
      <p class="text-sm text-neutral-600 leading-relaxed">
        Laporan terperinci untuk siswa dan administrator, lengkap dengan unduhan format spreadsheet Excel (.xlsx) untuk kebutuhan analisis kelas.
      </p>
    </div>
  </section>
</div>
