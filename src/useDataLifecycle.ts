import { useState, useEffect } from 'react'

export const useDataLifecycle = (
  data: any,
  init?: (data: any) => void,
  draw?: (data: any) => void,
  clear?: () => void,
  dataIsValid: (data: any) => boolean = (data: any) => !!data || data === 0
) => {
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    const isValid = dataIsValid(data)

    if (!initialized && isValid) {
      init?.(data)
      setInitialized(true)
    }

    if (isValid) {
      draw?.(data)
    }

    if (initialized && !isValid) {
      clear?.()
      setInitialized(false)
    }
  }, [data])
  
}