import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
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
  Award,
} from 'lucide-react'
import { exerciseApi } from '../lib/api/exercise'
import { topicsApi } from '../lib/api/topics'
import { adminApi } from '../lib/api/admin'
import { useAuthStore, selectIsAdmin } from '../lib/stores/auth'
import { queryKeys } from '../lib/query/query-keys'
import { toast } from '../lib/stores/toast'
import { Spinner } from '../lib/components/ui/Spinner'

export function DashboardPage() {
  const isAdmin = useAuthStore(selectIsAdmin)
  const user = useAuthStore((s) => s.user)

  const {
    data: adminTopics = [],
    isPending: adminTopicsPending,
    error: adminTopicsError,
  } = useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: () => topicsApi.getAll(),
    enabled: isAdmin,
  })

  const {
    data: adminUsers = [],
    isPending: adminUsersPending,
    error: adminUsersError,
  } = useQuery({
    queryKey: queryKeys.admin.users(''),
    queryFn: () => adminApi.getAllUsers(),
    enabled: isAdmin,
  })

  const {
    data: adminAnswers = [],
    isPending: adminAnswersPending,
    error: adminAnswersError,
  } = useQuery({
    queryKey: queryKeys.admin.answers({}),
    queryFn: () => adminApi.getAnswers(),
    enabled: isAdmin,
  })

  const {
    data: exerciseTopics = [],
    isPending: studentTopicsPending,
    error: studentTopicsError,
  } = useQuery({
    queryKey: queryKeys.exercise.topics(),
    queryFn: () => exerciseApi.getExerciseTopics(),
    enabled: !isAdmin,
  })

  const isAdminLoading = adminTopicsPending || adminUsersPending || adminAnswersPending

  useEffect(() => {
    if (isAdmin) {
      const firstError = adminTopicsError ?? adminUsersError ?? adminAnswersError
      if (firstError) {
        toast.error((firstError as Error)?.message || 'Gagal memuat statistik dashboard admin.')
      }
    } else if (studentTopicsError) {
      toast.error((studentTopicsError as Error)?.message || 'Gagal memuat topik latihan.')
    }
  }, [isAdmin, adminTopicsError, adminUsersError, adminAnswersError, studentTopicsError])

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-medium text-neutral-200">
              <Sparkles size={14} className="text-amber-400" />
              <span>{currentDateFormatted}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat datang kembali, {user?.username}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {isAdmin
                ? 'Kelola topik pembelajaran, bank soal konseptual, dan pantau rekapitulasi penilaian kelas berbasis AI secara terpusat.'
                : 'Lanjutkan latihan penalaran konseptual hari ini. MentorAI siap mengevaluasi jawaban Anda secara objektif dan mendalam.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                to="/topics"
                preload="intent"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Plus size={16} />
                <span>Kelola Topik & Soal</span>
              </Link>
            ) : (
              <Link
                to="/exercise"
                preload="intent"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Play size={16} />
                <span>Mulai Latihan Baru</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific Dashboard Sections */}
      {isAdmin ? (
        /* ==================== ADMIN DASHBOARD ==================== */
        isAdminLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-neutral-500 font-medium">Memuat statistik administrator...</p>
          </div>
        ) : (
          <>
            {/* Admin Metric Counters */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Topik Aktif
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <BookOpen size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-neutral-950">
                    {adminTopics.length}
                  </h3>
                  <p className="text-[11px] text-neutral-500">Materi evaluasi terdaftar</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Total Pengguna
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <Users size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-neutral-950">
                    {adminUsers.length}
                  </h3>
                  <p className="text-[11px] text-neutral-500">Akun siswa & pengajar</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Jawaban Tersimpan
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                    <Database size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-neutral-950">
                    {adminAnswers.length}
                  </h3>
                  <p className="text-[11px] text-neutral-500">Evaluasi AI terkumpul</p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    AI Evaluator
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Shield size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-neutral-950 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Aktif
                  </h3>
                  <p className="text-[11px] text-neutral-500">Anti-Cheat & Penilaian Siap</p>
                </div>
              </div>
            </section>

            {/* Admin Quick Navigation Shortcuts */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/topics"
                preload="intent"
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Shield size={20} />
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Kelola Materi & Bank Soal</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Tambah, edit, atau hapus topik serta kelola butir soal dan kunci konseptual.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
                  <span>Buka Panel Topik</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              <Link
                to="/database/users"
                preload="intent"
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Users size={20} />
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Database Siswa & Akun</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Manajemen user, perubahan role, reset kata sandi, dan penghapusan massal.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
                  <span>Buka Tabel User</span>
                  <ArrowRight size={14} />
                </div>
              </Link>

              <Link
                to="/database/answers"
                preload="intent"
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-950 transition-all group"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Database size={20} />
                  </div>
                  <h4 className="text-base font-bold text-neutral-950">Database Log Jawaban</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Inspeksi detail rekaman jawaban siswa, skor AI (0-3), dan catatan feedback.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">
                  <span>Buka Log Jawaban</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </section>

            {/* Admin Topik Overview */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Daftar Topik Pembelajaran
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Akses cepat ke bank soal dan matriks jawaban siswa
                  </p>
                </div>
                <Link
                  to="/topics"
                  preload="intent"
                  className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:underline"
                >
                  Lihat Semua Topik →
                </Link>
              </div>

              {adminTopics.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  Belum ada topik yang dibuat. Klik tombol di atas untuk menambah topik baru.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {adminTopics.slice(0, 5).map((topic) => (
                    <div
                      key={topic.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-950">{topic.name}</h5>
                          <p className="text-[11px] text-neutral-400">
                            ID: #{topic.id}{' '}
                            {topic.questionCount !== undefined
                              ? `• ${topic.questionCount} Soal`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to="/topics/list/$topicId"
                          params={{ topicId: String(topic.id) }}
                          preload="intent"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
                        >
                          Kelola Soal
                        </Link>
                        <Link
                          to="/studentsAnswers/$topicId"
                          params={{ topicId: String(topic.id) }}
                          preload="intent"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                        >
                          Matriks Nilai
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )
      ) : studentTopicsPending ? (
        /* ==================== SISWA DASHBOARD ==================== */
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-neutral-500 font-medium">Memuat katalog materi latihan...</p>
        </div>
      ) : (
        <>
          {/* Siswa Summary Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Topik Latihan
                </span>
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <BookOpen size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-neutral-950">
                  {exerciseTopics.length}
                </h3>
                <p className="text-[11px] text-neutral-500">Materi siap dikerjakan</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Anti-Cheat
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Shield size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-950">Proteksi 100%</h3>
                <p className="text-[11px] text-neutral-500">Fokus pada penalaran mandiri</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Skala Rubrik
                </span>
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <Award size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-950">Skor 0 - 3</h3>
                <p className="text-[11px] text-neutral-500">Standarisasi evaluasi AI</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Mode Latihan
                </span>
                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                  <Sparkles size={18} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-950">Interaktif</h3>
                <p className="text-[11px] text-neutral-500">Feedback per butir soal</p>
              </div>
            </div>
          </section>

          {/* Quick Action Cards for Student */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/exercise"
              preload="intent"
              className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between hover:border-neutral-950 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-950">Katalog Latihan Soal</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Pilih topik dan kerjakan soal latihan konseptual sekarang
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                <ArrowRight size={18} />
              </div>
            </Link>

            <Link
              to="/faq"
              preload="intent"
              className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between hover:border-neutral-950 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-950">
                    Panduan & Cara Kerja AI
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Pelajari rubrik penilaian dan kiat menjawab soal konseptual
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                <ArrowRight size={18} />
              </div>
            </Link>
          </section>

          {/* Student Topics List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-950">
                  Topik Pembelajaran Pilihan
                </h3>
                <p className="text-xs text-neutral-500">
                  Pilih salah satu topik untuk mulai berlatih atau melihat catatan jawaban
                </p>
              </div>
              <Link
                to="/exercise"
                preload="intent"
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:underline"
              >
                Lihat Semua Topik →
              </Link>
            </div>

            {exerciseTopics.length === 0 ? (
              <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl space-y-2">
                <BookOpen size={32} className="mx-auto text-neutral-400" />
                <p className="text-sm font-semibold text-neutral-800">
                  Belum ada topik yang tersedia
                </p>
                <p className="text-xs text-neutral-500">
                  Materi latihan akan ditampilkan di sini saat pengajar menambahkannya.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exerciseTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-950 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                        <BookOpen size={16} />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-950 leading-snug line-clamp-2">
                        {topic.name}
                      </h4>
                      {topic.questionCount !== undefined ? (
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {topic.questionCount} Butir Pertanyaan
                        </p>
                      ) : null}
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                      <Link
                        to="/exercise/$topicId"
                        params={{ topicId: String(topic.id) }}
                        preload="intent"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                      >
                        <Play size={13} />
                        <span>Latihan</span>
                      </Link>
                      <Link
                        to="/myAnswers/$topicId"
                        params={{ topicId: String(topic.id) }}
                        preload="intent"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Hasil Saya</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Learning Tips Callout */}
          <section className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-neutral-950 font-bold text-sm">
              <Sparkles size={16} className="text-amber-500" />
              <span>Tips Memaksimalkan Nilai Evaluasi AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-900">
                  1. Gunakan Pemikiran Sendiri
                </span>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Jelaskan konsep inti dengan kalimat sendiri secara terstruktur. Jangan menyalin
                  teks dari sumber lain.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-900">
                  2. Sertakan Alasan & Logika
                </span>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  AI menilai kedalaman pemahaman, bukan sekadar kata kunci. Jabarkan "mengapa" dan
                  "bagaimana" konsep tersebut berlaku.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-900">
                  3. Baca Feedback dengan Cermat
                </span>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Jika skor Anda belum maksimal (0-2), baca rekomendasi yang diberikan AI dan
                  gunakan untuk memperbaiki jawaban Anda.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
