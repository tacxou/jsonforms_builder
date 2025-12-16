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
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isDateControl,
  or,
  isDateTimeControl,
  isTimeControl,
} from '@jsonforms/core'
import { defineComponent, ref } from 'vue'
import { rendererProps, useJsonFormsControl, RendererProps } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue, useQuasarControl } from '../utils'
import { QInput, QPopupProxy } from 'quasar'
import { isEmpty } from 'radash'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'

const controlRenderer = defineComponent({
  name: 'DateControlRenderer',
  components: {
    ControlWrapper,
    QInput,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const popupProxy = ref<QPopupProxy>(null)
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value) => (isEmpty(value) ? clearValue : value)
    const input = useQuasarControl(useJsonFormsControl(props), adaptTarget, 100)

    return {
      ...input,
      adaptTarget,
      popupProxy,
    }
  },
  computed: {
    optionPattern(): string {
      return this.appliedOptions.pattern || this.patternDefault
    },
    controlData() {
      const date = dayjs(this.control.data, this.optionPattern, true)

      return date.format(this.patternDefault)
    },
    maskPattern() {
      const pattern = this.optionPattern

      return pattern.replace(/Y|M|D|H|m|s/g, '#')
    },
    inputType() {
      const format = this.control.schema.format || this.control.uischema?.options?.format || 'date'

      if (format === 'date-time') return 'datetime-local'
      if (format === 'time') return 'time'
      return 'date'
    },
    patternDefault() {
      const format = this.control.schema.format || this.control.uischema?.options?.format || 'date'

      if (format === 'date-time') return DEFAULT_DATETIME_FORMAT
      if (format === 'time') return DEFAULT_TIME_FORMAT
      return DEFAULT_DATE_FORMAT
    },
  },
  methods: {
    onBlur() {
      this.isFocused = false
      console.log('controlData', this.controlData)

      const normalized = this.normalizeValue(this.controlData)
      const date = dayjs(normalized, this.patternDefault, true)

      if (!date.isValid()) {
        this.onChange(this.adaptTarget(undefined))
        console.log('Invalid date on blur, clearing value', this.controlData)
        return
      }

      // this.onChange(this.adaptTarget(this.controlData))
    },
    normalizeValue(value: string, pattern = this.patternDefault): string {
      if (!value) {
        return value
      }

      if (pattern === DEFAULT_TIME_FORMAT) {
        const segments = value.split(':')
        if (segments.length >= 2) {
          const padded = segments.map((segment, index) => {
            if (segment.length === 0) {
              return segment
            }

            const targetLength = index === 0 ? 2 : 2
            return segment.padStart(targetLength, '0')
          })

          if (padded.length === 2) {
            padded.push('00')
          }

          return padded.slice(0, 3).join(':')
        }

        return value
      }

      if (pattern === DEFAULT_DATE_FORMAT) {
        const segments = value.split('-')
        if (segments.length === 3) {
          const [year, month, day] = segments
          const normalizedYear = year.length === 4 ? year : year.padStart(4, '0')
          const normalizedMonth = month.length === 2 ? month : month.padStart(2, '0')
          const normalizedDay = day.length === 2 ? day : day.padStart(2, '0')

          return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`
        }

        return value
      }

      if (pattern === DEFAULT_DATETIME_FORMAT) {
        const [datePart, timePart] = value.split('T')
        if (!timePart) {
          return value
        }

        const normalizedDate = this.normalizeValue(datePart, DEFAULT_DATE_FORMAT)
        const normalizedTime = this.normalizeValue(timePart, DEFAULT_TIME_FORMAT)

        return `${normalizedDate}T${normalizedTime}`
      }

      return value
    },
    onChangeDate(value: string) {
      // 1️⃣ Cas clear : l'utilisateur vide le champ -> on propage bien la valeur vide
      if (isEmpty(value)) {
        // adaptTarget va transformer "" en clearValue (null, undefined, peu importe ce que tu as configuré)
        this.onChange(this.adaptTarget(value))
        return
      }

      // 2️⃣ Tant que la saisie n'a pas rempli le pattern (mask), on ne fait RIEN
      //    -> ça évite que "13:" ou "13:5" déclenchent une normalisation en "13:00"
      const neededDigits = this.optionPattern.replace(/[^YMDHms]/g, '').length
      const currentDigits = value.replace(/\D/g, '').length

      console.log('aaaa', {
        optpat: this.optionPattern.replace(/[^YMDHms]/g, ''),
        curdig: value.replace(/\D/g, ''),
      })

      if (currentDigits < neededDigits) {
        console.log('Waiting for complete input, current digits:', currentDigits, 'needed:', neededDigits)
        return
      }

      console.log('Processing complete input value:', value)

      // 3️⃣ Là seulement on normalise / parse / format
      const normalized = this.normalizeValue(value)
      const date = dayjs(normalized, this.optionPattern, true)

      if (!date.isValid()) {
        console.log('Invalid date entered, ignoring:', {
          value,
          normalized,
          patternDefault: this.patternDefault,
        })
        return
      }

      this.onChange(date.format(this.optionPattern))
      console.log('d', {
        value,
        date,
        optionPattern: this.optionPattern,
        patternDefault: this.patternDefault,
        format: date.format(this.optionPattern),
      })
      // this.popupProxy?.hide()
    },
    keydownHandler(ev, pos: number) {
      ev.preventDefault()
      console.log('keydown prevented', ev, pos)
    },
    keyupHandler(ev, pos: number) {
      ev.preventDefault()
      const cursorPosition = ev.target.selectionStart
      this.changeValueAtPosition(pos, cursorPosition)
      console.log('keyup', ev, pos, 'cursor at:', cursorPosition)
    },
    changeValueAtPosition(increment: number, cursorPosition: number) {
      const currentDate = dayjs(this.control.data, this.optionPattern, true)

      if (!currentDate.isValid()) {
        // Si pas de date valide, utiliser la date actuelle
        const date = dayjs()
        this.onChange(date.format(this.optionPattern))
        return
      }

      // Détecter quelle partie de la date modifier selon la position du curseur
      const dateUnit = this.getDateUnitFromPosition(cursorPosition)
      const newDate = currentDate.add(increment, dateUnit)

      this.onChange(newDate.format(this.optionPattern))
      //console.log(`Value changed by ${increment} ${dateUnit} to`, newDate.format(this.optionPattern))
    },
    getDateUnitFromPosition(position: number): string {
      const pattern = this.optionPattern

      // Si position dépasse le pattern, utiliser la dernière position valide
      const safePosition = Math.min(position, pattern.length - 1)

      // Trouver le caractère de format à cette position ou proche
      let formatChar = pattern[safePosition]

      // Si c'est un séparateur, chercher le caractère de format le plus proche
      if (![...'YMDHms'].includes(formatChar)) {
        // Chercher vers la gauche d'abord
        for (let i = safePosition; i >= 0; i--) {
          if ([...'YMDHms'].includes(pattern[i])) {
            formatChar = pattern[i]
            break
          }
        }
        // Si pas trouvé, chercher vers la droite
        if (![...'YMDHms'].includes(formatChar)) {
          for (let i = safePosition; i < pattern.length; i++) {
            if ([...'YMDHms'].includes(pattern[i])) {
              formatChar = pattern[i]
              break
            }
          }
        }
      }

      console.log('Detected format char:', formatChar)

      // Mapper le caractère de format vers l'unité dayjs
      switch (formatChar) {
        case 'Y':
          return 'year'
        case 'M':
          return 'month'
        case 'D':
          return 'day'
        case 'H':
          return 'hour'
        case 'm':
          return 'minute'
        case 's':
          return 'second'
        default:
          return 'day' // fallback
      }
    },
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
