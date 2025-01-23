'use client'

import { Slide } from '@/utils'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'

type SlideImageProps = Pick<Slide, 'id' | 'image'>

export default function SlideImage({ id, image }: SlideImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  return (
    <Image
      className={clsx(
        isLoaded ? 'blur-none' : 'blur-lg',
        'h-full w-full rounded-md object-cover grayscale-[50%] transition-all duration-200'
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
