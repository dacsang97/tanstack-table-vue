import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/index.ts'],
  format: 'esm',
  dts: { vue: true },
  clean: true,
  plugins: [Vue({ isProduction: true })],
  external: ['vue', '@tanstack/vue-table', 'lodash.capitalize'],
})