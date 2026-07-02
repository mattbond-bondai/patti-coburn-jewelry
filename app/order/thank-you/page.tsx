import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Thank You for Your Order',
  robots: { index: false, follow: false }
}

export default function ThankYouPage() {
  return (
    <section className="bg-heaven-gradient">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-28 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Order received
        </p>
        <h1 className="mt-4 font-serif text-4xl text-text md:text-5xl">Thank you!</h1>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
          Your order has been received. Patti will begin working on your piece and will email you
          personally with confirmation and shipping details.
        </p>
        <p className="mt-6 max-w-md font-serif text-lg italic text-muted">
          &ldquo;Every good gift and every perfect gift is from above.&rdquo;
          <span className="mt-1 block text-sm not-italic tracking-wide">James 1:17</span>
        </p>
        <Link
          href="/collection/"
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
        >
          Continue browsing
        </Link>
      </div>
    </section>
  )
}
