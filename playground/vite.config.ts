import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pugPlugin from 'vite-plugin-pug'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    pugPlugin(<any>{
      pretty: true,
      compilerOptions: {},
    }),
    quasar(),
  ],
})
