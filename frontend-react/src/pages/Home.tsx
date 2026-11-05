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
    description: 'Feedback mendalam dan skor 0-3',
  },
  {
    icon: FileSpreadsheet,
    title: 'Ekspor Spreadsheet',
    description: 'Unduh rekap kelas format Excel',
  },
  {
    icon: Zap,
    title: 'Tanggapan Cepat',
    description: 'Evaluasi AI langsung terbaca',
  },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Integritas dan anti-cheat cerdas',
    description:
      'Menonaktifkan copy, cut, dan paste pada textarea soal dan jawaban. Siswa distimulasi untuk menyusun kalimat penalaran secara orisinal dari pemikiran sendiri.',
  },
  {
    icon: Brain,
    title: 'Evaluasi bertingkat berbasis AI',
    description:
      'Model AI menganalisis ketepatan konsep, kelengkapan argumentasi, serta memberikan koreksi konstruktif disertai skor standar rubrik 0 sampai 3 untuk setiap butir soal.',
  },
  {
    icon: BarChart3,
    title: 'Matriks dan rekap nilai otomatis',
    description:
      'Siswa dapat mengkaji kembali catatan evaluasi terdahulu, sementara administrator dapat memantau matriks nilai kelas serta mengunduh rekap berformat .xlsx dengan satu klik.',
  },
]

const steps = [
  {
    step: 1,
    title: 'Pilih topik latihan',
    description:
      'Buka katalog latihan dari dashboard dan pilih materi yang ingin dipelajari sesuai silabus.',
  },
  {
    step: 2,
    title: 'Jawab pertanyaan konseptual',
    description:
      'Ketik uraian jawaban secara mandiri pada antarmuka latihan yang dirancang fokus dan bersih.',
  },
  {
    step: 3,
    title: 'Evaluasi dan telaah feedback AI',
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
    <div className="bg-white">
      {/* ================= HERO ================= */}
      <section className="border-b border-neutral-200 bg-teal-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 text-balance leading-[1.15]">
              Evaluasi pemahaman belajar secara mandiri,{' '}
              <span className="text-teal-700">akurat, dan berintegritas</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-neutral-600 leading-relaxed text-pretty">
              MentorAI mendampingi siswa merumuskan pemahaman konseptual secara mandiri dengan feedback
              AI objektif, proteksi anti-copy paste, serta rekapitulasi analitik komprehensif bagi
              pengajar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    preload="intent"
                    className="group inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
                  >
                    <span>Buka dashboard utama</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/exercise"
                    preload="intent"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <GraduationCap size={16} />
                    <span>Katalog latihan soal</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    preload="intent"
                    className="group inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
                  >
                    <span>Daftar akun siswa</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    preload="intent"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <span>Masuk ke akun</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.title} className="border-t border-neutral-300 pt-4">
                <dt className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
                  <item.icon size={16} className="shrink-0 text-teal-700" />
                  <span>{item.title}</span>
                </dt>
                <dd className="mt-1 text-base text-neutral-600 leading-relaxed">{item.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 text-balance">
            Dirancang khusus untuk menguji pemahaman murni
          </h2>
          <p className="mt-3 text-base text-neutral-600 leading-relaxed text-pretty">
            MentorAI memadukan proteksi integritas akademik dengan kecerdasan buatan agar proses belajar
            tetap terarah dan bermakna.
          </p>
        </div>

        <div className="mt-10 border-y border-neutral-200 divide-y divide-neutral-200">
          {features.map((item) => (
            <article
              key={item.title}
              className="grid gap-3 py-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10"
            >
              <h3 className="flex items-start gap-2.5 text-base font-semibold text-neutral-950 text-pretty">
                <item.icon size={18} className="mt-0.5 shrink-0 text-teal-700" />
                <span>{item.title}</span>
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed text-pretty">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 text-balance">
              Tiga langkah mudah memulai belajar
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed text-pretty">
              Proses interaktif yang intuitif, mendidik, dan bebas dari kebingungan navigasi.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <li key={item.step} className="border-t border-teal-600 pt-4">
                <span className="text-sm font-semibold text-teal-700">Langkah {item.step}</span>
                <h3 className="mt-2 text-base font-semibold text-neutral-950 text-pretty">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-base text-neutral-600 leading-relaxed text-pretty">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 text-balance">
            Satu platform untuk siswa dan pengajar
          </h2>
          <p className="mt-3 text-base text-neutral-600 leading-relaxed text-pretty">
            Setiap peran mendapat alur kerja yang sesuai, tanpa fitur yang saling mengganggu.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-neutral-200">
          <div className="md:pr-10">
            <h3 className="flex items-center gap-2.5 text-lg font-semibold text-neutral-950">
              <GraduationCap size={20} className="shrink-0 text-teal-700" />
              <span>Bagi siswa</span>
            </h3>
            <p className="mt-1 text-base text-neutral-600">Pengalaman belajar mandiri dan interaktif.</p>

            <ul className="mt-5 space-y-3">
              {studentBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-base text-neutral-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <span className="leading-relaxed text-pretty">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-neutral-200 pt-10 md:border-t-0 md:pt-0 md:pl-10">
            <h3 className="flex items-center gap-2.5 text-lg font-semibold text-neutral-950">
              <Users size={20} className="shrink-0 text-amber-700" />
              <span>Bagi pengajar dan administrator</span>
            </h3>
            <p className="mt-1 text-base text-neutral-600">Efisiensi pemeriksaan dan analitik kelas.</p>

            <ul className="mt-5 space-y-3">
              {teacherBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-base text-neutral-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-amber-700" />
                  <span className="leading-relaxed text-pretty">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-xl bg-teal-800 px-6 py-10 sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Mulai evaluasi pembelajaran berkualitas hari ini
            </h2>
            <p className="mt-3 text-base text-teal-50 leading-relaxed text-pretty">
              Masuk ke akun Anda atau daftarkan akun siswa baru untuk merasakan kemudahan belajar bersama
              MentorAI.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  preload="intent"
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
                >
                  <span>Buka dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    preload="intent"
                    className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
                  >
                    <span>Daftar akun baru</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    preload="intent"
                    className="inline-flex items-center gap-2 rounded-lg border border-teal-300/60 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
                  >
                    <span>Masuk akun</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
