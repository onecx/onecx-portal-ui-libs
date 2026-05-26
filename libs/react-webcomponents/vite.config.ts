/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import * as path from 'node:path'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/react-webcomponents',
  plugins: [
    react(),

    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/libs/react-webcomponents',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'react-webcomponents',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
        },
      ],
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@onecx/react-integration-interface',
        '@onecx/integration-interface',
        '@r2wc/react-to-web-component',
      ],
    },
  },
})
