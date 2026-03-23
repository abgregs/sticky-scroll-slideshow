import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState, useRef } from 'react'

export default function useScrollDirection() {
  const { scrollYProgress } = useScroll()
  const [scrollDirection, setScrollDirection] = useState(1)
  const directionRef = useRef(1)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    const prev = scrollYProgress.getPrevious()
    if (!prev) return
    const newDirection = current - prev > 0 ? 1 : -1
    if (directionRef.current !== newDirection) {
      directionRef.current = newDirection
      setScrollDirection(newDirection)
    }
  })

  return { scrollDirection, scrollYProgress }
}
