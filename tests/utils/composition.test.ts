import { describe, expect, it } from 'bun:test'
import { computed, createApp } from 'vue'
import {
  isFieldReadonly,
  useControlAppliedOptions,
  useComputedLabel,
  useLayoutAppliedOptions,
  determineClearValue,
} from '../../src/utils/composition'
import { IsDynamicPropertyContext } from '../../src/utils/inject'

describe('isFieldReadonly', () => {
  it('detects readonly from uischema options', () => {
    const schema = { type: 'string' }
    const uischema = { options: { readonly: true } }

    expect(isFieldReadonly(schema, uischema)).toBe(true)
  })

  it('detects readOnly from schema', () => {
    const schema = { type: 'string', readOnly: true }
    const uischema = { options: {} }

    expect(isFieldReadonly(schema, uischema)).toBe(true)
  })

  it('returns false when neither flag is set', () => {
    const schema = { type: 'string' }
    const uischema = { options: {} }

    expect(isFieldReadonly(schema, uischema)).toBe(false)
  })
})

describe('useControlAppliedOptions', () => {
  it('merges control config with uischema options without mutation', () => {
    const control = computed(() => ({
      config: {
        dense: true,
        nested: { slot: 'base' },
      },
      uischema: {
        options: {
          dense: false,
          append: true,
          nested: { slot: 'override' },
        },
      },
    }))

    const applied = useControlAppliedOptions({ control })

    expect(applied.value.dense).toBe(false)
    expect(applied.value.append).toBe(true)
    expect(applied.value.nested.slot).toBe('override')
    expect(control.value.config.nested.slot).toBe('base')
  })
})

describe('useComputedLabel', () => {
  it('retains required asterisk by default', () => {
    const control = computed(() => ({
      label: 'Name',
      required: true,
      config: {},
      uischema: { options: {} },
    }))

    const applied = useControlAppliedOptions({ control })
    const label = useComputedLabel({ control }, applied)

    expect(label.value.endsWith('*')).toBe(true)
  })

  it('hides required asterisk when disabled', () => {
    const control = computed(() => ({
      label: 'Name',
      required: true,
      config: { hideRequiredAsterisk: true },
      uischema: { options: {} },
    }))

    const applied = useControlAppliedOptions({ control })
    const label = useComputedLabel({ control }, applied)

    expect(label.value).toBe('Name')
  })
})

describe('useLayoutAppliedOptions', () => {
  it('merges layout config with options copies', () => {
    const layout = computed(() => ({
      config: {
        gap: '16px',
        dense: false,
      },
      uischema: {
        options: {
          dense: true,
          direction: 'column',
        },
      },
    }))

    const applied = useLayoutAppliedOptions({ layout })

    expect(applied.value.gap).toBe('16px')
    expect(applied.value.dense).toBe(true)
    expect(applied.value.direction).toBe('column')
    expect(layout.value.config.dense).toBe(false)
  })
})

describe('determineClearValue', () => {
  it('returns default when dynamic context defaults to true', () => {
    const app = createApp({})
    app.provide('jsonforms', { core: { schema: { type: 'string' } } })

    let result: any
    app.runWithContext(() => {
      result = determineClearValue('fallback')
    })

    expect(result).toBe('fallback')
  })

  it('respects explicit dynamic property context override', () => {
    const app = createApp({})
    app.provide('jsonforms', { core: { schema: { type: 'object' } } })
    app.provide(IsDynamicPropertyContext, false)

    let result: any
    app.runWithContext(() => {
      result = determineClearValue('fallback')
    })

    expect(result).toBeUndefined()
  })
})
