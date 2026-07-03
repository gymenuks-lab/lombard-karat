import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
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
  themeColor: '#111110',
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
