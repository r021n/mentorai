# Product Requirement Document (PRD) - Frontend Application
## MentorAI: AI-Powered Interactive Assessment Platform (Refactored)

---

## 1. Executive Summary & Project Overview

### 1.1 Latar Belakang
Pada arsitektur legacy, frontend MentorAI dirender langsung oleh server (Server-Side Rendering menggunakan Express dan template EJS). Setiap aksi pengguna seperti navigasi, penyimpanan jawaban, atau pagination menyebabkan full page reload atau manipulasi DOM langsung secara imperatif (vanilla JS DOM scripts).

Melalui refaktor ini, frontend ditransformasikan menjadi **Single Page Application (SPA)** yang modern, reaktif, cepat, dan terisolasi secara rapi dari backend.

### 1.2 Tujuan Refaktor Frontend
1. **Interactive & Fluid User Experience**: Menghadirkan transisi halaman instan tanpa full page reload, animasi typewriter feedback yang mulus, dan state management reaktif.
2. **Modern Component-Driven Architecture**: Menggunakan **Svelte 5** dengan sintaks Runes (`$state`, `$derived`, `$props`) dan bundling super-cepat berbasis **Vite**.
3. **Type Safety & Maintainability**: Integrasi penuh dengan **TypeScript**, memastikan setiap model data (soal, jawaban, user, topik) terverifikasi saat kompilasi.
4. **Tailwind CSS Design System**: Menggantikan ratusan baris CSS vanilla yang tersebar di template EJS menjadi utility-first CSS yang konsisten, responsif mobile-first, dan mudah dirawat, dengan tetap mempertahankan identitas visual palet warna asli MentorAI.
5. **Preserving Core Business & Anti-Cheat Features**: Mempertahankan seluruh mekanisme anti-kecurangan (blokir copy/paste, validasi minimal kata), progress bar pengerjaan, retry feedback AI, dan matriks laporan nilai untuk admin.

---

## 2. Technology Stack & Dependencies

| Kategori | Library / Tool | Alasan & Peran |
| :--- | :--- | :--- |
| **Framework** | **Svelte 5** (`svelte`) | Framework UI reaktif tanpa virtual DOM overhead, performa tinggi, sintaks ringkas, dan native Runes architecture. |
| **Build Tool & Dev Server** | **Vite** (`vite`, `@sveltejs/vite-plugin-svelte`) | Hot Module Replacement (HMR) instan, build bundling super-optimal, native ES Modules. |
| **Language** | **TypeScript** (`typescript`) | Static typing untuk contract API, props komponen, dan event handling. |
| **Styling Engine** | **Tailwind CSS v3/v4** (`tailwindcss`, `postcss`, `autoprefixer`) | Utility-first CSS framework untuk implementasi UI modern, responsif, dan konsisten. |
| **Icons** | **Lucide Svelte** (`lucide-svelte`) | Koleksi ikon SVG modern, konsisten, dan ringan (tree-shakeable). |
| **Routing** | **svelte-spa-router** / **SvelteKit (SPA mode)** | Client-side routing berbasis hash (`#/`) atau HTML5 History API dengan dukungan route guards (Auth & Admin guard). |
| **State & Data Fetching**| **TanStack Svelte Query** (`@tanstack/svelte-query`) + **Fetch Client** | Caching otomatis, background refetching, mutation lifecycle, dan loading/error state out-of-the-box. |
| **Rich Text Editor** | **Tiptap** / **Quill Svelte** | Editor WYSIWYG untuk pembuatan soal berformat kaya (bold, italic, list, code block) bagi admin. |
| **Toast & Notifications**| **Svelte Sonner** (`svelte-sonner`) | Sistem notifikasi toast modern, elegan, dan non-intrusif untuk feedback aksi user. |

---

## 3. Brand Identity & Design System

Frontend mempertahankan palet warna dan tipografi khas MentorAI yang telah dikenal pengguna pada versi sebelumnya:

### 3.1 Color Palette

