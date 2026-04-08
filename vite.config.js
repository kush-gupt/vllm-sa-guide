import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-prism': [
            'prismjs',
            'prismjs/components/prism-python',
            'prismjs/components/prism-bash',
            'prismjs/components/prism-yaml',
          ],
          'vendor-mermaid': ['beautiful-mermaid'],
        },
      },
    },
  },
});
