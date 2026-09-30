<script lang="ts">
  import { router } from '../stores/router.svelte';
  import { lazyRoutes } from '../stores/lazyRoutes.svelte';
  import { matchRoute } from '../routes';
  import Spinner from './ui/Spinner.svelte';

  const match = $derived(matchRoute(router.currentPath));

  $effect.pre(() => {
    if (match) lazyRoutes.ensure(match.route);
  });

  const Component = $derived(match ? lazyRoutes.get(match.route.pattern) : undefined);
  const loadError = $derived(
    match && lazyRoutes.error?.pattern === match.route.pattern ? lazyRoutes.error.message : null
  );
</script>

{#if match && Component}
  <Component {...router.params} />
{:else if match && loadError}
  <div class="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
    <p class="text-sm text-neutral-600">Gagal memuat halaman: {loadError}</p>
    <button
      type="button"
      onclick={() => lazyRoutes.ensure(match.route)}
      class="text-xs font-semibold px-4 py-2 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
    >
      Coba Lagi
    </button>
  </div>
{:else}
  <div class="min-h-[50vh] flex flex-col items-center justify-center gap-3">
    <Spinner size="lg" />
    <p class="text-xs text-neutral-500 font-medium">Memuat halaman...</p>
  </div>
{/if}
