import { Award, Brain, HelpCircle, Shield } from 'lucide-react'

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
]

const highlights = [
  {
    icon: Brain,
    title: 'Penilaian Kualitatif',
    description: 'Umpan balik yang spesifik membantu Anda menemukan area yang perlu diperbaiki.',
  },
  {
    icon: Shield,
    title: 'Proteksi Orisinalitas',
    description: 'Mendorong kemandirian berpikir dengan memblokir pemindahan teks otomatis.',
  },
  {
    icon: Award,
    title: 'Standarisasi Nilai',
    description: 'Skala rubrik 0-3 yang konsisten untuk setiap soal yang dikerjakan.',
  },
]

export function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 bg-white text-xs font-medium text-neutral-800">
          <HelpCircle size={14} />
          <span>Informasi & Tanya Jawab</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
          Tentang MentorAI & FAQ
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          Pelajari bagaimana platform ini membantu meningkatkan kualitas pemahaman konsep Anda secara
          terarah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => (
          <div key={item.title} className="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
            <item.icon size={20} className="text-neutral-900" />
            <h3 className="font-semibold text-sm text-neutral-900">{item.title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-950">Pertanyaan yang Sering Diajukan</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <div key={item.q} className="bg-white border border-neutral-200 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-semibold text-neutral-900">{item.q}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
