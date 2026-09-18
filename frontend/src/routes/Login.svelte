<script lang="ts">
  import { authApi } from '../lib/api/auth';
  import { authStore } from '../lib/stores/auth.svelte';
  import { toast } from '../lib/stores/toast.svelte';
  import Input from '../lib/components/ui/Input.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import Spinner from '../lib/components/ui/Spinner.svelte';
  import { LogIn } from '@lucide/svelte';

  let username = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      errorMessage = 'Username dan password wajib diisi.';
      return;
    }

    errorMessage = '';
    isSubmitting = true;

    try {
      const res = await authApi.login({ username: username.trim(), password: password.trim() });
      authStore.setUser(res.user);
      toast.success(`Selamat datang kembali, ${res.user.username}!`);
      if (res.user.role === 'admin') {
        window.location.hash = '#/topics';
      } else {
        window.location.hash = '#/exercise';
      }
    } catch (err: any) {
      errorMessage = err.message || 'Login gagal. Periksa kembali username dan password Anda.';
      toast.error(errorMessage);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-md bg-white border border-neutral-300 rounded-xl p-8 shadow-sm space-y-6">
    <div class="text-center space-y-1.5">
      <div class="w-12 h-12 mx-auto rounded-xl bg-neutral-900 text-white flex items-center justify-center">
        <LogIn size={22} />
      </div>
      <h2 class="text-2xl font-bold text-neutral-950">Masuk Akun</h2>
      <p class="text-xs text-neutral-500">Masukkan kredensial akun MentorAI Anda untuk melanjutkan</p>
    </div>

    {#if errorMessage}
      <div class="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 leading-normal">
        {errorMessage}
      </div>
    {/if}

    <form onsubmit={handleLogin} class="space-y-4">
      <Input
        id="username"
        label="Username"
        placeholder="Masukkan username"
        bind:value={username}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Masukkan password"
        bind:value={password}
        required
      />

      <Button
        type="submit"
        variant="primary"
        class="w-full py-2.5"
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          <Spinner size="sm" class="border-t-white" />
          <span>Memproses Masuk...</span>
        {:else}
          <span>Masuk</span>
        {/if}
      </Button>
    </form>

    <div class="text-center pt-2 border-t border-neutral-200">
      <p class="text-xs text-neutral-600">
        Belum memiliki akun?
        <a href="#/register" class="font-semibold text-neutral-950 hover:underline">
          Daftar di sini
        </a>
      </p>
    </div>
  </div>
</div>
