import type { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'
import { products } from '@/data/products'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/glimpse-of-heaven', '/collection', '/bible-study', '/about', '/contact']
  const productRoutes = products.map((p) => `/collection/${p.slug}`)
  const lastModified = new Date()

  return [...routes, ...productRoutes].map((route) => ({
    url: `${siteConfig.url}${route}/`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : route === '/glimpse-of-heaven' ? 0.9 : 0.7
  }))
}
