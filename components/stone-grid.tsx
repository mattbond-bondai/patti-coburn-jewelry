import { foundationStones } from '@/data/site'

export default function StoneGrid({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2" aria-label="The twelve foundation stones">
        {foundationStones.map((stone) => (
          <span
            key={stone.order}
            title={stone.name}
            className="h-4 w-4 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: stone.swatch }}
          />
        ))}
      </div>
    )
  }

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {foundationStones.map((stone) => (
        <li
          key={stone.order}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-card"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white shadow"
            style={{ backgroundColor: stone.swatch }}
          >
            {stone.order}
          </span>
          <div>
            <h3 className="font-serif text-lg text-text">{stone.name}</h3>
            <p className="text-xs uppercase tracking-wide text-muted">{stone.color}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{stone.meaning}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
