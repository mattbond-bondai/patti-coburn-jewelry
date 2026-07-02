'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/data/products'
import { allProducts } from '@/data/products'

export interface CartLine {
  slug: string
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  open: boolean
  setOpen: (open: boolean) => void
  add: (slug: string) => void
  remove: (slug: string) => void
  setQuantity: (slug: string, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
  resolved: { product: Product; quantity: number }[]
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'pcj-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLines(JSON.parse(raw))
    } catch {
      // ignore corrupted cart
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const resolved = lines
      .map((line) => {
        const product = allProducts.find((p) => p.slug === line.slug)
        return product ? { product, quantity: line.quantity } : null
      })
      .filter((x): x is { product: Product; quantity: number } => x !== null)

    return {
      lines,
      open,
      setOpen,
      add: (slug) =>
        setLines((prev) => {
          const product = allProducts.find((p) => p.slug === slug)
          if (!product) return prev
          const existing = prev.find((l) => l.slug === slug)
          if (existing) {
            if (product.oneOfAKind) return prev
            return prev.map((l) => (l.slug === slug ? { ...l, quantity: l.quantity + 1 } : l))
          }
          return [...prev, { slug, quantity: 1 }]
        }),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      setQuantity: (slug, quantity) =>
        setLines((prev) =>
          quantity < 1
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, quantity } : l))
        ),
      clear: () => setLines([]),
      count: resolved.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: resolved.reduce((sum, l) => sum + (l.product.price ?? 0) * l.quantity, 0),
      resolved
    }
  }, [lines, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
