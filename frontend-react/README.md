# MentorAI — Frontend (React)

Replika dari `frontend/` (Svelte) dengan stack React. Semua route, layout, guard,
state, dan tampilan diperankan ulang 1:1.

## Stack

| Concern | Pilihan | Versi stabil |
| --- | --- | --- |
| UI | React + TypeScript | 19.3 / 6.0 |
| Build | Vite + `@vitejs/plugin-react` | 8.3 / 6.1 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | 4.3 |
| Routing | TanStack Router — **file/folder based** + hash history | 1.170 |
| Server state | TanStack Query (React Query) | 5.104 |
| Client state | Zustand | 5.0 |
| Icons | lucide-react | 1.52 |
| Class merging | clsx + tailwind-merge (`cn()`) | 2.1 / 3.7 |
| Lint | ESLint flat config + typescript-eslint + react-hooks | 10 / 8 |
| Test | Vitest + jsdom + Testing Library | 5.0 |

Semua versi di atas adalah rilis stabil (bukan RC/beta) yang terverifikasi per
Oktober 2026.

> Catatan: `typescript` dikunci di `~6.0.3` karena `typescript-eslint@8` mensyaratkan
> `typescript >=4.8.4 <6.1.0`. TypeScript 7.x sudah stabil tetapi belum didukung
> parser typescript-eslint.

## Perintah

```bash
npm install
npm run dev        # dev server (port 5173, proxy /api ke localhost:3000)
npm run build      # generate route tree -> typecheck -> vite build
npm run preview    # jalankan hasil build
npm run generate   # hanya regenerate src/routeTree.gen.ts (tsr generate)
npm run lint       # eslint .
npm run lint:fix   # eslint . --fix
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run test:watch # vitest
```

## Struktur

```
src/
├── main.tsx              # bootstrap React
├── App.tsx               # auth loading gate + QueryClientProvider + RouterProvider + Toast
├── router.ts             # createRouter (hash history)
├── routeTree.gen.ts      # DIGENERASI — jangan diedit manual
├── app.css               # Tailwind v4 entry + reset anti-cheat
├── routes/               # file-based routes (TanStack Router)
│   ├── __root.tsx
│   ├── _public.tsx       # pathless layout: Navbar + Footer
│   ├── _public/          # /, /login, /register, /faq, /* (404)
│   ├── _dashboard.tsx    # pathless layout: DashboardLayout (sidebar)
│   └── _dashboard/       # /dashboard, /exercise, /topics, /database, ...
├── pages/                # komponen halaman (dihandle oleh route di atas)
├── lib/
│   ├── api/              # API client (fetch + Bearer token) + domain API
│   ├── components/       # Navbar, Footer, Toast, AntiCheat, layout/, ui/
│   ├── query/            # QueryClient + query key factory
│   ├── router/           # route guards + page title
│   ├── stores/           # zustand: auth, toast, exercise
│   ├── types/            # tipe domain
│   └── utils/            # cn, validation, typewriter
└── test/setup.ts         # Testing Library setup
tests/
├── unit/                 # validation, typewriter, stores, komponen Toast
└── integration/          # API client, smoke test aplikasi, route guards
```

## Catatan implementasi

- **Routing** memakai `createHashHistory()` sehingga URL tetap berformat `/#/dashboard`
  seperti versi Svelte. `<Link>` dari TanStack Router menggantikan `<a href="#/...">`
  dan sekaligus memberikan hover-preload (pengganti `use:preloadRoute`).
- **Guard** dideklarasikan di `beforeLoad` tiap route (`guardRoute`, `authPage`,
  `adminPage`). Router baru dipasang setelah probe sesi selesai, jadi guard selalu
  membaca state auth yang sudah final.
- **Server state** memakai TanStack Query; **state sesi latihan** (jawaban, indeks
  soal, flag loading) tetap di Zustand agar tidak ter-reset oleh refetch.
- `autoCodeSplitting: true` pada plugin router melakukan code-split per route,
  meniru lazy loading `import()` pada aplikasi Svelte asli.
