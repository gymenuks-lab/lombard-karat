"use client"

import { useEffect, useState } from "react"

import { getProductsByIds } from "@/app/actions/catalog"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/types"

/** Завантажує товари за списком id й тримає порядок списку. null — ще вантажиться. */
export function useProductsByIds(ids: string[]): Product[] | null {
  const key = ids.join(",")
  const [loaded, setLoaded] = useState<{ key: string; products: Product[] } | null>(null)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    getProductsByIds(key.split(",")).then((products) => {
      if (!cancelled) setLoaded({ key, products })
    })
    return () => {
      cancelled = true
    }
  }, [key])

  if (!key) return []
  return loaded?.key === key ? loaded.products : null
}

export function SavedProducts({ ids, emptyText }: { ids: string[]; emptyText: React.ReactNode }) {
  const products = useProductsByIds(ids)

  if (products === null) {
    return (
      <p className="type-body-sm text-muted-foreground" aria-live="polite">
        Завантаження…
      </p>
    )
  }
  if (products.length === 0) return <div className="type-body text-muted-foreground">{emptyText}</div>
  return <ProductGrid products={products.filter((product) => ids.includes(product.id))} />
}
