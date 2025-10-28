<template lang="pug">
  q-layout(view="hHh Lpr lff")
    layout-default-header
    layout-default-drawer
    q-page-container.q-mx-md
      q-splitter(v-model="splitterModel")
        template(#before)
          q-card(flat)
            q-tabs(v-model="tabs" vertical)
              q-tab(v-for="example in examples" :key="example.name" :name="example.name" :label="example.label")
        template(#after)
          q-card(flat bordered square)
            q-card-section.q-pa-none
              q-form.q-pa-md
                json-forms(
                  :key="example.name"
                  :data="data"
                  :schema="example.schema"
                  :uischema="example.uischema"
                  :renderers="renderers"
                  :i18n="i18n"
                  validationMode="ValidateAndShow"
                  :additional-errors="additionalErrors"
                  :config="{ trim: true }"
                  @change="onChange"
                )
            q-separator
            q-card-section
              pre(v-text="JSON.stringify(data, null, 2)")
    layout-default-footer
</template>
<script lang="ts">
import { defineComponent, provide, ref, computed } from 'vue'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue'
import { ErrorObject } from 'ajv'
import { quasarRenderers } from '../src'
import { getExamples } from '../examples/register'
import { useQuasar } from 'quasar'
import LayoutDefaultHeader from './components/layout/default/header.vue'
import LayoutDefaultDrawer from './components/layout/default/drawer.vue'
import LayoutDefaultFooter from './components/layout/default/footer.vue'

const examples = getExamples()

export default defineComponent({
  name: 'App',
  components: {
    JsonForms,
    LayoutDefaultHeader,
    LayoutDefaultDrawer,
    LayoutDefaultFooter,
  },
  data() {
    const exampleData = window.localStorage.getItem('form-data')
    const data = exampleData ? JSON.parse(exampleData) : {}

    const additionalErrors: ErrorObject[] = []
    return {
      data: {},
      splitterModel: 35,
      renderers: Object.freeze(quasarRenderers),
      examples,
      additionalErrors,
      wls: window.location.search,
    }
  },
  setup() {
    const $q = useQuasar()
    const drawer = ref($q.screen.width > 700)

    const locale = ref<'en' | 'bg'>('bg')

    const createTranslator = (currentLocale: string) => (key: string, defaultMessage: string) => {
      console.log(`Locale: ${currentLocale}, Key: ${key}, Default Message: ${defaultMessage}`)
      return defaultMessage
    }

    const translation = computed(() => createTranslator(locale.value))

    provide('drawer', drawer)

    return {
      locale,
      translation,
    }
  },
  watch: {
    '$q.screen.lt.sm': {
      handler(v) {
        this.drawer = !v
      },
      immediate: true,
    },
    wls: {
      handler() {
        this.data = { ...(this.example.data || {}) }
      },
      immediate: true,
    },
  },
  computed: {
    exampleQuery() {
      const params = new URLSearchParams(this.wls)
      return params.get('example')
    },
    tabs: {
      get() {
        return this.exampleQuery
      },
      set(value: string) {
        const params = new URLSearchParams(this.wls)
        params.set('example', value)
        this.wls = params.toString()
        window.history.replaceState({}, '', `?${this.wls}`)
      },
    },
    example() {
      const example = this.examples.find((e) => e.name === this.exampleQuery)
      if (!example) {
        console.warn(`Example with name "${this.exampleQuery}" not found. Using default example.`)
        return this.examples[0]
      }

      return example
    },
    i18n() {
      console.log('example i18n', this.example?.i18n)
      return this.example?.i18n || {}
      // return {
      //   locale: this.locale,
      //   translate: this.translation,
      // }
    },
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      console.log('ev', event)
      window.localStorage.setItem('form-data', JSON.stringify(event.data))
      this.data = event.data
    },
  },
})
</script>
