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
import { defineComponent, ref } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue, Options, useQuasarControl } from '../utils'
import { QInput } from 'quasar'
import { isEmpty } from 'radash'

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
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value: any) => (isEmpty(value) ? clearValue : Number(value))
    const input = useQuasarControl(useJsonFormsControl(props), adaptTarget)

    return {
      ...input,
      adaptTarget,
    }
  },
  computed: {
    step(): number {
      const defaultStep = this.control.schema.type === 'integer' ? 1 : 0.1
      const options: Options = this.appliedOptions

      return options.step ?? defaultStep
    },
    precision(): number | undefined {
      if (!this.step || Number.isInteger(this.step)) return undefined

      const stepStr = this.step.toString()

      if (stepStr.indexOf('e-') > -1) {
        return parseInt(stepStr.split('e-')[1], 10)
      }

      const fraction = stepStr.split('.')[1]

      return fraction ? fraction.length : undefined
    },
    formattedValue(): string | number {
      if (this.control.data == null || this.control.data === '') {
        return this.control.data
      }

      const num = Number(this.control.data)
      if (isNaN(num)) {
        return this.control.data
      }

      if (this.precision !== undefined) {
        return num.toFixed(this.precision)
      }

      return this.control.data
    },
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
