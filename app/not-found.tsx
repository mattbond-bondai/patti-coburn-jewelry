import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-heaven-gradient">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-28 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-4 font-serif text-4xl text-text">This page has gone home</h1>
        <p className="mt-4 max-w-md text-muted">
          The page you are looking for does not exist, but there is plenty of beauty to see back
          on the main path.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </section>
  )
}
