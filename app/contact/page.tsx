import type { Metadata } from 'next'
import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact | Order Handmade Christian Jewelry',
  description:
    'Contact Patti Coburn Jewelry to order the Glimpse of Heaven bracelet, ask about a piece, or request a custom faith-inspired design.'
}

const reasons = [
  {
    title: 'Order a piece',
    body: 'Tell Patti which piece caught your eye and she will follow up with sizing, stone options, and payment details.',
    subject: 'Jewelry order'
  },
  {
    title: 'Request a custom design',
    body: 'Share a verse, a birthstone, an occasion, or a color palette, and Patti will design something one of a kind around it.',
    subject: 'Custom jewelry request'
  },
  {
    title: 'Ask a question',
    body: 'Questions about materials, care, gifting, or anything else are always welcome.',
    subject: 'Question about your jewelry'
  }
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-heaven-gradient">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Contact</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-text md:text-5xl">
            Patti would love to hear from you
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            Every piece is handmade to order in Plano, Texas. Email is the best way to reach
            Patti, and she answers personally.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-7 inline-block rounded-full bg-primary px-7 py-3 text-base font-medium text-white shadow-soft transition-opacity hover:opacity-90"
          >
            {siteConfig.email}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col rounded-2xl border border-border bg-surface p-7 shadow-card"
            >
              <h2 className="font-serif text-xl text-text">{reason.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{reason.body}</p>
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(reason.subject)}`}
                className="mt-5 text-sm font-medium text-primary hover:underline"
              >
                Email about this &rarr;
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          Prefer to include a photo or a Pinterest inspiration? Attachments are welcome &mdash;
          they help Patti match stones and styles.
        </p>
      </section>
    </>
  )
}
