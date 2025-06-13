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
        'src/cli/**',             // Scripts CLI non testables ou à faible logique
        'src/config/**',          // Fichiers de config (ex: app, security)
        'src/types/**',           // Définitions TypeScript
        'src/main.tsx',           // Point d’entrée React (souvent trivial)
        'src/vite-env.d.ts',      // Fichier généré automatiquement
        '**/*.d.ts',              // Tous les fichiers de type TS
      ],
    },
  },
});
