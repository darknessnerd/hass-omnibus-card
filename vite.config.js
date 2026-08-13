import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry:    'src/index.js',
      formats:  ['iife'],
      name:     'RoomSummaryCard',
      fileName: () => 'room-summary-card.js',
    },
    outDir:     'dist',
    emptyOutDir: false,   // don't wipe other files that may live in dist/
  },
});
