<template lang="pug">
  control-wrapper(
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
    v-model:is-hovered="isHovered"
  )
    q-select(
      v-bind="quasarProps('q-select')"
      @update:model-value="onChange"
      @filter="onFilter"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :id="control.id + '-input'"
      :model-value="control.data"
      :label="computedLabel"
      :class="styles.control.input"
      clear-icon="mdi-trash"
      :disable="!control.enabled && !isReadonly"
      :readonly="isReadonly"
      :required="control.required"
      :placeholder="appliedOptions.placeholder"
      :hide-bottom-space="!!control.description"
  :options="optionsList || control.options || suggestions"
      option-value="value"
      option-label="label"
      :hint="control.description"
      :hide-hint="persistentHint()"
      :error="control.errors !== ''"
      :error-message="control.errors"
      :clearable="isClearable"
    new-value-mode='add-unique'
      :input-debounce="300"
      use-input
      use-chips
      hide-dropdown-icon
      map-options
      emit-value
      stack-label
      outlined
      dense
    )
      template(#no-option)
        q-item
          q-item-section
            q-item-label Aucun résultat
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  hasOption,
  or,
  isEnumControl,
} from '@jsonforms/core'
import { defineComponent } from 'vue'
import { rendererProps, RendererProps, useJsonFormsEnumControl } from '@jsonforms/vue'
import { ControlWrapper } from '../common'
import { determineClearValue, useQuasarControl } from '../utils'
import { isArray, isEmpty, isString, get, tryit } from 'radash'
import { ref } from 'vue'

const controlRenderer = defineComponent({
  name: 'SuggestionControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const clearValue = determineClearValue(undefined)
    const adaptTarget = (value) => (isEmpty(value) ? clearValue : value)
    const input = useQuasarControl(useJsonFormsEnumControl(props), adaptTarget, 100)
    const optionsList = ref<Array<{ label: string; value: any }>>([])
    const abortController = ref<AbortController | null>(null)

    const fetchOptions = async (search: string, uiOptions?: any) => {
      console.log('[autocomplete] fetchOptions search=', search)
      const opt = uiOptions ?? get(input as any, 'control.uischema.options', {})
      console.log('[autocomplete] setup uiOptions=', opt, 'control.id=', (input as any).control?.id)
      const api = opt.api ?? get(input as any, 'appliedOptions.api')
      const minLength = opt.minLength ?? get(input as any, 'appliedOptions.minLength') ?? 3
      if (!api || !api.url) {
        // No API config, fall back
        console.log('[autocomplete] no api config, fallback to suggestions/control.options')
        optionsList.value = []
        return
      }
      if (!search || search.length < minLength) {
        console.log('[autocomplete] below minLength, clearing optionsList')
        optionsList.value = []
        return
      }

      const queryKey = api.queryKey ?? 'q'
      const labelKey = api.labelKey ?? 'label'
      const valueKey = api.valueKey ?? 'value'
      const extraParams = api.params ?? {}
      const url = api.base ? new URL(api.url, api.base) : new URL(api.url)
      url.searchParams.set(queryKey, search)
      Object.entries(extraParams).forEach(([k, v]) => url.searchParams.set(k, String(v)))

      // cancel previous request
      if (abortController.value) {
        abortController.value.abort()
      }
      abortController.value = new AbortController()
      try {
        console.log('[autocomplete] fetching URL:', url.toString())
        const [err, data] = await tryit(async () => {
          const res = await fetch(url.toString(), {
            signal: abortController.value!.signal,
            headers: api.headers ?? {},
          })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })()
        if (err) throw err
        console.log('[autocomplete] response data:', data)
        const rawItems = api.itemsPath ? get(data, api.itemsPath) : data
        const items = Array.isArray(rawItems) ? rawItems : []
        console.log('[autocomplete] items length:', items.length)
        optionsList.value = items.map((it: any) => ({
          label: String((labelKey ? get(it, labelKey) : undefined) ?? it?.toString?.() ?? ''),
          value: (valueKey ? get(it, valueKey) : undefined) ?? it,
        }))
        console.log('[autocomplete] optionsList set:', optionsList.value)
      } catch (e) {
        console.warn('[autocomplete] API error:', e)
        optionsList.value = []
      }
    }

    return {
      ...input,
      adaptTarget,
      optionsList,
      fetchOptions,
    }
  },
  computed: {
    suggestions(): Array<{ label: string; value: any }> | undefined {
      const suggestions = this.control.uischema.options?.suggestion

      if (!suggestions) {
        return undefined
      }

      if (!isArray(suggestions)) {
        console.warn('Suggestions must be an array')
        return undefined
      }

      const validSuggestions = suggestions
        .filter((suggestion) => {
          if (isString(suggestion)) {
            return true
          }
          if (suggestion != null && typeof suggestion.toString === 'function') {
            return true
          }
          console.warn('Invalid suggestion item:', suggestion)
          return false
        })
        .map((suggestion) => {
          const label = isString(suggestion) ? suggestion : suggestion.toString()
          return { label, value: label }
        })

      return !isEmpty(validSuggestions) ? validSuggestions : undefined
    },
  },
  methods: {
    onFilter(val: string, update: (fn: () => void) => void, abort: () => void) {
      console.log('[autocomplete] onFilter value=', val)
      const uiOptions = get(this as any, 'control.uischema.options', {})
      console.log('[autocomplete] onFilter uiOptions=', uiOptions, 'control.id=', this.control?.id)
      const api = get(uiOptions as any, 'api') ?? get(this as any, 'appliedOptions.api')
      const minLength = Number(get(uiOptions as any, 'minLength') ?? get(this as any, 'appliedOptions.minLength') ?? 1)
      update(async () => {
        if (!val || val.length < minLength) {
          console.log('[autocomplete] onFilter below minLength, restore static options')
          if (Array.isArray(this.control?.options)) {
            this.optionsList = this.control.options
          } else {
            this.optionsList = []
          }
          return
        }
        if (!api) {
          console.log('[autocomplete] no api, using client-side filter on control.options')
          const base = Array.isArray(this.control?.options) ? this.control.options : []
          const lowered = String(val).toLowerCase()
          this.optionsList = base.filter((opt: any) => {
            const label = typeof opt === 'string' ? opt : (opt?.label ?? String(opt))
            return String(label).toLowerCase().includes(lowered)
          })
          return
        }
        await this.fetchOptions(val, uiOptions)
      })
    },
  },
})

export default controlRenderer

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  // prettier-ignore
  tester: rankWith(2,
    and(
      isStringControl,
      hasOption('api'),
    ),
  ), // Matches string controls with 'api' option defined
}
</script>
