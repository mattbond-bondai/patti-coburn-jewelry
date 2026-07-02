'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product, StoreSettings } from '@/data/products'
import type { GhAuth, WorkflowRun } from '@/lib/github'
import { getFile, latestRun, putFile, textToBase64, validateAuth } from '@/lib/github'
import ProductEditor from '@/components/admin/product-editor'

interface StoreData {
  settings: StoreSettings
  products: Product[]
}

const AUTH_KEY = 'pcj-admin-auth'
const PRODUCTS_PATH = 'public/data/products.json'
const DEFAULT_AUTH: GhAuth = {
  token: '',
  owner: 'mattbond-bondai',
  repo: 'patti-coburn-jewelry',
  branch: 'main'
}

type Tab = 'products' | 'settings' | 'help'
type PublishState = 'idle' | 'saving' | 'building' | 'live' | 'failed'

export default function AdminApp() {
  const [auth, setAuth] = useState<GhAuth | null>(null)
  const [data, setData] = useState<StoreData | null>(null)
  const [sha, setSha] = useState('')
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState<Tab>('products')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [publish, setPublish] = useState<PublishState>('idle')
  const [runUrl, setRunUrl] = useState('')
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(async (candidate: GhAuth) => {
    setError(null)
    await validateAuth(candidate)
    const file = await getFile(candidate, PRODUCTS_PATH)
    setData(JSON.parse(file.text) as StoreData)
    setSha(file.sha)
    setAuth(candidate)
    localStorage.setItem(AUTH_KEY, JSON.stringify(candidate))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY)
    if (!saved) return
    connect(JSON.parse(saved) as GhAuth).catch((e: Error) => {
      setError(`Saved sign-in no longer works: ${e.message}`)
      localStorage.removeItem(AUTH_KEY)
    })
  }, [connect])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => () => {
    if (pollRef.current) clearTimeout(pollRef.current)
  }, [])

  function update(mutate: (draft: StoreData) => void) {
    setData((prev) => {
      if (!prev) return prev
      const draft: StoreData = JSON.parse(JSON.stringify(prev))
      mutate(draft)
      return draft
    })
    setDirty(true)
  }

  function pollBuild(currentAuth: GhAuth, startedAfter: number) {
    const tick = async () => {
      try {
        const run: WorkflowRun | null = await latestRun(currentAuth)
        if (run && new Date(run.created_at).getTime() >= startedAfter) {
          setRunUrl(run.html_url)
          if (run.status === 'completed') {
            setPublish(run.conclusion === 'success' ? 'live' : 'failed')
            return
          }
        }
      } catch {
        // transient polling errors are fine
      }
      pollRef.current = setTimeout(tick, 8000)
    }
    pollRef.current = setTimeout(tick, 4000)
  }

  async function onPublish() {
    if (!auth || !data) return
    setPublish('saving')
    setError(null)
    try {
      const json = `${JSON.stringify(data, null, 2)}\n`
      const startedAfter = Date.now() - 5000
      const result = await putFile(
        auth,
        PRODUCTS_PATH,
        textToBase64(json),
        'Admin: update products and settings',
        sha
      )
      setSha(result.sha)
      setDirty(false)
      setPublish('building')
      pollBuild(auth, startedAfter)
    } catch (e) {
      setPublish('idle')
      const message = (e as Error).message
      if (message.includes('409')) {
        setError('The site was changed somewhere else. Refresh the page, then redo your edits.')
      } else {
        setError(message)
      }
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setData(null)
    setDirty(false)
  }

  if (!auth || !data) {
    return <LoginScreen onConnect={connect} error={error} setError={setError} />
  }

  const editing = editingSlug ? data.products.find((p) => p.slug === editingSlug) : null

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text">Shop admin</h1>
          <p className="mt-1 text-sm text-muted">
            Signed in to {auth.owner}/{auth.repo}
            <button type="button" onClick={logout} className="ml-3 text-primary underline">
              Sign out
            </button>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PublishStatus state={publish} runUrl={runUrl} />
          <button
            type="button"
            onClick={onPublish}
            disabled={!dirty || publish === 'saving'}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {publish === 'saving' ? 'Publishing...' : dirty ? 'Publish changes' : 'Published'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-1 border-b border-border">
        {(['products', 'settings', 'help'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t)
              setEditingSlug(null)
            }}
            className={`rounded-t-lg px-4 py-2 text-sm capitalize ${
              tab === t ? 'border border-b-0 border-border bg-surface text-text' : 'text-muted hover:text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && !editing && (
        <ProductList
          products={data.products}
          onEdit={(slug) => setEditingSlug(slug)}
          onAdd={() => {
            const slug = uniqueSlug('new-piece', data.products)
            update((d) => {
              d.products.unshift(newProduct(slug))
            })
            setEditingSlug(slug)
          }}
          onMove={(index, dir) =>
            update((d) => {
              const target = index + dir
              if (target < 0 || target >= d.products.length) return
              const [item] = d.products.splice(index, 1)
              d.products.splice(target, 0, item)
            })
          }
          onToggleHidden={(slug) =>
            update((d) => {
              const p = d.products.find((x) => x.slug === slug)
              if (p) p.hidden = !p.hidden
            })
          }
          onDelete={(slug) => {
            if (!window.confirm('Delete this product? This cannot be undone after publishing.')) return
            update((d) => {
              d.products = d.products.filter((x) => x.slug !== slug)
            })
          }}
        />
      )}

      {tab === 'products' && editing && auth && (
        <ProductEditor
          key={editing.slug}
          product={editing}
          auth={auth}
          allSlugs={data.products.map((p) => p.slug)}
          onChange={(next) =>
            update((d) => {
              const i = d.products.findIndex((p) => p.slug === editing.slug)
              if (i >= 0) d.products[i] = next
            })
          }
          onRename={(newSlug) => {
            update((d) => {
              const p = d.products.find((x) => x.slug === editing.slug)
              if (p) p.slug = newSlug
            })
            setEditingSlug(newSlug)
          }}
          onBack={() => setEditingSlug(null)}
        />
      )}

      {tab === 'settings' && (
        <SettingsForm
          settings={data.settings}
          onChange={(next) =>
            update((d) => {
              d.settings = next
            })
          }
        />
      )}

      {tab === 'help' && <HelpTab auth={auth} />}
    </section>
  )
}

function LoginScreen({
  onConnect,
  error,
  setError
}: {
  onConnect: (auth: GhAuth) => Promise<void>
  error: string | null
  setError: (e: string | null) => void
}) {
  const [token, setToken] = useState('')
  const [owner, setOwner] = useState(DEFAULT_AUTH.owner)
  const [repo, setRepo] = useState(DEFAULT_AUTH.repo)
  const [busy, setBusy] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await onConnect({ token: token.trim(), owner, repo, branch: 'main' })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-center font-serif text-3xl text-text">Shop admin</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Sign in with your GitHub access key to manage products, prices, photos, and settings.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <label className="block text-sm font-medium text-text" htmlFor="admin-token">
          Access key
        </label>
        <input
          id="admin-token"
          type="password"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_..."
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-3 text-xs text-muted underline"
        >
          {showAdvanced ? 'Hide' : 'Show'} advanced settings
        </button>
        {showAdvanced && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-muted">
              Owner
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text"
              />
            </label>
            <label className="text-xs text-muted">
              Repository
              <input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy || !token.trim()}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <details className="mt-6 rounded-2xl border border-border bg-surface p-5 text-sm text-muted">
        <summary className="cursor-pointer font-medium text-text">
          How to create your access key (one time)
        </summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            Go to{' '}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              github.com/settings/personal-access-tokens/new
            </a>{' '}
            while signed in to the GitHub account that owns the site.
          </li>
          <li>Name it &ldquo;Jewelry site admin&rdquo; and set expiration to 1 year.</li>
          <li>Under Repository access choose Only select repositories and pick the site repository.</li>
          <li>Under Permissions, set Contents to Read and write.</li>
          <li>Click Generate token and paste it here.</li>
        </ol>
        <p className="mt-3">
          The key is stored only in this browser. Sign out to remove it.
        </p>
      </details>
    </section>
  )
}

function PublishStatus({ state, runUrl }: { state: PublishState; runUrl: string }) {
  if (state === 'idle') return null
  const label =
    state === 'saving'
      ? 'Saving...'
      : state === 'building'
        ? 'Updating the live site (about 2 min)...'
        : state === 'live'
          ? 'Live'
          : 'Publish failed'
  const tone =
    state === 'live'
      ? 'bg-green-100 text-green-800'
      : state === 'failed'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-800'
  return (
    <a
      href={runUrl || undefined}
      target="_blank"
      rel="noreferrer"
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${tone}`}
    >
      {label}
    </a>
  )
}

