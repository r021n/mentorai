import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$lib': path.resolve(import.meta.dirname, './src/lib'),
    },
  },
  test: {
    globals: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        execArgv: ['--preserve-symlinks', '--preserve-symlinks-main'],
      },
      threads: {
        execArgv: ['--preserve-symlinks', '--preserve-symlinks-main'],
      },
    },
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
