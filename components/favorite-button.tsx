"use client"

import { Heart } from "lucide-react"

import { FAVORITES_KEY, toggleInList, useLocalList } from "@/lib/local-list"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  productId: string
  title: string
  /** card — кругла кнопка на фото; inline — текстова кнопка на сторінці товару */
  variant?: "card" | "inline"
  className?: string
}

export function FavoriteButton({ productId, title, variant = "card", className }: FavoriteButtonProps) {
  const favorites = useLocalList(FAVORITES_KEY)
  const active = favorites.includes(productId)

  if (variant === "inline") {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => toggleInList(FAVORITES_KEY, productId)}
        className={cn(
          "type-body-sm inline-flex items-center gap-2 text-foreground transition-colors duration-250 hover:text-gold-700",
          className,
        )}
      >
        <Heart aria-hidden="true" strokeWidth={1.5} className={cn("size-5", active && "fill-current")} />
        {active ? "В обраному" : "Додати в обране"}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Прибрати з обраного: ${title}` : `Додати в обране: ${title}`}
      onClick={() => toggleInList(FAVORITES_KEY, productId)}
      className={cn(
        "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background text-foreground transition-[opacity,color] duration-250 ease-luxe hover:text-gold-700 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Heart aria-hidden="true" strokeWidth={1.5} className={cn("size-[1.125rem]", active && "fill-current")} />
    </button>
  )
}
