export default function Scripture({
  children,
  reference,
  className = ''
}: {
  children: React.ReactNode
  reference: string
  className?: string
}) {
  return (
    <figure className={`border-l-2 border-primary/60 pl-5 ${className}`}>
      <blockquote className="font-serif text-lg italic leading-relaxed text-text/90 md:text-xl">
        &ldquo;{children}&rdquo;
      </blockquote>
      <figcaption className="mt-2 text-sm tracking-wide text-primary">{reference}</figcaption>
    </figure>
  )
}
