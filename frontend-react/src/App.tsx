import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { queryClient } from './lib/query/query-client'
import { useAuthStore } from './lib/stores/auth'
import { Toast } from './lib/components/Toast'
import { Spinner } from './lib/components/ui/Spinner'

function SessionLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-neutral-50 text-neutral-900">
      <Spinner size="lg" />
      <p className="text-xs text-neutral-500 font-medium">Memverifikasi sesi pengguna...</p>
    </div>
  )
}

export default function App() {
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    void useAuthStore.getState().init()
  }, [])

  // Route guards rely on a settled session, so the router only mounts once the
  // auth probe has finished (mirrors the loading gate of the original app).
  if (isLoading) {
    return <SessionLoading />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toast />
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> : null}
    </QueryClientProvider>
  )
}
