<script lang="ts">
  import { authStore } from '../stores/auth.svelte';
  import { router } from '../stores/router.svelte';
  import { BookOpen, LogOut, Menu, X, Shield, Database } from '@lucide/svelte';

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
  }
</script>

<header class="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Brand Logo -->
      <a
        href="#/"
        class="flex items-center gap-2.5 text-neutral-950 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
      >
        <div class="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
          <BookOpen size={18} />
        </div>
        <span>MentorAI</span>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-6">
        <a
          href="#/"
          class="text-sm font-medium transition-colors hover:text-neutral-950 {router.currentPath === '/' ? 'text-neutral-950 font-semibold underline underline-offset-8' : 'text-neutral-600'}"
        >
          Beranda
        </a>

        <a
          href="#/faq"
          class="text-sm font-medium transition-colors hover:text-neutral-950 {router.currentPath === '/faq' ? 'text-neutral-950 font-semibold underline underline-offset-8' : 'text-neutral-600'}"
        >
          Tentang Kami
        </a>

        {#if authStore.isAuthenticated}
          <a
            href="#/exercise"
            class="text-sm font-medium transition-colors hover:text-neutral-950 {router.currentPath.startsWith('/exercise') ? 'text-neutral-950 font-semibold underline underline-offset-8' : 'text-neutral-600'}"
          >
            Latihan Soal
          </a>
        {/if}

        {#if authStore.isAdmin}
          <div class="h-4 w-px bg-neutral-300"></div>

          <a
            href="#/topics"
            class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-neutral-950 {router.currentPath.startsWith('/topics') || router.currentPath.startsWith('/studentsAnswers') ? 'text-neutral-950 font-semibold underline underline-offset-8' : 'text-neutral-600'}"
          >
            <Shield size={15} />
            Kelola Topik
          </a>

          <div class="relative group">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors text-neutral-600 hover:text-neutral-950 cursor-pointer"
            >
              <Database size={15} />
              Database
            </button>
            <div
              class="absolute left-0 mt-1 w-44 bg-white border border-neutral-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity p-1 z-50"
            >
              <a
                href="#/database/users"
                class="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
              >
                Tabel Users
              </a>
              <a
                href="#/database/answers"
                class="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
              >
                Tabel Answers
              </a>
            </div>
          </div>
        {/if}
      </nav>

      <!-- User Auth Section Desktop -->
      <div class="hidden md:flex items-center gap-3">
        {#if authStore.isLoading}
          <div class="w-16 h-8 bg-neutral-100 rounded-lg"></div>
        {:else if authStore.isAuthenticated && authStore.user}
          <div class="flex items-center gap-2.5 pl-2">
            <div class="flex flex-col text-right">
              <span class="text-xs font-semibold text-neutral-900 leading-tight">
                {authStore.user.username}
              </span>
              <span class="text-[10px] text-neutral-500 uppercase tracking-wider">
                {authStore.user.role}
              </span>
            </div>

            <button
              type="button"
              onclick={handleLogout}
              title="Keluar"
              class="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
            >
              <LogOut size={16} />
            </button>
          </div>
        {:else}
          <a
            href="#/login"
            class="text-xs font-semibold px-4 py-2 text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-300 transition-colors"
          >
            Masuk
          </a>
          <a
            href="#/register"
            class="text-xs font-semibold px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg border border-neutral-900 transition-colors"
          >
            Daftar
          </a>
        {/if}
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex md:hidden">
        <button
          type="button"
          onclick={toggleMobileMenu}
          aria-label="Toggle navigasi"
          class="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
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
    <div class="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3 transition-opacity">
      <a
        href="#/"
        onclick={closeMobileMenu}
        class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
      >
        Beranda
      </a>
      <a
        href="#/faq"
        onclick={closeMobileMenu}
        class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
      >
        Tentang Kami
      </a>

      {#if authStore.isAuthenticated}
        <a
          href="#/exercise"
          onclick={closeMobileMenu}
          class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
        >
          Latihan Soal
        </a>
      {/if}

      {#if authStore.isAdmin}
        <div class="pt-2 border-t border-neutral-200">
          <p class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Admin Panel</p>
          <a
            href="#/topics"
            onclick={closeMobileMenu}
            class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
          >
            Kelola Topik
          </a>
          <a
            href="#/database/users"
            onclick={closeMobileMenu}
            class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
          >
            Database: Users
          </a>
          <a
            href="#/database/answers"
            onclick={closeMobileMenu}
            class="block text-sm font-medium py-1.5 text-neutral-800 hover:text-neutral-950"
          >
            Database: Answers
          </a>
        </div>
      {/if}

      <div class="pt-3 border-t border-neutral-200">
        {#if authStore.isAuthenticated && authStore.user}
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-neutral-900">{authStore.user.username}</p>
              <p class="text-xs text-neutral-500 uppercase">{authStore.user.role}</p>
            </div>
            <button
              type="button"
              onclick={handleLogout}
              class="text-xs font-medium px-3 py-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Keluar
            </button>
          </div>
        {:else}
          <div class="flex gap-2">
            <a
              href="#/login"
              onclick={closeMobileMenu}
              class="flex-1 text-center text-xs font-semibold py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Masuk
            </a>
            <a
              href="#/register"
              onclick={closeMobileMenu}
              class="flex-1 text-center text-xs font-semibold py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Daftar
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</header>
