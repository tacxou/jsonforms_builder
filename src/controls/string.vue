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
      :model-value="control.data"
      :id="control.id + '-input'"
      :label="computedLabel"
      :class="styles.control.input"
      clear-icon="mdi-close"
      :disable="!control.enabled && !isReadonly"
      :placeholder="appliedOptions.placeholder"
      :readonly="isReadonly"
      :autofocus="appliedOptions.focus"
      :hint="control.description"
      :required="control.required"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :hide-bottom-space="!!control.description"
      :maxlength="appliedOptions.restrict ? control.schema.maxLength : undefined"
      :counter="appliedOptions.restrict"
      :clearable="isClearable"
      :debounce="100"
      outlined
      stack-label
      dense
    )
</template>

<script lang="ts">
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isStringControl } from '@jsonforms/core'
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
  tester: rankWith(1,
    isStringControl,
  ), // Matches schema properties with type "string"
}
</script>
