import { computed, ref } from 'vue'
import { get, isArray } from 'radash'
import { useQuasarControl } from '../utils'
import type { useJsonFormsEnumControl } from '@jsonforms/vue'
import {
  createEnumAdaptTarget,
  normalizeSuggestions,
} from './useEnumSuggestionControl'

export interface AutocompleteApiConfig {
  url: string
  base?: string
  queryKey?: string
  labelKey?: string
  valueKey?: string
  itemsPath?: string
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

type JsonFormsEnumControl = ReturnType<typeof useJsonFormsEnumControl>

type UseAutocompleteControlOptions = {
  jsonFormsControl: JsonFormsEnumControl
  clearValue: unknown
  debounceWait?: number
  defaultMinLength?: number
}

export const resolveAutocompleteMinLength = (
  uiOptions: any,
  appliedOptions: any,
  fallback: number,
): number => {
  const uiValue = Number(uiOptions?.minLength)
  if (!Number.isNaN(uiValue) && uiValue > 0) {
    return uiValue
  }

  const appliedValue = Number(appliedOptions?.minLength)
  if (!Number.isNaN(appliedValue) && appliedValue > 0) {
    return appliedValue
  }

  return fallback
}

export const mapSuggestionsToOptions = (
  suggestions: string[] | undefined,
): Array<{ label: string; value: string }> | undefined => {
  if (!suggestions?.length) {
    return undefined
  }

  return suggestions.map((label) => ({ label, value: label }))
}

export const extractAutocompleteApiConfig = (
  uiOptions: any,
  appliedOptions: any,
): AutocompleteApiConfig | undefined => {
  const api = uiOptions?.api ?? appliedOptions?.api
  if (!api?.url) {
    return undefined
  }

  return api
}

export const buildAutocompleteRequest = (
  api: AutocompleteApiConfig,
  search: string,
): { url: string; headers: Record<string, string> } => {
  const baseUrl = api.base ? new URL(api.url, api.base) : new URL(api.url)
  const queryKey = api.queryKey ?? 'q'
  baseUrl.searchParams.set(queryKey, search)

  if (api.params) {
    Object.entries(api.params).forEach(([key, value]) => {
      baseUrl.searchParams.set(key, String(value))
    })
  }

  return {
    url: baseUrl.toString(),
    headers: api.headers ?? {},
  }
}

export const resolveFetchedOptions = (
  items: any[],
  api: AutocompleteApiConfig,
): Array<{ label: string; value: unknown }> => {
  const labelKey = api.labelKey ?? 'label'
  const valueKey = api.valueKey ?? 'value'

  return items.map((item) => {
    const label = get(item, labelKey)
    const value = get(item, valueKey)

    return {
      label: String(label ?? item?.toString?.() ?? ''),
      value: value ?? item,
    }
  })
}

const isArrayOfOptions = (options: unknown): options is any[] => {
  return Array.isArray(options)
}

const getStaticOptions = (control: JsonFormsEnumControl['control']['value']) => {
  return isArrayOfOptions(control.options) ? control.options : []
}

const filterOptionsBySearch = (options: any[], search: string) => {
  const lowered = search.toLowerCase()

  return options.filter((option) => {
    if (typeof option === 'string') {
      return option.toLowerCase().includes(lowered)
    }

    const label = option?.label ?? option?.toString?.()
    return typeof label === 'string' && label.toLowerCase().includes(lowered)
  })
}

export const useAutocompleteControl = ({
  jsonFormsControl,
  clearValue,
  debounceWait = 100,
  defaultMinLength = 3,
}: UseAutocompleteControlOptions) => {
  const adaptTarget = createEnumAdaptTarget(clearValue)
  const control = useQuasarControl(jsonFormsControl, adaptTarget, debounceWait)

  const optionsList = ref<any[]>([])
  const abortController = ref<AbortController | null>(null)

  const suggestions = computed(() => {
    const normalized = normalizeSuggestions(
      control.control.value.uischema.options?.suggestion,
    )

    return mapSuggestionsToOptions(normalized)
  })

  const modelValue = computed(() => control.control.value.data)

  const minLength = computed(() =>
    resolveAutocompleteMinLength(
      control.control.value.uischema.options,
      control.appliedOptions.value,
      defaultMinLength,
    ),
  )

  const selectOptions = computed(() => {
    if (optionsList.value.length > 0) {
      return optionsList.value
    }

    const staticOptions = getStaticOptions(control.control.value)
    if (staticOptions.length > 0) {
      return staticOptions
    }

    return suggestions.value ?? []
  })

  const clearPendingRequest = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  const fetchOptions = async (search: string, uiOptions?: any) => {
    console.log('[autocomplete] fetchOptions search=', search)
    const apiConfig = extractAutocompleteApiConfig(
      uiOptions,
      control.appliedOptions.value,
    )

    if (!apiConfig) {
      console.log('[autocomplete] no api config, fallback to static options')
      optionsList.value = []
      return
    }

    const request = buildAutocompleteRequest(apiConfig, search)

    clearPendingRequest()
    abortController.value = new AbortController()

    try {
      console.log('[autocomplete] fetching URL:', request.url)
      const response = await fetch(request.url, {
        signal: abortController.value.signal,
        headers: request.headers,
      })

      if (!response.ok) {
        console.warn('[autocomplete] HTTP error:', response.status)
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const rawItems = apiConfig.itemsPath ? get(data, apiConfig.itemsPath) : data
      const items = isArray(rawItems) ? rawItems : []
      console.log('[autocomplete] items length:', items.length)
      optionsList.value = resolveFetchedOptions(items, apiConfig)
      console.log('[autocomplete] optionsList set:', optionsList.value)
    } catch (error) {
      console.warn('[autocomplete] API error:', error)
      optionsList.value = []
    }
  }

  const onFilter = (
    value: string,
    update: (fn: () => void) => void,
    abort: () => void,
  ) => {
    console.log('[autocomplete] onFilter value=', value)
    update(async () => {
      if (!value || value.length < minLength.value) {
        console.log('[autocomplete] onFilter below minLength, restoring static options')
        optionsList.value = getStaticOptions(control.control.value)
        return
      }

      const uiOptions = control.control.value.uischema.options
      const apiConfig = extractAutocompleteApiConfig(
        uiOptions,
        control.appliedOptions.value,
      )

      if (!apiConfig) {
        console.log('[autocomplete] onFilter using client-side filtering')
        const staticOptions = getStaticOptions(control.control.value)
        optionsList.value = filterOptionsBySearch(staticOptions, value)
        return
      }

      console.log('[autocomplete] onFilter fetching remote options')
      await fetchOptions(value, uiOptions)
    })
  }

  return {
    ...control,
    adaptTarget,
    optionsList,
    selectOptions,
    suggestions,
    minLength,
    fetchOptions,
    onFilter,
    modelValue,
  }
}
