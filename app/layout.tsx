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
  title: '5 Карат — ювелірний дім | Золото та срібло: ломбардна вітрина та вироби від виробника',
  description:
    '5 Карат: каталог ювелірних виробів із золота та срібла. Ломбардна вітрина та нові прикраси від виробника. Оберіть виріб онлайн і залиште заявку — менеджер зв’яжеться з вами. Швидка оцінка та видача грошей.',
  keywords: [
    '5 Карат',
    'ювелірний дім',
    'золото купити',
    'срібло купити',
    'ломбардна вітрина',
    'ювелірні вироби від виробника',
    'золото під заставу',
    'срібло під заставу',
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
