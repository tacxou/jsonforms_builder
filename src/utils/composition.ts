import { computeLabel, ControlElement, DispatchPropsOfControl, DispatchPropsOfMultiEnumControl, isDescriptionHidden, JsonFormsSubStates, JsonSchema, UISchemaElement } from '@jsonforms/core'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'
import { computed, ComputedRef, inject, ref } from 'vue'
import { useStyles } from '../styles'
import { IsDynamicPropertyContext } from './inject'

/**
 * Vérifie si un champ est en lecture seule en tenant compte de la compatibilité
 * avec les différentes versions de JSON Schema
 */
const isFieldReadonly = (schema: JsonSchema, uischema: any): boolean => {
  // Vérification de la propriété readonly dans le uischema (toujours supportée)
  if (uischema?.options?.readonly === true) {
    return true
  }

  // Vérification de la propriété readOnly dans le schema
  // Cette propriété n'existe que depuis JSON Schema Draft 6
  // En JSON Schema v4, cette propriété n'est pas disponible
  if (schema && 'readOnly' in schema && (schema as any).readOnly === true) {
    return true
  }

  return false
}

export const useControlAppliedOptions = <
  T extends { config: any; uischema: UISchemaElement },
  I extends {
    control: ComputedRef<T>,
  },
>(
  input: I,
) => {
  return computed(() =>
    merge(
      {},
      cloneDeep(input.control.value.config),
      cloneDeep(input.control.value.uischema.options),
    ),
  )
}

export const useLayoutAppliedOptions = <
  T extends { config: any; uischema: UISchemaElement },
  I extends {
    layout: ComputedRef<T>,
  },
>(
  input: I,
) => {
  return computed(() =>
    merge(
      {},
      cloneDeep(input.layout.value.config),
      cloneDeep(input.layout.value.uischema.options),
    ),
  )
}

export const useComputedLabel = <
  T extends { label: string; required: boolean },
  I extends { control: ComputedRef<T> },
>(
  input: I,
  appliedOptions: ReturnType<typeof useControlAppliedOptions>,
) => {
  return computed((): string => {
    return computeLabel(
      input.control.value.label,
      input.control.value.required,
      !!appliedOptions.value?.hideRequiredAsterisk,
    )
  })
}

export const useQuasarLabel = <
  T extends {
    uischema: UISchemaElement,
    config: any,
  },
  I extends {
    label: ComputedRef<T>,
  },
>(
  input: I,
) => {
  const styles = useStyles(input.label.value.uischema)
  const appliedOptions = computed(() =>
    merge(
      {},
      cloneDeep(input.label.value.config),
      cloneDeep(input.label.value.uischema.options),
    ),
  )
  const quasarProps = (path: string) => {
    const props = get(appliedOptions.value, path)

    return props && isPlainObject(props) ? props : {}
  }

  return {
    ...input,
    appliedOptions,
    quasarProps,
    styles,
  }
}

export const useQuasarControl = <
  T extends {
    schema: NonNullable<JsonSchema>
    uischema: ControlElement
    path: string
    config: any
    label: string
    description: string
    required: boolean
    enabled: boolean
    errors: string
    data: any
    id: string
    visible: boolean
  },
  I extends {
    control: ComputedRef<T>
  } & (DispatchPropsOfControl | DispatchPropsOfMultiEnumControl),
>(
  input: I,
  adaptTarget: (target: any) => any = (v) => v,
  debounceWait?: number,
) => {
  const touched = ref(false)

  const changeEmitter =
    typeof debounceWait === 'number' &&
      (input as DispatchPropsOfControl).handleChange
      ? debounce((input as DispatchPropsOfControl).handleChange, debounceWait)
      : (input as DispatchPropsOfControl).handleChange

  const onChange = (value: any) => {
    if (changeEmitter) {
      changeEmitter(input.control.value.path, adaptTarget(value))
    }
  }

  const appliedOptions = useControlAppliedOptions(input)
  const isFocused = ref(false)

  const handleFocus = () => {
    isFocused.value = true
  }

  const handleBlur = () => {
    touched.value = true
    isFocused.value = false
  }

  const filteredErrors = computed(() => {
    return touched.value || !appliedOptions.value.enableFilterErrorsBeforeTouch
      ? input.control.value.errors
      : ''
  })

  const persistentHint = (): boolean => {
    return !isDescriptionHidden(
      input.control.value.visible,
      input.control.value.description,
      isFocused.value,
      !!appliedOptions.value?.showUnfocusedDescription,
    )
  }

  const isHovered = ref(false)

  const isClearable = computed(() => {
    if (appliedOptions.value?.clearable !== undefined) {
      return appliedOptions.value.clearable
    }

    return isHovered.value || isFocused.value
  })

  const controlWrapper = computed(() => {
    const { description, errors, label, visible, required } = input.control.value
    const id = input.control.value.id.replace(/#\//g, '').replace(/\//g, '_')

    return { id, description, errors, label, visible, required }
  })

  const computedLabel = useComputedLabel(input, appliedOptions)

  const styles = useStyles(input?.control?.value?.uischema)

  const quasarProps = (path: string) => {
    const props = get(appliedOptions.value, path)

    return props && isPlainObject(props) ? props : {}
  }

  const overwrittenControl = computed(() => {
    return {
      ...input.control.value,
      errors: filteredErrors.value,
    }
  })

  const rawErrors = computed(() => input.control.value.errors)

  const isReadonly = computed(() => {
    if (input.control.value.config?.readonly === true) {
      return true
    }

    return isFieldReadonly(
      input.control.value?.schema,
      input.control.value?.uischema,
    )
  })

  return {
    ...input,
    control: overwrittenControl,
    styles,
    isFocused,
    appliedOptions,
    controlWrapper,
    computedLabel,
    touched,
    quasarProps,
    persistentHint,
    handleBlur,
    handleFocus,
    onChange,
    rawErrors,
    isHovered,
    isClearable,
    isReadonly,
  }
}

export const useQuasarLayout = <I extends { layout: any }>(input: I) => {
  const appliedOptions = computed(() =>
    merge(
      {},
      structuredClone(input.layout.value.config),
      structuredClone(input.layout.value.uischema.options),
    ),
  )

  return {
    ...input,
    styles: useStyles(input.layout.value.uischema),
    appliedOptions,
  }
}

export const useVanillaLabel = <I extends { label: any }>(input: I) => {
  const appliedOptions = computed(() =>
    merge(
      {},
      cloneDeep(input.label.value.config),
      cloneDeep(input.label.value.uischema.options),
    )
  )

  return {
    ...input,
    styles: useStyles(input.label.value.uischema),
    appliedOptions,
  }
}

export const useJsonForms = () => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms')

  if (!jsonforms) {
    throw new Error(
      "jsonforms couldn't be injected. Are you within JSON Forms?",
    )
  }

  return jsonforms
}

export const determineClearValue = (defaultValue: any) => {
  const jsonforms = useJsonForms()
  const useDefaultValue = inject<boolean>(
    IsDynamicPropertyContext,
    jsonforms.core?.schema.type !== 'object',
  )

  return useDefaultValue ? defaultValue : undefined
}

export { isFieldReadonly }
