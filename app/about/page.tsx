import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Scripture from '@/components/scripture'
import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'About Patti Coburn | Faith-Inspired Jewelry Artist',
  description:
    'Meet Patti Coburn, the artist behind Patti Coburn Jewelry. Every handmade gemstone piece is designed and strung by hand, inspired by Scripture.'
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            About the artist
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-5xl">
            Meet Patti
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
              <Image
                src="/images/one-of-a-kind-collection.png"
                alt="A colorful assortment of Patti Coburn's handmade gemstone jewelry"
                width={576}
                height={1024}
                priority
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-center font-serif italic text-muted">
              A gathering of one-of-a-kind pieces from Patti&apos;s worktable
            </p>
          </div>

          <div className="space-y-5 leading-relaxed text-muted">
            <p>
              Patti Coburn designs and strings every piece of jewelry herself &mdash; selecting
              each gemstone, pearl, and silver bead by hand, and pairing them with the Scriptures
              that inspired them.
            </p>
            <p>
              Her work began with a simple idea: that beauty can preach. A bracelet on a wrist or
              a necklace at a neckline gets noticed, and every compliment is a chance to share the
              story behind the stones &mdash; none more so than her signature piece,{' '}
              <Link href="/glimpse-of-heaven/" className="text-primary hover:underline">
                A Glimpse of Heaven
              </Link>
              , built from the twelve foundation stones of Revelation 21.
            </p>
            <p>
              Working from Plano, Texas, Patti makes each piece to order using genuine gemstones,
              freshwater pearls, Swarovski crystals, Bali silver, and sterling silver. No two
              pieces are ever quite alike &mdash; just like the people who wear them.
            </p>

            <Scripture reference="Proverbs 31:10" className="my-8">
              Who can find a virtuous wife? For her worth is far above rubies.
            </Scripture>

            <p>
              Whether you are shopping for yourself, choosing a gift, or hoping to design
              something custom around a meaningful verse, Patti would love to hear from you.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=Hello Patti`}
              className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
            >
              Say hello
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
