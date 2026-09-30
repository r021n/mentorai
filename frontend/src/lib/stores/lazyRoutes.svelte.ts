import type { Component } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { matchRoute, type RouteDef } from '../routes';

export class LazyRoutesStore {
  private cache = new SvelteMap<string, Component<any>>();
  private inflight = new SvelteSet<string>();
  error = $state<{ pattern: string; message: string } | null>(null);

  get(pattern: string): Component<any> | undefined {
    return this.cache.get(pattern);
  }

  ensure(route: RouteDef): void {
    const { pattern, load } = route;
    if (this.cache.has(pattern) || this.inflight.has(pattern)) return;

    this.inflight.add(pattern);
    if (this.error?.pattern === pattern) this.error = null;
    load()
      .then((mod) => {
        this.cache.set(pattern, mod.default);
      })
      .catch((err: unknown) => {
        this.error = {
          pattern,
          message: err instanceof Error ? err.message : 'Gagal memuat halaman.',
        };
      })
      .finally(() => {
        this.inflight.delete(pattern);
      });
  }

  preload(path: string): void {
    const match = matchRoute(path);
    if (match) this.ensure(match.route);
  }
}

export const lazyRoutes = new LazyRoutesStore();
