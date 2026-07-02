'use client'

import { useRef, useState } from 'react'
import type { Product } from '@/data/products'
import type { GhAuth } from '@/lib/github'
import { prepareImage, putFile, toBase64 } from '@/lib/github'
import { kebab } from '@/components/admin/admin-app'

export default function ProductEditor({
  product,
  auth,
  allSlugs,
  onChange,
  onRename,
  onBack
}: {
  product: Product
  auth: GhAuth
  allSlugs: string[]
  onChange: (next: Product) => void
  onRename: (newSlug: string) => void
  onBack: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    onChange({ ...product, [key]: value })
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const bytes = await prepareImage(file)
      const name = `${product.slug}-${Date.now()}.jpg`
      await putFile(
        auth,
        `public/images/${name}`,
        toBase64(bytes),
        `Admin: upload photo ${name}`
      )
      set('images', [...product.images, `/images/${name}`])
    } catch (err) {
      setUploadError((err as Error).message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={onBack} className="text-sm text-primary underline">
        Back to all products
      </button>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr,20rem]">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-text">Name</span>
            <input
              value={product.name}
              onChange={(e) => set('name', e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Web address name (slug)</span>
            <input
              value={product.slug}
              onChange={(e) => {
                const next = kebab(e.target.value)
                if (next && !allSlugs.some((s) => s === next && s !== product.slug)) {
                  onRename(next)
                }
              }}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
            <span className="mt-1 block text-xs text-muted">
              Part of the page link, like /collection/{product.slug}/. Avoid changing it after a
              piece has been shared.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Price in US dollars</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={product.price ?? ''}
              placeholder="Leave empty for Price upon request"
              onChange={(e) =>
                set('price', e.target.value === '' ? null : Math.max(0, Number(e.target.value)))
              }
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Description</span>
            <textarea
              value={product.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Detail lines (one per line)</span>
            <textarea
              value={product.details.join('\n')}
              onChange={(e) => set('details', e.target.value.split('\n').filter((l) => l.trim()))}
              rows={5}
              placeholder={'Sterling silver clasp\n19 inches long'}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Photo description for accessibility</span>
            <input
              value={product.alt}
              onChange={(e) => set('alt', e.target.value)}
              placeholder="A bracelet with twelve colorful gemstones and a silver cross"
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text">Stripe Payment Link (optional)</span>
            <input
              value={product.paymentLink}
              onChange={(e) => set('paymentLink', e.target.value.trim())}
              placeholder="https://buy.stripe.com/..."
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
            <span className="mt-1 block text-xs text-muted">
              Paste a Payment Link from your Stripe account to turn on card checkout for this
              piece. See the Help tab.
            </span>
          </label>

          <fieldset className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4">
            <legend className="px-1 text-sm font-medium text-text">Options</legend>
            <Toggle
              label="Featured"
              hint="Shown first and highlighted on the home page"
              checked={product.featured}
              onChange={(v) => set('featured', v)}
            />
            <Toggle
              label="One of a kind"
              hint="Limits orders to quantity 1"
              checked={product.oneOfAKind}
              onChange={(v) => set('oneOfAKind', v)}
            />
            <Toggle
              label="Inquire only"
              hint="No buy buttons; invites an email"
              checked={product.inquireOnly}
              onChange={(v) => set('inquireOnly', v)}
            />
            <Toggle
              label="Sold"
              hint="Keeps the piece visible with a Sold badge"
              checked={product.sold}
              onChange={(v) => set('sold', v)}
            />
            <Toggle
              label="Hidden"
              hint="Removes the piece from the shop entirely"
              checked={product.hidden}
              onChange={(v) => set('hidden', v)}
            />
          </fieldset>
        </div>

        <div>
          <p className="text-sm font-medium text-text">Photos</p>
          <p className="mt-1 text-xs text-muted">
            The first photo is the cover. Photos upload right away; other changes go live when
            you Publish.
          </p>

          <ul className="mt-3 space-y-2">
            {product.images.map((img, i) => (
              <li key={img} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2">
                <img src={img} alt="" className="h-14 w-12 rounded object-cover ring-1 ring-border" />
                <span className="min-w-0 flex-1 truncate text-xs text-muted">{img}</span>
                {i > 0 && (
                  <button
                    type="button"
                    className="text-xs text-primary underline"
                    onClick={() =>
                      set('images', [img, ...product.images.filter((x) => x !== img)])
                    }
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  className="text-xs text-red-600 underline"
                  onClick={() => set('images', product.images.filter((x) => x !== img))}
                >
                  Remove
                </button>
              </li>
            ))}
            {product.images.length === 0 && (
              <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">
                No photos yet. A piece needs at least one photo before you un-hide it.
              </li>
            )}
          </ul>

          <label className="mt-3 block">
            <span className="sr-only">Upload photo</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={uploading}
              className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-medium file:text-white"
            />
          </label>
          {uploading && <p className="mt-2 text-xs text-muted">Uploading photo...</p>}
          {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[color:var(--primary)]"
      />
      <span>
        <span className="block text-sm text-text">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </label>
  )
}
