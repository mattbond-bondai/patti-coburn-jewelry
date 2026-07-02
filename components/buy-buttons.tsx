'use client'

import { useCart } from '@/components/cart-provider'
import type { Product } from '@/data/products'
import { isPurchasable, storeSettings } from '@/data/products'
import { buildOrderEmail, startCheckout } from '@/lib/checkout'

export default function BuyButtons({ product }: { product: Product }) {
  const cart = useCart()

  if (product.sold) {
    return (
      <div>
        <p className="inline-block rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          This piece has found a home
        </p>
        <div className="mt-4">
          <a
            href={`mailto:${storeSettings.contactEmail}?subject=${encodeURIComponent(
              `Similar piece to: ${product.name}`
            )}`}
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
          >
            Ask about a similar piece
          </a>
        </div>
      </div>
    )
  }

  if (!isPurchasable(product)) {
    return (
      <div className="flex flex-wrap gap-3">
        <a
          href={buildOrderEmail([{ product, quantity: 1 }], storeSettings.contactEmail)}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
        >
          Order by email
        </a>
        <a
          href={`mailto:${storeSettings.contactEmail}?subject=${encodeURIComponent(
            `Question about: ${product.name}`
          )}`}
          className="rounded-full border border-primary/40 bg-surface px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          Ask a question
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => {
          cart.add(product.slug)
          cart.setOpen(true)
        }}
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
      >
        Add to cart
      </button>
      <button
        type="button"
        onClick={() => startCheckout([{ product, quantity: 1 }], storeSettings.contactEmail)}
        className="rounded-full border border-primary/40 bg-surface px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        Buy now
      </button>
    </div>
  )
}
