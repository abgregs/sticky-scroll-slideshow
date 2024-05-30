/**
 * WHAT WE'RE BUILDING
 *
 * This is a demo of a scroll-based animation using a combination of sticky elements as well as elements in the normal doc flow that animate. Scroll progress is used to track the active section to determine the animations. Feel free to use this as a starting point for your own projects. If you find it useful, throw it a star on GitHub or give me a shout @abgregs on Twitter.
 */

/**
 * HOW IT WORKS
 *
 * This demo uses Framer Motion for animations and Next.js for the project setup for demo purposes, but the code below can be used in any React project. Simply paste it into any client component.
 *
 * Our layout consists of a left column that's part of the normal document flow and has five sections, each consisting of a heading and body copy. An absolute positioned container is used to display a right column consisting of sticky elements. The sticky elements use a dynamically set top position in response to the column width to ensure the elements remained vertically centered during scrolling of the left column. We set a 1:1 aspect ratio for the sticky image we use in the right column to simplify some aspects of the UI and animation, but you could explore adjusting or extending this to fit your needs. Along with the sticky image, we have also have a centered sticky element that animates in and out the current slide number. The left column also includes a subtle animation of a series of simple rounded elements with varying opacity to indicate the active section.
 *
 * The overall effect is similar to something I've seen popularized from time to time, where once a use begins scrolling some particular content, sticky elements off to one side animate in and out to provide additional context or visual interest. The sticky elements go inside an absolute container matching the height of the corresonding contents, such that the sticky elements are active only while the contents are scrolled, otherwise they align with the top and bottom of the contents on start and end, returning to the normal document flow.
 */

'use client'

import FlowersPic from '#/flowers.jpg'
import BikePic from '#/bike.jpg'
import CoffeePic from '#/coffee.jpg'
import FerrisWheelPic from '#/ferris-wheel.jpg'
import BridgePic from '#/bridge.jpg'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  MotionValue,
  useTransform
} from 'framer-motion'
import useResizeObserver from '@/hooks/useResizeObserver'

const loremSnippet =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

interface Slide {
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
    content: loremSnippet,
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
    content: loremSnippet,
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

const colors = ['#6282a6', '#7e6e84', '#72665e', '#b87a5e', '#ebbd74']

const baseEase = [0.72, 0.32, 0, 1]

const baseTransition = {
  duration: 0.7,
  ease: [0.72, 0.32, 0, 1]
}

const activeTitleTransition = baseTransition

const activeTitleContainerTransition = {
  duration: 1,
  ease: baseEase,
  staggerChildren: 0.6,
  delayChildren: 0.1
}

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

const activeNumberBackgroundVariants = {
  inactive: ({ direction, id }: { direction: number; id: number }) => ({
    backgroundColor: colors[(id + direction * -1) % 5],
    opacity: 0.2
  }),
  active: ({ id }: { id: number }) => ({
    backgroundColor: colors[id % 5],
    opacity: 0.7
  })
}

const activeNumberTransition = baseTransition

// Used for the distance images should enter and exit from left or right.
const xOffset = 80

/**
 * We will animate the slide number for the active slide. This height offset will be used for a counter-like effect as the slide numbers animate out and in from above and below.
 */
const heightOffset = 40

const activeNumberVariants = {
  inactive: (direction: number) => ({
    opacity: 0,
    y: direction * heightOffset
  }),
  active: {
    opacity: 0.9,
    y: 0
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * heightOffset * -1
  })
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(slidesData)
  const [[direction, lastScrollY], setDirection] = useState([1, 0])
  const [activeSlideID, setActiveSlide] = useState(0)
  const [imageReady, setImageReady] = useState(false)

  /**
   * We are using a fixed aspect ratio for our image container, in this case 1:1, using a container with vertical padding of 100% and using `object-fit: cover` on the image to fill our 1:1 container.
   */
  const columnRef = useRef<HTMLDivElement>(null)

  // Track scroll to determine direction and currently active slide.
  const { scrollYProgress } = useScroll({})

  useMotionValueEvent(scrollYProgress, 'change', (currentScrollY) => {
    // Check the diff between last scroll Y value to determine direction.
    // Set current scroll Y and direction.
    if (currentScrollY !== lastScrollY) {
      setDirection([currentScrollY - lastScrollY > 0 ? 1 : -1, currentScrollY])
    }
  })

