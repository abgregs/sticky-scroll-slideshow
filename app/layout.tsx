import { PropsWithChildren } from 'react'
import './globals.css'
import Head from 'next/head'

export const metadata = {
  title:
    'Sticky Scroll Slideshow Demo Made with Create Next App and Framer Motion',
  description:
    'A side-by-side slideshow with centered sticky image section that animates based on scroll.'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        ></meta>
      </Head>
      <body className='overflow-x-clip'>{children}</body>
    </html>
  )
}
