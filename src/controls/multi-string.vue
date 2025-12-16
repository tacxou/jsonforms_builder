<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-input(
      type="textarea"
      v-bind="quasarProps('q-input')"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      clear-icon="mdi-close"
      :id="control.id + '-input'"
      :model-value="control.data"
      :label="computedLabel"
      :class="styles.control.input"
      :disable="!control.enabled && !isReadonly"
      :placeholder="appliedOptions.placeholder"
      :readonly="isReadonly"
      :autofocus="appliedOptions.focus"
      :hint="control.description"
      :required="control.required"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :maxlength="control.schema.maxLength"
      :clearable="appliedOptions.clearable"
      :debounce="100"
      :rows="appliedOptions.rows || 30"
      :min-rows="appliedOptions.minRows || 30"
      counter
      stack-label
      outlined
      autogrowa
    )
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  isMultiLineControl,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue, useQuasarControl } from '../utils'
import { QInput } from 'quasar'
import { isEmpty } from 'radash'

const controlRenderer = defineComponent({
  name: 'StringControlRenderer',
  components: {
    ControlWrapper,
    QInput,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value) => (isEmpty(value) ? clearValue : value)
    const input = useQuasarControl(useJsonFormsControl(props), adaptTarget, 100)

    return {
      ...input,
      adaptTarget,
    }
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(2,
    and(
      isStringControl,
      isMultiLineControl,
    ),
  ), // Matches schema properties with type "string" and with "multiLine" option set to true
}
</script>
