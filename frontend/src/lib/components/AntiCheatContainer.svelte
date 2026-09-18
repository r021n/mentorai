<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: customClass = '', children }: Props = $props();

  function preventCopy(e: ClipboardEvent) {
    e.preventDefault();
  }

  function preventContextMenu(e: MouseEvent) {
    e.preventDefault();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="select-none no-copy-text {customClass}"
  oncopy={preventCopy}
  oncut={preventCopy}
  oncontextmenu={preventContextMenu}
>
  {@render children?.()}
</div>
