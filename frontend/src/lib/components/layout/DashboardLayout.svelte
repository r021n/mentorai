<script lang="ts">
  import type { Snippet } from 'svelte';
  import { authStore } from '../../stores/auth.svelte';
  import { router } from '../../stores/router.svelte';
  import {
    LayoutDashboard,
    BookOpen,
    Shield,
    Users,
    Database,
    LogOut,
    Menu,
    X,
    ChevronRight,
    HelpCircle,
    Home,
    GraduationCap,
    ExternalLink,
    FileSpreadsheet,
    Layers,
    Sparkles
  } from '@lucide/svelte';

  interface Props {
    title?: string;
    children?: Snippet;
  }

  let { title = 'Dashboard', children }: Props = $props();

  let isMobileSidebarOpen = $state(false);
  let isDesktopCollapsed = $state(false);

  function toggleMobileSidebar() {
    isMobileSidebarOpen = !isMobileSidebarOpen;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen = false;
  }

  function toggleDesktopCollapse() {
    isDesktopCollapsed = !isDesktopCollapsed;
  }

  async function handleLogout() {
    closeMobileSidebar();
    await authStore.logout();
    router.navigate('/');
  }

  const currentPath = $derived(router.currentPath);

  const isDashboardActive = $derived(currentPath === '/dashboard');
  const isExerciseActive = $derived(
    currentPath === '/exercise' ||
    currentPath.startsWith('/exercise/') ||
    currentPath === '/endExercise' ||
    currentPath.startsWith('/myAnswers/')
  );
  const isTopicsActive = $derived(
    currentPath === '/topics' ||
    currentPath.startsWith('/topics/list/') ||
    currentPath.startsWith('/studentsAnswers/')
  );
  const isUsersActive = $derived(currentPath === '/database/users');
  const isAnswersActive = $derived(currentPath === '/database/answers');
</script>

