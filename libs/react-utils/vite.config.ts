/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import * as path from 'path'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/react-utils',
  plugins: [
    react(),

    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/libs/react-utils',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: 'src/lib/index.ts',
        styling: 'src/lib/styling/primeReact/index.ts',
        utils: 'src/lib/utils/index.ts',
        guards: 'src/lib/guards/index.ts',
        styles: 'src/lib/styling/primeReact/styles.ts',
      },
      name: 'react-utils',
      fileName: (format, entryName) => `lib/${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          entryFileNames: 'lib/[name].mjs',
          chunkFileNames: 'lib/[name].mjs',
        },
        {
          format: 'cjs',
          entryFileNames: 'lib/[name].cjs',
          chunkFileNames: 'lib/[name].cjs',
        },
      ],
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'primereact',
        'react-router',
        '@onecx/integration-interface',
        '@onecx/react-integration-interface',
        '@onecx/react-webcomponents',
        '@onecx/accelerator',
      ],
    },
  },
})
