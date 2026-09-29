<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '../lib/stores/auth.svelte';
  import { exerciseApi } from '../lib/api/exercise';
  import { topicsApi } from '../lib/api/topics';
  import { adminApi } from '../lib/api/admin';
  import type { Topic } from '../lib/types/topic.types';
  import type { DbUser, DbAnswer } from '../lib/types/admin.types';
  import { toast } from '../lib/stores/toast.svelte';
  import Spinner from '../lib/components/ui/Spinner.svelte';
  import {
    BookOpen,
    Play,
    CheckCircle2,
    Shield,
    Users,
    Database,
    Sparkles,
    ArrowRight,
    GraduationCap,
    HelpCircle,
    Plus,
    FileSpreadsheet,
    ListFilter,
    Award,
    AlertCircle,
    Flame
  } from '@lucide/svelte';

  // Student State
  let exerciseTopics = $state<Topic[]>([]);
  let isStudentLoading = $state(false);

  // Admin State
  let adminTopics = $state<Topic[]>([]);
  let adminUsers = $state<DbUser[]>([]);
  let adminAnswers = $state<DbAnswer[]>([]);
  let isAdminLoading = $state(false);

  let errorMessage = $state('');

  onMount(async () => {
    if (authStore.isAdmin) {
      isAdminLoading = true;
      try {
        const [topicsRes, usersRes, answersRes] = await Promise.all([
          topicsApi.getAll(),
          adminApi.getAllUsers(),
          adminApi.getAnswers(),
        ]);
        adminTopics = topicsRes;
        adminUsers = usersRes;
        adminAnswers = answersRes;
      } catch (err: any) {
        errorMessage = err.message || 'Gagal memuat statistik dashboard admin.';
        toast.error(errorMessage);
      } finally {
        isAdminLoading = false;
      }
    } else {
      isStudentLoading = true;
      try {
        exerciseTopics = await exerciseApi.getExerciseTopics();
      } catch (err: any) {
        errorMessage = err.message || 'Gagal memuat topik latihan.';
        toast.error(errorMessage);
      } finally {
        isStudentLoading = false;
      }
    }
  });

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
</script>

