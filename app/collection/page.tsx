import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, productImage, products, storeSettings } from '@/data/products'

export const metadata: Metadata = {
  title: 'Shop Handmade Gemstone Jewelry',
  description:
    'Shop one-of-a-kind handmade Christian jewelry by Patti Coburn: gemstone bracelets, silk-knotted necklaces, and custom faith-inspired designs.'
}

export default function CollectionPage() {
  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            The shop
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/collection/${product.slug}/`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-soft"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                <Image
                  src={productImage(product)}
                  alt={product.alt}
                  width={576}
                  height={720}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {product.sold && (
                  <span className="absolute left-3 top-3 rounded-full bg-text/80 px-3 py-1 text-xs font-medium text-white">
                    Sold
                  </span>
                )}
                {product.featured && !product.sold && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    Signature piece
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl text-text">{product.name}</h2>
                <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
              </div>
            </Link>
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
            href={`mailto:${storeSettings.contactEmail}?subject=Custom jewelry request`}
            className="mt-6 inline-block rounded-full border border-primary/40 bg-bg px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Request a custom piece
          </a>
        </div>
      </section>
    </>
  )
}
