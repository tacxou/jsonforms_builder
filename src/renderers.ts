import { additionalsRenderers } from './additional'
import { controlsRenderers } from './controls'
import { layoutsRenderers } from './layouts'
import { advancedRenderers } from './advanced'

export { advancedRenderers }

export const quasarRenderers = [
  ...controlsRenderers,
  ...layoutsRenderers,
  ...additionalsRenderers,
]

export const allRenderers = [
  ...quasarRenderers,
  ...advancedRenderers,
]
