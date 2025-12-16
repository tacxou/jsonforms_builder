import { registerExamples } from '../register'

export const schema = {
  type: 'object',
  properties: {
    departmentNumber: {
      type: 'array',
      description: 'EmployeeNumber of the inetOrgPerson.',
      items: {
        type: 'string',
      },
    },
    simpleDepartment: {
      type: 'string',
      description: 'EmployeeNumber of the inetOrgPerson.',
    },
  },
  required: ['departmentNumber'],
}

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Label',
      text: 'InetOrgPerson Information',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/departmentNumber',
          options: {
            suggestion: ['etd', 'esn', 'adm'],
          },
        },
        {
          type: 'Control',
          scope: '#/properties/simpleDepartment',
          options: {
            suggestion: ['etd', 'esn', 'adm'],
          },
        },
      ],
    },
  ],
}

const data = {
  departmentNumber: ['etd'],
}

const config = {
  defaultValue: null,
}

registerExamples([
  {
    name: 'array-items',
    label: 'Array Items',
    data,
    config,
    schema,
    uischema,
  },
])
