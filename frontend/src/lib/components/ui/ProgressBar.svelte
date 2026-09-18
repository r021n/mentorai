<script lang="ts">
  interface Props {
    percent: number;
    class?: string;
  }

  let { percent, class: customClass = '' }: Props = $props();

  const clamped = $derived(Math.min(100, Math.max(0, percent)));
</script>

<div class="w-full bg-neutral-200 h-2 rounded-full overflow-hidden {customClass}">
  <div
    class="bg-neutral-900 h-full rounded-full transition-[width] duration-300 ease-out"
    style="width: {clamped}%"
  ></div>
</div>
