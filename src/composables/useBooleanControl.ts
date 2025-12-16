import { computed } from 'vue'
import { useQuasarControl } from '../utils'

type QuasarControlInput = Parameters<typeof useQuasarControl>[0]

type UseBooleanControlOptions = {
  jsonFormsControl: QuasarControlInput
  debounceWait?: number
}

export const useBooleanControl = ({
  jsonFormsControl,
  debounceWait,
}: UseBooleanControlOptions) => {
  const control = useQuasarControl(jsonFormsControl, undefined, debounceWait)

  const modelValue = computed(() => control.control.value.data)
  const disable = computed(() =>
    resolveBooleanDisable(control.control.value.enabled, control.isReadonly.value),
  )

  return {
    ...control,
    modelValue,
    disable,
  }
}

export const resolveBooleanDisable = (enabled: boolean, isReadonly: boolean) => {
  return !enabled && !isReadonly
}
