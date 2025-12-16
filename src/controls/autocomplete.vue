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
      @filter="onFilter"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :id="control.id + '-input'"
      :model-value="modelValue"
      :label="computedLabel"
      :class="styles.control.input"
      clear-icon="mdi-trash"
      :disable="!control.enabled && !isReadonly"
      :readonly="isReadonly"
      :required="control.required"
      :placeholder="appliedOptions.placeholder"
      :hide-bottom-space="!!control.description"
      :options="selectOptions"
      option-value="value"
      option-label="label"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :clearable="isClearable"
      new-value-mode='add-unique'
      :input-debounce="300"
      use-input
      use-chips
      hide-dropdown-icon
      map-options
      emit-value
      stack-label
      outlined
      dense
    )
      template(#no-option="{ inputValue }")
        q-item(v-show='inputValue.length >= minLength')
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
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, RendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { useAutocompleteControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'SuggestionControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsEnumControl(props)
    const clearValue = determineClearValue(undefined)

    return useAutocompleteControl({
      jsonFormsControl,
      clearValue,
    })
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(2,
    and(
      isStringControl,
      hasOption('api'),
    ),
  ), // Matches string controls with 'api' option defined
}
</script>
