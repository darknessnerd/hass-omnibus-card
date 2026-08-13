import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: process.env.CI ? null : undefined,
  },
  build: {
    lib: {
      entry:    'src/index.js',
      formats:  ['iife'],
      name:     'HassOmnibusCard',
      fileName: () => 'hass-omnibus-card.js',
    },
    outDir:     'dist',
    emptyOutDir: false,   // don't wipe other files that may live in dist/
  },
});
