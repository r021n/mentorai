<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'outline' | 'dark';
    size?: 'sm' | 'md';
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'sm',
    class: customClass = '',
    children,
  }: Props = $props();

  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    outline: 'bg-white text-neutral-800 border border-neutral-300',
    dark: 'bg-neutral-900 text-white border border-neutral-900',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-sm px-3 py-1 rounded-full font-medium',
  };
</script>

<span class="inline-flex items-center gap-1.5 {variantClasses[variant]} {sizeClasses[size]} {customClass}">
  {@render children?.()}
</span>
