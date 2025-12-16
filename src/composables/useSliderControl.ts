import { computed } from 'vue'
import { isNumber } from 'radash'
import { useQuasarControl } from '../utils'

type QuasarControlInput = Parameters<typeof useQuasarControl>[0]

type UseSliderControlOptions = {
  jsonFormsControl: QuasarControlInput
  clearValue: number
  debounceWait?: number
}

export const createSliderAdaptTarget = (clearValue: number) => {
  return (value: unknown): number => {
    if (value === null || value === undefined || value === '') {
      return clearValue
    }

    if (isNumber(value)) {
      return value
    }

    const numeric = Number(value)
    return Number.isNaN(numeric) ? clearValue : numeric
  }
}

export const resolveSliderMin = (schemaMinimum: number | undefined): number | undefined => {
  return schemaMinimum
}

export const resolveSliderMax = (schemaMaximum: number | undefined): number | undefined => {
  return schemaMaximum
}

export const resolveSliderStep = (multipleOf: number | undefined): number => {
  return multipleOf ?? 1
}

export const useSliderControl = ({
  jsonFormsControl,
  clearValue,
  debounceWait,
}: UseSliderControlOptions) => {
  const adaptTarget = createSliderAdaptTarget(clearValue)
  const control = useQuasarControl(jsonFormsControl, adaptTarget, debounceWait)

  const min = computed(() => resolveSliderMin(control.control.value.schema?.minimum))
  const max = computed(() => resolveSliderMax(control.control.value.schema?.maximum))
  const step = computed(() => resolveSliderStep(control.control.value.schema?.multipleOf))
  const modelValue = computed(() => control.control.value.data)

  return {
    ...control,
    adaptTarget,
    min,
    max,
    step,
    modelValue,
  }
}
