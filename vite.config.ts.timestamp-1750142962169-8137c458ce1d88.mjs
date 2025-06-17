// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      exclude: [
        "src/cli/convert.ts",
        // Exclu du coverage: script CLI principal
        "src/cli/index.ts",
        // Exclu du coverage: point d'entrée CLI
        "src/cli/**",
        // Scripts CLI non testables ou à faible logique
        "src/config/**",
        // Fichiers de config internes (ex: app, security)
        "src/types/**",
        // Définitions TypeScript
        "src/main.tsx",
        // Point d’entrée React (souvent trivial)
        "src/vite-env.d.ts",
        // Fichier généré automatiquement
        "**/*.d.ts",
        // Tous les fichiers de type TS
        "vite.config.ts",
        // Ce fichier-ci
        "tailwind.config.js",
        "postcss.config.js",
        "eslint.config.js",
        "tsconfig.json",
        "tsconfig.app.json",
        "tsconfig.node.json"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoudGVzdC50cycsICdzcmMvKiovKi50ZXN0LnRzeCddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2xjb3YnXSxcbiAgICAgIHJlcG9ydHNEaXJlY3Rvcnk6ICdjb3ZlcmFnZScsXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdzcmMvY2xpL2NvbnZlcnQudHMnLCAvLyBFeGNsdSBkdSBjb3ZlcmFnZTogc2NyaXB0IENMSSBwcmluY2lwYWxcbiAgICAgICAgJ3NyYy9jbGkvaW5kZXgudHMnLCAvLyBFeGNsdSBkdSBjb3ZlcmFnZTogcG9pbnQgZCdlbnRyXHUwMEU5ZSBDTElcbiAgICAgICAgJ3NyYy9jbGkvKionLCAvLyBTY3JpcHRzIENMSSBub24gdGVzdGFibGVzIG91IFx1MDBFMCBmYWlibGUgbG9naXF1ZVxuICAgICAgICAnc3JjL2NvbmZpZy8qKicsIC8vIEZpY2hpZXJzIGRlIGNvbmZpZyBpbnRlcm5lcyAoZXg6IGFwcCwgc2VjdXJpdHkpXG4gICAgICAgICdzcmMvdHlwZXMvKionLCAvLyBEXHUwMEU5ZmluaXRpb25zIFR5cGVTY3JpcHRcbiAgICAgICAgJ3NyYy9tYWluLnRzeCcsIC8vIFBvaW50IGRcdTIwMTllbnRyXHUwMEU5ZSBSZWFjdCAoc291dmVudCB0cml2aWFsKVxuICAgICAgICAnc3JjL3ZpdGUtZW52LmQudHMnLCAvLyBGaWNoaWVyIGdcdTAwRTluXHUwMEU5clx1MDBFOSBhdXRvbWF0aXF1ZW1lbnRcbiAgICAgICAgJyoqLyouZC50cycsIC8vIFRvdXMgbGVzIGZpY2hpZXJzIGRlIHR5cGUgVFNcbiAgICAgICAgJ3ZpdGUuY29uZmlnLnRzJywgLy8gQ2UgZmljaGllci1jaVxuICAgICAgICAndGFpbHdpbmQuY29uZmlnLmpzJyxcbiAgICAgICAgJ3Bvc3Rjc3MuY29uZmlnLmpzJyxcbiAgICAgICAgJ2VzbGludC5jb25maWcuanMnLFxuICAgICAgICAndHNjb25maWcuanNvbicsXG4gICAgICAgICd0c2NvbmZpZy5hcHAuanNvbicsXG4gICAgICAgICd0c2NvbmZpZy5ub2RlLmpzb24nLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsU0FBUyxDQUFDLG9CQUFvQixtQkFBbUI7QUFBQSxJQUNqRCxVQUFVO0FBQUEsTUFDUixVQUFVLENBQUMsUUFBUSxNQUFNO0FBQUEsTUFDekIsa0JBQWtCO0FBQUEsTUFDbEIsU0FBUztBQUFBLFFBQ1A7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
