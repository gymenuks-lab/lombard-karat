"use client"

import { FAVORITES_KEY, useLocalList } from "@/lib/local-list"
import { SavedProducts } from "@/components/saved-products"

export function FavoritesList({ emptyAction }: { emptyAction: React.ReactNode }) {
  const ids = useLocalList(FAVORITES_KEY)

  return (
    <SavedProducts
      ids={ids}
      emptyText={
        <p>
          Збережених виробів поки немає. {emptyAction}
        </p>
      }
    />
  )
}