| Token | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| **Primary Green** | `#009E61` | Warna utama, tombol aksi primer, navbar logo, header tabel, indikator aktif. |
| **Primary Hover** | `#008652` | State hover tombol primer. |
| **Accent Orange** | `#FF7849` | Tombol sekunder ("Lihat Jawabanku", "Dapatkan Feedback / Retry", Logout, Aksi Hapus). |
| **Accent Hover** | `#FF6B35` | State hover tombol oranye. |
| **Dark Neutral** | `#1A1A1A` | Teks utama, judul, warna border gelap. |
| **Background** | `#F5F5F5` | Latar belakang seluruh halaman aplikasi. |
| **Surface White** | `#FFFFFF` | Background kartu, container modal, navbar, panel form. |
| **Border / Divider** | `#E5E7EB` | Garis batas tabel, input border, card outline. |

### 3.2 Typography & Spacing
- **Font Family**: `"Poppins", sans-serif` (diimpor via Google Fonts 300, 400, 500, 600, 700).
- **Border Radius**: 
  - `rounded-lg` (8px) untuk container input dan card.
  - `rounded-xl` (12px) untuk container utama latihan dan modal.
  - `rounded-full` untuk tombol aksi CTA (Call To Action).

---

## 4. Frontend Application Architecture

### 4.1 Project Directory Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/             # Gambar statis, logo, ilustrasi
│   ├── lib/
│   │   ├── api/            # API Client & Axios/Fetch wrappers
│   │   │   ├── client.ts   # Base fetch dengan interceptor token
│   │   │   ├── auth.ts     # Auth endpoints
│   │   │   ├── topics.ts   # Topic endpoints
│   │   │   ├── questions.ts# Question endpoints
│   │   │   ├── exercise.ts # Exercise & AI feedback endpoints
│   │   │   └── admin.ts    # Admin report & database manager endpoints
│   │   ├── components/     # Reusable UI Components
│   │   │   ├── ui/         # Button, Input, Modal, Badge, Spinner, ProgressBar
│   │   │   ├── Navbar.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── AntiCheatContainer.svelte
│   │   │   └── RichTextEditor.svelte
│   │   ├── stores/         # Svelte 5 Runes / Reactive Stores
│   │   │   ├── auth.svelte.ts     # Session state & current user
│   │   │   └── exercise.svelte.ts # Current exercise progress & answers map
│   │   ├── types/          # TypeScript Type Definitions
│   │   │   ├── auth.types.ts
│   │   │   ├── topic.types.ts
│   │   │   ├── question.types.ts
│   │   │   └── answer.types.ts
│   │   └── utils/          # Formatting helpers, typewriter animation helper
│   ├── routes/             # Halaman-halaman aplikasi
│   │   ├── Home.svelte             # Dashboard utama
│   │   ├── Login.svelte            # Login page
│   │   ├── Register.svelte         # Register page
│   │   ├── Faq.svelte              # Tentang Kami / FAQ
│   │   ├── exercise/
│   │   │   ├── TopicSelect.svelte  # Pilih Topik Latihan
│   │   │   ├── ExerciseRunner.svelte # Antarmuka Mengerjakan Soal
│   │   │   └── EndExercise.svelte  # Halaman Selesai Latihan
│   │   ├── my-answers/
│   │   │   └── MyAnswers.svelte    # Rekap Nilai Siswa
│   │   └── admin/
│   │       ├── TopicList.svelte    # CRUD Topik
│   │       ├── QuestionList.svelte # CRUD Soal per Topik
│   │       ├── QuestionForm.svelte # Tambah / Edit Soal
│   │       ├── StudentAnswers.svelte # Laporan Matriks Jawaban Siswa
│   │       └── database/
│   │           ├── UsersManager.svelte   # Raw Database: Users
│   │           └── AnswersManager.svelte # Raw Database: Answers
│   ├── App.svelte          # Root component & Route definitions
│   ├── main.ts             # Application entry point
│   └── app.css             # Tailwind CSS directives
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. User Roles & Route Access Matrix

