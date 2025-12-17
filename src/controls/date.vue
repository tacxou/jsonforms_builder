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
      @keydown.up.stop="keydownHandler($event, 1)"
      @keydown.down.stop="keydownHandler($event, -1)"
      @keyup.up.stop="keyupHandler($event, 1)"
      @keyup.down.stop="keyupHandler($event, -1)"
      @update:model-value="onChangeDate"
      @focus="isFocused = true"
      @blur="onBlur"
      :id="control.id"
      :model-value="controlData"
      :label="controlWrapper.label"
      :class="styles.control.input"
      clear-icon="mdi-close"
      :disable="!control.enabled"
      :placeholder="appliedOptions.placeholder"
      :autofocus="appliedOptions.focus"
      :required="control.required"
      :hide-bottom-space="!!control.description"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :clearable="isClearable"
      :debounce="100"
      inputmode="numeric"
      :_step="optionPattern.includes('s') ? 1 : 0"
      :mask="maskPattern"
      outlined
      stack-label
      dense
    )
      template(#prepend)
        q-icon.cursor-pointer(v-if="inputType === 'datetime-local'" name="mdi-calendar-clock")
          q-popup-proxy(ref="popupProxy")
            q-card.row(flat)
              .col
                q-date(
                  v-bind="quasarProps('q-date')"
                  @update:model-value="onChangeDate"
                  :model-value="controlData"
                  first-day-of-week="1"
                  :mask="patternDefault"
                  square
                )
              .col
                q-time(
                  v-bind="quasarProps('q-time')"
                  @update:model-value="onChangeDate"
                  :model-value="controlData"
                  :with-seconds="optionPattern.includes('s')"
                  format24h
                  square
                )
        q-icon.cursor-pointer(v-else-if="inputType === 'date'" name="mdi-calendar")
          q-popup-proxy(ref="popupProxy")
            q-date(
              v-bind="quasarProps('q-date')"
              @update:model-value="onChangeDate"
              :model-value="controlData"
              first-day-of-week="1"
              :mask="patternDefault"
            )
        q-icon.cursor-pointer(v-else-if="inputType === 'time'" name="mdi-clock")
          q-popup-proxy(ref="popupProxy")
            q-time(
              v-bind="quasarProps('q-time')"
              @update:model-value="onChangeDate"
              :model-value="controlData"
              :with-seconds="optionPattern.includes('s')"
              format24h
              square
            )
</template>

<script lang="ts">
import { ControlElement, JsonFormsRendererRegistryEntry, rankWith, isDateControl, or, isDateTimeControl, isTimeControl } from '@jsonforms/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { defineComponent } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue } from '../utils'
import { QCard, QDate, QIcon, QInput, QPopupProxy, QTime } from 'quasar'
import { useDateControl } from '../composables'

dayjs.extend(customParseFormat)

const controlRenderer = defineComponent({
  name: 'DateControlRenderer',
  components: {
    ControlWrapper,
    QInput,
    QIcon,
    QPopupProxy,
    QCard,
    QTime,
    QDate,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const jsonFormsControl = useJsonFormsControl(props)
    const clearValue = determineClearValue(undefined)

    return useDateControl({
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
    or(
      isDateControl,
      isDateTimeControl,
      isTimeControl,
    ),
  ), // Matches schema properties with format "date", "date-time" or "time"
}
</script>

<style>
input[type='date']::-webkit-calendar-picker-indicator,
input[type='time']::-webkit-calendar-picker-indicator,
input[type='datetime-local']::-webkit-calendar-picker-indicator {
  display: none;
  appearance: none;
  -webkit-appearance: none;
}

input[type='time']::-webkit-inner-spin-button,
input[type='datetime-local']::-webkit-inner-spin-button {
  display: none;
}

input[type='date'],
input[type='time'],
input[type='datetime-local'] {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
