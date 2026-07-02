import type { Product } from '@/data/products'
import { storeSettings } from '@/data/products'

export interface CheckoutLine {
  product: Product
  quantity: number
}

/**
 * Starts checkout for the given lines, preferring (in order):
 * 1. The configured checkout endpoint (Cloudflare Worker creating a Stripe
 *    Checkout Session) which supports full multi-item carts.
 * 2. A per-product Stripe Payment Link when there is a single line.
 * 3. An email order to the shop address as the universal fallback.
 *
 * Returns an error message to surface to the shopper, or null on redirect.
 */
export async function startCheckout(lines: CheckoutLine[], email: string): Promise<string | null> {
  if (lines.length === 0) return 'Your cart is empty.'

  if (storeSettings.checkoutUrl) {
    try {
      const res = await fetch(storeSettings.checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.product.slug, quantity: l.quantity }))
        })
      })
      if (res.ok) {
        const data = (await res.json()) as { url?: string }
        if (data.url) {
          window.location.href = data.url
          return null
        }
      }
    } catch {
      // fall through to the next option
    }
  }

  if (lines.length === 1 && lines[0].quantity === 1 && lines[0].product.paymentLink) {
    window.location.href = lines[0].product.paymentLink
    return null
  }

  window.location.href = buildOrderEmail(lines, email)
  return null
}

export function buildOrderEmail(lines: CheckoutLine[], email: string): string {
  const summary = lines
    .map((l) => `- ${l.product.name} x${l.quantity}${l.product.price ? ` ($${l.product.price} each)` : ''}`)
    .join('\n')
  const body =
    `Hi Patti,\n\nI would like to order the following:\n\n${summary}\n\n` +
    `My shipping address:\n\n\nThank you!`
  return `mailto:${email}?subject=${encodeURIComponent('Order request')}&body=${encodeURIComponent(body)}`
}
