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
      :label="computedLabel"
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
      q-option-group.q-py-sm(
        v-bind="quasarProps('q-option-group')"
        type="radio"
        @update:model-value="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :id="control.id + '_q-option-group'"
        :model-value="modelValue"
        :class="styles.control.input"
        :disable="disable"
        :options="control.options"
        inline
        dense
      )
</template>

<script lang="ts">
import { and, ControlElement, isEnumControl, JsonFormsRendererRegistryEntry, optionIs, rankWith } from '@jsonforms/core'
import { rendererProps, RendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'
import { QInput } from 'quasar'
import { defineComponent } from 'vue'
import { determineClearValue } from '../utils'
import { ControlWrapper } from '../common'
import { useRadioGroupControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'RadioGroupControlRenderer',
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

    return useRadioGroupControl({
      jsonFormsControl,
      clearValue,
    })
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(20,
    and(
      isEnumControl,
      optionIs('format', 'radio'),
    ),
  ), // Matches enum controls with option format set to 'radio'
}
</script>

<style lang="scss">
.q-custom {
  .q-field__control {
    color: inherit;
  }
}
</style>
