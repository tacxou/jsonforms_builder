import { registerExamples } from '../register'

export const schema = {
  type: 'object',
  properties: {
    readonly: {
      type: 'string',
      readOnly: true,
    },
    readonlyByUISchema: {
      type: 'string',
    },
    notReadonly: {
      type: 'string',
    },
  },
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/readonly',
      label: 'A readonly field',
    },
    {
      type: 'Control',
      scope: '#/properties/readonlyByUISchema',
      label: 'A readonly field by ui schema',
      options: {
        readonly: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/notReadonly',
      label: 'A normal field',
    },
  ],
}

export const data = {
  readonly: 'readonly by schema',
  readonlyByUISchema: 'readonly by ui schema',
  notReadonly: 'normal field',
}

registerExamples([
  {
    name: 'Readonly Fields',
    label: 'Readonly examples',
    data,
    schema,
    uischema,
  },
])
