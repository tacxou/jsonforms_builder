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
            q-card-section
              q-select(
                v-model="locale"
                label="Select Language"
                :options="[ { label: 'English', value: 'en' }, { label: 'Français', value: 'fr' } ]"
                 dense outlined emit-value map-options
              )
            q-separator
            q-card-section.q-pa-none
              q-form.q-pa-md
                json-forms(
                  :key="example.name"
                  :data="data"
                  :schema="example.schema"
                  :uischema="example.uischema"
                  :renderers="renderers"
                  :i18n="i18n"
                  :ajv="ajv"
                  validationMode="ValidateAndShow"
                  :additional-errors="additionalErrors"
                  :config="{ ...example.config }"
                  @change="onChange"
                  _readonly
                )
            q-separator
            q-card-section
              pre(v-text="JSON.stringify(data, null, 2)")
    layout-default-footer
</template>
<script lang="ts">
import { defineComponent, provide, ref, computed, getCurrentInstance, watch } from 'vue'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue'
import { ErrorObject } from 'ajv'
import { allRenderers, createAjv } from '../src'
import { getExamples } from './examples/register'
import { useQuasar } from 'quasar'
import LayoutDefaultHeader from './components/layout/default/header.vue'
import LayoutDefaultDrawer from './components/layout/default/drawer.vue'
import LayoutDefaultFooter from './components/layout/default/footer.vue'
import { JsonFormsI18nState } from '@jsonforms/core'
import { get } from 'radash'

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
      splitterModel: 25,
      renderers: Object.freeze(allRenderers),
      examples,
      additionalErrors,
      wls: window.location.search,
    }
  },
  setup() {
    const $q = useQuasar()
    const drawer = ref($q.screen.width > 700)
    const instance = getCurrentInstance()
    const ajv = createAjv()

    const locale = ref<'fr' | 'en'>('fr')

    const createTranslator = (currentLocale: string) => (key: string, defaultMessage?: string, values?: unknown) => {
      const proxy = instance?.proxy as { example?: { i18n?: Record<string, unknown> } } | undefined
      const example = proxy?.example
      const translations = get(example?.i18n, currentLocale, {})
      const fallback = defaultMessage ?? key

      return get(translations, key, fallback)
    }

    const translation = computed(() => createTranslator(locale.value))

    watch(
      () => $q.screen.lt.sm,
      (isSmall) => {
        drawer.value = !isSmall
      },
      { immediate: true },
    )

    provide('drawer', drawer)

    console.log('Ajv instance', ajv)

    return {
      locale,
      translation,
      ajv,
    }
  },
  watch: {
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
    i18n(): JsonFormsI18nState {
      return {
        locale: this.locale,
        translate: this.translation,
      }
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
