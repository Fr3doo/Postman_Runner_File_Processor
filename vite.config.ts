import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'src/cli/convert.ts', // Exclu du coverage: script CLI principal
        'src/cli/index.ts', // Exclu du coverage: point d'entrée CLI
        'src/cli/**', // Scripts CLI non testables ou à faible logique
        'src/config/**', // Fichiers de config internes (ex: app, security)
        'src/types/**', // Définitions TypeScript
        'src/main.tsx', // Point d’entrée React (souvent trivial)
        'src/vite-env.d.ts', // Fichier généré automatiquement
        '**/*.d.ts', // Tous les fichiers de type TS
        'vite.config.ts', // Ce fichier-ci
        'tailwind.config.js',
        'postcss.config.js',
        'eslint.config.js',
      ],
    },
  },
});
