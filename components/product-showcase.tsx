"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import type { Product } from "@/lib/types"

const filters = [
  ["all", "Усі"], ["ring", "Каблучки"], ["chain", "Ланцюжки"], ["earrings", "Сережки"], ["bracelet", "Браслети"],
] as const

const demos = [
  ["showcase-ring-fi", "Золота каблучка з фіанітом", "ring", "/images/test-gold-ring.png"],
  ["showcase-ring-white", "Каблучка з білого золота", "ring", "/images/silver-ring.png"],
  ["showcase-ring-min", "Мінімалістична золота каблучка", "ring", "/images/gold-ring.png"],
  ["showcase-chain-bis", "Ланцюжок плетіння Бісмарк", "chain", "/images/gold-chain.png"],
  ["showcase-chain-silver", "Срібний ланцюжок", "chain", "/images/silver-chain.png"],
  ["showcase-earrings-gold", "Золоті сережки", "earrings", "/images/gold-bracelet.png"],
  ["showcase-earrings-silver", "Сережки з фіанітами", "earrings", "/images/silver-earrings.png"],
  ["showcase-bracelet-gold", "Золотий браслет", "bracelet", "/images/gold-bracelet.png"],
] as const

function toDemoProduct([id, title, type, image]: typeof demos[number]): Product {
  return { id, title, description: "", price: null, currency: "UAH", category: "manufacturer", metal: null, sample: null, weight: null, item_type: type, images: [image], telegram_message_id: null, telegram_post_url: null, status: "available", is_published: true, created_at: "", updated_at: "" }
}

export function ProductShowcase({ products }: { products: Product[] }) {
  const all = [...products, ...demos.map(toDemoProduct)]
  const [filter, setFilter] = React.useState<(typeof filters)[number][0]>("all")
  const visible = filter === "all" ? all : all.filter((product) => product.item_type === filter)

  return <>
    <div className="mt-9 flex gap-6 overflow-x-auto border-b border-border pb-4 whitespace-nowrap" role="tablist" aria-label="Категорії прикрас">
      {filters.map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`relative pb-1 text-[10px] uppercase tracking-[.2em] transition-colors ${filter === value ? "text-primary after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-px after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>)}
    </div>
    <div className="mt-10 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" key={filter}>
      {visible.map((product, index) => <Reveal key={product.id} delay={Math.min(index, 7) * 75}><ProductCard product={product} demo={product.id.startsWith("showcase-")} /></Reveal>)}
    </div>
    <div className="mt-14"><Link href="/catalog" className="link-arrow inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[.14em]">Переглянути весь каталог <ArrowRight className="size-4" /></Link></div>
  </>
}
