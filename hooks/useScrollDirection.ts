import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'

export default function useScrollDirection() {
  const { scrollYProgress } = useScroll()
  const [scrollDirection, setScrollDirection] = useState(1)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    const prev = scrollYProgress.getPrevious()
    if (!prev) return
    // Check the diff between current and previous scroll to get direction.
    setScrollDirection(current - prev > 0 ? 1 : -1)
  })

  return { scrollDirection, scrollYProgress }
}
