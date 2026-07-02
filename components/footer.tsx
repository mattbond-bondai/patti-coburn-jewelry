import Link from 'next/link'
import { navLinks, siteConfig } from '@/data/site'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <p className="font-serif text-2xl tracking-wide text-text">Patti Coburn</p>
            <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-primary">
              Jewelry
            </p>
          </div>

          <p className="max-w-md font-serif text-lg italic leading-relaxed text-muted">
            &ldquo;Every good gift and every perfect gift is from above.&rdquo;
            <span className="mt-1 block text-sm not-italic tracking-wide">James 1:17</span>
          </p>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-muted">
            <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
              {siteConfig.email}
            </a>
            <span className="mx-2" aria-hidden="true">
              &middot;
            </span>
            {siteConfig.location}
          </div>

          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Handmade with faith, hope, and love.
          </p>
        </div>
      </div>
    </footer>
  )
}
