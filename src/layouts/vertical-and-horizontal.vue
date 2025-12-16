<template lang="pug">
  .q-col-gutter-sm(
    v-if="layout.visible"

    :class="[layoutClassObject.root, layout.direction]"
  )
    .col(
      v-for="(element, index) in layout.uischema.elements"

      :key="`${layout.path}-${index}`"
      :class="['col-xs-12', `col-md-${12 / layout.uischema.elements.length}`, layoutClassObject.item, layout.direction === 'column' ? 'q-pb-sm' : 'q-pr-sm']"
      style="max-width: 100%;"
    )
      dispatch-renderer(
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      )
</template>

<script lang="ts">
import { isLayout, JsonFormsRendererRegistryEntry, Layout, rankWith } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { DispatchRenderer, rendererProps, useJsonFormsLayout, type RendererProps } from '@jsonforms/vue'
import { useQuasarLayout } from '../utils'

/**
 * VerticalAndHorizontalLayoutRenderer Component
 *
 * A Vue 3 component that renders JSONForms vertical and horizontal layout elements using
 * Quasar's grid system. This renderer organizes form elements in either vertical stacks
 * or horizontal rows with responsive column distribution.
 *
 * Features:
 * - Supports both vertical and horizontal layout directions
 * - Responsive grid layout with automatic column distribution
 * - Quasar CSS grid integration with gutter spacing
 * - Recursive rendering of nested layout elements
 * - Visibility control based on JSONForms schema
 * - Dynamic styling based on layout direction
 *
 * Usage:
 * This component is automatically selected by JSONForms when encountering VerticalLayout
 * or HorizontalLayout UI elements. It should not be used directly but rather through
 * the JSONForms rendering system.
 *
 * Example UI Schema:
 * {
 *   type: "VerticalLayout", // or "HorizontalLayout"
 *   elements: [
 *     { type: "Control", scope: "#/properties/name" },
 *     { type: "Control", scope: "#/properties/email" }
 *   ]
 * }
 */
const layoutRenderer = defineComponent({
  name: 'LayoutRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  /**
   * Setup function that initializes the layout renderer with JSONForms integration
   *
   * @param props - Renderer properties containing layout configuration
   * @returns Combined functionality from useQuasarLayout and useJsonFormsLayout hooks
   */
  setup(props: RendererProps<Layout>) {
    return useQuasarLayout(useJsonFormsLayout(props))
  },
  computed: {
    /**
     * Computed layout class object based on direction
     *
     * @returns Appropriate style classes for horizontal or vertical layouts
     */
    layoutClassObject(): any {
      return this.layout.direction === 'row' ? this.styles.horizontalLayout : this.styles.verticalLayout
    },
  },
})

export default layoutRenderer

/**
 * JSONForms Renderer Registry Entry
 *
 * Registers the LayoutRenderer component with JSONForms rendering system.
 * The tester function determines when this renderer should be used for any layout type.
 */
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(1, isLayout), // Matches UI elements with layout types (VerticalLayout/HorizontalLayout)
}
</script>
