import Image from "next/image"
import Link from "next/link"
import { CATEGORY_LABELS, formatPrice, STATUS_LABELS, type Product } from "@/lib/types"
import { OrderButton } from "@/components/order-button"

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0] || "/placeholder.svg?height=600&width=600"
  const soldOut = product.status === "sold"

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={cover || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {CATEGORY_LABELS[product.category]}
        </span>
        {product.status !== "available" && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground">
            {STATUS_LABELS[product.status]}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">{product.title}</h3>
        </Link>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {product.metal && <span>{product.metal}</span>}
          {product.sample && <span>Проба {product.sample}</span>}
          {product.weight && <span>{product.weight} г</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-serif text-lg font-semibold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          <OrderButton product={product} size="sm" disabled={soldOut} />
        </div>
      </div>
    </article>
  )
}
