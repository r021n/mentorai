<script lang="ts">
  import type { Snippet } from 'svelte';
  import { X } from '@lucide/svelte';

  interface Props {
    isOpen: boolean;
    title?: string;
    onclose: () => void;
    children?: Snippet;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  }

  let {
    isOpen,
    title,
    onclose,
    children,
    maxWidth = 'md',
  }: Props = $props();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-opacity">
    <!-- Backdrop button for closing modal -->
    <button
      type="button"
      aria-label="Tutup modal"
      class="fixed inset-0 w-full h-full cursor-default bg-transparent border-none"
      onclick={onclose}
    ></button>

    <!-- Modal Box -->
    <div
      role="dialog"
      aria-modal="true"
      class="relative z-10 w-full {maxWidthClasses[maxWidth]} bg-white border border-neutral-300 rounded-xl shadow-2xl p-6 transition-opacity"
    >
      <div class="flex items-center justify-between pb-4 border-b border-neutral-200">
        {#if title}
          <h3 class="text-base font-semibold text-neutral-900">{title}</h3>
        {:else}
          <div></div>
        {/if}
        <button
          type="button"
          aria-label="Tutup"
          onclick={onclose}
          class="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div class="mt-4">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
