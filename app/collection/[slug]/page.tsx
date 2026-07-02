import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BuyButtons from '@/components/buy-buttons'
import ProductGallery from '@/components/product-gallery'
import JSONLD from '@/components/jsonld'
import { formatPrice, products } from '@/data/products'
import { siteConfig } from '@/data/site'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const product = products.find((p) => p.slug === params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [`${siteConfig.url}${product.images[0]}`]
    }
  }
}

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug)
  if (!product) notFound()

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/collection/" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-text">{product.name}</span>
        </nav>

        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <ProductGallery images={product.images} alt={product.alt} />
          </div>

          <div>
            {product.featured && (
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                Our signature piece
              </p>
            )}
            <h1 className="mt-2 font-serif text-3xl text-text md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-xl text-primary">{formatPrice(product.price)}</p>

            <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

            <ul className="mt-6 space-y-2 text-sm text-muted">
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <BuyButtons product={product} />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              Every piece is handmade by Patti in Plano, Texas. Questions about sizing, stones, or
              gifting? Reach out any time &mdash; she answers personally.
            </p>

            {product.slug === 'glimpse-of-heaven-bracelet' && (
              <Link
                href="/glimpse-of-heaven/"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Read the story behind this piece &rarr;
              </Link>
            )}
          </div>
        </div>
      </section>

      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.images.map((img) => `${siteConfig.url}${img}`),
          description: product.description,
          brand: { '@type': 'Brand', name: siteConfig.name },
          offers: {
            '@type': 'Offer',
            url: `${siteConfig.url}/collection/${product.slug}/`,
            ...(product.price !== null
              ? { price: product.price, priceCurrency: 'USD' }
              : {}),
            availability: product.sold
              ? 'https://schema.org/SoldOut'
              : 'https://schema.org/InStock'
          }
        }}
      />
    </>
  )
}
