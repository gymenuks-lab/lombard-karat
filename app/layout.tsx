import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '5 Карат — ювелірний магазин | Купити золото та срібло онлайн',
  description:
    '5 Карат: інтернет-магазин ювелірних виробів із золота та срібла. Каблучки, ланцюжки, сережки та браслети — нові вироби від виробника та перевірені вживані прикраси. Доставка по всій Україні.',
  keywords: [
    '5 Карат',
    'ювелірний магазин',
    'купити золото',
    'купити срібло',
    'золоті каблучки',
    'срібні прикраси',
    'ювелірні вироби від виробника',
    'купити прикраси онлайн',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#fbf9f4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