| Route Path | Deskripsi Halaman | Akses Guest | Siswa | Admin |
| :--- | :--- | :---: | :---: | :---: |
| `/` atau `/dashboard` | Dashboard / Beranda Utama | ✅ (Terbatas) | ✅ | ✅ |
| `/login` | Form Masuk Akun | ✅ | ❌ (Redirect) | ❌ (Redirect) |
| `/register` | Form Pendaftaran Siswa Baru | ✅ | ❌ (Redirect) | ❌ (Redirect) |
| `/faq` | Halaman "Tentang Kami" & FAQ | ✅ | ✅ | ✅ |
| `/exercise` | Katalog Pemilihan Topik Latihan | ❌ (Wajib Login)| ✅ | ✅ |
| `/exercise/:topicId` | Runner Pengerjaan Soal Interaktif | ❌ | ✅ | ✅ |
| `/endExercise` | Halaman Perayaan Selesai Latihan | ❌ | ✅ | ✅ |
| `/myAnswers/:topicId` | Riwayat Jawaban & Skor Siswa | ❌ | ✅ | ✅ |
| `/topics` | Manajemen Daftar Topik | ❌ | ❌ (Forbidden) | ✅ |
| `/topics/list/:topicId`| Manajemen Daftar Soal per Topik | ❌ | ❌ | ✅ |
| `/studentsAnswers/:topicId` | Matriks Jawaban Seluruh Siswa | ❌ | ❌ | ✅ |
| `/database/users` | Raw Table Management: Users | ❌ | ❌ | ✅ |
| `/database/answers` | Raw Table Management: Answers | ❌ | ❌ | ✅ |

---

## 6. Detailed Feature & UX Specifications

### 6.1 Interactive Exercise Runner (`/exercise/:topicId`)

Modul ini merupakan inti interaksi aplikasi bagi siswa. Pengalaman pengguna harus memenuhi spesifikasi berikut:

#### 1. Anti-Cheating & Integrity Guard
- Kontainer teks soal dan gambar dibungkus proteksi CSS & Event Listener:
  - `user-select: none; -webkit-user-select: none;`
  - Event `oncopy` dan `oncut` dicegah (`e.preventDefault()`).
- Area teks input jawaban (`<textarea>`):
  - Event `onpaste` dan `ondrop` diblokir total (`e.preventDefault()`).
  - Siswa wajib mengetik secara manual untuk mendorong pemahaman konseptual.

#### 2. Real-Time Word Count Validation
- Input jawaban dipantau secara reaktif (`$state`).
- Tombol **"Kirim Jawaban"** dalam kondisi disabled jika jumlah kata $< 2$ kata (`text.trim().split(/\s+/).length < 2`).

#### 3. Two-Step Submission & AI Feedback Pipeline
1. **Langkah 1: Simpan Jawaban**:
   - Saat tombol "Kirim Jawaban" ditekan, trigger request ke `POST /api/exercise/:topicId/submit`.
   - Menampilkan loading spinner dengan teks *"Sedang menyimpan jawaban..."*.
   - Segera setelah sukses:
     - Textarea langsung dikunci (`readonly = true`) dengan background abu-abu (`bg-gray-100`).
     - Tombol "Kirim Jawaban" disembunyikan permanen untuk soal tersebut.
2. **Langkah 2: Evaluasi AI**:
   - Mengubah teks loading menjadi *"Menganalisis jawaban Anda..."*.
   - Trigger otomatis request ke `POST /api/exercise/:topicId/feedback`.
   - **Jika AI Sukses**:
     - Hilangkan spinner.
     - Simpan data feedback ke memori lokal.
     - Jalankan animasi **Typewriter** (efek ketik huruf demi huruf dengan interval 30ms).
     - Catat status animasi di `sessionStorage` (`feedbackAnimated_${questionId}`) agar saat kembali ke soal ini, teks tidak dianimasikan ulang.
   - **Jika AI Gagal / Kuota Habis**:
     - Hilangkan spinner.
     - Tampilkan toast error atau pesan alert *"Gagal menghubungi AI. Silakan coba lagi nanti."*
     - Munculkan tombol oranye **"Dapatkan Feedback"** (Retry Feedback Button) sehingga siswa dapat mencoba evaluasi ulang tanpa harus mengetik ulang jawaban.

