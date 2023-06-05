/**
 * WHAT WE'RE BUILDING
 *
 * This is a demo of a scroll-linked animated slideshow using a combination of sticky elements as well as elements in the normal doc flow. Scroll progress is used to track the active slide content to determine the animations. The overall effect is similar to something I've seen popularized from time to time, where once a user begins scrolling some particular content, sticky elements off to one side animate in and out to provide additional context or visual interest.
 *
 * This demo uses Framer Motion for animations and Next.js for the project setup for demo purposes, but the code (aside from Next's `Image` component can be dropped in any React client component as a starting point.
 *
 * Feel free to leverage the patterns or code found in this demo in your own projects or as a resource to help create your own scroll-linked animations with Motion.
 *
 * If you find it useful, throw it a star on GitHub or give me a shout @abgregs on Twitter.
 */

'use client'

import FlowersPic from '#/flowers.jpg'
import BikePic from '#/bike.jpg'
import CoffeePic from '#/coffee.jpg'
import FerrisWheelPic from '#/ferris-wheel.jpg'
import BridgePic from '#/bridge.jpg'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { useCallback, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useTransform,
  useSpring
} from 'framer-motion'
import { useResizeObserver } from '@/hooks/useResizeObserver'

const loremSnippet =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

type Slide = {
  id: number
  title: string
  content: string
  image: {
    src: StaticImageData
    alt: string
  }
  opacity: number
  scale: number
  x: number
}

const slidesData = [
  {
    id: 0,
    title: 'Flowers',
    content: loremSnippet,
    image: {
      src: FlowersPic,
      alt: 'flowers'
    },
    opacity: 1,
    scale: 1,
    x: 0
  },
  {
    id: 1,
    title: 'Bike',
    content: `${loremSnippet} ${loremSnippet}`,
    image: {
      src: BikePic,
      alt: 'bike'
    },
    opacity: 0,
    scale: 0,
    x: 0
  },
  {
    id: 2,
    title: 'Coffee',
    content: loremSnippet,
    image: {
      src: CoffeePic,
      alt: 'coffee'
    },
    opacity: 0,
    scale: 0,
    x: 0
  },
  {
    id: 3,
    title: 'Ferris Wheel',
    content: `${loremSnippet} ${loremSnippet}`,
    image: {
      src: FerrisWheelPic,
      alt: 'ferris wheel'
    },
    opacity: 0,
    scale: 0,
    x: 0
  },
  {
    id: 4,
    title: 'Bridge',
    content: loremSnippet,
    image: {
      src: BridgePic,
      alt: 'bridge'
    },
    opacity: 0,
    scale: 0,
    x: 0
  }
]

// Just some reusable classes for container styles.
const containerClasses = 'mx-auto max-w-6xl px-6 lg:px-8'

// Colors representing each slide, used for the active slide number animation.
const colors = ['#6282a6', '#7e6e84', '#72665e', '#b87a5e', '#ebbd74']

const baseEase = [0.72, 0.32, 0, 1]

const baseTransition = {
  duration: 0.7,
  ease: baseEase
}

// Initial position styles for staggered active title animation.
const activeTitleClassNames: Record<number, string> = {
  1: 'absolute -left-3 -top-3 h-6 w-6 rounded-[4px]',
  2: 'absolute -left-4 -top-4 h-6 w-5 rounded-[4px]',
  3: 'absolute -left-2 -top-1 h-5 w-6 rounded-[4px]'
}

const activeTitleTransition = baseTransition

const activeTitleContainerTransition = {
  duration: 1,
  ease: baseEase,
  staggerChildren: 0.6,
  delayChildren: 0.1
}

// Variants for active title animation, applies to three different elements used to create a staggered effect.
const activeTitleVariants = {
  inactive: ({ id, direction }: { id: number; direction: number }) => ({
    opacity: 0,
    scale: 0,
    rotate: 270 * direction,
    x: 25 * id ** 3 * -1,
    y: 15 * id ** 3 * direction
  }),
  active: ({ id }: { id: number }) => ({
    opacity: 1 / (2 + id ** 2),
    scale: 1,
    rotate: 0,
    x: 0,
    y: 0
  })
}

const activeNumberBackgroundTransition = baseTransition

// Variants for background color animation on the animated counter showing the active slide number.
const activeNumberBackgroundVariants = {
  inactive: {
    backgroundColor: 'ffffff',
    opacity: 0
  },
  active: ({ id }: { id: number }) => ({
    backgroundColor: colors[id % 5],
    opacity: 0.7
  })
}

const activeNumberTransition = baseTransition

/**
 * We will animate the slide number for the active slide. This height offset will be used for a counter-like effect as the slide numbers animate out and in from above and below.
 */
const heightOffset = 40

