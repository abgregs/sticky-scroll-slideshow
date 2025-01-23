import { Slide, xOffset } from '@/utils'
import StickyImageContainer from './StickyImageContainer'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import SlideImage from './SlideImage'

type ImageViewerProps = {
  slide: Slide
  imageHeight: number
}

export default function ImageViewer({ slide, imageHeight }: ImageViewerProps) {
  return (
    <StickyImageContainer imageHeight={imageHeight}>
      <motion.div
        key={slide.id}
        className={clsx('h-full rounded-md', `slide-${slide.id}`)}
        initial={{
          opacity: 0,
          scale: 0.75,
          x: xOffset(imageHeight) * (slide.id % 2 === 0 ? -1 : 1)
        }}
      >
        <SlideImage id={slide.id} image={slide.image} />
      </motion.div>
    </StickyImageContainer>
  )
}
