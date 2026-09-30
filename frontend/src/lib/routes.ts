import type { Component } from 'svelte';

export type RouteGuard = 'public' | 'guest-only' | 'auth' | 'admin';
export type RouteLayout = 'dashboard' | 'public';
export type LazyComponent = () => Promise<{ default: Component<any> }>;

export interface RouteDef {
  pattern: string;
  layout: RouteLayout;
  guard: RouteGuard;
  title?: string;
  load: LazyComponent;
}

export interface RouteMatch {
  route: RouteDef;
  params: Record<string, string>;
}

export const routes: RouteDef[] = [
  { pattern: '/', layout: 'public', guard: 'public', load: () => import('../routes/Home.svelte') },
  { pattern: '/login', layout: 'public', guard: 'guest-only', load: () => import('../routes/Login.svelte') },
  { pattern: '/register', layout: 'public', guard: 'guest-only', load: () => import('../routes/Register.svelte') },
  { pattern: '/faq', layout: 'public', guard: 'public', load: () => import('../routes/Faq.svelte') },

  { pattern: '/dashboard', layout: 'dashboard', guard: 'auth', title: 'Dashboard', load: () => import('../routes/Dashboard.svelte') },
  { pattern: '/exercise', layout: 'dashboard', guard: 'auth', title: 'Katalog Topik Latihan', load: () => import('../routes/exercise/TopicSelect.svelte') },
  { pattern: '/exercise/:topicId', layout: 'dashboard', guard: 'auth', title: 'Pengerjaan Latihan Soal', load: () => import('../routes/exercise/ExerciseRunner.svelte') },
  { pattern: '/endExercise', layout: 'dashboard', guard: 'auth', title: 'Selesai Latihan', load: () => import('../routes/exercise/EndExercise.svelte') },
  { pattern: '/myAnswers/:topicId', layout: 'dashboard', guard: 'auth', title: 'Hasil Evaluasi Jawaban', load: () => import('../routes/my-answers/MyAnswers.svelte') },

  { pattern: '/topics', layout: 'dashboard', guard: 'admin', title: 'Kelola Topik Pembelajaran', load: () => import('../routes/admin/TopicList.svelte') },
  { pattern: '/topics/list/:topicId', layout: 'dashboard', guard: 'admin', title: 'Kelola Butir Soal', load: () => import('../routes/admin/QuestionList.svelte') },
  { pattern: '/studentsAnswers/:topicId', layout: 'dashboard', guard: 'admin', title: 'Matriks Jawaban Siswa', load: () => import('../routes/admin/StudentAnswers.svelte') },
  { pattern: '/database/users', layout: 'dashboard', guard: 'admin', title: 'Database Pengguna', load: () => import('../routes/admin/database/UsersManager.svelte') },
  { pattern: '/database/answers', layout: 'dashboard', guard: 'admin', title: 'Database Jawaban AI', load: () => import('../routes/admin/database/AnswersManager.svelte') },
];

export function matchRoute(path: string): RouteMatch | null {
  const pathParts = path.split('/');

  for (const route of routes) {
    const patternParts = route.pattern.split('/');
    if (patternParts.length !== pathParts.length) continue;

    const params: Record<string, string> = {};
    let matched = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        matched = false;
        break;
      }
    }
    if (matched) return { route, params };
  }

  return null;
}
