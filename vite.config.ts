/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

// https://vitejs.dev/config/
export default defineConfig({
  // Root by default (local dev / Vercel). The GitHub Pages build sets
  // VITE_BASE=/inner-feelings/ so assets resolve under the repo subpath.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
