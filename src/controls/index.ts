export { default as ControlWrapper } from '../common/control-wrapper.vue'
export { default as StringControlRenderer } from './string.vue'
export { default as BooleanControlRenderer } from './boolean.vue'
export { default as DateControlRenderer } from './date.vue'
// export { default as DateTimeControlRenderer } from './date-time.vue'
export { default as PasswordControlRenderer } from './password.vue'
export { default as SliderControlRenderer } from './slider.vue'
export { default as EnumAndSuggestionControlRenderer } from './enum-and-suggestion.vue'
export { default as RadioGroupControlRenderer } from './radio-group.vue'
export { default as numericControlRenderer } from './numeric.vue'
export { default as MultiStringControlRenderer } from './multi-string.vue'
export { default as AutocompleteControlRenderer } from './autocomplete.vue'

import { entry as stringControlRendererEntry } from './string.vue'
import { entry as booleanControlRendererEntry } from './boolean.vue'
import { entry as dateControlRendererEntry } from './date.vue'
// import { entry as dateTimeControlRendererEntry } from './date-time.vue'
import { entry as passwordControlRendererEntry } from './password.vue'
import { entry as sliderControlRendererEntry } from './slider.vue'
import { entry as enumAndSuggestionControlRenderer } from './enum-and-suggestion.vue'
import { entry as radioGroupControlRenderer } from './radio-group.vue'
import { entry as numericControlRendererEntry } from './numeric.vue'
import { entry as multiStringControlRendererEntry } from './multi-string.vue'
import { entry as autocompleteControlRendererEntry } from './autocomplete.vue'

export const controlsRenderers = [
  stringControlRendererEntry,
  booleanControlRendererEntry,
  dateControlRendererEntry,
  // dateTimeControlRendererEntry,
  passwordControlRendererEntry,
  sliderControlRendererEntry,
  enumAndSuggestionControlRenderer,
  radioGroupControlRenderer,
  numericControlRendererEntry,
  multiStringControlRendererEntry,
  autocompleteControlRendererEntry,
]
