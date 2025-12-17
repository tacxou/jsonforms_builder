import { registerExamples } from '../register'

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    propertiesString: {
      type: 'string',
    },
  },
  propertyNames: {
    minLength: 2,
  },
  patternProperties: {
    '^string$': {
      type: 'string',
    },
    '^number$': {
      type: 'number',
    },
    '^integer$': {
      type: 'integer',
    },
    '^object$': {
      type: 'object',
      properties: {
        prop1: {
          type: 'string',
        },
      },
    },
    '^boolean$': {
      type: 'boolean',
    },
    '^stringArray$': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    '^numberArray$': {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    '^integerArray$': {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    '^objectArray$': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          prop1: {
            type: 'string',
          },
        },
      },
    },
    '^booleanArray$': {
      type: 'array',
      items: {
        type: 'boolean',
      },
    },
  },
  additionalProperties: {
    type: 'string',
    title: 'Additional Properties',
  },
  maxProperties: 15,
}

export const uischema = {
  type: 'Control',
  scope: '#/',
}

const data = {
  propertiesString: 'data',
  string: 'string value',
  number: 10.2,
  integer: 11,
  object: {
    prop1: 'prop 1 value',
  },
  boolean: true,
  stringArray: ['value1', 'value2'],
  numberArray: [12.2],
  integerArray: [33],
  objectArray: [{ prop1: 'prop1 val' }, {}],
  booleanArray: [false, true],
}

registerExamples([
  {
    name: 'additional-properties',
    label: 'Additional Properties',
    data,
    schema,
    uischema,
  },
])
