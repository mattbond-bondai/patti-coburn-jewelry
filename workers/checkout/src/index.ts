/**
 * Cloudflare Worker that creates Stripe Checkout Sessions for the static
 * storefront. Prices are always read from the live site's products.json so
 * the client can never set its own amounts.
 *
 * Deploy:
 *   cd workers/checkout
 *   npx wrangler login
 *   npx wrangler secret put STRIPE_SECRET_KEY   (paste the sk_live_... key)
 *   npx wrangler deploy
 *
 * Then paste the printed workers.dev URL into the admin Settings tab.
 */

interface Env {
  STRIPE_SECRET_KEY: string
  SITE_URL: string
}

interface CartItem {
  slug: string
  quantity: number
}

interface Product {
  slug: string
  name: string
  price: number | null
  images: string[]
  oneOfAKind: boolean
  inquireOnly: boolean
  sold: boolean
  hidden: boolean
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = {
      'Access-Control-Allow-Origin': env.SITE_URL,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors })
    }

    try {
      const { items } = (await request.json()) as { items: CartItem[] }
      if (!Array.isArray(items) || items.length === 0) {
        return json({ error: 'Cart is empty' }, 400, cors)
      }

      const catalogRes = await fetch(`${env.SITE_URL}/data/products.json`, {
        cf: { cacheTtl: 60 }
      })
      const catalog = (await catalogRes.json()) as { products: Product[] }

      const params = new URLSearchParams()
      params.set('mode', 'payment')
      params.set('success_url', `${env.SITE_URL}/order/thank-you/`)
      params.set('cancel_url', `${env.SITE_URL}/collection/`)
      params.set('shipping_address_collection[allowed_countries][0]', 'US')

      let index = 0
      for (const item of items) {
        const product = catalog.products.find((p) => p.slug === item.slug)
        if (!product || product.hidden || product.sold || product.inquireOnly) continue
        if (product.price === null) {
          return json({ error: `${product.name} is priced by request; order it by email.` }, 400, cors)
        }
        const quantity = product.oneOfAKind ? 1 : Math.min(Math.max(1, item.quantity), 10)
        params.set(`line_items[${index}][quantity]`, String(quantity))
        params.set(`line_items[${index}][price_data][currency]`, 'usd')
        params.set(
          `line_items[${index}][price_data][unit_amount]`,
          String(Math.round(product.price * 100))
        )
        params.set(`line_items[${index}][price_data][product_data][name]`, product.name)
        if (product.images[0]) {
          params.set(
            `line_items[${index}][price_data][product_data][images][0]`,
            `${env.SITE_URL}${product.images[0]}`
          )
        }
        index++
      }

      if (index === 0) return json({ error: 'No purchasable items in cart' }, 400, cors)

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      const session = (await stripeRes.json()) as { url?: string; error?: { message: string } }
      if (!stripeRes.ok || !session.url) {
        return json({ error: session.error?.message || 'Stripe error' }, 502, cors)
      }
      return json({ url: session.url }, 200, cors)
    } catch {
      return json({ error: 'Invalid request' }, 400, cors)
    }
  }
}

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors }
  })
}
