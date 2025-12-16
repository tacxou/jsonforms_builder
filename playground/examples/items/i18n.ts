import { registerExamples } from '../register'
import { personCoreSchema } from './person'

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      i18n: 'basicInfoGroup',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
          i18n: 'name',
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate',
        },
      ],
    },
    {
      type: 'Label',
      text: 'additionalInformationLabel',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/nationality',
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarian',
        },
      ],
    },
  ],
}

export const data = {
  vegetarian: false,
  birthDate: '1985-06-02',
  personalData: {
    age: 34,
  },
  postalCode: '12345',
}

export const i18n = {
  fr: {
    birthDate: {
      label: 'Date de naissance',
      description: 'Veuillez entrer votre date de naissance',
    },
    name: {
      label: 'Nom',
      description: 'Veuillez entrer votre nom',
    },
    nationality: {
      label: 'Nationalité',
      description: 'Veuillez sélectionner votre nationalité',
    },
    vegetarian: {
      label: 'Végétarien',
      description: 'Cochez si vous êtes végétarien',
    },
    additionalInformationLabel: 'Informations supplémentaires',
    basicInfoGroup: 'Informations de base',
  },
  en: {
    birthDate: {
      label: 'Birth Date',
      description: 'Please enter your birth date',
    },
    name: {
      label: 'Name',
      description: 'Please enter your name',
    },
    basicInfoGroup: 'Basic Information',
  },
}

registerExamples([
  {
    name: 'i18n',
    label: 'Person (i18n)',
    data,
    schema: personCoreSchema,
    uischema,
    i18n,
  },
])
