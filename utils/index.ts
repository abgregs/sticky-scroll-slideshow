import FlowersPic from '#/flowers.jpg'
import BikePic from '#/bike.jpg'
import CoffeePic from '#/coffee.jpg'
import FerrisWheelPic from '#/ferris-wheel.jpg'
import BridgePic from '#/bridge.jpg'
import { StaticImageData } from 'next/image'

const loremSnippet =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export type Slide = {
  id: number
  title: string
  content: string
  image: {
    src: StaticImageData
    alt: string
  }
}

export const slides = [
  {
    id: 0,
    title: 'Flowers',
    content: loremSnippet,
    image: {
      src: FlowersPic,
      alt: 'flowers'
    }
  },
  {
    id: 1,
    title: 'Bike',
    content: `${loremSnippet} ${loremSnippet}`,
    image: {
      src: BikePic,
      alt: 'bike'
    }
  },
  {
    id: 2,
    title: 'Coffee',
    content: loremSnippet,
    image: {
      src: CoffeePic,
      alt: 'coffee'
    }
  },
  {
    id: 3,
    title: 'Ferris Wheel',
    content: `${loremSnippet} ${loremSnippet}`,
    image: {
      src: FerrisWheelPic,
      alt: 'ferris wheel'
    }
  },
  {
    id: 4,
    title: 'Bridge',
    content: loremSnippet,
    image: {
      src: BridgePic,
      alt: 'bridge'
    }
  }
]

// Some reusable classes for container styles.
export const containerClasses = 'mx-auto max-w-6xl px-6 lg:px-8'

// Some reusable grid and gap styles for our layout.
export const gridClasses = 'grid grid-cols-2 gap-16 md:gap-32'

// The gap between each content section.
export const sectionRowGap = 24

// Colors representing each slide, used for the active slide number animation.
export const colors = ['#6282a6', '#7e6e84', '#72665e', '#b87a5e', '#ebbd74']

export const baseEase = [0.72, 0.32, 0, 1]

// Base transition used in active slide animations.
export const baseTransition = {
  duration: 0.7,
  ease: baseEase
}

// Initial position styles for staggered active title animation.
export const activeTitleClassNames = [
  'absolute -left-3 -top-3 h-6 w-6 rounded-[4px]',
  'absolute -left-4 -top-4 h-6 w-5 rounded-[4px]',
  'absolute -left-2 -top-1 h-5 w-6 rounded-[4px]'
]

// Motion variants for for the parent container used with the active title staggered animation.
export const activeTitleContainerTransition = {
  duration: 1,
  ease: baseEase,
  staggerChildren: 0.6,
  delayChildren: 0.1
}

// Motion variants for active title animation, applies to three different elements used to create a staggered effect.
export const activeTitleVariants = {
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

// Motion variants for background color animation on the animated counter showing the active slide number.
export const activeNumberBackgroundVariants = {
  initial: {
    backgroundColor: '#ffffff',
    opacity: 0
  },
  active: ({ id }: { id: number }) => ({
    backgroundColor: colors[id],
    opacity: 0.7
  })
}

// We will animate the slide number for the active slide. This height offset will be used for a counter-like effect as the slide numbers animate out and in from above and below.
export const heightOffset = 40

// Motion variants for enter/exit of active slide number inside the animated counter.
export const activeNumberVariants = {
  initial: ({ direction }: { direction: number }) => ({
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

// The negative margin used to offset `<SlideTop>` and `<SlideBottom>` components with respect to slide content.
export function topAndBottomNegativeMargin(imageHeight: number) {
  return imageHeight * 0.5
}

// An adjusted `y` offset of `<SlideTop>` and `<SlideBottom>` that accounts for the row gap between slide content sections.
function topAndBottomYOffset(imageHeight: number) {
  return topAndBottomNegativeMargin(imageHeight) - sectionRowGap / 2
}

// The `x` distance a slide exits to or enters from.
export function xOffset(imageHeight: number) {
  return imageHeight * 0.5 - sectionRowGap
}

// Where relative to the viewport our animation starts and ends.
export const animateScrollOffset = '50vh'

/**
 * The calculated scroll progress of `<SlideTop>` or `<SlideBottom>` at which the row gap center between slides is scrolled to the center of the viewport. The instant scroll progress becomes greater than `activeSlideProgressValue` this means the opacity of an entering or exiting slide has surpassed the other. Therefore, this value can be used to determine the most visible and therefore `active` slide.
 */
export function activeSlideProgressValue(imageHeight: number) {
  return topAndBottomYOffset(imageHeight) / topAndBottomHeight(imageHeight)
}

// The height of the `<SlideTop>` and `<SlideBottom>` components.
// This value should be greater than `topAndBottomNegativeMargin` to achieve some overlap of entering and exiting images during the transition between slides.
export function topAndBottomHeight(imageHeight: number) {
  return imageHeight * 0.75
}
