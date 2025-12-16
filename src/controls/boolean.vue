<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-field.q-custom(
      v-bind="quasarProps('q-field')"
      @focus="handleFocus"
      @blur="handleBlur"
      :id="control.key"
      :class="styles.control.input"
      :hint="control.description"
      :required="control.required"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :disable="disable"
      borderless
      hide-bottom-space
      stack-label
      dense
    )
      q-checkbox.non-selectable(
        v-bind="quasarProps('q-checkbox')"
        @update:model-value="onChange"
        :id="control.key + '_checkbox'"
        :model-value="modelValue"
        :label="controlWrapper.label"
        :disable="disable"
        :error="control.errors !== ''"
        :error-message="control.errors"
      )
</template>

<script lang="ts">
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isBooleanControl } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { useBooleanControl } from '../composables'

/**
 * BooleanControlRenderer Component
 *
 * A Vue 3 component that renders JSONForms boolean controls using Quasar's q-checkbox component.
 * This renderer provides an interactive checkbox input for boolean data types within forms,
 * enabling users to toggle true/false values with a clear visual representation.
 *
 * Features:
 *  - Renders boolean values as Quasar checkboxes
 *  - Supports validation with error display
 *  - Provides focus and blur event handling
 *  - Integrates with ControlWrapper for consistent styling
 *  - Handles disabled state based on control configuration
 *  - Displays hints and descriptions for user guidance
 *
 * Usage:
 *  This component is automatically selected by JSONForms when encountering boolean schema properties.
 *  It should not be used directly but rather through the JSONForms rendering system.
 *
 * Example JSON Schema:
 *  {
 *    type: "boolean",
 *    title: "Accept Terms",
 *    description: "Please accept the terms and conditions"
 *  }
 */
const controlRenderer = defineComponent({
  name: 'BooleanControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },

  /**
   * Setup function that initializes the boolean control renderer with JSONForms integration
   *
   * @param props - Renderer properties containing control element configuration
   * @returns Combined functionality from useQuasarControl and useJsonFormsControl hooks
   */
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsControl(props)

    return useBooleanControl({
      jsonFormsControl,
    })
  },
})

export default controlRenderer

/**
 * JSONForms Renderer Registry Entry
 *
 * Registers the BooleanControlRenderer component with JSONForms rendering system.
 * The tester function determines when this renderer should be used based on schema type.
 */
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(1,
    isBooleanControl,
  ), // Matches schema properties with type "boolean"
}
</script>

<style lang="scss">
.q-custom {
  .q-field__control {
    color: inherit;
  }
}
</style>
