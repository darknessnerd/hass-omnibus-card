import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  define: {
    '__VERSION__': JSON.stringify(pkg.version),
  },
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
