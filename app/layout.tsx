import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const okaluera = localFont({
  src: './fonts/Okaluera.otf',
  variable: '--font-okaluera',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Villa Aura',
  description: 'An immersive luxury experience above the ocean cliffs.',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${okaluera.variable} ${cormorant.variable} ${jost.variable}`}>
        {children}
      </body>
    </html>
  )
}
