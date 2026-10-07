import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <h2 className="text-4xl font-extrabold text-neutral-950">404</h2>
      <p className="text-sm text-neutral-600">Halaman yang Anda cari tidak ditemukan.</p>
      <Link
        to="/"
        className="inline-block text-xs font-semibold px-4 py-2 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
