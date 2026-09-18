<script lang="ts">
  import { HelpCircle, Shield, Brain, Award } from '@lucide/svelte';

  const faqs = [
    {
      q: 'Bagaimana cara AI mengevaluasi jawaban saya?',
      a: 'Setelah Anda mengirimkan jawaban, sistem menganalisis pemahaman konseptual, ketepatan fakta, dan struktur penalaran Anda menggunakan model bahasa tingkat lanjut. Jawaban Anda dinilai dalam rentang skor 0 hingga 3 dengan umpan balik terstruktur.',
    },
    {
      q: 'Mengapa fitur copy dan paste dinonaktifkan?',
      a: 'MentorAI menerapkan sistem integritas akademik. Kami meyakini bahwa proses mengetik jawaban secara mandiri memicu sintesis pemikiran dan pemahaman konsep yang jauh lebih mendalam ketimbang menyalin jawaban.',
    },
    {
      q: 'Bagaimana perhitungan total skor latihan?',
      a: 'Total nilai dihitung menggunakan rumus persentase: (Total Skor Diperoleh / (Jumlah Soal × 3)) × 100%. Anda dapat melihat evaluasi lengkap setiap saat melalui menu "Lihat Jawabanku".',
    },
    {
      q: 'Apa yang harus dilakukan jika evaluasi AI gagal?',
      a: 'Jika terjadi gangguan koneksi atau kuota layanan AI sedang padat, sistem akan menampilkan tombol "Dapatkan Feedback" (Retry). Jawaban Anda tetap tersimpan dengan aman dan Anda dapat menekan tombol tersebut untuk memicu evaluasi ulang kapan saja.',
    },
  ];
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
  <div class="text-center space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 bg-white text-xs font-medium text-neutral-800">
      <HelpCircle size={14} />
      <span>Informasi & Tanya Jawab</span>
    </div>
    <h1 class="text-3xl font-bold tracking-tight text-neutral-950">Tentang MentorAI & FAQ</h1>
    <p class="text-sm text-neutral-600 max-w-xl mx-auto">
      Pelajari bagaimana platform ini membantu meningkatkan kualitas pemahaman konsep Anda secara terarah.
    </p>
  </div>

  <!-- Highlights Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
      <Brain size={20} class="text-neutral-900" />
      <h3 class="font-semibold text-sm text-neutral-900">Penilaian Kualitatif</h3>
      <p class="text-xs text-neutral-600 leading-relaxed">
        Umpan balik yang spesifik membantu Anda menemukan area yang perlu diperbaiki.
      </p>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
      <Shield size={20} class="text-neutral-900" />
      <h3 class="font-semibold text-sm text-neutral-900">Proteksi Orisinalitas</h3>
      <p class="text-xs text-neutral-600 leading-relaxed">
        Mendorong kemandirian berpikir dengan memblokir pemindahan teks otomatis.
      </p>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
      <Award size={20} class="text-neutral-900" />
      <h3 class="font-semibold text-sm text-neutral-900">Standarisasi Nilai</h3>
      <p class="text-xs text-neutral-600 leading-relaxed">
        Skala rubrik 0-3 yang konsisten untuk setiap soal yang dikerjakan.
      </p>
    </div>
  </div>

  <!-- FAQ Accordion / Cards -->
  <div class="space-y-4">
    <h2 class="text-lg font-bold text-neutral-950">Pertanyaan yang Sering Diajukan</h2>
    <div class="space-y-3">
      {#each faqs as item (item.q)}
        <div class="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
          <h3 class="text-sm font-semibold text-neutral-900">{item.q}</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">{item.a}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
