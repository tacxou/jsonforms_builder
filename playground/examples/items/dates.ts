import { registerExamples } from '../register'

export const schema = {
  type: 'object',
  properties: {
    schemaBased: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date',
          description: 'schema-based date picker',
        },
        time: {
          type: 'string',
          format: 'time',
          description: 'schema-based time picker',
          pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
        },
        datetime: {
          type: 'string',
          format: 'date-time',
          description: 'schema-based datetime picker',
        },
      },
    },
    uiSchemaBased: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'does not allow to select days',
        },
        time: {
          type: 'string',
          description: '24 hour format',
        },
        datetime: {
          type: 'string',
          description: 'uischema-based datetime picker',
        },
      },
    },
  },
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/schemaBased/properties/date',
        },
        {
          type: 'Control',
          scope: '#/properties/schemaBased/properties/time',
          options: {
            pattern: 'HH:mm',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/schemaBased/properties/datetime',
          options: {
            pattern: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
          },
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/date',
          label: 'Year Month Picker',
          options: {
            format: 'date',
            // clearLabel: 'Clear it!',
            // cancelLabel: 'Abort',
            // okLabel: 'Do it',
            // views: ['year', 'month'],
            pattern: 'YYYY.MM',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/time',
          options: {
            format: 'time',
            // ampm: true,
          },
        },
        {
          type: 'Control',
          scope: '#/properties/uiSchemaBased/properties/datetime',
          // options: {
          //   format: 'date-time',
          //   dateTimeFormat: 'DD-MM-YY hh:mm:a',
          //   dateTimeSaveFormat: 'YYYY/MM/DD h:mm a',
          //   ampm: true,
          // },
          options: {
            format: 'date-time',
            pattern: 'YYYY-MM-DDTHH:mm',
          },
        },
      ],
    },
  ],
}

export const data = {
  schemaBased: {
    date: new Date().toISOString().substr(0, 10),
    time: '13:37',
    datetime: new Date().toISOString(),
  },
  uiSchemaBased: {
    date: '2024.01',
    time: '13:37:00',
    datetime: '1999-12-11T10:05',
  },
}

registerExamples([
  {
    name: 'dates',
    label: 'Dates',
    data,
    schema,
    uischema,
  },
])
