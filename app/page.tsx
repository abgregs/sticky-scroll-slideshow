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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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

// Used for the distance images should enter and exit from left or right.
const xOffset = 125

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(slidesData)
  const [imageReady, setImageReady] = useState(false)

  // We are using a fixed aspect ratio for our image content,
  // in this case 1:1, using a container with vertical padding of 100%
  // and using `object-fit: cover` on the image to fill our 1:1 container.

  let imageContainerRef = useRef<HTMLDivElement>(null)

  // We can use the width of this element as a proxy for our image height.
  // We need this value in order to appropriately offset the `top` property
  // on the `position: sticky` image horizontally center it in the viewport.

  // We created a hook that relies on `resizeObserver` to get this value.
  let imageHeight = useResizeObserver({
    ref: imageContainerRef,
    dimension: 'width'
  })

  console.log('image height: ', imageHeight)
  console.log('image ready: ', imageReady)

  // We need an image ready state to ensure our sticky image loads
  // in the correct place. Since its position will depend on
  // calculations based on the image height, if those values aren't
  // available yet the image won't be positioned correctly, so we should wait.

  useEffect(() => {
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
  }

  return (
    <main className='flex min-h-screen flex-col'>
      <Guides />
      <ArbitrarySection />
      <div className='relative'>
        <div className='absolute inset-0'>
          <div
            style={{
              top: imageHeight ? `calc(50vh - ${imageHeight / 2}px` : 0
            }}
            className='sticky flex items-center justify-center'
          >
            <div className='container-base w-full'>
              <div className='grid grid-cols-4 gap-16 md:gap-32'>
                <div className='col-span-2 col-start-3 flex justify-center'>
                  <div
                    ref={imageContainerRef}
                    className='relative w-full pt-[100%]'
                  >
                    {imageReady &&
                      slides.map((slide) => (
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

        <div className='container-base'>
          <div className='grid grid-cols-4 gap-16 md:gap-32'>
            <div className='col-span-2 col-start-1 grid grid-cols-1 gap-y-6'>
              {slides.map((slide) => (
                <Fragment key={slide.id}>
                  <ContentSection
                    slide={slide}
                    onUpdateSlide={(id, opacity, scale, x) =>
                      handleUpdateSlide(id, opacity, scale, x)
                    }
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ArbitrarySection />
      <ArbitrarySection />
    </main>
  )
}

interface ContentSectionProps {
  slide: Slide
  onUpdateSlide: (id: number, opacity: number, scale: number, x: number) => void
}

const ContentSection: FC<ContentSectionProps> = ({ slide, onUpdateSlide }) => {
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

  useMotionValueEvent(scrollYProgress, 'change', () => {
    let currentScrollY = scrollYProgress.get()
    console.log(`scroll progress for slide ${slide.id}: ${currentScrollY}`)
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

  useMotionValueEvent(opacity, 'change', () => {
    let currentOpacity = opacity.get()

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
    console.log(`opacity for slide ${slide.id}: ${currentOpacity}`)
    onUpdateSlide(slide.id, currentOpacity, currentScale, currentX)
  })

  return (
    <div className='grid grid-cols-1 gap-y-6' ref={sectionRef}>
      <div className='relative'>
        <div className='absolute inset-0 flex'>
          <div className='flex translate-x-[-50%] items-center justify-center gap-[2px]'>
            <div className='h-full w-[2px] bg-gray-800' />
          </div>
        </div>
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
