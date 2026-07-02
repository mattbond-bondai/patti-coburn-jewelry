import type { Metadata } from 'next'
import Image from 'next/image'
import { pieces, siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'Handmade Gemstone Jewelry Collection',
  description:
    'Browse one-of-a-kind handmade Christian jewelry by Patti Coburn: gemstone bracelets, silk-knotted necklaces, and custom faith-inspired designs.'
}

export default function CollectionPage() {
  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            The collection
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-5xl">
            One of a kind, every time
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            Genuine gemstones, freshwater pearls, Swarovski crystals, and sterling silver &mdash;
            hand-selected and hand-strung. No two pieces are ever alike.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="space-y-14">
          {pieces.map((piece, i) => (
            <article
              key={piece.slug}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <div className={`mx-auto w-full max-w-sm ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-border">
                  <Image
                    src={piece.image}
                    alt={piece.alt}
                    width={720}
                    height={900}
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <h2 className="font-serif text-3xl text-text">{piece.name}</h2>
                <p className="mt-4 leading-relaxed text-muted">{piece.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted">
                  {piece.details.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${siteConfig.email}?subject=Inquiry: ${encodeURIComponent(piece.name)}`}
                  className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
                >
                  Ask about this piece
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <h2 className="font-serif text-3xl text-text">Custom designs</h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-muted">
            Have a favorite verse, a birthstone, or a loved one to honor? Patti loves creating
            custom pieces with meaning woven into every stone.
          </p>
          <a
            href={`mailto:${siteConfig.email}?subject=Custom jewelry request`}
            className="mt-6 inline-block rounded-full border border-primary/40 bg-bg px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Request a custom piece
          </a>
        </div>
      </section>
    </>
  )
}
