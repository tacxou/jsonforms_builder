<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-input(
      v-bind="quasarProps('q-input')"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :id="control.id + '-input'"
      :model-value="formattedValue"
      :label="controlWrapper.label"
      :class="styles.control.input"
      :disable="!control.enabled && !isReadonly"
      :placeholder="appliedOptions.placeholder"
      :readonly="isReadonly"
      clear-icon="mdi-close"
      :autofocus="appliedOptions.focus"
      :required="control.required"
      :hint="control.description"
      :hide-bottom-space="!!control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :clearable="isClearable"
      :debounce="100"
      :step="step"
      type='number'
      outlined
      stack-label
      dense
    )
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isIntegerControl,
  or,
  isNumberControl,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { QInput } from 'quasar'
import { useNumericControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'NumericControlRenderer',
  components: {
    ControlWrapper,
    QInput,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsControl(props)
    const clearValue = determineClearValue(undefined)
    const input = useNumericControl({
      jsonFormsControl,
      clearValue,
    })

    return input
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(1,
    or(isIntegerControl,
      isNumberControl,
    ),
  ), // Matches schema properties with type "number" or "integer"
}
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
