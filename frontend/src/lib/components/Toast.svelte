<script lang="ts">
  import { toast } from '../stores/toast.svelte';
  import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from '@lucide/svelte';
</script>

<div
  class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
  aria-live="polite"
>
  {#each toast.toasts as item (item.id)}
    <div
      class="pointer-events-auto flex items-start gap-3 p-4 bg-white border border-neutral-900 rounded-lg shadow-lg text-neutral-900 transition-opacity"
      role="alert"
    >
      <div class="mt-0.5 shrink-0">
        {#if item.type === 'success'}
          <CheckCircle2 size={18} class="text-neutral-900" />
        {:else if item.type === 'error'}
          <AlertCircle size={18} class="text-neutral-900" />
        {:else if item.type === 'warning'}
          <AlertTriangle size={18} class="text-neutral-900" />
        {:else}
          <Info size={18} class="text-neutral-900" />
        {/if}
      </div>

      <div class="flex-1 text-sm font-medium leading-relaxed">
        {item.message}
      </div>

      <button
        type="button"
        onclick={() => toast.dismiss(item.id)}
        aria-label="Tutup notifikasi"
        class="text-neutral-500 hover:text-neutral-900 cursor-pointer p-0.5 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>
