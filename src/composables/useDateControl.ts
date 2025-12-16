import { computed, ref } from 'vue'
import { useQuasarControl } from '../utils'
import type { useJsonFormsControl } from '@jsonforms/vue'
import { isEmpty } from 'radash'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { ManipulateType } from 'dayjs'
import type { QPopupProxy } from 'quasar'

dayjs.extend(customParseFormat)

type JsonFormsControl = ReturnType<typeof useJsonFormsControl>

type UseDateControlOptions = {
  jsonFormsControl: JsonFormsControl
  clearValue: unknown
  debounceWait?: number
}

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss'

export const countPatternDigits = (pattern: string): number => {
  return pattern.replace(/[^YMDHms]/g, '').length
}

// 3️⃣ normalise les valeurs saisies pour comparaison stricte avec dayjs
export const normalizeDateValue = (
  value: string,
  pattern: string,
): string => {
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

    const normalizedDate = normalizeDateValue(datePart, DEFAULT_DATE_FORMAT)
    const normalizedTime = normalizeDateValue(timePart, DEFAULT_TIME_FORMAT)

    return `${normalizedDate}T${normalizedTime}`
  }

  return value
}

export const resolveDateInputType = (format?: string): 'date' | 'time' | 'datetime-local' => {
  if (format === 'date-time') return 'datetime-local'
  if (format === 'time') return 'time'
  return 'date'
}

export const detectDateUnitFromPosition = (
  pattern: string,
  position: number,
): ManipulateType => {
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
}

type DateKeyboardEvent = {
  preventDefault: () => void
  target: {
    selectionStart: number | null | undefined
  }
}

export const useDateControl = ({
  jsonFormsControl,
  clearValue,
  debounceWait = 100,
}: UseDateControlOptions) => {
  const adaptTarget = (value: unknown) => (isEmpty(value) ? clearValue : value)
  const control = useQuasarControl(jsonFormsControl, adaptTarget, debounceWait)

  const popupProxy = ref<QPopupProxy | null>(null)

  const rawFormat = computed(
    () =>
      control.control.value.schema?.format ??
      control.control.value.uischema?.options?.format ??
      'date',
  )

  const patternDefault = computed(() => {
    if (rawFormat.value === 'date-time') return DEFAULT_DATETIME_FORMAT
    if (rawFormat.value === 'time') return DEFAULT_TIME_FORMAT
    return DEFAULT_DATE_FORMAT
  })

  const optionPattern = computed(
    () => control.appliedOptions.value?.pattern || patternDefault.value,
  )

  const controlData = computed(() => {
    const date = dayjs(control.control.value.data, optionPattern.value, true)

    return date.format(patternDefault.value)
  })

  const maskPattern = computed(() => {
    const pattern = optionPattern.value

    return pattern.replace(/Y|M|D|H|m|s/g, '#')
  })

  const inputType = computed(() => resolveDateInputType(rawFormat.value))

  const normalizeValue = (value: string, pattern = patternDefault.value) => {
    return normalizeDateValue(value, pattern)
  }

  const onBlur = () => {
    control.isFocused.value = false
    console.log('controlData', controlData.value)

    const normalized = normalizeValue(controlData.value)
    const date = dayjs(normalized, patternDefault.value, true)

    if (!date.isValid()) {
      control.onChange(adaptTarget(undefined))
      console.log('Invalid date on blur, clearing value', controlData.value)
      return
    }

    // this.onChange(this.adaptTarget(this.controlData))
  }

  const onChangeDate = (value: string) => {
    // 1️⃣ Cas clear : l'utilisateur vide le champ -> on propage bien la valeur vide
    if (isEmpty(value)) {
      // adaptTarget va transformer "" en clearValue (null, undefined, peu importe ce que tu as configuré)
      control.onChange(adaptTarget(value))
      return
    }

    // 2️⃣ Tant que la saisie n'a pas rempli le pattern (mask), on ne fait RIEN
    //    -> ça évite que "13:" ou "13:5" déclenchent une normalisation en "13:00"
    const neededDigits = countPatternDigits(optionPattern.value)
    const currentDigits = value.replace(/\D/g, '').length

    console.log('aaaa', {
      optpat: optionPattern.value.replace(/[^YMDHms]/g, ''),
      curdig: value.replace(/\D/g, ''),
    })

    if (currentDigits < neededDigits) {
      console.log(
        'Waiting for complete input, current digits:',
        currentDigits,
        'needed:',
        neededDigits,
      )
      return
    }

    console.log('Processing complete input value:', value)

    // 3️⃣ Là seulement on normalise / parse / format
    const normalized = normalizeValue(value)
    const date = dayjs(normalized, optionPattern.value, true)

    if (!date.isValid()) {
      console.log('Invalid date entered, ignoring:', {
        value,
        normalized,
        patternDefault: patternDefault.value,
      })
      return
    }

    control.onChange(date.format(optionPattern.value))
    console.log('d', {
      value,
      date,
      optionPattern: optionPattern.value,
      patternDefault: patternDefault.value,
      format: date.format(optionPattern.value),
    })
    // this.popupProxy?.hide()
  }

  const changeValueAtPosition = (increment: number, cursorPosition: number) => {
    const currentDate = dayjs(control.control.value.data, optionPattern.value, true)

    if (!currentDate.isValid()) {
      // Si pas de date valide, utiliser la date actuelle
      const date = dayjs()
      control.onChange(date.format(optionPattern.value))
      return
    }

    // Détecter quelle partie de la date modifier selon la position du curseur
    const dateUnit = detectDateUnitFromPosition(optionPattern.value, cursorPosition)
    const newDate = currentDate.add(increment, dateUnit)

    control.onChange(newDate.format(optionPattern.value))
    //console.log(`Value changed by ${increment} ${dateUnit} to`, newDate.format(this.optionPattern))
  }

  const keydownHandler = (ev: DateKeyboardEvent, pos: number) => {
    ev.preventDefault()
    console.log('keydown prevented', ev, pos)
  }

  const keyupHandler = (ev: DateKeyboardEvent, pos: number) => {
    ev.preventDefault()
    const cursorPosition = ev.target.selectionStart ?? 0
    changeValueAtPosition(pos, cursorPosition)
    console.log('keyup', ev, pos, 'cursor at:', cursorPosition)
  }

  return {
    ...control,
    adaptTarget,
    popupProxy,
    optionPattern,
    controlData,
    maskPattern,
    inputType,
    patternDefault,
    normalizeValue,
    onBlur,
    onChangeDate,
    keydownHandler,
    keyupHandler,
    changeValueAtPosition,
    getDateUnitFromPosition: (position: number) =>
      detectDateUnitFromPosition(optionPattern.value, position),
  }
}
