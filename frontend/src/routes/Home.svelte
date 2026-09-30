<script lang="ts">
  import { authStore } from '../lib/stores/auth.svelte';
  import { preloadRoute } from '../lib/utils/preloadRoute';
  import {
    ShieldCheck,
    Sparkles,
    BarChart3,
    ArrowRight,
    GraduationCap,
    CheckCircle2,
    Lock,
    Brain,
    FileSpreadsheet,
    Zap,
    BookOpen,
    Users
  } from '@lucide/svelte';
</script>

<div class="space-y-24 py-8 sm:py-16">
  <!-- Hero Section -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 shadow-xs">
      <Sparkles size={14} class="text-neutral-950" />
      <span>Platform Evaluasi Pembelajaran Berbasis AI Generasi 2026</span>
    </div>

    <div class="space-y-4 max-w-4xl mx-auto">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.15]">
        Evaluasi Pemahaman Belajar Secara Mandiri, Akurat, & Berintegritas
      </h1>
      <p class="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        MentorAI mendampingi siswa merumuskan pemahaman konseptual secara mandiri dengan feedback AI objektif, proteksi anti-copy paste, serta rekapitulasi analitik komprehensif bagi pengajar.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="pt-2 flex flex-wrap items-center justify-center gap-4">
      {#if authStore.isAuthenticated}
        <a
          href="#/dashboard"
          use:preloadRoute
          class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm hover:shadow group"
        >
          <span>Buka Dashboard Utama</span>
          <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="#/exercise"
          use:preloadRoute
          class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-neutral-900 font-semibold text-sm border border-neutral-300 hover:bg-neutral-100 transition-all shadow-xs"
        >
          <GraduationCap size={16} />
          <span>Katalog Latihan Soal</span>
        </a>
      {:else}
        <a
          href="#/register"
          use:preloadRoute
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm hover:shadow group"
        >
          <span>Daftar Akun Siswa</span>
          <ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="#/login"
          use:preloadRoute
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-neutral-900 font-semibold text-sm border border-neutral-300 hover:bg-neutral-100 transition-all shadow-xs"
        >
          <span>Masuk ke Akun</span>
        </a>
      {/if}
    </div>

    <!-- Trust / Capability Highlights Strip -->
    <div class="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
      <div class="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-neutral-950">
          <Lock size={14} class="text-neutral-900" />
          <span>Anti-Copy Paste</span>
        </div>
        <p class="text-[11px] text-neutral-500">Mencegah penyalinan jawaban instan</p>
      </div>

      <div class="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-neutral-950">
          <Brain size={14} class="text-neutral-900" />
          <span>AI Dua Tahap</span>
        </div>
        <p class="text-[11px] text-neutral-500">Feedback mendalam + skor 0-3</p>
      </div>

      <div class="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-neutral-950">
          <FileSpreadsheet size={14} class="text-neutral-900" />
          <span>Ekspor Spreadsheet</span>
        </div>
        <p class="text-[11px] text-neutral-500">Unduh rekap kelas format Excel</p>
      </div>

      <div class="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
        <div class="flex items-center gap-1.5 text-xs font-bold text-neutral-950">
          <Zap size={14} class="text-neutral-900" />
          <span>Tanggapan Cepat</span>
        </div>
        <p class="text-[11px] text-neutral-500">Animasi typewriter real-time</p>
      </div>
    </div>
  </section>

  <!-- Feature Grid Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    <div class="text-center space-y-3 max-w-2xl mx-auto">
      <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Keunggulan Sistem</span>
      <h2 class="text-3xl font-extrabold text-neutral-950 tracking-tight">
        Dirancang Khusus untuk Menguji Pemahaman Murni
      </h2>
      <p class="text-sm text-neutral-600">
        MentorAI mengintegrasikan proteksi integritas akademik dengan kecerdasan buatan untuk menciptakan proses belajar yang terarah dan bermakna.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 hover:border-neutral-950 transition-colors">
        <div class="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-950">
          <ShieldCheck size={24} />
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-neutral-950">Integritas & Anti-Cheat Cerdas</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Menonaktifkan copy, cut, dan paste pada textarea soal dan jawaban. Siswa distimulasi untuk menyusun kalimat penalaran secara orisinal dari pemikiran sendiri.
          </p>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 hover:border-neutral-950 transition-colors">
        <div class="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-950">
          <Sparkles size={24} />
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-neutral-950">Evaluasi Bertingkat Berbasis AI</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Model AI menganalisis ketepatan konsep, kelengkapan argumentasi, serta memberikan koreksi konstruktif disertai skor standar rubrik 0 sampai 3 untuk setiap butir soal.
          </p>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 hover:border-neutral-950 transition-colors">
        <div class="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-950">
          <BarChart3 size={24} />
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-neutral-950">Matriks & Rekap Nilai Otomatis</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Siswa dapat mengkaji kembali catatan evaluasi terdahulu, sementara administrator dapat memantau matriks nilai kelas serta mengunduh rekap berformat .xlsx dengan satu klik.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="bg-neutral-100/70 border-y border-neutral-200 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center space-y-3 max-w-xl mx-auto">
        <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Alur Belajar Siswa</span>
        <h2 class="text-3xl font-extrabold text-neutral-950 tracking-tight">
          3 Langkah Mudah Memulai Belajar
        </h2>
        <p class="text-sm text-neutral-600">
          Proses interaktif yang intuitif, mendidik, dan bebas dari kebingungan navigasi.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <div class="w-8 h-8 rounded-full bg-neutral-950 text-white font-extrabold text-xs flex items-center justify-center">
            1
          </div>
          <h3 class="text-base font-bold text-neutral-950">Pilih Topik Latihan</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Buka katalog latihan dari dashboard dan pilih materi yang ingin dipelajari sesuai silabus.
          </p>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <div class="w-8 h-8 rounded-full bg-neutral-950 text-white font-extrabold text-xs flex items-center justify-center">
            2
          </div>
          <h3 class="text-base font-bold text-neutral-950">Jawab Pertanyaan Konseptual</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Ketik uraian jawaban secara mandiri pada antarmuka latihan yang dirancang fokus dan bersih.
          </p>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <div class="w-8 h-8 rounded-full bg-neutral-950 text-white font-extrabold text-xs flex items-center justify-center">
            3
          </div>
          <h3 class="text-base font-bold text-neutral-950">Evaluasi & Telaah Feedback AI</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            AI memberikan koreksi seketika dan catatan peningkatan untuk menyempurnakan pemahaman Anda.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- For Students & Educators Comparison Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    <div class="text-center space-y-3 max-w-xl mx-auto">
      <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Dirancang Untuk Dua Peran</span>
      <h2 class="text-3xl font-extrabold text-neutral-950 tracking-tight">
        Satu Platform, Solusi untuk Seluruh Kelas
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Siswa Card -->
      <div class="bg-white border border-neutral-200 rounded-2xl p-8 space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-950">
            <GraduationCap size={22} />
          </div>
          <div>
            <h3 class="text-lg font-bold text-neutral-950">Bagi Siswa</h3>
            <p class="text-xs text-neutral-500">Pengalaman belajar mandiri & interaktif</p>
          </div>
        </div>

        <ul class="space-y-3 text-xs text-neutral-700">
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-emerald-600 shrink-0 mt-0.5" />
            <span>Mendapatkan umpan balik kualitatif tanpa takut dinilai secara menghakimi.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-emerald-600 shrink-0 mt-0.5" />
            <span>Mengetahui skor rubrik transparan (0-3) untuk setiap butir pertanyaan konseptual.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-emerald-600 shrink-0 mt-0.5" />
            <span>Akses histori seluruh jawaban dan catatan revisi melalui dashboard pribadi.</span>
          </li>
        </ul>
      </div>

      <!-- Pengajar / Admin Card -->
      <div class="bg-white border border-neutral-200 rounded-2xl p-8 space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <h3 class="text-lg font-bold text-neutral-950">Bagi Pengajar & Administrator</h3>
            <p class="text-xs text-neutral-500">Efisiensi pemeriksaan & analitik kelas</p>
          </div>
        </div>

        <ul class="space-y-3 text-xs text-neutral-700">
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-neutral-950 shrink-0 mt-0.5" />
            <span>Menghemat waktu koreksi manual ratusan lembar jawaban uraian konsep.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-neutral-950 shrink-0 mt-0.5" />
            <span>Memantau matriks perolehan nilai seluruh siswa dalam satu layar tabel ringkas.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <CheckCircle2 size={16} class="text-neutral-950 shrink-0 mt-0.5" />
            <span>Mengunduh berkas laporan berformat Microsoft Excel (.xlsx) untuk arsip akademik.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- CTA Banner Section -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
        Mulai Evaluasi Pembelajaran Berkualitas Hari Ini
      </h2>
      <p class="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
        Masuk ke akun Anda atau daftarkan akun siswa baru untuk merasakan kemudahan belajar bersama MentorAI.
      </p>

      <div class="pt-2 flex flex-wrap items-center justify-center gap-4">
        {#if authStore.isAuthenticated}
          <a
            href="#/dashboard"
            use:preloadRoute
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <span>Buka Dashboard</span>
            <ArrowRight size={14} />
          </a>
        {:else}
          <a
            href="#/register"
            use:preloadRoute
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <span>Daftar Akun Baru</span>
            <ArrowRight size={14} />
          </a>
          <a
            href="#/login"
            use:preloadRoute
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold text-xs hover:bg-neutral-700 transition-colors"
          >
            <span>Masuk Akun</span>
          </a>
        {/if}
      </div>
    </div>
  </section>
</div>
