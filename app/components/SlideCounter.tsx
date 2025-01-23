import useScrollDirection from '@/hooks/useScrollDirection'
import StickyImageContainer from './StickyImageContainer'
import { AnimatePresence, motion } from 'framer-motion'
import {
  activeNumberBackgroundVariants,
  activeNumberVariants,
  baseTransition
} from '@/utils'

type SlideCounterProps = {
  activeSlideID: number | null
  imageHeight: number
}

export default function SlideCounter({
  activeSlideID,
  imageHeight
}: SlideCounterProps) {
  const { scrollDirection } = useScrollDirection()

  if (activeSlideID === null) return null

  return (
    <StickyImageContainer imageHeight={imageHeight}>
      <div className='absolute -left-12 bottom-0 top-0 flex items-center md:-left-20'>
        <motion.div
          custom={{
            id: activeSlideID
          }}
          initial='initial'
          animate={'active'}
          transition={baseTransition}
          variants={activeNumberBackgroundVariants}
          className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-[4px]'
        >
          <AnimatePresence>
            <motion.div
              key={activeSlideID}
              custom={{ direction: scrollDirection }}
              initial='initial'
              animate={'active'}
              exit='exit'
              variants={activeNumberVariants}
              transition={baseTransition}
              className='absolute text-white'
            >
              {activeSlideID + 1}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </StickyImageContainer>
  )
}
