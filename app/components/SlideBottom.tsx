'use client'

import { topAndBottomHeight, topAndBottomNegativeMargin } from '@/utils'
import { type ForwardedRef, forwardRef } from 'react'

const SlideBottom = forwardRef(function SlideBottom(
  { imageHeight }: { imageHeight: number },
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className='absolute'
      style={{
        height: topAndBottomHeight(imageHeight),
        bottom: 0,
        marginBottom: `-${topAndBottomNegativeMargin(imageHeight)}px`
      }}
    />
  )
})

export default SlideBottom
