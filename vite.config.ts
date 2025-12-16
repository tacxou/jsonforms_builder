import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pugPlugin from 'vite-plugin-pug'
import dts from 'vite-plugin-dts'
import { transformAssetUrls } from '@quasar/vite-plugin'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    dts({
      include: ['src'],
      insertTypesEntry: true,
    }),
    pugPlugin(<any>{
      pretty: true,
      compilerOptions: {},
    }),
  ],

  build: {
    outDir: './dist',

    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JsonFormBuilder',
      fileName: (format) => `json-formbuilder.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },

    rollupOptions: {
      external: [
        'vue',
        'quasar',
        '@jsonforms/core',
        '@jsonforms/vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
          '@jsonforms/core': 'JSONFormsCore',
          '@jsonforms/vue': 'JSONFormsVue',
        },
      },
    },

    sourcemap: true,
    cssCodeSplit: false,
  },

  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
})
