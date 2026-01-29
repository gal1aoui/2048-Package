import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react'],
  onSuccess: async () => {
    const fs = await import('fs');
    fs.copyFileSync('src/styles/game.css', 'dist/styles.css');
  }
});
