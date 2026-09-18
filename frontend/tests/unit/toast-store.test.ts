import { describe, it, expect } from '../test-utils.ts';
import { ToastStore } from '../../src/lib/stores/toast.svelte.ts';

describe('ToastStore Tests', () => {
  it('should add toasts and auto-dismiss after duration', async () => {
    const store = new ToastStore();
    expect(store.toasts).toEqual([]);

    store.success('Operasi berhasil', 30);
    expect(store.toasts.length).toBe(1);
    expect(store.toasts[0].message).toBe('Operasi berhasil');
    expect(store.toasts[0].type).toBe('success');

    await new Promise((r) => setTimeout(r, 60));
    expect(store.toasts.length).toBe(0);
  });

  it('should allow manually dismissing a toast by ID', () => {
    const store = new ToastStore();
    store.error('Terjadi kesalahan', 0); // 0 = no auto dismiss

    expect(store.toasts.length).toBe(1);
    const toastId = store.toasts[0].id;

    store.dismiss(toastId);
    expect(store.toasts.length).toBe(0);
  });
});
