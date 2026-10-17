"use client"

import { useEffect } from "react"

import { ProductGrid } from "@/components/product-grid"
import { useProductsByIds } from "@/components/saved-products"
import { pushToList, RECENT_KEY, useLocalList } from "@/lib/local-list"

/** Запам'ятовує перегляд поточного товару й показує попередні (до 4). */
export function RecentlyViewed({ currentId }: { currentId: string }) {
  const recent = useLocalList(RECENT_KEY)

  useEffect(() => {
    pushToList(RECENT_KEY, currentId, 12)
  }, [currentId])

  const ids = recent.filter((id) => id !== currentId).slice(0, 4)
  const products = useProductsByIds(ids)

  if (!products || products.length === 0) return null
  return (
    <section className="mt-20 border-t border-border pt-16 lg:mt-28">
      <h2 className="type-h2 mb-10">Нещодавно переглянуті</h2>
      <ProductGrid products={products} />
    </section>
  )
}
