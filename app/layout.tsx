import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import JSONLD from '@/components/jsonld'
import { siteConfig } from '@/data/site'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif'
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Patti Coburn Jewelry | Faith-Inspired Handmade Gemstone Jewelry',
    template: '%s | Patti Coburn Jewelry'
  },
  description: siteConfig.description,
  keywords: [
    'Christian jewelry',
    'faith-based jewelry',
    'handmade gemstone jewelry',
    'Glimpse of Heaven bracelet',
    'Revelation 21 jewelry',
    'twelve foundation stones',
    'religious gifts for women',
    'Christian gifts',
    'handmade bracelets',
    'Patti Coburn'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Patti Coburn Jewelry | Faith-Inspired Handmade Gemstone Jewelry',
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/images/glimpse-of-heaven-bracelet.png`,
        width: 576,
        height: 1024,
        alt: 'A Glimpse of Heaven bracelet by Patti Coburn'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patti Coburn Jewelry',
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/glimpse-of-heaven-bracelet.png`]
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <JSONLD
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            email: siteConfig.email,
            description: siteConfig.description,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Plano',
              addressRegion: 'TX',
              addressCountry: 'US'
            }
          }}
        />
        <JSONLD
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url
          }}
        />
      </body>
    </html>
  )
}
