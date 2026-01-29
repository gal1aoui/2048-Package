import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@agallaoui/2048': path.resolve(__dirname, '../src/index.ts'),
      '@agallaoui/2048/styles.css': path.resolve(__dirname, '../src/styles/game.css')
    }
  }
});
