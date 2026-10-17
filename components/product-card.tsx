import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CATEGORY_LABELS, formatPrice, STATUS_LABELS, type Product } from "@/lib/types"
import { OrderButton } from "@/components/order-button"

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0] || "/placeholder.svg?height=600&width=600"
  const soldOut = product.status === "sold"
  return <article className="group"><Link href={`/product/${product.id}`} className="relative block aspect-[.88] overflow-hidden bg-[#eeeae1]"><Image src={cover} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" /><span className="absolute left-4 top-4 text-[10px] uppercase tracking-[.18em] text-white drop-shadow-md">{CATEGORY_LABELS[product.category]}</span>{product.status !== "available" && <span className="absolute right-4 top-4 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-wider">{STATUS_LABELS[product.status]}</span>}<span className="absolute bottom-4 right-4 flex size-10 translate-y-2 items-center justify-center bg-background opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="size-4" /></span></Link><div className="pt-4"><Link href={`/product/${product.id}`}><h3 className="font-serif text-lg leading-tight group-hover:text-primary">{product.title}</h3></Link><div className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted-foreground">{product.metal && <span>{product.metal}</span>}{product.sample && <span>Проба {product.sample}</span>}{product.weight && <span>{product.weight} г</span>}</div><div className="mt-4 flex items-center justify-between"><span className="font-serif text-xl">{formatPrice(product.price, product.currency)}</span><OrderButton product={product} size="sm" disabled={soldOut} /></div></div></article>
}
