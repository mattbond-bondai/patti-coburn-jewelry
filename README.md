# Patti Coburn Jewelry

Faith-inspired handmade gemstone jewelry site for Patti Coburn, home of the signature
"A Glimpse of Heaven" bracelet (the twelve foundation stones of Revelation 21:19-20).

Built with the same stack as bondsolutions.ai: Next.js 14 (App Router) + TypeScript +
Tailwind CSS, exported as a fully static site so it can be hosted for free and stay
live with no computer running at home.

## Stack

- Next.js 14 (App Router, `output: 'export'` static site)
- TypeScript
- Tailwind CSS with CSS variables (light, airy, gold/ivory/sky palette)
- No backend needed; orders go through email links

## Local development

```powershell
npm install
npm run dev     # http://localhost:3000
npm run build   # static site written to /out
```

## Content editing

- Site name, email, tagline: `data/site.ts` (`siteConfig`)
- Jewelry pieces (photos, descriptions, details): `data/site.ts` (`pieces`)
- The twelve stones and meanings: `data/site.ts` (`foundationStones`)
- Bible studies: `app/bible-study/page.tsx`
- About Patti: `app/about/page.tsx` (personalize this with her real story)
- Photos live in `public/images/` (add new ones there and reference in `data/site.ts`)

## SEO

- Per-page titles/descriptions via Next.js Metadata API
- Open Graph + Twitter cards
- JSON-LD: Organization, WebSite, and Product (Glimpse of Heaven)
- `sitemap.xml` and `robots.txt` generated at build
- Descriptive alt text on all photos

When the real domain is purchased, update `NEXT_PUBLIC_SITE_URL` in
`.github/workflows/deploy.yml` and `siteConfig.url` in `data/site.ts`.

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static site
and publishes it to GitHub Pages. The site stays live 24/7 with nothing running locally.

To attach a custom domain later: repo Settings > Pages > Custom domain, then set
`NEXT_PUBLIC_BASE_PATH` to empty in the workflow and update `NEXT_PUBLIC_SITE_URL`.
