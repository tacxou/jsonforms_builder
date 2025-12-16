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
        :model-value="control.data"
        :class="styles.control.input"
        :disable="!control.enabled"
        :options="control.options"
        inline
        dense
      )
</template>

<script lang="ts">
import { and, ControlElement, isEnumControl, JsonFormsRendererRegistryEntry, optionIs, rankWith } from '@jsonforms/core'
import { rendererProps, RendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'
import { QInput } from 'quasar'
import { isEmpty } from 'radash'
import { defineComponent } from 'vue'
import { determineClearValue, useQuasarControl } from '../utils'
import { ControlWrapper } from '../common'

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
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value) => (isEmpty(value) ? clearValue : value)
    const input = useQuasarControl(useJsonFormsEnumControl(props), adaptTarget, 100)

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
