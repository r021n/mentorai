import { SvelteURLSearchParams } from 'svelte/reactivity';

export interface RouteMatch {
  pattern: string;
  params: Record<string, string>;
}

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
    this.params = this.matchParams(path);
  }

  private matchParams(path: string): Record<string, string> {
    const patterns = [
      '/exercise/:topicId',
      '/myAnswers/:topicId',
      '/topics/list/:topicId',
      '/studentsAnswers/:topicId',
    ];

    for (const pattern of patterns) {
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');
      if (patternParts.length === pathParts.length) {
        let match = true;
        const extracted: Record<string, string> = {};
        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            const key = patternParts[i].slice(1);
            extracted[key] = pathParts[i];
          } else if (patternParts[i] !== pathParts[i]) {
            match = false;
            break;
          }
        }
        if (match) return extracted;
      }
    }
    return {};
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
