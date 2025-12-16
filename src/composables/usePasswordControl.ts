import { ref } from 'vue'
import { useStringControl } from './useInputControl'

export const createPasswordVisibilityRef = () => {
  return ref(false)
}

type UsePasswordControlOptions = Parameters<typeof useStringControl>[0]

export const usePasswordControl = (options: UsePasswordControlOptions) => {
  const passwordVisible = createPasswordVisibilityRef()
  const control = useStringControl(options)

  return {
    ...control,
    passwordVisible,
  }
}
