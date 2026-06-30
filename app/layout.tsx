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
  title: 'Ломбард Карат — швидка оцінка та гроші за 5 хвилин | Золото та срібло',
  description:
    'Ломбард Карат в Україні: золото під заставу, срібло під заставу, ювелірні вироби та техніка. Швидка оцінка онлайн, видача грошей за 10–15 хвилин. Купуйте нові ювелірні вироби від виробника.',
  keywords: [
    'ломбард Україна',
    'ломбард Карат',
    'золото під заставу',
    'срібло під заставу',
    'ювелірні вироби Україна',
    'швидкий ломбард',
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
