import { registerExamples } from '../register'

export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    message: {
      type: 'string',
      minLength: 10,
    },
  },
  required: ['name', 'email', 'message'],
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
      label: 'Full Name',
    },
    {
      type: 'Control',
      scope: '#/properties/email',
      label: 'Email Address',
    },
    {
      type: 'Control',
      scope: '#/properties/message',
      label: 'Your Message',
      options: {
        multi: true,
      },
    },
  ],
}

export const data = {
  name: 'Jean',
  email: '',
  message: '',
}

registerExamples([
  {
    name: 'simple-form',
    label: 'Simple Contact Form',
    data,
    schema,
    uischema,
  },
])
