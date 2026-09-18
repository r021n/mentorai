<script lang="ts">
  import { authApi } from '../lib/api/auth';
  import { toast } from '../lib/stores/toast.svelte';
  import Input from '../lib/components/ui/Input.svelte';
  import Button from '../lib/components/ui/Button.svelte';
  import Spinner from '../lib/components/ui/Spinner.svelte';
  import { UserPlus } from '@lucide/svelte';

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  async function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      errorMessage = 'Semua field wajib diisi.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Konfirmasi password tidak cocok dengan password.';
      return;
    }

    if (password.length < 3) {
      errorMessage = 'Password minimal harus 3 karakter.';
      return;
    }

    errorMessage = '';
    isSubmitting = true;

    try {
      await authApi.register({
        username: username.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });
      toast.success('Pendaftaran berhasil! Silakan masuk ke akun Anda.');
      window.location.hash = '#/login';
    } catch (err: any) {
      errorMessage = err.message || 'Pendaftaran gagal. Silakan coba lagi.';
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
        <UserPlus size={22} />
      </div>
      <h2 class="text-2xl font-bold text-neutral-950">Daftar Akun Baru</h2>
      <p class="text-xs text-neutral-500">Daftarkan akun siswa untuk mulai belajar dan berlatih</p>
    </div>

    {#if errorMessage}
      <div class="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 leading-normal">
        {errorMessage}
      </div>
    {/if}

    <form onsubmit={handleRegister} class="space-y-4">
      <Input
        id="username"
        label="Username"
        placeholder="Pilih username unik"
        bind:value={username}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Minimal 3 karakter"
        bind:value={password}
        required
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Konfirmasi Password"
        placeholder="Ulangi password di atas"
        bind:value={confirmPassword}
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
          <span>Mendaftarkan Akun...</span>
        {:else}
          <span>Daftar Sekarang</span>
        {/if}
      </Button>
    </form>

    <div class="text-center pt-2 border-t border-neutral-200">
      <p class="text-xs text-neutral-600">
        Sudah memiliki akun?
        <a href="#/login" class="font-semibold text-neutral-950 hover:underline">
          Masuk di sini
        </a>
      </p>
    </div>
  </div>
</div>
