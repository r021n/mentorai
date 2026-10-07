import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/auth'
import { setPageTitle } from './page-title'

export type RouteGuard = 'public' | 'guest-only' | 'auth' | 'admin'

/**
 * Evaluates a route guard against the already-initialised auth store.
 * `App` only mounts the router once the session has been resolved, so the
 * store always contains settled data here.
 */
export function guardRoute(guard: RouteGuard): void {
  if (guard === 'public') return

  const { user } = useAuthStore.getState()
  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'admin'

  switch (guard) {
    case 'guest-only':
      if (isAuthenticated) throw redirect({ to: '/dashboard' })
      break
    case 'auth':
      if (!isAuthenticated) throw redirect({ to: '/login' })
      break
    case 'admin':
      if (!isAuthenticated) throw redirect({ to: '/login' })
      if (!isAdmin) throw redirect({ to: '/dashboard' })
      break
  }
}

/** `beforeLoad` factory for routes reachable by any signed-in user. */
export function authPage(title: string) {
  return () => {
    guardRoute('auth')
    setPageTitle(title)
  }
}

/** `beforeLoad` factory for admin-only routes. */
export function adminPage(title: string) {
  return () => {
    guardRoute('admin')
    setPageTitle(title)
  }
}
