import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const API_TARGET = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    // Proxy /api to the backend in dev so the browser talks to a single
    // origin and there are no CORS preflights against localhost:3000.
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    // Absolute base so axios builds full URLs that MSW can intercept in jsdom.
    env: {
      VITE_API_URL: 'http://localhost:3000/api',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        // Wiring/config with no logic to unit-test (parallels the backend
        // excluding its infra adapters): the bootstrap, the query client
        // config and the type-only module.
        'src/main.tsx',
        'src/lib/queryClient.ts',
        'src/types/**',
      ],
      // Same gate as the backend (60% across the four metrics).
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
});
