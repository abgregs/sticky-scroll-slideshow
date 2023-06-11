import { RefObject, useEffect, useState } from 'react'

interface UseResizeProps {
  ref: RefObject<Element>
  dimension: 'height' | 'width'
}

export default function useResizeObserver({ ref, dimension }: UseResizeProps) {
  const [val, setVal] = useState<number | null>(null)

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((observer) => {
        const newVal =
          dimension === 'height'
            ? observer[0]?.contentRect?.height
            : observer[0]?.contentRect?.width
        setVal(newVal || null)
      })
      resizeObserver.observe(ref.current)

      // clean up
      return () => resizeObserver.disconnect()
    }
  }, [dimension, ref])

  return val
}