<div class="min-h-screen flex bg-neutral-100 text-neutral-900 selection:bg-neutral-900 selection:text-white">
  <!-- Mobile Sidebar Backdrop Overlay -->
  {#if isMobileSidebarOpen}
    <div
      role="button"
      tabindex="0"
      aria-label="Tutup Menu Sidebar"
      onclick={closeMobileSidebar}
      onkeydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
      class="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
    ></div>
  {/if}

  <!-- Sidebar Container -->
  <aside
    class="fixed md:sticky top-0 inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 h-screen
      {isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      {isDesktopCollapsed ? 'md:w-20' : 'w-64 md:w-64'}"
  >
    <!-- Sidebar Header / Logo -->
    <div class="h-16 px-4 flex items-center justify-between border-b border-neutral-200 bg-white">
      <a
        href="#/dashboard"
        onclick={closeMobileSidebar}
        class="flex items-center gap-3 overflow-hidden group"
      >
        <div class="w-9 h-9 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <BookOpen size={18} />
        </div>
        {#if !isDesktopCollapsed}
          <div class="flex flex-col leading-none">
            <span class="font-bold text-base tracking-tight text-neutral-950">MentorAI</span>
            <span class="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
              {authStore.isAdmin ? 'Admin Portal' : 'Siswa Workspace'}
            </span>
          </div>
        {/if}
      </a>

      <!-- Mobile close button -->
      <button
        type="button"
        onclick={closeMobileSidebar}
        class="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 md:hidden"
        aria-label="Tutup navigasi"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Navigation Menu Items -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <!-- Section: Navigasi Utama -->
      <div class="space-y-1">
        {#if !isDesktopCollapsed}
          <p class="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Navigasi Utama
          </p>
        {/if}

        <a
          href="#/dashboard"
          onclick={closeMobileSidebar}
          title="Dashboard"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all {isDashboardActive
            ? 'bg-neutral-950 text-white shadow-xs'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}"
        >
          <LayoutDashboard size={18} class="shrink-0" />
          {#if !isDesktopCollapsed}
            <span>Dashboard</span>
          {/if}
        </a>

        <a
          href="#/exercise"
          onclick={closeMobileSidebar}
          title="Katalog Latihan Soal"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all {isExerciseActive
            ? 'bg-neutral-950 text-white shadow-xs'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}"
        >
          <GraduationCap size={18} class="shrink-0" />
          {#if !isDesktopCollapsed}
            <span>Latihan Soal</span>
          {/if}
        </a>
      </div>

      <!-- Section: Manajemen Materi & Database (Admin Only) -->
      {#if authStore.isAdmin}
        <div class="space-y-1 pt-2 border-t border-neutral-100">
          {#if !isDesktopCollapsed}
            <p class="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Panel Pengajar
            </p>
          {/if}

          <a
            href="#/topics"
            onclick={closeMobileSidebar}
            title="Kelola Topik & Soal"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all {isTopicsActive
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}"
          >
            <Shield size={18} class="shrink-0" />
            {#if !isDesktopCollapsed}
              <span>Kelola Topik & Soal</span>
            {/if}
          </a>

          <a
            href="#/database/users"
            onclick={closeMobileSidebar}
            title="Database Pengguna"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all {isUsersActive
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}"
          >
            <Users size={18} class="shrink-0" />
            {#if !isDesktopCollapsed}
              <span>Data Siswa / User</span>
            {/if}
          </a>

          <a
            href="#/database/answers"
            onclick={closeMobileSidebar}
            title="Database Log Jawaban"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all {isAnswersActive
              ? 'bg-neutral-950 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'}"
          >
            <Database size={18} class="shrink-0" />
            {#if !isDesktopCollapsed}
              <span>Data Jawaban AI</span>
            {/if}
          </a>
        </div>
      {/if}

      <!-- Section: Tautan Umum -->
      <div class="space-y-1 pt-2 border-t border-neutral-100">
        {#if !isDesktopCollapsed}
          <p class="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Halaman Umum
          </p>
        {/if}

        <a
          href="#/"
          onclick={closeMobileSidebar}
          title="Ke Landing Page"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all"
        >
          <Home size={18} class="shrink-0" />
          {#if !isDesktopCollapsed}
            <span class="flex-1">Landing Page</span>
            <ExternalLink size={13} class="text-neutral-400" />
          {/if}
        </a>

        <a
          href="#/faq"
          onclick={closeMobileSidebar}
          title="Bantuan & FAQ"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-all"
        >
          <HelpCircle size={18} class="shrink-0" />
          {#if !isDesktopCollapsed}
            <span>Bantuan & FAQ</span>
          {/if}
        </a>
      </div>
    </div>

    <!-- Sidebar Footer / User Profile & Logout -->
    <div class="p-3 border-t border-neutral-200 bg-neutral-50/50">
      {#if authStore.user}
        <div class="flex items-center {isDesktopCollapsed ? 'justify-center' : 'justify-between'} gap-2 p-2 rounded-xl bg-white border border-neutral-200">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {authStore.user.username.slice(0, 1).toUpperCase()}
            </div>
            {#if !isDesktopCollapsed}
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold text-neutral-950 truncate leading-snug">
                  {authStore.user.username}
                </span>
                <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  {authStore.user.role}
                </span>
              </div>
            {/if}
          </div>

          <button
            type="button"
            onclick={handleLogout}
            title="Keluar dari akun"
            class="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      {/if}
    </div>
  </aside>

  <!-- Main Content Layout Area -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Top Header Bar inside Dashboard -->
    <header class="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <button
          type="button"
          onclick={toggleMobileSidebar}
          aria-label="Buka menu navigasi"
          class="p-2 -ml-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        <!-- Desktop collapse toggle -->
        <button
          type="button"
          onclick={toggleDesktopCollapse}
          aria-label="Toggle lebar sidebar"
          class="hidden md:flex p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100"
          title={isDesktopCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          <Menu size={18} />
        </button>

        <div class="h-4 w-px bg-neutral-200 hidden md:block"></div>

        <!-- Breadcrumb / Header Title -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-neutral-400 hidden sm:inline">Workspace</span>
          <ChevronRight size={13} class="text-neutral-300 hidden sm:inline" />
          <h1 class="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-3">
        <a
          href="#/"
          class="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
        >
          <Home size={14} />
          <span>Lihat Beranda</span>
        </a>

        {#if authStore.user}
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[11px] font-semibold text-neutral-700">
            <span class="w-2 h-2 rounded-full {authStore.isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
            <span>{authStore.user.role.toUpperCase()}</span>
          </div>
        {/if}
      </div>
    </header>

    <!-- Workspace Main Content -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8">
      {#if children}
        {@render children()}
      {/if}
    </main>
  </div>
</div>
