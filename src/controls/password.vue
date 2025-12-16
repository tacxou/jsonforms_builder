<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-input(
      @update:model-value="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :type="passwordVisible ? 'text' : 'password'"
      :id="control.id + '-input'"
      :model-value="modelValue"
      :label="computedLabel"
      :class="styles.control.input"
      :disable="!control.enabled && !isReadonly"
      :placeholder="appliedOptions.placeholder"
      :autofocus="appliedOptions.focus"
      :required="control.required"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :hide-bottom-space="!!control.description"
      :error-message="control.errors"
      :maxlength="maxLength"
      :counter="counter"
      :clearable="isClearable"
      :debounce="100"
      outlined
      stack-label
      dense

      v-bind="{...quasarProps('q-input'), ...appliedOptions.props}"
    )
      template(#append)
        q-icon.cursor-pointer(
          :name="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click="passwordVisible = !passwordVisible"
        )
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  formatIs,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { QInput } from 'quasar'
import { usePasswordControl } from '../composables'

const controlRenderer = defineComponent({
  name: 'PasswordControlRenderer',
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

    return usePasswordControl({
      jsonFormsControl,
      clearValue,
      debounceWait: 100,
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
      formatIs('password'),
    ),
  ), // Matches schema properties with format "password"
}
</script>
