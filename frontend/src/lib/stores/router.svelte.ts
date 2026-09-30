import { SvelteURLSearchParams } from 'svelte/reactivity';
import { matchRoute } from '../routes';

export class RouterState {
  currentHash = $state<string>('');
  currentPath = $state<string>('/');
  params = $state<Record<string, string>>({});
  query = $state<Record<string, string>>({});

  constructor() {
    if (typeof window !== 'undefined') {
      this.syncRoute();
      window.addEventListener('hashchange', () => this.syncRoute());
    }
  }

  private parseHash(): { path: string; query: Record<string, string> } {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [pathPart, queryPart] = raw.split('?');
    const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
    const query: Record<string, string> = {};

    if (queryPart) {
      const searchParams = new SvelteURLSearchParams(queryPart);
      searchParams.forEach((val, key) => {
        query[key] = val;
      });
    }

    return { path, query };
  }

  syncRoute() {
    const { path, query } = this.parseHash();
    this.currentHash = window.location.hash;
    this.currentPath = path;
    this.query = query;
    this.params = matchRoute(path)?.params ?? {};
  }

  navigate(path: string) {
    if (typeof window !== 'undefined') {
      const targetHash = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : `/${path}`}`;
      if (window.location.hash === targetHash) {
        this.syncRoute();
      } else {
        window.location.hash = targetHash;
      }
    }
  }
}

export const router = new RouterState();
