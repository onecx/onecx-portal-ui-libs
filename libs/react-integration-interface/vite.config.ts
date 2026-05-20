/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import * as path from 'path'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/react-integration-interface',
  plugins: [
    react(),

    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/libs/react-integration-interface',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: 'src/index.ts',
        mocks: 'src/lib/mocks/index.ts',
      },
      name: 'react-integration-interface',
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
      external: ['react', 'react-dom', 'react/jsx-runtime', '@onecx/integration-interface', '@onecx/accelerator'],
    },
  },
})