#### 4. Navigation & Progress Bar
- Progress bar di bagian atas container dengan transisi lebar halus (`transition-all duration-300`).
- Teks penunjuk progres: `"Soal {currentIndex + 1} dari {questions.length}"`.
- Tombol **Prev**: Disembunyikan saat berada di soal nomor 1 (`index === 0`).
- Tombol **Next**:
  - Berlabel **"Next"** untuk soal selain yang terakhir.
  - Berubah otomatis menjadi **"End"** saat berada pada soal terakhir (`index === questions.length - 1`). Menekan tombol ini mengarahkan siswa ke halaman `/endExercise`.

---

### 6.2 Student Dashboard & History Views

#### 1. Dashboard (`/dashboard`)
- **Hero Section**:
  - Jika Guest: Ucapan selamat datang umum + Tombol CTA *"Login Sekarang"*.
  - Jika Siswa/Admin Terautentikasi: *"Selamat datang, {username}!"* + Tombol CTA *"Mulai Latihan"* mengarah ke `/exercise`.
- **Navbar Responsif**:
  - Logo MentorAI (Primary Green).
  - Menu Navigasi: "Tentang Kami", "Latihan", "Edit Topik" (hanya Admin), dan tombol "Logout" (oranye).
  - Burger menu drawer untuk layar mobile ($\le 768\text{px}$).

#### 2. Topic Selection (`/exercise`)
- Menampilkan grid kartu-kartu topik yang tersedia.
- Setiap kartu memiliki dua tombol aksi:
  1. Tombol Hijau: **"Mulai Latihan"** $\to$ `/exercise/:topicId`
  2. Tombol Oranye: **"Lihat Jawabanku"** $\to$ `/myAnswers/:topicId`

#### 3. My Answers (`/myAnswers/:topicId`)
- Tabel riwayat jawaban siswa untuk topik yang dipilih.
- Kolom: `Nomor`, `Soal`, `Jawaban Siswa`, `Feedback AI`, `Skor (0-3)`.
- Panel rekapitulasi di bawah tabel:
  $$\text{Total Skor: } \text{round}\left(\frac{\sum \text{score}}{N_{\text{soal}} \times 3} \times 100\right)\%$$
  Ditampilkan dengan font tebal berwarna hijau primer.

#### 4. End Exercise (`/endExercise`)
- Tampilan kartu perayaan dengan ikon bintang/trofi.
- Judul: *"Selamat! Anda telah menyelesaikan latihan."*
- Tombol aksi navigasi:
  - Kembali ke Dashboard
  - Lihat Jawabanku

---

### 6.3 Admin Backoffice & Assessment Reports

#### 1. Topic Management (`/topics`)
- Daftar tabel seluruh topik.
- Tombol "Tambah Topik" (membuka modal / form pembuatan topik baru).
- Kolom Aksi:
  - **Daftar Soal**: Link ke `/topics/list/:topicId`.
  - **Edit**: Edit nama topik secara inline atau via modal.
  - **Jawaban Siswa**: Link ke laporan evaluasi kelas `/studentsAnswers/:topicId`.
  - **Hapus**: Membuka modal konfirmasi hapus *"Apakah Anda yakin ingin menghapus topik ini?"*.

#### 2. Question Management (`/topics/list/:topicId`)
- Tabel seluruh soal pada topik aktif.
- Tombol "Tambah Soal":
  - Rich Text WYSIWYG Editor untuk teks pertanyaan.
  - File input upload gambar dengan preview langsung sebelum submit.
  - Textarea untuk input `imageDescription` (keterangan konteks gambar untuk panduan penilaian AI).
- Fitur Edit dan Hapus soal dengan modal konfirmasi.

#### 3. Class Performance Matrix (`/studentsAnswers/:topicId`)
- Tabel matriks komprehensif yang menampilkan jawaban seluruh siswa pada satu topik:
  - Kolom statis: `No`, `Nama Siswa`.
  - Kolom dinamis per nomor soal: `Jawaban ke-N`, `Feedback ke-N`.
  - Kolom total nilai: `Total Skor (%)` yang dihitung secara presisi.
- Tombol CTA Oranye: **"Unduh Jawaban Siswa"** yang men-trigger unduhan file Microsoft Excel (`.xlsx`) langsung dari backend.

#### 4. Raw Database Management Tools
Dua antarmuka khusus untuk administrator menginspeksi tabel database secara langsung:
1. **Users Management (`/database/users`)**:
   - Live search input untuk menyaring username secara real-time.
   - Fitur multiple checkbox untuk bulk deletion.
   - Modal edit data user (`username`, `password`, `role`).
