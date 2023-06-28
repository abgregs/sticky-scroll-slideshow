/**
 * What we're building...
 *
 * A slideshow that scrolls from top to bottom.
 * Each side-by-side slide has text content on the left
 * which scrolls as part of the normal document flow and
 * a sticky image on the right that animates.
 *
 * In the left column, the scroll progress of any text content
 * still visible within a specified threshold of the viewport
 * height is tracked for a given slide. This value will be used
 * used to determine how the slide's image is animated.
 *
 * A right column is taken outside the document flow to display
 * slide images. The desired effect is an image section that:
 *
 * 1) starts aligned at the top of the left column
 * 2) becomes sticky once it has been scrolled into the horizontal
 * center of the viewport
 * 3) is released back into flow once the left column scrolls far enough
 * such that the bottom of the left column aligns with the bottom of the
 * image section
 *
 */

'use client'

import FlowersPic from '@/public/images/flowers.jpg'
import BikePic from '@/public/images/Bike.jpg'
import CoffeePic from '@/public/images/coffee.jpg'
import FerrisWheelPic from '@/public/images/ferris-wheel.jpg'
import BridgePic from '@/public/images/bridge.jpg'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent
} from 'framer-motion'
import useResizeObserver from '@/hooks/useResizeObserver'

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
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: {
      src: BridgePic,
      alt: 'bridge'
    },
    opacity: 0,
    scale: 0,
    x: 0
  }
]

const colors = ['#6282a6', '#7e6e84', '#72665e', '#b87a5e', '#ebbd74']

const baseTransition = {
  duration: 0.7,
  ease: [0.72, 0.32, 0, 1]
}

const activeTitleTransition = baseTransition

const activeTitleContainerTransition = {
  duration: 1,
  ease: [0.72, 0.32, 0, 1],
  staggerChildren: 0.6,
  delayChildren: 0.1
}

const activeTitleVariants = {
  inactive: ({ id, direction }: { id: number; direction: number }) => ({
    opacity: 0.2,
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
    backgroundColor: colors[(id + direction * -1) % 5]
  }),
  active: ({ id }: { id: number }) => ({
    backgroundColor: colors[id % 5]
  })
}

const activeNumberTransition = baseTransition

const heightOffset = 40

