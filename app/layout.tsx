import './globals.css'

export const metadata = {
  title:
    'Sticky Scroll Slideshow Demo Made with Create Next App and Framer Motion',
  description:
    'A side-by-side slideshow with centered sticky image section that animates based on scroll.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='overflow-x-clip'>{children}</body>
    </html>
  )
}
