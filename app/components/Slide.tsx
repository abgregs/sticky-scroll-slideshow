import useScrollDirection from '@/hooks/useScrollDirection'
import {
  animateScrollOffset,
  slides,
  xOffset,
  activeSlideProgressValue,
  Slide as SlideType
} from '@/utils'
import {
  useAnimate,
  useInView,
  useSpring,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRef, useEffect } from 'react'
import ContentSection from './ContentSection'
import ImageViewer from './ImageViewer'
import SlideBottom from './SlideBottom'
import SlideTop from './SlideTop'

type SlideProps = {
  slide: SlideType
  handleSetActiveSlideID: (id: number) => void
  activeSlideID: number | null
  imageHeight: number
}

export default function Slide({
  slide,
  handleSetActiveSlideID,
  activeSlideID,
  imageHeight
}: SlideProps) {
  const [scope, animate] = useAnimate()
  /**
   * We track scroll of the top and bottom of the slide content as these are the relevant scrollable areas concerning our enter and exit animations.
   */
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef)
  const { scrollYProgress } = useScrollDirection()

  const { scrollYProgress: topYProgress } = useScroll({
    target: topRef,
    offset: [`start ${animateScrollOffset}`, `end ${animateScrollOffset}`]
  })

  const { scrollYProgress: bottomYProgress } = useScroll({
    target: bottomRef,
    offset: [`start ${animateScrollOffset}`, `end ${animateScrollOffset}`]
  })

  /**
   * We create an opacity based on the scroll progress of the top and bottom of the section. The very first and very last slide will stay visible on enter and exit, respectively, otherwise top animates in on enter and bottom animates out on exit.
   */
  const topOpacity = useTransform(
    topYProgress,
    [0, 1],
    slide.id === 0 ? [1, 1] : [0, 1]
  )

  const bottomOpacity = useTransform(
    bottomYProgress,
    [0, 1],
    slide.id === slides.length - 1 ? [1, 1] : [1, 0]
  )

  const opacity = useTransform(() =>
    Math.min(topOpacity.get(), bottomOpacity.get())
  )

  /**
   * Our scale will be a minimum of 0.75 and move toward 1 based on the current opacity. We use the formula below to determine how rapidly scale accelerates between the bounds of 0.75 and 1. Adjust the values below or expiriment to create your own effect.
   */
  const scale = useTransform(() =>
    Math.min(1, 0.75 + opacity.get() ** 2 * 0.25)
  )

  /**
   * Slides enter/exit from left to right if even and right to left if odd.
   */
  const x = useTransform(
    () =>
      xOffset(imageHeight) * (slide.id % 2 === 0 ? -1 : 1) +
      opacity.get() * xOffset(imageHeight) * (slide.id % 2 === 0 ? 1 : -1)
  )

  useEffect(() => {
    /**
     * Handle initial active slide animation for scenario of page loading/refreshing anywhere in a range of initial scroll values. Using `isInView` to target only slides in view as first to animate.
     * */
    if (isInView && !activeSlideID) {
      if (
        activeSlideID !== slide.id &&
        opacity.get() >= activeSlideProgressValue(imageHeight)
      ) {
        handleSetActiveSlideID(slide.id)
        animate(
          `.slide-${slide.id}`,
          {
            opacity: opacity.get(),
            x: x.get(),
            scale: scale.get()
          },
          {
            duration: 0
          }
        )
      }
    }
  }, [isInView])

  useEffect(() => {
    /**
     * Subscribe to changes in page scroll to account for animation during exit/enter transition as well as conditionally setting the appropriate active slide ID.
     */
    const unSubScroll = scrollYProgress.on('change', () => {
      if (opacity.get() >= activeSlideProgressValue(imageHeight)) {
        handleSetActiveSlideID(slide.id)
      }
      animate(
        `.slide-${slide.id}`,
        {
          opacity: opacity.get(),
          x: x.get(),
          scale: scale.get()
        },
        {
          duration: 0
        }
      )
    })

    return () => {
      unSubScroll()
    }
  })

  return (
    <div>
      <div className='relative'>
        <SlideTop ref={topRef} imageHeight={imageHeight} />
        <SlideBottom ref={bottomRef} imageHeight={imageHeight} />
        <ContentSection
          slide={slide}
          activeSlideID={activeSlideID}
          ref={sectionRef}
        />
      </div>
      <div ref={scope}>
        <ImageViewer slide={slide} imageHeight={imageHeight} />
      </div>
    </div>
  )
}
