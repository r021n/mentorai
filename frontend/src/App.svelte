<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './lib/stores/auth.svelte';
  import { router } from './lib/stores/router.svelte';
  import { matchRoute, type RouteGuard } from './lib/routes';
  import Navbar from './lib/components/Navbar.svelte';
  import Footer from './lib/components/Footer.svelte';
  import Toast from './lib/components/Toast.svelte';
  import Spinner from './lib/components/ui/Spinner.svelte';
  import RouteView from './lib/components/RouteView.svelte';
  import DashboardLayout from './lib/components/layout/DashboardLayout.svelte';

  onMount(async () => {
    await authStore.init();
  });

  const match = $derived(matchRoute(router.currentPath));

  function guardSatisfied(guard: RouteGuard): boolean {
    switch (guard) {
      case 'public':
        return true;
      case 'guest-only':
        return !authStore.isAuthenticated;
      case 'auth':
        return authStore.isAuthenticated;
      case 'admin':
        return authStore.isAuthenticated && authStore.isAdmin;
    }
  }

  // Route Guards
  $effect(() => {
    if (authStore.isLoading || !match) return;

    const guard = match.route.guard;
    if (guardSatisfied(guard)) return;

    if (guard === 'guest-only') {
      router.navigate('/dashboard');
    } else if (guard === 'auth') {
      router.navigate('/login');
    } else if (guard === 'admin') {
      router.navigate(authStore.isAuthenticated ? '/dashboard' : '/login');
    }
  });

  const isDashboardRoute = $derived(
    match?.route.layout === 'dashboard' && authStore.isAuthenticated
  );

  const dashboardTitle = $derived(match?.route.title ?? 'Dashboard');
</script>

{#if authStore.isLoading}
  <div class="min-h-screen flex flex-col items-center justify-center gap-3 bg-neutral-50 text-neutral-900">
    <Spinner size="lg" />
    <p class="text-xs text-neutral-500 font-medium">Memverifikasi sesi pengguna...</p>
  </div>
{:else if match && !guardSatisfied(match.route.guard)}
  <!-- Guard redirect in progress: never render protected content or flash the 404 -->
  <div class="min-h-screen flex flex-col items-center justify-center gap-3 bg-neutral-50 text-neutral-900">
    <Spinner size="lg" />
    <p class="text-xs text-neutral-500 font-medium">Mengalihkan halaman...</p>
  </div>
{:else if isDashboardRoute}
  <!-- ==================== DASHBOARD & WORKSPACE (WITH SIDEBAR) ==================== -->
  <DashboardLayout title={dashboardTitle}>
    <RouteView />
  </DashboardLayout>
  <Toast />
{:else}
  <!-- ==================== PUBLIC LAYOUT (NAVBAR + FOOTER) ==================== -->
  <div class="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
    <Navbar />

    <main class="flex-1">
      {#if match}
        <RouteView />
      {:else}
        <!-- 404 Not Found -->
        <div class="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <h2 class="text-4xl font-extrabold text-neutral-950">404</h2>
          <p class="text-sm text-neutral-600">Halaman yang Anda cari tidak ditemukan.</p>
          <a
            href="#/"
            class="inline-block text-xs font-semibold px-4 py-2 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      {/if}
    </main>

    <Footer />
    <Toast />
  </div>
{/if}
