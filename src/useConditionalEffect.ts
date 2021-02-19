import { useEffect, EffectCallback, DependencyList } from 'react'

export const useConditionalEffect = (
  condition: () => boolean | null | undefined,
  effect: EffectCallback,
  deps?: DependencyList | undefined
) => {
  useEffect(() => {
    if (condition()) {
      return effect()
    }
  }, deps)
}