const activeNumberVariants = {
  inactive: ({ direction }: { direction: number }) => ({
    opacity: 0,
    y: direction * heightOffset
  }),
  active: {
    opacity: 0.9,
    y: 0
  },
  exit: ({ direction }: { direction: number }) => ({
    opacity: 0,
    y: direction * heightOffset * -1
  })
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(slidesData)
  const [[direction, lastScrollY], setDirection] = useState([1, 0])
  const [activeSlideID, setActiveSlideID] = useState(0)

  // Track scroll to determine direction.
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (currentScrollY) => {
    // Check the diff between current and last scroll Y to determine direction.
    // Set current direction and scroll Y.
    setDirection([currentScrollY - lastScrollY > 0 ? 1 : -1, currentScrollY])
  })

  /**
   * We are using a fixed aspect ratio for our image container, in this case 1:1, using a container with vertical padding of 100% and using `object-fit: cover` on the image to fill our 1:1 container.
   */
  const columnRef = useRef<HTMLDivElement>(null)

  /**
   * We can use the width of our column to derive our image height (and width since our images will be 1:1), since we want our image to fill the width of the column. We need this value in order to appropriately offset the `top` property on the `position: sticky section that contains our image.
   *
   * https://usehooks-ts.com/react-hook/use-resize-observer
   */
  const { width: imageHeight } = useResizeObserver({
    ref: columnRef
  })

  // Handler to set the active slide ID.
  const handleSetActiveSlideID = (id: number) => setActiveSlideID(id)

  // Handler to update a slide's opacity, scale, and x position.
  const handleSetSlides = useCallback(
    ({
      id,
      opacity,
      scale,
      x
    }: Pick<Slide, 'id' | 'opacity' | 'scale' | 'x'>) => {
      setSlides((prevSlides: any) => {
        return prevSlides.map((slide: any) => {
          return slide.id === id
            ? {
                ...slide,
                opacity,
                scale,
                x
              }
            : slide
        })
      })
    },
    []
  )

  return (
    <main className='flex min-h-screen flex-col'>
      <Guides />
      <ArbitrarySection />
      <div className='relative'>
        {imageHeight && (
          <ImageViewer
            imageHeight={imageHeight}
            slides={slides}
            activeSlideID={activeSlideID}
            direction={direction}
          />
        )}

        <div className={containerClasses}>
          <div className='grid grid-cols-2 gap-16 md:gap-32'>
            <div ref={columnRef} className='grid gap-y-6'>
              {slides.map((slide) => (
                <ContentSection
                  key={slide.id}
                  handleSetActiveSlideID={handleSetActiveSlideID}
                  slides={slides}
                  activeSlideID={activeSlideID}
                  slide={slide}
                  direction={direction}
                  handleSetSlides={handleSetSlides}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ArbitrarySection />
    </main>
  )
}

type SlideImageProps = Pick<Slide, 'id' | 'image'>

const SlideImage = ({ id, image }: SlideImageProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return (
    <Image
      className={clsx(
        isLoaded ? 'blur-none' : 'blur-lg',
        'z-50 h-full w-full rounded-md object-cover grayscale-[50%] transition-all duration-200'
      )}
      priority={id === 0}
      width={580}
      height={580}
      sizes='(max-width: 767px) 360px, 580px'
      alt={image.alt}
      src={image.src}
      placeholder={'blur'}
      onLoad={() => setIsLoaded(true)}
    />
  )
}

type ImageViewerProps = {
  imageHeight: number
  slides: Slide[]
  direction: number
  activeSlideID: number
}

/**
 * We only show our slideshow images once our `imageHeight` is defined (i.e. once the column has been measured). We use the `imageHeight` to offset the image from the vertical center of the viewport.
 */
const ImageViewer = ({
  imageHeight,
  direction,
  activeSlideID,
  slides
}: ImageViewerProps) => {
  const imageOffset = (imageHeight / 2).toFixed(0)

  return (
    <div className='absolute inset-0'>
      <div
        style={{
          top: `calc(50vh - ${imageOffset}px)`
        }}
        className='sticky'
      >
        <div className={containerClasses}>
          <div className='grid grid-cols-2 gap-16 md:gap-32'>
            <div className='col-start-2'>
              <div className='relative' style={{ height: `${imageHeight}px` }}>
                {slides.map((slide) => (
                  <motion.div
                    key={slide.id}
                    className={clsx(
                      'absolute inset-0 origin-center rounded-md'
                    )}
                    style={{
                      opacity: slide.opacity,
                      x: slide.x,
                      scale: slide.scale
                    }}
                  >
                    <SlideImage id={slide.id} image={slide.image} />
                  </motion.div>
                ))}

                <div className='absolute -left-12 bottom-0 top-0 flex items-center md:-left-20'>
                  <motion.div
                    custom={{
                      id: activeSlideID
                    }}
                    initial='inactive'
                    animate='active'
                    transition={activeNumberBackgroundTransition}
                    variants={activeNumberBackgroundVariants}
                    className='relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[4px]'
                  >
                    {slides.map((slide) => (
                      <AnimatePresence key={slide.id}>
                        {slide.id === activeSlideID && (
                          <motion.div
                            custom={{ direction }}
                            initial='inactive'
                            animate='active'
                            exit='exit'
                            variants={activeNumberVariants}
                            transition={activeNumberTransition}
                            className='absolute text-white'
                          >
                            {activeSlideID + 1}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// The distance images should enter and exit from left or right.
const xOffset = 80
// The scrollable area in pixels the animation will take up from start to finish.
const animateHeight = 150
// How many pixels beyond the section top and bottom our animation is offset.
const animatePositionOffset = 50
// Where relative to the viewport our animation is triggered.
const animateScrollOffset = '50vh'

type ContentSectionProps = {
  handleSetActiveSlideID: (id: number) => void
  slides: Slide[]
  slide: Slide
  activeSlideID: number
  direction: number
  handleSetSlides: ({
    id,
    opacity,
    scale,
    x
  }: Pick<Slide, 'id' | 'opacity' | 'scale' | 'x'>) => void
}

const ContentSection = ({
  direction,
  slide,
  slides,
  activeSlideID,
  handleSetSlides,
  handleSetActiveSlideID
}: ContentSectionProps) => {
  /**
   * Setting refs used to track the top and bottom of the content section. These will be absolute positioned elements assigned a fixed height so that animating in and out is consistent from section to section.
   */
  const topRef = useRef(null)
  const bottomRef = useRef(null)

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
   * Slides enter/exit from left to right if even and right to left if odd. Note we also account for offsetting any change in scale of the image (if applicable) so the image transitions correctly between our `xOffset` distance and center.
   */
  const x = useTransform(() => {
    // Alternate the direction a slide enters/exits for odd/even slides.
    const isEven = slide.id % 2 === 0
    return (
      // The `xOffset` distance off center.
      xOffset * (isEven ? -1 : 1) +
      // Approach center as opacity approaches 1.
      opacity.get() * xOffset * (isEven ? 1 : -1)
    )
  })

  const handleSlideUpdates = useCallback(
    (slide: Slide) => {
      handleSetSlides({
        id: slide.id,
        opacity: opacity.get(),
        scale: scale.get(),
        x: x.get()
      })

      if (
        slide.id !== activeSlideID &&
        opacity.get() > slides[activeSlideID].opacity
      ) {
        handleSetActiveSlideID(slide.id)
      }
    },
    [
      handleSetSlides,
      handleSetActiveSlideID,
      opacity,
      scale,
      x,
      slides,
      activeSlideID
    ]
  )

  /**
   * Track relevant scroll changes with scroll momentum to reflect more appropriate surface area of scroll events we respond to for state updates.
   */
  const contentScrollYWithRest = useSpring(opacity, {
    bounce: 0,
    restDelta: 0.001
  })
  useMotionValueEvent(contentScrollYWithRest, 'change', () => {
    handleSlideUpdates(slide)
  })

  const isActive = slide.id === activeSlideID

  return (
    <div className='relative grid gap-y-6'>
      <div
        className='absolute'
        style={{
          height: animateHeight,
          top: 0,
          marginTop: `-${animatePositionOffset}px`
        }}
        ref={topRef}
      />
      <div
        className='absolute'
        style={{
          height: animateHeight,
          bottom: 0,
          marginBottom: `-${animatePositionOffset}px`
        }}
        ref={bottomRef}
      />
      <div className='relative'>
        <motion.div
          key={slide.id}
          transition={activeTitleContainerTransition}
          initial={'inactive'}
          animate={isActive ? 'active' : 'inactive'}
          className='absolute inset-0 flex'
        >
          {Object.values(activeTitleClassNames).map((classNames, i) => (
            <motion.div
              key={i}
              style={{ backgroundColor: colors[slide.id % 5] }}
              className={classNames}
              custom={{ id: i + 1, direction }}
              initial='inactive'
              animate={isActive ? 'active' : 'inactive'}
              variants={activeTitleVariants}
              transition={activeTitleTransition}
            />
          ))}
        </motion.div>
        <h2 className='pl-6 text-4xl font-bold md:text-7xl'>{slide.title}</h2>
      </div>
      <p className='pl-6 text-base font-extralight md:text-2xl'>
        {slide.content}
      </p>
    </div>
  )
}

// Just used to simulate how the sticky elements behave on a real page transitioning to and from other content.
const ArbitrarySection = () => {
  return (
    <div className='flex h-[300px] w-full items-center justify-center sm:h-[500px]'>
      <h2 className='text-4xl font-bold md:text-7xl'>Section</h2>
    </div>
  )
}

// Just some grid lines to illustrate our spacing and alignment.
const Guides = () => {
  return (
    <div className='fixed inset-0'>
      <div className={clsx(containerClasses, 'h-screen')}>
        <div
          style={{
            gridAutoFlow: 'column'
          }}
          className='grid h-screen grid-flow-row grid-cols-2 md:grid-cols-4'
        >
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='hidden h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y md:block'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='hidden h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y md:block'
          />
        </div>
      </div>
    </div>
  )
}
