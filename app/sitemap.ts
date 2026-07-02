import type { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/glimpse-of-heaven', '/collection', '/bible-study', '/about', '/contact']
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}/`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : route === '/glimpse-of-heaven' ? 0.9 : 0.7
  }))
}
