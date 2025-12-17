<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-field(
      v-bind="quasarProps('q-field')"
      @update:model-value="onChange"
      :id="control.id + '-input'"
      :model-value="modelValue"
      :label="computedLabel"
      :class="styles.control.input"
      :disable="!control.enabled && !isReadonly"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :hide-bottom-space="!!control.description"
      :debounce="100"
      outlined
      stack-label
      dense
    )
      template(#control)
        q-slider(
          v-bind="quasarProps('q-slider')"
          @update:model-value="onChange"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :model-value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          label
          label-always
          dense
        )
</template>

<script lang="ts">
import { isRangeControl, JsonFormsRendererRegistryEntry, rankWith, type ControlElement } from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, type RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { QField, QSlider } from 'quasar'
import { useSliderControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'slider-control-renderer',
  components: {
    ControlWrapper,
    QField,
    QSlider,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsControl(props)
    const clearValue = determineClearValue(0) as number

    return useSliderControl({
      jsonFormsControl,
      clearValue,
    })
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(4,
    isRangeControl,
  ), // Matches schema properties with type "number" or "integer" and with "range" option set to true
}
</script>
