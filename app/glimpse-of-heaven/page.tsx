import type { Metadata } from 'next'
import Image from 'next/image'
import Scripture from '@/components/scripture'
import StoneGrid from '@/components/stone-grid'
import JSONLD from '@/components/jsonld'
import { pieces, siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'A Glimpse of Heaven Bracelet | The Twelve Foundation Stones of Revelation 21',
  description:
    'The Glimpse of Heaven bracelet holds all twelve foundation stones of the New Jerusalem from Revelation 21:19-20, handcrafted with genuine gemstones and a sterling silver cross.',
  openGraph: {
    title: 'A Glimpse of Heaven Bracelet',
    description:
      'All twelve foundation stones of the New Jerusalem in one handcrafted bracelet. A wearable reminder of our eternal home.',
    images: ['/images/glimpse-of-heaven-bracelet.png']
  }
}

export default function GlimpseOfHeavenPage() {
  const piece = pieces.find((p) => p.slug === 'glimpse-of-heaven-bracelet')!

  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Our signature piece
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-5xl">
            A Glimpse of Heaven
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            Twelve stones. One promise. A handcrafted bracelet that carries the very gemstones
            John saw in his vision of the heavenly city &mdash; a daily reminder of our eternal
            home.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
              <Image
                src={piece.image}
                alt={piece.alt}
                width={576}
                height={1024}
                priority
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
              <Image
                src="/images/glimpse-of-heaven-cross-detail.png"
                alt="The Glimpse of Heaven bracelet laid out to show the sterling silver cross charm and clasp"
                width={576}
                height={1024}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div>
            <Scripture reference="Revelation 21:19-20">
              The foundations of the wall of the city were adorned with all kinds of precious
              stones: the first foundation was jasper, the second sapphire, the third chalcedony,
              the fourth emerald, the fifth sardonyx, the sixth sardius, the seventh chrysolite,
              the eighth beryl, the ninth topaz, the tenth chrysoprase, the eleventh jacinth, and
              the twelfth amethyst.
            </Scripture>

            <div className="mt-8 space-y-4 leading-relaxed text-muted">
              <p>
                At the end of the Bible, John is given a vision of the New Jerusalem &mdash; a
                city whose foundations are covered in gemstones, whose gates are pearls, and whose
                streets are pure gold. It is one of the most breathtaking pictures of Heaven in
                all of Scripture.
              </p>
              <p>
                The Glimpse of Heaven bracelet gathers all twelve of those foundation stones into
                a single strand, in order, each separated by sterling silver and finished with a
                cross &mdash; because the cross is the only way home.
              </p>
              <p>
                This bracelet serves as a reminder of our eternal home. Wear it as encouragement,
                give it as comfort, and let it open conversations about the hope it represents.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h2 className="font-serif text-xl text-text">Details</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {piece.details.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${siteConfig.email}?subject=A Glimpse of Heaven bracelet order`}
                className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
              >
                Order by email
              </a>
              <p className="mt-3 text-xs text-muted">
                Each bracelet is handmade to order. Sizing and stone variations welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-text md:text-4xl">The twelve stones</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Each stone in the bracelet corresponds to a foundation of the heavenly city, in the
              order John recorded them.
            </p>
          </div>
          <div className="mt-10">
            <StoneGrid />
          </div>
        </div>
      </section>

      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'A Glimpse of Heaven Bracelet',
          image: `${siteConfig.url}/images/glimpse-of-heaven-bracelet.png`,
          description:
            'Handcrafted bracelet featuring the twelve foundation stones of Revelation 21:19-20 with sterling silver and a cross charm. A wearable reminder of our eternal home.',
          brand: { '@type': 'Brand', name: siteConfig.name },
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/MadeToOrder',
            url: `${siteConfig.url}/glimpse-of-heaven/`
          }
        }}
      />
    </>
  )
}
