import { useRef, useEffect, DependencyList } from 'react'

export const useToggleEffect = (
  condition: () => boolean | null | undefined,
  effect: () => (void | (() => void)),
  deps?: DependencyList | undefined
) => {
  const isSet = useRef<boolean>(false),
        reset = useRef<void | (() => void)>()

  useEffect(() => {
    const conditionResult = condition()
    if (!isSet.current && conditionResult) {
      // toggle set
      isSet.current = true
      reset.current = effect()

    } else if (isSet.current && !conditionResult) {
      // toggle reset
      isSet.current = false
      if (reset.current) {
        reset.current()
      }
    }
  }, deps)
}