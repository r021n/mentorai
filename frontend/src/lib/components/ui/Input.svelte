<script lang="ts">
  interface Props {
    type?: string;
    value?: string;
    placeholder?: string;
    label?: string;
    id?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    oninput?: (e: Event) => void;
  }

  let {
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    label,
    id,
    error,
    disabled = false,
    required = false,
    class: customClass = '',
    oninput,
  }: Props = $props();
</script>

<div class="w-full flex flex-col gap-1.5">
  {#if label}
    <label for={id} class="text-xs font-semibold text-neutral-800 tracking-wide uppercase">
      {label}
      {#if required}
        <span class="text-neutral-900">*</span>
      {/if}
    </label>
  {/if}
  <input
    {id}
    {type}
    bind:value
    {placeholder}
    {disabled}
    {required}
    {oninput}
    class="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors disabled:bg-neutral-100 disabled:text-neutral-400 {error ? 'border-neutral-900' : ''} {customClass}"
  />
  {#if error}
    <p class="text-xs text-neutral-700 font-medium">{error}</p>
  {/if}
</div>
