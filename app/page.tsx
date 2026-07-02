import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import StoneGrid from '@/components/stone-grid'
import { asset, siteConfig } from '@/data/site'
import { formatPrice, productImage, products } from '@/data/products'

export const metadata: Metadata = {
  title: 'Patti Coburn Jewelry | Faith-Inspired Handmade Gemstone Jewelry',
  description:
    'Handcrafted Christian gemstone jewelry made with prayer and care. Home of the Glimpse of Heaven bracelet with the twelve foundation stones of Revelation 21.'
}

export default function HomePage() {
  const featured = products.find((p) => p.featured) ?? products[0]
  const others = products.filter((p) => p.slug !== featured.slug)

  return (
    <>
      {/* Hero */}
      <section className="bg-heaven-gradient">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="text-center md:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Handmade in Texas &middot; Inspired by Scripture
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-6xl">
              Jewelry that carries
              <span className="block italic text-primary">a glimpse of Heaven</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted md:mx-0">
              One-of-a-kind gemstone jewelry, handcrafted by Patti Coburn and inspired by the
              beauty of God&apos;s Word. Every piece tells a story of faith.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/glimpse-of-heaven/"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
              >
                Discover A Glimpse of Heaven
              </Link>
              <Link
                href="/collection/"
                className="rounded-full border border-primary/40 bg-surface px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                Shop the Collection
              </Link>
            </div>
            <div className="mt-10">
              <StoneGrid compact />
              <p className="mt-2 text-xs tracking-wide text-muted">
                The twelve foundation stones of the New Jerusalem
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
              <Image
                src={productImage(featured)}
                alt={featured.alt}
                width={576}
                height={1024}
                priority
                className="h-auto w-full"
              />
            </div>
            <p className="mt-3 text-center font-serif text-lg italic text-muted">
              A Glimpse of Heaven &mdash; our signature bracelet
            </p>
          </div>
        </div>
      </section>

      {/* Scripture strip */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-text/90 md:text-2xl">
            &ldquo;The foundations of the wall of the city were adorned with all kinds of precious
            stones.&rdquo;
          </p>
          <p className="mt-3 text-sm tracking-widest text-primary">REVELATION 21:19</p>
        </div>
      </section>

      {/* Featured piece */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-3xl text-text md:text-4xl">
              The story behind our best-loved piece
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              The Glimpse of Heaven bracelet gathers all twelve foundation stones of the heavenly
              city described in Revelation 21 &mdash; jasper, sapphire, chalcedony, emerald,
              sardonyx, sardius, chrysolite, beryl, topaz, chrysoprase, jacinth, and amethyst
              &mdash; finished with a sterling silver cross.
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              It is more than jewelry. It is a daily, wearable reminder of our eternal home.
            </p>
            <Link
              href="/glimpse-of-heaven/"
              className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
            >
              Read the full story
            </Link>
          </div>
          <div className="order-1 mx-auto w-full max-w-sm md:order-2">
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
              <Image
                src={asset('/images/glimpse-of-heaven-cross-detail.png')}
                alt="Close-up of the Glimpse of Heaven bracelet showing the sterling silver cross charm"
                width={576}
                height={1024}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collection preview */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-text md:text-4xl">From the collection</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Every piece is one of a kind &mdash; genuine gemstones, freshwater pearls, and
              sterling silver, strung by hand.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[featured, ...others].map((piece) => (
              <Link
                key={piece.slug}
                href={`/collection/${piece.slug}/`}
                className="group overflow-hidden rounded-2xl border border-border bg-bg shadow-card transition-shadow hover:shadow-soft"
              >
                <div className="aspect-[4/5] overflow-hidden bg-white">
                  <Image
                    src={productImage(piece)}
                    alt={piece.alt}
                    width={576}
                    height={720}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-text">{piece.name}</h3>
                  <p className="mt-1 text-sm text-primary">{formatPrice(piece.price)}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    {piece.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/collection/"
              className="rounded-full border border-primary/40 bg-bg px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Shop the full collection
            </Link>
          </div>
        </div>
      </section>

      {/* Bible study + about teaser */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-card">
            <h2 className="font-serif text-2xl text-text md:text-3xl">Gems of Scripture</h2>
            <p className="mt-3 leading-relaxed text-muted">
              God fills His Word with precious stones, from the High Priest&apos;s breastpiece to
              the foundations of the New Jerusalem. Explore short devotional studies behind the
              stones in Patti&apos;s designs.
            </p>
            <Link
              href="/bible-study/"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Start the Bible study &rarr;
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-card">
            <h2 className="font-serif text-2xl text-text md:text-3xl">Meet Patti</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Patti Coburn designs and strings every piece herself, pairing genuine gemstones with
              scripture so that beauty and truth travel together.
            </p>
            <Link
              href="/about/"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Read Patti&apos;s story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="font-serif text-3xl text-text md:text-4xl">
            Order a piece, or ask about a custom design
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Each piece is made to order with prayer and care. Reach out and Patti will get back to
            you personally.
          </p>
          <a
            href={`mailto:${siteConfig.email}?subject=Jewelry inquiry`}
            className="mt-7 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
          >
            Email {siteConfig.email}
          </a>
        </div>
      </section>
    </>
  )
}
