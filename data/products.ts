import storeData from '@/public/data/products.json'
import { asset } from '@/data/site'

export interface Product {
  slug: string
  name: string
  /** Price in whole US dollars; null means "inquire for price". */
  price: number | null
  images: string[]
  alt: string
  description: string
  details: string[]
  featured: boolean
  oneOfAKind: boolean
  inquireOnly: boolean
  sold: boolean
  hidden: boolean
  paymentLink: string
}

export interface StoreSettings {
  contactEmail: string
  checkoutUrl: string
  announcement: string
}

export const storeSettings: StoreSettings = storeData.settings

/** All products, in the display order set in the admin. */
export const allProducts: Product[] = storeData.products as Product[]

/** Products shown on the storefront. */
export const products: Product[] = allProducts.filter((p) => !p.hidden)

export function productImage(product: Product): string {
  return asset(product.images[0] || '/images/glimpse-of-heaven-bracelet.png')
}

export function isPurchasable(product: Product): boolean {
  return !product.sold && !product.inquireOnly && product.price !== null
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Price upon request'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2
  }).format(price)
}
