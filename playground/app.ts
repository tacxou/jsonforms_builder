import './examples'
import 'quasar/src/css/index.sass'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import langFr from 'quasar/lang/fr'

import { createApp } from 'vue'
import { Quasar } from 'quasar'
import iconSet from 'quasar/icon-set/mdi-v7'

import App from './App.vue'
const myApp = createApp(App)

myApp.use(Quasar, {
  iconSet,
  lang: langFr,
  config: {
    dark: 'auto',
    brand: {
      primary: '#1b9bb5',
      secondary: '#00589B',
      accent: '#9c27b0',
      dark: '#1a1a1a',
      'dark-page': '#121212',
      positive: '#21ba45',
      negative: '#ff3860',
      info: '#31ccec',
      warning: '#f2c037',
    },
  },
})

myApp.mount('#app')
