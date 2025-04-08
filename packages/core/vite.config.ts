import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

let currentFormat = ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    dedupe: ['vue', '@vue/runtime-core'],
  },
  build: {
    minify: false,
    target: 'esnext',
    sourcemap: true,
    lib: {
      name: 'reka-ui',
      fileName: (format, name) => {
        currentFormat = format
        return `${name}.${format === 'es' ? 'js' : 'cjs'}`
      },
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies ?? {})],
      output: {
        // Don't rely on preserveModules
        // It creates a lot of unwanted files because of the multiple sections of SFC files
        manualChunks: (moduleId, meta) => {
          const info = meta.getModuleInfo(moduleId)
          if (!info?.isIncluded) {
            // Don't create empty chunks
            return null
          }

          const [namespace, file] = moduleId.split('?')[0].split('/').slice(-2)
          return `${namespace}/${file.slice(0, file.lastIndexOf('.'))}`
        },

        exports: 'named',
        chunkFileNames: (chunk) => `${chunk.name}.${currentFormat === 'es' ? 'js' : 'cjs'}`,
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') return 'index.css'
          return chunkInfo.name as string
        },
        inlineDynamicImports: false,
      },
    },
  },
})
