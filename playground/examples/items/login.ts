import { registerExamples } from '../register'

export const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description: 'Login Name',
    },
    password: {
      type: 'string',
      format: 'password',
      description: 'Login password',
    },
  },
  required: ['username', 'password'],
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'Login Information',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/username',
        },
        {
          type: 'Control',
          scope: '#/properties/password',
          options: {
            props: {
              // autocomplete: 'current-password',
            },
          },
        },
      ],
    },
  ],
}

const data = {
  username: 'john.doe@email.com',
}

const config = {
  props: {
    autocomplete: 'current-password',
  },
  'q-input': {
    dense: false,
  },
}

registerExamples([
  {
    name: 'login',
    label: 'Login Form',
    data,
    config,
    schema,
    uischema,
  },
])
