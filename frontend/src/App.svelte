<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './lib/stores/auth.svelte';
  import { router } from './lib/stores/router.svelte';
  import Navbar from './lib/components/Navbar.svelte';
  import Footer from './lib/components/Footer.svelte';
  import Toast from './lib/components/Toast.svelte';
  import Spinner from './lib/components/ui/Spinner.svelte';

  // Routes
  import Home from './routes/Home.svelte';
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import Faq from './routes/Faq.svelte';
  import TopicSelect from './routes/exercise/TopicSelect.svelte';
  import ExerciseRunner from './routes/exercise/ExerciseRunner.svelte';
  import EndExercise from './routes/exercise/EndExercise.svelte';
  import MyAnswers from './routes/my-answers/MyAnswers.svelte';
  import TopicList from './routes/admin/TopicList.svelte';
  import QuestionList from './routes/admin/QuestionList.svelte';
  import StudentAnswers from './routes/admin/StudentAnswers.svelte';
  import UsersManager from './routes/admin/database/UsersManager.svelte';
  import AnswersManager from './routes/admin/database/AnswersManager.svelte';

  onMount(async () => {
    await authStore.init();
  });

  // Route Guards
  $effect(() => {
    if (authStore.isLoading) return;

    const path = router.currentPath;
    const isGuestOnly = path === '/login' || path === '/register';
    const isAuthRequired =
      path.startsWith('/exercise') ||
      path === '/endExercise' ||
      path.startsWith('/myAnswers') ||
      path.startsWith('/topics') ||
      path.startsWith('/studentsAnswers') ||
      path.startsWith('/database');

    const isAdminRequired =
      path.startsWith('/topics') ||
      path.startsWith('/studentsAnswers') ||
      path.startsWith('/database');

    if (authStore.isAuthenticated && isGuestOnly) {
      router.navigate('/');
    } else if (!authStore.isAuthenticated && isAuthRequired) {
      router.navigate('/login');
    } else if (authStore.isAuthenticated && !authStore.isAdmin && isAdminRequired) {
      router.navigate('/');
    }
  });
</script>

<div class="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
  <Navbar />

  <main class="flex-1">
    {#if authStore.isLoading}
      <div class="py-32 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p class="text-xs text-neutral-500 font-medium">Memverifikasi sesi pengguna...</p>
      </div>
    {:else if router.currentPath === '/' || router.currentPath === '/dashboard'}
      <Home />
    {:else if router.currentPath === '/login'}
      <Login />
    {:else if router.currentPath === '/register'}
      <Register />
    {:else if router.currentPath === '/faq'}
      <Faq />
    {:else if router.currentPath === '/exercise'}
      <TopicSelect />
    {:else if router.currentPath.startsWith('/exercise/')}
      <ExerciseRunner topicId={router.params.topicId} />
    {:else if router.currentPath === '/endExercise'}
      <EndExercise />
    {:else if router.currentPath.startsWith('/myAnswers/')}
      <MyAnswers topicId={router.params.topicId} />
    {:else if router.currentPath === '/topics'}
      <TopicList />
    {:else if router.currentPath.startsWith('/topics/list/')}
      <QuestionList topicId={router.params.topicId} />
    {:else if router.currentPath.startsWith('/studentsAnswers/')}
      <StudentAnswers topicId={router.params.topicId} />
    {:else if router.currentPath === '/database/users'}
      <UsersManager />
    {:else if router.currentPath === '/database/answers'}
      <AnswersManager />
    {:else}
      <!-- 404 Not Found -->
      <div class="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 class="text-4xl font-extrabold text-neutral-950">404</h2>
        <p class="text-sm text-neutral-600">Halaman yang Anda cari tidak ditemukan.</p>
        <a
          href="#/"
          class="inline-block text-xs font-semibold px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    {/if}
  </main>

  <Footer />
  <Toast />
</div>
