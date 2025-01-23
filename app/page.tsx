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

import { useRef, useState } from 'react'
import { containerClasses, gridClasses, sectionRowGap, slides } from '@/utils'
import Guides from './components/Guides'
import ArbitrarySection from './components/ArbitrarySection'
import SlideCounter from './components/SlideCounter'
import Slide from './components/Slide'
import { useResizeObserver } from '@/hooks/useResizeObserver'

export default function Home() {
  const [activeSlideID, setActiveSlideID] = useState<number | null>(null)

  const handleSetActiveSlideID = (id: number) => {
    setActiveSlideID(id)
  }

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

  return (
    <main className='flex min-h-screen flex-col'>
      <Guides />
      <ArbitrarySection />
      <div className='absolute inset-0'>
        <div className={containerClasses}>
          <div className={gridClasses}>
            <div ref={columnRef} />
          </div>
        </div>
      </div>
      <div className={containerClasses}>
        <div style={{ rowGap: `${sectionRowGap}px` }} className='relative grid'>
          {imageHeight && (
            <>
              {slides.map((slide) => (
                <Slide
                  key={slide.id}
                  slide={slide}
                  activeSlideID={activeSlideID}
                  imageHeight={imageHeight}
                  handleSetActiveSlideID={handleSetActiveSlideID}
                />
              ))}
            </>
          )}
          {imageHeight && (
            <SlideCounter
              activeSlideID={activeSlideID}
              imageHeight={imageHeight}
            />
          )}
        </div>
      </div>
      <ArbitrarySection />
    </main>
  )
}
