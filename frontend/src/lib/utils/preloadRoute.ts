import { lazyRoutes } from '../stores/lazyRoutes.svelte';

function handlePreload(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const href = target.getAttribute('href');
  if (!href?.startsWith('#')) return;
  lazyRoutes.preload(href.slice(1).split('?')[0]);
}

export function preloadRoute(node: HTMLElement): { destroy: () => void } {
  node.addEventListener('mouseenter', handlePreload);
  node.addEventListener('focus', handlePreload);

  return {
    destroy() {
      node.removeEventListener('mouseenter', handlePreload);
      node.removeEventListener('focus', handlePreload);
    },
  };
}