const activeNumberVariants = {
  inactive: (direction: number) => ({
    opacity: 0.2,
    y: direction * heightOffset
  }),
  active: {
    opacity: 0.9,
    y: 0
  }
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(slidesData)
  const [[direction, lastScrollY], setDirection] = useState([1, 0])
  const [slideID, setActiveSlide] = useState(0)
  const [imageReady, setImageReady] = useState(false)

  // We are using a fixed aspect ratio for our image container,
  // in this case 1:1, using a container with vertical padding of 100%
  // and using `object-fit: cover` on the image to fill our 1:1 container.

  let columnRef = useRef<HTMLDivElement>(null)

  // We can use the width of our column as a proxy for our image height,
  // since our image will be as wide as a column.
  // We need this value in order to appropriately offset the `top` property
  // on the `position: sticky` section that contains our image.

  // We created a hook that relies on `resizeObserver` to get this value.
  let imageHeight = useResizeObserver({
    ref: columnRef,
    dimension: 'width'
  })

  // We need an image ready state to ensure our sticky image loads
  // in the correct place. Since its position and height will depend on
  // calculations based on the current container width, if that value isn't
  // available yet the image won't be positioned correctly, so we should wait.

  useEffect(() => {
    console.log('image height: ', imageHeight)
    console.log('image ready: ', imageReady)
    if (imageReady) return
    if (imageHeight !== null) {
      setImageReady(true)
    }
  }, [imageReady, imageHeight])

  const handleUpdateSlide = (
    id: number,
    opacity: number,
    scale: number,
    x: number
  ) => {
    setSlides((prevSlides) => {
      return prevSlides.map((slide) => {
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

    // If progress changed for a slide OTHER than the current slide,
    // AND it has the higher opacity, set it as the active slide.
    if (id !== slideID && opacity > slides[slideID].opacity) {
      console.log(`active slide is: ${id}`)
      setActiveSlide(id)
    }
  }

  const handleUpdateDirection = (scrollY: number) => {
    // Check the diff between last scroll Y value to determine direction.
    // Set current scroll Y as the latest
    if (scrollY !== lastScrollY) {
      setDirection([scrollY - lastScrollY > 0 ? 1 : -1, scrollY])
    }
  }

  console.log(`direction change is: ${direction}`)

  return (
    <main className='flex min-h-screen flex-col'>
      <Guides />
      <ArbitrarySection />
      <div className='relative'>
        {imageReady && (
          <div className='absolute inset-0'>
            <div
              style={{
                top: imageHeight ? `calc(50vh - ${imageHeight / 2}px` : 0
              }}
              className='sticky flex items-center justify-center'
            >
              <div className='container-base w-full'>
                <div className={`grid grid-cols-4 gap-16 md:gap-32`}>
                  <div className='col-span-2 col-start-3 flex justify-center'>
                    <div className='relative w-full pt-[100%]'>
                      <div className='absolute -left-12 bottom-0 top-0 flex items-center md:-left-20'>
                        {slides.map(
                          (slide) =>
                            slide.id === slideID && (
                              <motion.div
                                key={slide.id}
                                custom={{ direction, id: slide.id }}
                                initial='inactive'
                                animate='active'
                                transition={activeNumberBackgroundTransition}
                                variants={activeNumberBackgroundVariants}
                                className='flex h-8 w-8 items-center justify-center rounded-[4px]'
                              >
                                <Fragment key={slide.id}>
                                  <motion.div
                                    initial='inactive'
                                    custom={direction}
                                    animate='active'
                                    variants={activeNumberVariants}
                                    transition={activeNumberTransition}
                                    className='text-white'
                                  >
                                    {slideID + 1}
                                  </motion.div>
                                </Fragment>
                              </motion.div>
                            )
                        )}
                      </div>

                      {slides.map((slide) => (
                        <motion.div
                          className='absolute inset-0 overflow-hidden'
                          key={slide.id}
                          style={{
                            opacity: slides[slide.id].opacity,
                            scale: slides[slide.id].scale,
                            x: slides[slide.id].x
                          }}
                        >
                          <SlideshowImage slide={slide} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='container-base'>
          <div className='grid grid-cols-4 gap-16 md:gap-32'>
            <div
              ref={columnRef}
              className='col-span-2 col-start-1 grid grid-cols-1 gap-y-6'
            >
              {slides.map((slide) => (
                <Fragment key={slide.id}>
                  <ContentSection
                    slide={slide}
                    activeSlideID={slideID}
                    direction={direction}
                    onUpdateSlide={(id, opacity, scale, x) =>
                      handleUpdateSlide(id, opacity, scale, x)
                    }
                    onUpdateDirection={() => handleUpdateDirection(scrollY)}
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

interface ContentSectionProps {
  slide: Slide
  activeSlideID: number
  direction: number
  onUpdateSlide: (id: number, opacity: number, scale: number, x: number) => void
  onUpdateDirection: (scrollY: number) => void
}

// Used for the distance images should enter and exit from left or right.
const xOffset = 125

const ContentSection: FC<ContentSectionProps> = ({
  activeSlideID,
  slide,
  direction,
  onUpdateSlide,
  onUpdateDirection
}) => {
  // Setting ref used to track scroll progress of each slide's content section.
  // We'll use this to determine how the corresponding image animates.
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // The `start` and `end` of scroll for the slide will be when the content section
    // first touches 52vh (just below center of the viewport) and when it last
    // crosses 48vh (just above center of viewport). This will give some overlap such that
    // one slide begins getting tracked just as another slide finishes its progress.
    offset: ['start 52vh', 'end 48vh']
  })

  let opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    slide.id === 0
      ? [1, 1, 1, 0]
      : slide.id === slidesData.length - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0]
  )

  useMotionValueEvent(opacity, 'change', (currentOpacity) => {
    // Our scale will be a minimum of 0.75 and move toward 1
    // based on the current opacity times a multiplier.
    // The smaller the multiplier, the more gradually the image
    // will scale up or down between these values as we scroll
    // within the section bounds where the opacity approaches 0
    // (IOW when we consider a section entering or exiting).
    let currentScale = Math.min(1, 0.75 + currentOpacity * 0.25)
    // The first slide doesn't enter but exits to the left.
    // Subsequent slides enter/exit from right to left if odd
    // and left to right if even.
    let currentX =
      slide.id === 0
        ? -xOffset + currentOpacity * xOffset
        : xOffset * (slide.id % 2 === 0 ? -1 : 1) +
          currentOpacity * xOffset * (slide.id % 2 === 0 ? 1 : -1)
    onUpdateSlide(slide.id, currentOpacity, currentScale, currentX)
  })

  useMotionValueEvent(scrollYProgress, 'change', (currentY) => {
    onUpdateDirection(currentY)
  })

  return (
    <div className='grid grid-cols-1 gap-y-6' ref={sectionRef}>
      <div className='relative'>
        <motion.div
          key={slide.id}
          transition={activeTitleContainerTransition}
          initial={'inactive'}
          animate={slide.id === activeSlideID ? 'active' : 'inactive'}
          className='absolute inset-0 flex'
        >
          <motion.div
            key={1}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-3 -top-3 h-6 w-6 rounded-[4px]'
            custom={{ id: 1, direction }}
            initial='inactive'
            animate={slide.id === activeSlideID ? 'active' : 'inactive'}
            variants={activeTitleVariants}
            transition={activeTitleTransition}
          />
          <motion.div
            key={2}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-4 -top-4 h-6 w-5 rounded-[4px]'
            custom={{ id: 2, direction }}
            initial='inactive'
            animate={slide.id === activeSlideID ? 'active' : 'inactive'}
            variants={activeTitleVariants}
            transition={activeTitleTransition}
          />
          <motion.div
            key={3}
            style={{ backgroundColor: colors[slide.id % 5] }}
            className='absolute -left-2 -top-1 h-5 w-6 rounded-[4px]'
            custom={{ id: 3, direction }}
            initial='inactive'
            animate={slide.id === activeSlideID ? 'active' : 'inactive'}
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

const ArbitrarySection: FC = () => {
  return (
    <div className='flex h-[500px] w-full items-center justify-center'>
      <h2 className='text-4xl font-bold md:text-7xl'>Section</h2>
    </div>
  )
}

const SlideshowImage: FC<{ slide: Slide }> = ({ slide }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return (
    <Image
      key={slide.id}
      className={clsx(
        isLoaded ? 'blur-none' : 'blur-lg',
        'z-50 h-full w-full rounded-md object-cover grayscale transition-all duration-200'
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

// Just some grid lines to illustrate our spacing and alignment
const Guides: FC = () => {
  return (
    <div className='fixed inset-0'>
      <div className='container-base h-screen'>
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