  /**
   * We can use the width of our column as a proxy for our image height (and width since our images will be 1:1), since we want our image to fill the width of the column. We need this value in order to appropriately offset the `top` property on the `position: sticky section that contains our image.
   *
   * We created a hook that relies on `ResizeObserver` to get this value.
   *
   * NOTE: This was some code I had lying around from quite some time ago, and it does the trick, but you could use `use-hooks-ts` or similar libraries too for convenience (https://usehooks-ts.com/).
   */
  const imageHeight = useResizeObserver({
    ref: columnRef,
    dimension: 'width'
  })

  /**
   * We need an image ready state to ensure our sticky image loads in the correct place. Since its position and height will depend on calculations based on the current container width, if that value isn't available yet the image won't be positioned correctly, so we should wait.
   */
  useEffect(() => {
    if (imageReady) return
    if (imageHeight !== null) {
      setImageReady(true)
    }
  }, [imageReady, imageHeight])

  const makeActiveSlide = useCallback((id: number) => setActiveSlide(id), [])

  // When scroll changes, we'll update the slide's opacity, scale, and x position.
  const handleUpdateSlide = useCallback(
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
            : { ...slide }
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
        {imageReady && imageHeight && (
          <SlideViewer
            imageHeight={imageHeight}
            slides={slides}
            activeSlideID={activeSlideID}
            direction={direction}
          />
        )}

        <div className={containerClasses}>
          <div className='relative grid grid-cols-4 gap-16 md:gap-32'>
            <div
              ref={columnRef}
              className='col-span-2 col-start-1 grid grid-cols-1 gap-y-6'
            >
              {imageReady &&
                slides.map((slide) => (
                  <Fragment key={slide.id}>
                    <ContentSection
                      imageHeight={imageHeight}
                      pageScrollYProgress={scrollYProgress}
                      makeActiveSlide={makeActiveSlide}
                      slides={slides}
                      activeSlideID={activeSlideID}
                      slide={slide}
                      direction={direction}
                      onUpdateSlide={handleUpdateSlide}
                    />
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>
      <ArbitrarySection />
    </main>
  )
}

interface SlideImageProps {
  slide: Slide
}

const SlideImage = ({ slide }: SlideImageProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return (
    <Image
      key={slide.id}
      className={clsx(
        isLoaded ? 'blur-none' : 'blur-lg',
        'z-50 h-full w-full rounded-md object-cover grayscale-[50%] transition-all duration-200'
      )}
      priority={slide.id === 0}
      width={580}
      height={580}
      sizes='(max-width: 767px) 360px, 580px'
      alt={slide.image.alt}
      src={slide.image.src}
      placeholder={'blur'}
      onLoadingComplete={() => setIsLoaded(true)}
    />
  )
}

interface SlideViewerProps {
  imageHeight: number
  direction: number
  activeSlideID: number
  slides: Slide[]
}

const SlideViewer = ({
  imageHeight,
  direction,
  activeSlideID,
  slides
}: SlideViewerProps) => {
  const imageOffset = (imageHeight / 2).toFixed(0)

  return (
    <div className='absolute inset-0'>
      <div
        style={{
          top: imageHeight ? `calc(50vh - ${imageOffset}px)` : 0
        }}
        className='sticky flex items-center justify-center'
      >
        <div className={clsx(containerClasses, 'w-full')}>
          <div className='grid grid-cols-4 gap-16 md:gap-32'>
            <div className='col-span-2 col-start-3 flex justify-center'>
              <div className='relative w-full pt-[100%]'>
                {slides.map((slide) => (
                  <motion.div
                    key={slide.id}
                    className={clsx(
                      'absolute inset-0 origin-center overflow-hidden'
                    )}
                    style={{
                      opacity: slide.opacity,
                      x: slide.x,
                      scale: slide.scale
                    }}
                  >
                    <SlideImage slide={slide} />
                  </motion.div>
                ))}

                <div className='absolute -left-12 bottom-0 top-0 flex items-center md:-left-20'>
                  <motion.div
                    custom={{
                      direction,
                      id: activeSlideID
                    }}
                    initial='inactive'
                    animate='active'
                    transition={activeNumberBackgroundTransition}
                    variants={activeNumberBackgroundVariants}
                    className='relative h-8 w-8 overflow-hidden rounded-[4px]'
                  >
                    <div className='absolute inset-0 flex items-center justify-center'>
                      {slides.map((slide) => (
                        <AnimatePresence key={slide.id}>
                          {slide.id === activeSlideID && (
                            <motion.div
                              custom={direction}
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
                    </div>
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

interface ContentSectionProps {
  imageHeight: number | null
  pageScrollYProgress: MotionValue
  makeActiveSlide: (id: number) => void
  slides: Slide[]
  slide: Slide
  activeSlideID: number
  direction: number
  onUpdateSlide: ({
    id,
    opacity,
    scale,
    x
  }: Pick<Slide, 'id' | 'opacity' | 'scale' | 'x'>) => void
}

const ContentSection = ({
  imageHeight,
  pageScrollYProgress,
  makeActiveSlide,
  slides,
  activeSlideID,
  slide,
  direction,
  onUpdateSlide
}: ContentSectionProps) => {
  // Setting ref used to track scroll progress of each slide's content section.
  // We'll use this to determine how the corresponding slide animates.
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,

    /**
     * The `start` and `end` of scroll for the slide will be when the top of content section first touches and when the bottom last crosses, respectively. Since our slides fade in and out gradually and we're looking for the new slide to fade in just as the previous slide exits, we overlap the offset a bit.
     */
    offset: ['start 52vh', 'end 45vh']
  })

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    slide.id === 0
      ? [1, 1, 1, 0]
      : slide.id === slidesData.length - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0]
  )

  /**
   * Our scale will be a minimum of 0.75 and move toward 1 based on the current opacity. We use the formula below to determine how rapidly scale accelerates between the bounds of 0.75 and 1. Adjust the values below or expirement to create your own effect.
   */
  const scale = useTransform(() =>
    Math.min(1, 0.75 + opacity.get() ** 2 * 0.25)
  )

  /**
   * Slides enter/exit from left to right if even and right to left if odd. Note we also account for offsetting any change in scale of the image (if applicable) to give the appearance of the image smoothly transitioning between our `xOffset` distance and center.
   */
  const x = useTransform(
    () =>
      // start the slide `xOffset` distance off center
      xOffset * (slide.id % 2 === 0 ? -1 : 1) +
      // come to center as opacity approaches 1
      opacity.get() * xOffset * (slide.id % 2 === 0 ? 1 : -1) +
      // offset for any change in scale
      (1 - scale.get()) *
        0.5 *
        (imageHeight ?? 0) *
        (slide.id % 2 === 0 ? -1 : 1)
  )

  const updateSlide = useCallback(
    (slide: Slide) => {
      onUpdateSlide({
        id: slide.id,
        opacity: opacity.get(),
        scale: scale.get(),
        x: x.get()
      })

      if (
        slide.id !== activeSlideID &&
        opacity.get() > slides[activeSlideID].opacity
      ) {
        makeActiveSlide(slide.id)
      }
    },
    [onUpdateSlide, makeActiveSlide, opacity, scale, x, slides, activeSlideID]
  )

  /**
   * On any scroll, ensure each slide's values and therefore styles are updated appropriately and so that we can determine which slide is active.
   */
  useMotionValueEvent(pageScrollYProgress, 'change', () => {
    updateSlide(slide)
  })

  const isActive = slide.id === activeSlideID

  return (
    <div className='grid grid-cols-1 gap-y-6' ref={sectionRef}>
      <div className='relative'>
        <motion.div
          key={slide.id}
          transition={activeTitleContainerTransition}
          initial={'inactive'}
          animate={isActive ? 'active' : 'inactive'}
          className='absolute inset-0 flex'
        >
          <motion.div
            key={1}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-3 -top-3 h-6 w-6 rounded-[4px]'
            custom={{ id: 1, direction }}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            variants={activeTitleVariants}
            transition={activeTitleTransition}
          />
          <motion.div
            key={2}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-4 -top-4 h-6 w-5 rounded-[4px]'
            custom={{ id: 2, direction }}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            variants={activeTitleVariants}
            transition={activeTitleTransition}
          />
          <motion.div
            key={3}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-2 -top-1 h-5 w-6 rounded-[4px]'
            custom={{ id: 3, direction }}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            variants={activeTitleVariants}
            transition={activeTitleTransition}
          />
        </motion.div>
        <h2 className='pl-6 text-4xl font-bold md:text-7xl'>{slide.title}</h2>
      </div>
      <div className='pl-6 text-base font-extralight md:text-2xl'>
        {slide.content}
      </div>
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
