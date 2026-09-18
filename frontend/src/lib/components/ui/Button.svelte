<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    class?: string;
    title?: string;
    ariaLabel?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    class: customClass = '',
    title,
    ariaLabel,
    onclick,
    children,
  }: Props = $props();

  const variantClasses = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900 disabled:bg-neutral-300 disabled:border-neutral-300 disabled:text-neutral-500',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400',
    outline: 'bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-300 disabled:border-neutral-200 disabled:text-neutral-300',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-300',
    danger: 'bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white border border-neutral-900 disabled:opacity-40',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md font-medium',
    md: 'text-sm px-4 py-2 rounded-lg font-medium',
    lg: 'text-base px-6 py-2.5 rounded-lg font-medium',
  };
</script>

<button
  {type}
  {disabled}
  {title}
  aria-label={ariaLabel}
  {onclick}
  class="inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors select-none {variantClasses[variant]} {sizeClasses[size]} {customClass}"
>
  {@render children?.()}
</button>