2. **Answers Management (`/database/answers`)**:
   - Form filter dinamis berdasarkan `userId`, `questionId`, dan `topicId`.
   - Multiple checkbox untuk bulk deletion.
   - Modal edit jawaban, feedback, skor, dan foreign key ID.

---

## 7. State Management & Data Architecture

Menggunakan fitur reaktif **Svelte 5 Runes**:

### 7.1 Authentication State Store (`src/lib/stores/auth.svelte.ts`)

```typescript
import { api } from "$lib/api/client";

interface User {
  id: number;
  username: string;
  role: "admin" | "siswa";
}

class AuthStore {
  user = $state<User | null>(null);
  isLoading = $state<boolean>(true);
  isAuthenticated = $derived(this.user !== null);
  isAdmin = $derived(this.user?.role === "admin");

  async init() {
    this.isLoading = true;
    try {
      const res = await api.get<{ user: User }>("/auth/me");
      this.user = res.data.user;
    } catch {
      this.user = null;
    } finally {
      this.isLoading = false;
    }
  }

  setUser(user: User | null) {
    this.user = user;
  }

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      this.user = null;
      window.location.href = "#/login";
    }
  }
}

export const authStore = new AuthStore();
```

### 7.2 Exercise Session Store (`src/lib/stores/exercise.svelte.ts`)

```typescript
interface Question {
  id: number;
  question: string;
  pathImage: string | null;
  imageDescription: string | null;
}

interface AnswerRecord {
  id?: number;
  questionId: number;
  answer: string;
  feedback: string | null;
  score: number;
}

export class ExerciseRunnerState {
  questions = $state<Question[]>([]);
  answersMap = $state<Record<number, AnswerRecord>>({});
  currentIndex = $state<number>(0);
  isSubmitting = $state<boolean>(false);
  isGeneratingFeedback = $state<boolean>(false);

  currentQuestion = $derived(this.questions[this.currentIndex]);
  progressPercent = $derived(
    this.questions.length > 0
      ? ((this.currentIndex + 1) / this.questions.length) * 100
      : 0
  );
  isLastQuestion = $derived(
    this.currentIndex === this.questions.length - 1
  );

  loadData(questions: Question[], existingAnswers: AnswerRecord[]) {
    this.questions = questions;
    const map: Record<number, AnswerRecord> = {};
    existingAnswers.forEach((ans) => {
      map[ans.questionId] = ans;
    });
    this.answersMap = map;
    this.currentIndex = 0;
  }
}
```

---

## 8. Typewriter Feedback Utility

Untuk menjaga kenyamanan membaca evaluasi AI secara bertahap, dibuat helper fungsi reusable:

```typescript
export function animateFeedback(
  text: string, 
  onTick: (partialText: string) => void, 
  onComplete?: () => void
) {
  let index = 0;
  let currentText = "";
  const interval = setInterval(() => {
    currentText += text[index];
    onTick(currentText);
    index++;
    if (index >= text.length) {
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, 30); // 30ms per karakter konsisten dengan legacy app
}
```

---

## 9. Non-Functional & Quality Requirements

1. **Responsiveness**: Seluruh tampilan dioptimalkan untuk perangkat Mobile (360px+), Tablet (768px+), dan Desktop (1024px+). Tabel data pada perangkat mobile mendukung horizontal scrolling yang mulus tanpa merusak layout navbar.
2. **Accessibility (a11y)**: Input form dilengkapi label semantik, tombol memiliki state fokus yang jelas (`focus:ring-2 focus:ring-emerald-500`), kontras teks memenuhi standar WCAG AA.
3. **Graceful Error Handling**: Kegagalan jaringan atau timeout dari AI tidak boleh menyebabkan layar putih (*white screen of death*). Setiap error ditangkap dan disajikan dengan toast notifikasi yang mudah dipahami oleh siswa.
4. **Clean Asset Management**: Gambar upload disajikan dengan fallback placeholder jika gagal memuat, dan thumbnail gambar soal otomatis menyesuaikan batas tinggi maksimal viewport (`max-h-[50vh] object-contain`).