function ProductList({
  products,
  onEdit,
  onAdd,
  onMove,
  onToggleHidden,
  onDelete
}: {
  products: Product[]
  onEdit: (slug: string) => void
  onAdd: () => void
  onMove: (index: number, dir: -1 | 1) => void
  onToggleHidden: (slug: string) => void
  onDelete: (slug: string) => void
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {products.length} products. The order here is the order shoppers see.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full border border-primary/40 bg-surface px-5 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Add product
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {products.map((p, i) => (
          <li
            key={p.slug}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-card"
          >
            <img
              src={p.images[0] || ''}
              alt=""
              className="h-16 w-14 rounded-lg object-cover ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-text">{p.name}</p>
              <p className="text-sm text-muted">
                {p.price !== null ? `$${p.price}` : 'Price upon request'}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.featured && <Chip label="Featured" tone="gold" />}
                {p.hidden && <Chip label="Hidden" tone="gray" />}
                {p.sold && <Chip label="Sold" tone="red" />}
                {p.oneOfAKind && <Chip label="One of a kind" tone="blue" />}
                {p.inquireOnly && <Chip label="Inquire only" tone="gray" />}
                {p.paymentLink && <Chip label="Card checkout" tone="green" />}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <IconButton label="Move up" disabled={i === 0} onClick={() => onMove(i, -1)}>
                &uarr;
              </IconButton>
              <IconButton
                label="Move down"
                disabled={i === products.length - 1}
                onClick={() => onMove(i, 1)}
              >
                &darr;
              </IconButton>
              <button
                type="button"
                onClick={() => onToggleHidden(p.slug)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-primary"
              >
                {p.hidden ? 'Show' : 'Hide'}
              </button>
              <button
                type="button"
                onClick={() => onEdit(p.slug)}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(p.slug)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Chip({ label, tone }: { label: string; tone: 'gold' | 'gray' | 'red' | 'blue' | 'green' }) {
  const tones = {
    gold: 'bg-amber-100 text-amber-800',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700'
  }
  return <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${tones[tone]}`}>{label}</span>
}

function IconButton({
  label,
  disabled,
  onClick,
  children
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm text-text disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function SettingsForm({
  settings,
  onChange
}: {
  settings: StoreSettings
  onChange: (next: StoreSettings) => void
}) {
  return (
    <div className="mt-6 max-w-xl space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-text">Contact and order email</span>
        <input
          type="email"
          value={settings.contactEmail}
          onChange={(e) => onChange({ ...settings, contactEmail: e.target.value })}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        />
        <span className="mt-1 block text-xs text-muted">
          Every Order and Contact button on the site uses this address.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-text">Announcement bar</span>
        <input
          value={settings.announcement}
          onChange={(e) => onChange({ ...settings, announcement: e.target.value })}
          placeholder="Example: Christmas orders ship by December 18"
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        />
        <span className="mt-1 block text-xs text-muted">
          Shows at the very top of every page. Leave empty to hide it.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-text">Card checkout endpoint (optional)</span>
        <input
          value={settings.checkoutUrl}
          onChange={(e) => onChange({ ...settings, checkoutUrl: e.target.value })}
          placeholder="https://checkout.patticoburnjewelry.com"
          className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        />
        <span className="mt-1 block text-xs text-muted">
          Advanced: URL of the Stripe checkout service (see the Help tab). When set, the cart
          checks out by card for all priced items. When empty, checkout falls back to Stripe
          Payment Links per piece, then to email orders.
        </span>
      </label>
    </div>
  )
}

function HelpTab({ auth }: { auth: GhAuth }) {
  return (
    <div className="prose-sm mt-6 max-w-2xl space-y-6 text-sm leading-relaxed text-muted">
      <section>
        <h2 className="font-serif text-xl text-text">How publishing works</h2>
        <p className="mt-2">
          Edits here are saved to the site&apos;s GitHub repository when you press Publish
          changes. The site rebuilds automatically and your changes are live in about two
          minutes. You can watch progress on the{' '}
          <a
            href={`https://github.com/${auth.owner}/${auth.repo}/actions`}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            build page
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-text">Taking card payments</h2>
        <p className="mt-2">There are two ways to accept cards, both through Stripe:</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>
            Simple: create a free account at{' '}
            <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-primary underline">
              stripe.com
            </a>
            , then for each piece create a Payment Link (Products, then Payment Links) and paste
            it into the piece&apos;s Stripe Payment Link field here. The Buy now button then goes
            straight to a secure Stripe checkout page.
          </li>
          <li>
            Full cart: deploy the small checkout service included in the repository under
            workers/checkout (instructions in the README), then paste its URL into Settings.
            This lets shoppers pay for a whole cart at once.
          </li>
        </ol>
        <p className="mt-2">
          Until one of those is set up, orders arrive by email and you can send an invoice or a
          payment link in reply. No sale is ever lost either way.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-text">Everyday tips</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Mark a piece Sold instead of deleting it; sold pieces show gracefully.</li>
          <li>Hide seasonal pieces instead of deleting them so you can bring them back.</li>
          <li>The first photo on a piece is its cover photo everywhere.</li>
          <li>One of a kind limits the piece to quantity 1 per order.</li>
          <li>Inquire only removes buying buttons and invites an email instead.</li>
        </ul>
      </section>
    </div>
  )
}

function newProduct(slug: string): Product {
  return {
    slug,
    name: 'New piece',
    price: null,
    images: [],
    alt: '',
    description: '',
    details: [],
    featured: false,
    oneOfAKind: true,
    inquireOnly: false,
    sold: false,
    hidden: true,
    paymentLink: ''
  }
}

export function kebab(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlug(base: string, products: Product[]): string {
  const slug = kebab(base) || 'piece'
  if (!products.some((p) => p.slug === slug)) return slug
  let i = 2
  while (products.some((p) => p.slug === `${slug}-${i}`)) i++
  return `${slug}-${i}`
}
