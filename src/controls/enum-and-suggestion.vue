<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-select(
      v-bind="quasarProps('q-select')"
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :id="control.id"
      :model-value="control.data"
      :label="computedLabel"
      :class="styles.control.input"
      clear-icon="mdi-close"
      :disable="!control.enabled && !isReadonly"
      :readonly="isReadonly"
      :required="control.required"
      :placeholder="appliedOptions.placeholder"
      :hide-bottom-space="!!control.description"
      :options="control.options || suggestions"
      option-value="value"
      option-label="label"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :multiple="isArrayControl"
      :clearable="isClearable"
      :debounce="100"
      emit-value
      outlined
      stack-label
      dense
    )
    template(#no-option)
      q-item
        q-item-section
          q-item-label Aucun résultat
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  hasOption,
  or,
  isEnumControl,
  isPrimitiveArrayControl,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, RendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { QInput } from 'quasar'
import { useEnumSuggestionControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'EnumAndSuggestionControlRenderer',
  components: {
    ControlWrapper,
    QInput,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsEnumControl(props)
    const clearValue = determineClearValue(undefined)

    return useEnumSuggestionControl({
      jsonFormsControl,
      clearValue,
    })
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(2, and(
    or(
      isStringControl,
      isPrimitiveArrayControl,
    ),
    or(
      hasOption('suggestion'),
      isEnumControl,
    ),
  )),
}
</script>
