<script lang="ts">
  import { authStore } from '../stores/auth.svelte';
  import { router } from '../stores/router.svelte';
  import { preloadRoute } from '../utils/preloadRoute';
  import { BookOpen, LogOut, Menu, X, ArrowRight, LayoutDashboard } from '@lucide/svelte';

  let isMobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  async function handleLogout() {
    closeMobileMenu();
    await authStore.logout();
    router.navigate('/');
  }
</script>

<header class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Brand Logo -->
      <a
        href="#/"
        class="flex items-center gap-2.5 text-neutral-950 font-bold text-lg tracking-tight hover:opacity-85 transition-opacity"
      >
        <div class="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-xs">
          <BookOpen size={18} />
        </div>
        <span>MentorAI</span>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-7">
        <a
          href="#/"
          class="text-xs font-semibold transition-colors hover:text-neutral-950 {router.currentPath === '/' ? 'text-neutral-950 underline underline-offset-8 decoration-2' : 'text-neutral-500'}"
        >
          Beranda
        </a>

        <a
          href="#/faq"
          use:preloadRoute
          class="text-xs font-semibold transition-colors hover:text-neutral-950 {router.currentPath === '/faq' ? 'text-neutral-950 underline underline-offset-8 decoration-2' : 'text-neutral-500'}"
        >
          Tentang Kami & FAQ
        </a>
      </nav>

      <!-- User Auth Section Desktop -->
      <div class="hidden md:flex items-center gap-3">
        {#if authStore.isLoading}
          <div class="w-20 h-8 bg-neutral-100 rounded-xl animate-pulse"></div>
        {:else if authStore.isAuthenticated && authStore.user}
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
              <span class="font-bold text-neutral-900">{authStore.user.username}</span>
              <span class="text-[10px] uppercase font-bold text-neutral-500 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                {authStore.user.role}
              </span>
            </div>

            <!-- Highlighted CTA to enter Dashboard -->
            <a
              href="#/dashboard"
              use:preloadRoute
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <LayoutDashboard size={14} />
              <span>Buka Dashboard</span>
              <ArrowRight size={13} />
            </a>

            <button
              type="button"
              onclick={handleLogout}
              title="Keluar dari akun"
              class="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        {:else}
          <a
            href="#/login"
            use:preloadRoute
            class="text-xs font-semibold px-4 py-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            Masuk
          </a>
          <a
            href="#/register"
            use:preloadRoute
            class="text-xs font-semibold px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl transition-colors shadow-xs"
          >
            Daftar Akun
          </a>
        {/if}
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex md:hidden">
        <button
          type="button"
          onclick={toggleMobileMenu}
          aria-label="Toggle menu"
          class="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors"
        >
          {#if isMobileMenuOpen}
            <X size={22} />
          {:else}
            <Menu size={22} />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if isMobileMenuOpen}
    <div class="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3">
      <a
        href="#/"
        onclick={closeMobileMenu}
        class="block text-sm font-semibold py-2 text-neutral-800 hover:text-neutral-950"
      >
        Beranda
      </a>
      <a
        href="#/faq"
        onclick={closeMobileMenu}
        use:preloadRoute
        class="block text-sm font-semibold py-2 text-neutral-800 hover:text-neutral-950"
      >
        Tentang Kami & FAQ
      </a>

      <div class="pt-3 border-t border-neutral-200">
        {#if authStore.isAuthenticated && authStore.user}
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-neutral-950">{authStore.user.username}</p>
                <p class="text-[11px] text-neutral-500 uppercase font-semibold">{authStore.user.role}</p>
              </div>
              <button
                type="button"
                onclick={handleLogout}
                class="text-xs font-medium px-3 py-1.5 border border-neutral-300 rounded-lg text-neutral-600 hover:text-red-600 transition-colors"
              >
                Keluar
              </button>
            </div>

            <a
              href="#/dashboard"
              onclick={closeMobileMenu}
              use:preloadRoute
              class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold shadow-xs"
            >
              <LayoutDashboard size={15} />
              <span>Buka Dashboard Utama</span>
            </a>
          </div>
        {:else}
          <div class="flex gap-2">
            <a
              href="#/login"
              onclick={closeMobileMenu}
              use:preloadRoute
              class="flex-1 text-center text-xs font-semibold py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Masuk
            </a>
            <a
              href="#/register"
              onclick={closeMobileMenu}
              use:preloadRoute
              class="flex-1 text-center text-xs font-semibold py-2.5 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Daftar
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</header>
