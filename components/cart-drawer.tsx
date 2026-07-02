'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-provider'
import { formatPrice, productImage, storeSettings } from '@/data/products'
import { startCheckout } from '@/lib/checkout'

export default function CartDrawer() {
  const cart = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!cart.open) return null

  const hasUnpriced = cart.resolved.some((l) => l.product.price === null)

  async function onCheckout() {
    setBusy(true)
    setError(null)
    const message = await startCheckout(cart.resolved, storeSettings.contactEmail)
    if (message) setError(message)
    setBusy(false)
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/30"
        onClick={() => cart.setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-xl text-text">Your cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text"
            onClick={() => cart.setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {cart.resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link
              href="/collection/"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft"
              onClick={() => cart.setOpen(false)}
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {cart.resolved.map(({ product, quantity }) => (
                <li key={product.slug} className="flex gap-4 rounded-xl border border-border bg-surface p-3">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={productImage(product)}
                      alt={product.alt}
                      width={128}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium text-text">{product.name}</p>
                    <p className="text-sm text-muted">{formatPrice(product.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      {product.oneOfAKind ? (
                        <span className="text-xs text-muted">One of a kind</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="px-2.5 py-1 text-sm text-text"
                            onClick={() => cart.setQuantity(product.slug, quantity - 1)}
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center text-sm">{quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            className="px-2.5 py-1 text-sm text-text"
                            onClick={() => cart.setQuantity(product.slug, quantity + 1)}
                          >
                            +
                          </button>
                        </span>
                      )}
                      <button
                        type="button"
                        className="text-xs text-muted underline hover:text-primary"
                        onClick={() => cart.remove(product.slug)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-text">
                  {hasUnpriced ? 'Quoted by email' : formatPrice(cart.subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Shipping and any adjustments are confirmed before payment.
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <button
                type="button"
                disabled={busy}
                onClick={onCheckout}
                className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy ? 'Starting checkout...' : 'Checkout'}
              </button>
              <p className="mt-2 text-center text-xs text-muted">
                Secure card checkout when available, otherwise your order is sent by email and
                Patti follows up personally.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
