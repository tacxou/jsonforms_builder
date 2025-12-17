import { registerExamples } from '../register'

export const schema = {
  "type": "object",
  "properties": {
    "exampleRadioEnum": {
      "type": "string",
      "enum": ["Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Black", "White"],
    }
  }
}

export const uischema = {
  "type": "Control",
  "scope": "#/properties/exampleRadioEnum",
  "options": {
    "format": "radio",
    "quasar": {
      "q-option-group": {
        "prepend-icon": "mdi-palette",
        "column": false,
        "row": true
      },
      "v-radio": {
        "Blue": {
          "color": "blue"
        },
        "Red": {
          "color": "red"
        },
        "Green": {
          "color": "green"
        }
      }
    }
  }
}

export const data = {
  exampleRadioEnum: 'Green',
}

registerExamples([
  {
    name: 'Radio',
    label: 'Radio Example',
    data,
    schema,
    uischema,
  },
])
