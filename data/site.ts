/**
 * Static export does not apply Next's basePath to unoptimized image srcs,
 * so every asset URL must be prefixed manually (e.g. GitHub Pages project
 * sites live under /repo-name).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function asset(path: string): string {
  return `${basePath}${path}`
}

export const siteConfig = {
  name: 'Patti Coburn Jewelry',
  tagline: 'Faith-inspired handmade gemstone jewelry',
  description:
    'Handcrafted Christian gemstone jewelry by Patti Coburn. Home of the Glimpse of Heaven bracelet, inspired by the twelve foundation stones of Revelation 21:19-20.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://patticoburnjewelry.com',
  email: 'patticoburnjewelry@gmail.com',
  location: 'Plano, Texas'
}

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/glimpse-of-heaven/', label: 'A Glimpse of Heaven' },
  { href: '/collection/', label: 'Shop' },
  { href: '/bible-study/', label: 'Bible Study' },
  { href: '/about/', label: 'About Patti' },
  { href: '/contact/', label: 'Contact' }
]

export interface FoundationStone {
  order: number
  name: string
  color: string
  swatch: string
  meaning: string
}

/**
 * The twelve foundation stones of the New Jerusalem, Revelation 21:19-20.
 * Meanings reflect commonly taught associations, kept devotional rather
 * than doctrinal.
 */
export const foundationStones: FoundationStone[] = [
  { order: 1, name: 'Jasper', color: 'Deep earth red', swatch: '#a4514f', meaning: 'The glory of God, first and foundational' },
  { order: 2, name: 'Sapphire', color: 'Heavenly blue', swatch: '#2f5a9e', meaning: 'The throne of heaven and divine truth' },
  { order: 3, name: 'Chalcedony', color: 'Soft sky blue-gray', swatch: '#9fb8c8', meaning: 'Gentleness and quiet strength' },
  { order: 4, name: 'Emerald', color: 'Living green', swatch: '#2e8b57', meaning: 'New life and the rainbow around the throne' },
  { order: 5, name: 'Sardonyx', color: 'Banded red and white', swatch: '#b2695c', meaning: 'Humanity and purity joined together' },
  { order: 6, name: 'Sardius', color: 'Rich carnelian red', swatch: '#b03a2e', meaning: 'Sacrifice and redeeming love' },
  { order: 7, name: 'Chrysolite', color: 'Golden olive', swatch: '#b5a642', meaning: 'The light of God shining through' },
  { order: 8, name: 'Beryl', color: 'Sea green', swatch: '#76b5a0', meaning: 'God\u2019s power over the deep' },
  { order: 9, name: 'Topaz', color: 'Warm amber', swatch: '#d9a441', meaning: 'The warmth of His presence' },
  { order: 10, name: 'Chrysoprase', color: 'Apple green', swatch: '#7fc98f', meaning: 'Joy and flourishing in Him' },
  { order: 11, name: 'Jacinth', color: 'Violet blue', swatch: '#5a4fcf', meaning: 'Royalty and the majesty of Christ' },
  { order: 12, name: 'Amethyst', color: 'Royal purple', swatch: '#7d4f9e', meaning: 'Completion, kingship, and rest' }
]

// Product data lives in public/data/products.json and is managed from the
// /admin panel. See data/products.ts for the typed accessors.
