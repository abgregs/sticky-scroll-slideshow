'use client'

import { topAndBottomHeight, topAndBottomNegativeMargin } from '@/utils'
import { type ForwardedRef, forwardRef } from 'react'

const SlideTop = forwardRef(function SlideTop(
  { imageHeight }: { imageHeight: number },
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className='absolute'
      style={{
        height: topAndBottomHeight(imageHeight),
        top: 0,
        marginTop: `-${topAndBottomNegativeMargin(imageHeight)}px`
      }}
    />
  )
})

export default SlideTop
