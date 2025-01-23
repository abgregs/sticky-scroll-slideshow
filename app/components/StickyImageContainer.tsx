import { gridClasses } from '@/utils'
import { PropsWithChildren } from 'react'

type StickyImageContainerProps = PropsWithChildren<{
  imageHeight: number
}>

/**
 * Shared layout for sticky container to set up elements used in the right grid column - the image and the active slide counter. We only show the image and slide counter once `imageHeight` is calculated.
 */
export default function StickyImageContainer({
  children,
  imageHeight
}: StickyImageContainerProps) {
  return (
    <div className='absolute inset-0'>
      {imageHeight && (
        <div
          style={{
            top: `calc(50svh - ${imageHeight / 2}px)`
          }}
          className='sticky'
        >
          <div className={gridClasses}>
            <div
              className='relative col-start-2'
              style={{
                height: `${imageHeight}px`
              }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
