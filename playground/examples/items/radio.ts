/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { registerExamples } from '../register';

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
]);
