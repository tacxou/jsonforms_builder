<template lang="pug">
  .q-col-gutter-sm
    .col
      q-tabs(
        v-model="activeCategory"
        dense
        align="justify"
        outside-arrows
        mobile-arrows
        swipeable
      )
        q-tab(
          v-for="(element, index) in visibleCategories"
          :key="index"
          :name="element.queryId"
          :label="visibleCategoryLabels[index]"
        )
      q-separator
      q-tab-panels(v-model="activeCategory")
        q-tab-panel.q-px-none(
          v-for="(element, index) in visibleCategories"
          :key="index"
          :name="element.queryId"
        )
          dispatch-renderer(
            :schema="layout.schema"
            :uischema="element.value.uischema"
            :path="layout.path"
            :enabled="layout.enabled"
            :renderers="layout.renderers"
            :cells="layout.cells"
          )
</template>

<script lang="ts">
import {
  and,
  categorizationHasCategory,
  isCategorization,
  JsonFormsRendererRegistryEntry,
  rankWith,
  type Layout,
} from '@jsonforms/core'
import { DispatchRenderer, rendererProps, useJsonFormsCategorization, type RendererProps } from '@jsonforms/vue'
import { computed, defineComponent, onMounted } from 'vue'
import { useQuasarLayout } from '../utils'
import { useHashState } from '../composables'
import { get, isString } from 'radash'

const DEFAULT_QUERY_KEY = 'tab'
const DEFAULT_DEFAULT_TAB = '0'

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    const { state, set } = useHashState()
    const renderedProps = useQuasarLayout(useJsonFormsCategorization(props))
    const queryKey = get(renderedProps.layout.value, 'uischema.options.queryKey', DEFAULT_QUERY_KEY)
    const defaultTab = get(renderedProps.layout.value, 'uischema.options.defaultTab', DEFAULT_DEFAULT_TAB)
    const uiSchemaOptions = get(renderedProps.layout.value, 'uischema.options', {})

    const activeCategory = computed({
      get: () => state.value[queryKey] || defaultTab,
      set: (val: string) => {
        set({ [queryKey]: val })
      },
    })

    const extendedCategories = computed(() =>
      renderedProps.categories.map((category, index) => {
        const value = category.value
        const queryId = get(value, 'uischema.options.queryId', `${index}`)

        return {
          value,
          queryId,
        }
      }),
    )

    const visibleCategories = computed(() =>
      extendedCategories.value.filter((category) => {
        const visibility = category.value?.visible

        return visibility === undefined ? true : visibility
      }),
    )

    const visibleCategoryLabels = computed(() => visibleCategories.value.map((category) => category.value?.label ?? ''))

    onMounted(() => {
      const selectedCategory = state.value[queryKey]

      if (!isString(selectedCategory)) {
        set({ [queryKey]: defaultTab })
        return
      }

      const match = extendedCategories.value.find((category) => {
        return selectedCategory === category.queryId && category.value.visible
      })

      if (!match) {
        set({ [queryKey]: defaultTab })
      }
    })

    return {
      ...renderedProps,

      activeCategory,
      extendedCategories,
      visibleCategories,
      visibleCategoryLabels,
      uiSchemaOptions,
    }
  },
})

export default layoutRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
}
</script>
