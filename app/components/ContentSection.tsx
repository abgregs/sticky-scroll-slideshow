import useScrollDirection from '@/hooks/useScrollDirection'
import {
  Slide,
  gridClasses,
  activeTitleContainerTransition,
  activeTitleClassNames,
  colors,
  activeTitleVariants,
  baseTransition
} from '@/utils'
import { motion } from 'framer-motion'
import { forwardRef, ForwardedRef } from 'react'

type ContentSectionProps = {
  slide: Slide
  activeSlideID: number | null
}

const ContentSection = forwardRef(function ContentSection(
  { slide, activeSlideID }: ContentSectionProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { scrollDirection } = useScrollDirection()
  const isActive = slide.id === activeSlideID

  return (
    <div className={gridClasses} ref={ref}>
      <div className='grid gap-y-4'>
        <div className='relative'>
          <motion.div
            key={slide.id}
            transition={activeTitleContainerTransition}
            initial={'inactive'}
            animate={isActive ? 'active' : 'inactive'}
            className='absolute inset-0 flex'
          >
            {activeTitleClassNames.map((classNames, i) => (
              <motion.div
                key={i}
                style={{ backgroundColor: colors[slide.id] }}
                className={classNames}
                custom={{ id: i + 1, direction: scrollDirection }}
                initial='inactive'
                animate={isActive ? 'active' : 'inactive'}
                variants={activeTitleVariants}
                transition={baseTransition}
              />
            ))}
          </motion.div>
          <h2 className='pl-6 text-4xl font-bold md:text-7xl'>{slide.title}</h2>
        </div>
        <p className='pl-6 text-base font-extralight md:text-2xl'>
          {slide.content}
        </p>
      </div>
    </div>
  )
})

export default ContentSection
