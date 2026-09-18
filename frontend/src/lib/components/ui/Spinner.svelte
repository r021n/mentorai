<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { size = 'md', class: customClass = '' }: Props = $props();

  const sizeDimensions = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  };
</script>

<div
  class="inline-block rounded-full border-neutral-300 border-t-neutral-900 animate-spin {sizeDimensions[size]} {customClass}"
  role="status"
  aria-label="Memuat"
></div>
