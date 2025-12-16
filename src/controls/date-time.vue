<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    //- pre(v-text="JSON.stringify(control.data, null, 2)")
    q-input(
      v-bind="quasarProps('q-input')"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :id="control.id + '-input'"
      :model-value="control.data"
      :label="controlWrapper.label"
      :class="styles.control.input"
      :disable="!control.enabled"
      :placeholder="appliedOptions.placeholder"
      :required="control.required"
      :hide-bottom-space="!!control.description"
      :autofocus="appliedOptions.focus"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :maxlength="appliedOptions.restrict ? control.schema.maxLength : undefined"
      :clearable="isClearable"
      :debounce="100"
      type="datetime-local"
      outlined
      stack-label
      dense
    )
</template>

<script lang="ts">
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isDateTimeControl } from '@jsonforms/core'
import { defineComponent, ref } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue, useQuasarControl } from '../utils'
import { QInput } from 'quasar'
import { isEmpty } from 'radash'

const controlRenderer = defineComponent({
  name: 'DateTimeControlRenderer',
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
    isDateTimeControl,
  ), // Matches schema properties with format "date-time"
}
</script>
