import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { selectIsAuthenticated, useAuthStore } from '../lib/stores/auth'

const highlights = [
  {
    icon: Lock,
    title: 'Anti-Copy Paste',
    description: 'Mencegah penyalinan jawaban instan',
  },
  {
    icon: Brain,
    title: 'AI Dua Tahap',
    description: 'Feedback mendalam + skor 0-3',
  },
  {
    icon: FileSpreadsheet,
    title: 'Ekspor Spreadsheet',
    description: 'Unduh rekap kelas format Excel',
  },
  {
    icon: Zap,
    title: 'Tanggapan Cepat',
    description: 'Animasi typewriter real-time',
  },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Integritas & Anti-Cheat Cerdas',
    description:
      'Menonaktifkan copy, cut, dan paste pada textarea soal dan jawaban. Siswa distimulasi untuk menyusun kalimat penalaran secara orisinal dari pemikiran sendiri.',
  },
  {
    icon: Sparkles,
    title: 'Evaluasi Bertingkat Berbasis AI',
    description:
      'Model AI menganalisis ketepatan konsep, kelengkapan argumentasi, serta memberikan koreksi konstruktif disertai skor standar rubrik 0 sampai 3 untuk setiap butir soal.',
  },
  {
    icon: BarChart3,
    title: 'Matriks & Rekap Nilai Otomatis',
    description:
      'Siswa dapat mengkaji kembali catatan evaluasi terdahulu, sementara administrator dapat memantau matriks nilai kelas serta mengunduh rekap berformat .xlsx dengan satu klik.',
  },
]

const steps = [
  {
    step: 1,
    title: 'Pilih Topik Latihan',
    description:
      'Buka katalog latihan dari dashboard dan pilih materi yang ingin dipelajari sesuai silabus.',
  },
  {
    step: 2,
    title: 'Jawab Pertanyaan Konseptual',
    description: 'Ketik uraian jawaban secara mandiri pada antarmuka latihan yang dirancang fokus dan bersih.',
  },
  {
    step: 3,
    title: 'Evaluasi & Telaah Feedback AI',
    description:
      'AI memberikan koreksi seketika dan catatan peningkatan untuk menyempurnakan pemahaman Anda.',
  },
]

const studentBenefits = [
  'Mendapatkan umpan balik kualitatif tanpa takut dinilai secara menghakimi.',
  'Mengetahui skor rubrik transparan (0-3) untuk setiap butir pertanyaan konseptual.',
  'Akses histori seluruh jawaban dan catatan revisi melalui dashboard pribadi.',
]

const teacherBenefits = [
  'Menghemat waktu koreksi manual ratusan lembar jawaban uraian konsep.',
  'Memantau matriks perolehan nilai seluruh siswa dalam satu layar tabel ringkas.',
  'Mengunduh berkas laporan berformat Microsoft Excel (.xlsx) untuk arsip akademik.',
]

export function HomePage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  return (
    <div className="space-y-24 py-8 sm:py-16">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 shadow-xs">
          <Sparkles size={14} className="text-neutral-950" />
          <span>Platform Evaluasi Pembelajaran Berbasis AI Generasi 2026</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.15]">
            Evaluasi Pemahaman Belajar Secara Mandiri, Akurat, & Berintegritas
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            MentorAI mendampingi siswa merumuskan pemahaman konseptual secara mandiri dengan feedback AI
            objektif, proteksi anti-copy paste, serta rekapitulasi analitik komprehensif bagi pengajar.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                preload="intent"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm hover:shadow group"
              >
                <span>Buka Dashboard Utama</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/exercise"
                preload="intent"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-neutral-900 font-semibold text-sm border border-neutral-300 hover:bg-neutral-100 transition-all shadow-xs"
              >
                <GraduationCap size={16} />
                <span>Katalog Latihan Soal</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                preload="intent"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-950 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm hover:shadow group"
              >
                <span>Daftar Akun Siswa</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                preload="intent"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-neutral-900 font-semibold text-sm border border-neutral-300 hover:bg-neutral-100 transition-all shadow-xs"
              >
                <span>Masuk ke Akun</span>
              </Link>
            </>
          )}
        </div>

        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          {highlights.map((item) => (
            <div key={item.title} className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-950">
                <item.icon size={14} className="text-neutral-900" />
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-neutral-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Keunggulan Sistem
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            Dirancang Khusus untuk Menguji Pemahaman Murni
          </h2>
          <p className="text-sm text-neutral-600">
            MentorAI mengintegrasikan proteksi integritas akademik dengan kecerdasan buatan untuk
            menciptakan proses belajar yang terarah dan bermakna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-neutral-200 rounded-2xl p-7 space-y-4 hover:border-neutral-950 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-950">
                <item.icon size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-neutral-950">{item.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100/70 border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Alur Belajar Siswa
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
              3 Langkah Mudah Memulai Belajar
            </h2>
            <p className="text-sm text-neutral-600">
              Proses interaktif yang intuitif, mendidik, dan bebas dari kebingungan navigasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-neutral-950 text-white font-extrabold text-xs flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-neutral-950">{item.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Dirancang Untuk Dua Peran
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            Satu Platform, Solusi untuk Seluruh Kelas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-950">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Bagi Siswa</h3>
                <p className="text-xs text-neutral-500">Pengalaman belajar mandiri & interaktif</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-neutral-700">
              {studentBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Bagi Pengajar & Administrator</h3>
                <p className="text-xs text-neutral-500">Efisiensi pemeriksaan & analitik kelas</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-neutral-700">
              {teacherBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-neutral-950 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Mulai Evaluasi Pembelajaran Berkualitas Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Masuk ke akun Anda atau daftarkan akun siswa baru untuk merasakan kemudahan belajar bersama
            MentorAI.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                preload="intent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <span>Buka Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  preload="intent"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  <span>Daftar Akun Baru</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  preload="intent"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold text-xs hover:bg-neutral-700 transition-colors"
                >
                  <span>Masuk Akun</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