<div class="max-w-7xl mx-auto space-y-8">
  <!-- Top Greeting Banner -->
  <div class="relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-6 sm:p-8 shadow-sm">
    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-medium text-neutral-200">
          <Sparkles size={14} class="text-amber-400" />
          <span>{currentDateFormatted}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Selamat datang kembali, {authStore.user?.username}! 👋
        </h2>
        <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {#if authStore.isAdmin}
            Kelola topik pembelajaran, bank soal konseptual, dan pantau rekapitulasi penilaian kelas berbasis AI secara terpusat.
          {:else}
            Lanjutkan latihan penalaran konseptual hari ini. MentorAI siap mengevaluasi jawaban Anda secara objektif dan mendalam.
          {/if}
        </p>
      </div>

      <div class="shrink-0 flex flex-wrap gap-3">
        {#if authStore.isAdmin}
          <a
            href="#/topics"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Plus size={16} />
            <span>Kelola Topik & Soal</span>
          </a>
        {:else}
          <a
            href="#/exercise"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Play size={16} />
            <span>Mulai Latihan Baru</span>
          </a>
        {/if}
      </div>
    </div>
  </div>

  <!-- Role-specific Dashboard Sections -->
  {#if authStore.isAdmin}
    <!-- ==================== ADMIN DASHBOARD ==================== -->
    {#if isAdminLoading}
      <div class="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p class="text-xs text-neutral-500 font-medium">Memuat statistik administrator...</p>
      </div>
    {:else}
      <!-- Admin Metric Counters -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Topik Aktif</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <BookOpen size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-3xl font-extrabold text-neutral-950">{adminTopics.length}</h3>
            <p class="text-[11px] text-neutral-500">Materi evaluasi terdaftar</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Pengguna</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Users size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-3xl font-extrabold text-neutral-950">{adminUsers.length}</h3>
            <p class="text-[11px] text-neutral-500">Akun siswa & pengajar</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Jawaban Tersimpan</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Database size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-3xl font-extrabold text-neutral-950">{adminAnswers.length}</h3>
            <p class="text-[11px] text-neutral-500">Evaluasi AI terkumpul</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Evaluator</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Shield size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-bold text-neutral-950 flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Aktif
            </h3>
            <p class="text-[11px] text-neutral-500">Anti-Cheat & Penilaian Siap</p>
          </div>
        </div>
      </section>

      <!-- Admin Quick Navigation Shortcuts -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="#/topics"
          class="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Shield size={20} />
            </div>
            <h4 class="text-base font-bold text-neutral-950">Kelola Materi & Bank Soal</h4>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Tambah, edit, atau hapus topik serta kelola butir soal dan kunci konseptual.
            </p>
          </div>
          <div class="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
            <span>Buka Panel Topik</span>
            <ArrowRight size={14} />
          </div>
        </a>

        <a
          href="#/database/users"
          class="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <h4 class="text-base font-bold text-neutral-950">Database Siswa & Akun</h4>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Manajemen user, perubahan role, reset kata sandi, dan penghapusan massal.
            </p>
          </div>
          <div class="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
            <span>Buka Tabel User</span>
            <ArrowRight size={14} />
          </div>
        </a>

        <a
          href="#/database/answers"
          class="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
        >
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Database size={20} />
            </div>
            <h4 class="text-base font-bold text-neutral-950">Database Log Jawaban</h4>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Inspeksi detail rekaman jawaban siswa, skor AI (0-3), dan catatan feedback.
            </p>
          </div>
          <div class="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
            <span>Buka Log Jawaban</span>
            <ArrowRight size={14} />
          </div>
        </a>
      </section>

      <!-- Admin Topik Overview -->
      <section class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h4 class="text-base font-bold text-neutral-950">Daftar Topik Pembelajaran</h4>
            <p class="text-xs text-neutral-500">Akses cepat ke bank soal dan matriks jawaban siswa</p>
          </div>
          <a
            href="#/topics"
            class="text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:underline"
          >
            Lihat Semua Topik →
          </a>
        </div>

        {#if adminTopics.length === 0}
          <div class="py-8 text-center text-xs text-neutral-500">
            Belum ada topik yang dibuat. Klik tombol di atas untuk menambah topik baru.
          </div>
        {:else}
          <div class="divide-y divide-neutral-100">
            {#each adminTopics.slice(0, 5) as topic (topic.id)}
              <div class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h5 class="text-sm font-semibold text-neutral-950">{topic.name}</h5>
                    <p class="text-[11px] text-neutral-400">
                      ID: #{topic.id} {topic.questionCount !== undefined ? `• ${topic.questionCount} Soal` : ''}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <a
                    href="#/topics/list/{topic.id}"
                    class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
                  >
                    Kelola Soal
                  </a>
                  <a
                    href="#/studentsAnswers/{topic.id}"
                    class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Matriks Nilai
                  </a>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}

  {:else}
    <!-- ==================== SISWA DASHBOARD ==================== -->
    {#if isStudentLoading}
      <div class="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p class="text-xs text-neutral-500 font-medium">Memuat katalog materi latihan...</p>
      </div>
    {:else}
      <!-- Siswa Summary Metric Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Topik Latihan</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <BookOpen size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-3xl font-extrabold text-neutral-950">{exerciseTopics.length}</h3>
            <p class="text-[11px] text-neutral-500">Materi siap dikerjakan</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Anti-Cheat</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Shield size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-bold text-neutral-950">Proteksi 100%</h3>
            <p class="text-[11px] text-neutral-500">Fokus pada penalaran mandiri</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Skala Rubrik</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Award size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-bold text-neutral-950">Skor 0 - 3</h3>
            <p class="text-[11px] text-neutral-500">Standarisasi evaluasi AI</p>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mode Latihan</span>
            <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Sparkles size={18} />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-bold text-neutral-950">Interaktif</h3>
            <p class="text-[11px] text-neutral-500">Feedback per butir soal</p>
          </div>
        </div>
      </section>

      <!-- Quick Action Cards for Student -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="#/exercise"
          class="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between hover:border-neutral-950 transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0">
              <GraduationCap size={24} />
            </div>
            <div>
              <h4 class="text-base font-bold text-neutral-950">Katalog Latihan Soal</h4>
              <p class="text-xs text-neutral-500 mt-0.5">Pilih topik dan kerjakan soal latihan konseptual sekarang</p>
            </div>
          </div>
          <div class="p-2 rounded-lg bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <ArrowRight size={18} />
          </div>
        </a>

        <a
          href="#/faq"
          class="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between hover:border-neutral-950 transition-all group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 class="text-base font-bold text-neutral-950">Panduan & Cara Kerja AI</h4>
              <p class="text-xs text-neutral-500 mt-0.5">Pelajari rubrik penilaian dan kiat menjawab soal konseptual</p>
            </div>
          </div>
          <div class="p-2 rounded-lg bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
            <ArrowRight size={18} />
          </div>
        </a>
      </section>

      <!-- Student Topics List -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-neutral-950">Topik Pembelajaran Pilihan</h3>
            <p class="text-xs text-neutral-500">Pilih salah satu topik untuk mulai berlatih atau melihat catatan jawaban</p>
          </div>
          <a
            href="#/exercise"
            class="text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:underline"
          >
            Lihat Semua Topik →
          </a>
        </div>

        {#if exerciseTopics.length === 0}
          <div class="p-8 text-center bg-white border border-neutral-200 rounded-2xl space-y-2">
            <BookOpen size={32} class="mx-auto text-neutral-400" />
            <p class="text-sm font-semibold text-neutral-800">Belum ada topik yang tersedia</p>
            <p class="text-xs text-neutral-500">Materi latihan akan ditampilkan di sini saat pengajar menambahkannya.</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each exerciseTopics as topic (topic.id)}
              <div class="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-950 transition-colors">
                <div class="space-y-2">
                  <div class="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <BookOpen size={16} />
                  </div>
                  <h4 class="text-sm font-bold text-neutral-950 leading-snug line-clamp-2">
                    {topic.name}
                  </h4>
                  {#if topic.questionCount !== undefined}
                    <p class="text-[11px] text-neutral-500 font-medium">
                      {topic.questionCount} Butir Pertanyaan
                    </p>
                  {/if}
                </div>

                <div class="pt-3 border-t border-neutral-100 flex items-center gap-2">
                  <a
                    href="#/exercise/{topic.id}"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    <Play size={13} />
                    <span>Latihan</span>
                  </a>
                  <a
                    href="#/myAnswers/{topic.id}"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <CheckCircle2 size={13} />
                    <span>Hasil Saya</span>
                  </a>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Learning Tips Callout -->
      <section class="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
        <div class="flex items-center gap-2.5 text-neutral-950 font-bold text-sm">
          <Sparkles size={16} class="text-amber-500" />
          <span>Tips Memaksimalkan Nilai Evaluasi AI</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div class="space-y-1">
            <span class="text-xs font-bold text-neutral-900">1. Gunakan Pemikiran Sendiri</span>
            <p class="text-xs text-neutral-500 leading-relaxed">
              Jelaskan konsep inti dengan kalimat sendiri secara terstruktur. Jangan menyalin teks dari sumber lain.
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-xs font-bold text-neutral-900">2. Sertakan Alasan & Logika</span>
            <p class="text-xs text-neutral-500 leading-relaxed">
              AI menilai kedalaman pemahaman, bukan sekadar kata kunci. Jabarkan "mengapa" dan "bagaimana" konsep tersebut berlaku.
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-xs font-bold text-neutral-900">3. Baca Feedback dengan Cermat</span>
            <p class="text-xs text-neutral-500 leading-relaxed">
              Jika skor Anda belum maksimal (0-2), baca rekomendasi yang diberikan AI dan gunakan untuk memperbaiki jawaban Anda.
            </p>
          </div>
        </div>
      </section>
    {/if}
  {/if}
</div>
