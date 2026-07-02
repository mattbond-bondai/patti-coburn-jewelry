export const siteConfig = {
  name: 'Patti Coburn Jewelry',
  tagline: 'Faith-inspired handmade gemstone jewelry',
  description:
    'Handcrafted Christian gemstone jewelry by Patti Coburn. Home of the Glimpse of Heaven bracelet, inspired by the twelve foundation stones of Revelation 21:19-20.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://patticoburnjewelry.com',
  email: 'patti@ccplano.com',
  location: 'Plano, Texas'
}

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/glimpse-of-heaven/', label: 'A Glimpse of Heaven' },
  { href: '/collection/', label: 'Collection' },
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

export interface Piece {
  slug: string
  name: string
  image: string
  alt: string
  description: string
  details: string[]
  featured?: boolean
}

export const pieces: Piece[] = [
  {
    slug: 'glimpse-of-heaven-bracelet',
    name: 'A Glimpse of Heaven Bracelet',
    image: '/images/glimpse-of-heaven-bracelet.png',
    alt: 'A Glimpse of Heaven bracelet with twelve colorful gemstones, sterling silver spacers, and a silver cross charm',
    description:
      'Our signature piece. Twelve gemstones for the twelve foundation stones of the New Jerusalem, finished with a sterling silver cross. A wearable reminder of our eternal home.',
    details: [
      'All twelve foundation stones of Revelation 21:19-20',
      'Genuine gemstones, freshwater pearls, and Swarovski crystals',
      'Sterling silver and Bali silver accents',
      'Sterling silver cross charm and lobster clasp'
    ],
    featured: true
  },
  {
    slug: 'gemstone-silk-knotted-necklace',
    name: 'Gemstone Silk Knotted Necklace',
    image: '/images/gemstone-silk-knotted-necklace.png',
    alt: 'Hand-knotted silk necklace with aquamarine, freshwater pearls, peridot, turquoise, garnet, and citrine gemstones',
    description:
      'A 19-inch necklace strung on hand-knotted silk in the old-world tradition. Aquamarine, freshwater pearls, peridot, turquoise, garnet, and citrine with Bali and sterling silver.',
    details: [
      'Aquamarine, peridot, turquoise, garnet, and citrine',
      'Freshwater pearls and Swarovski crystals',
      'Hand-knotted silk, 19 inches long',
      'Sterling silver clasp with Bali silver accents'
    ]
  },
  {
    slug: 'one-of-a-kind-collection',
    name: 'One-of-a-Kind Pieces',
    image: '/images/one-of-a-kind-collection.png',
    alt: 'A colorful collection of handmade gemstone bracelets and necklaces in blues, greens, ambers, and reds',
    description:
      'Every piece Patti makes is one of a kind. Lava stone, jade, carnelian, amber, shell, and hand-picked artisan beads come together in designs you will not find anywhere else.',
    details: [
      'No two pieces alike',
      'Natural stones chosen by hand',
      'Custom requests welcome',
      'Made with prayer and care in Texas'
    ]
  }
]
