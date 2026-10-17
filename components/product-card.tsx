import Image from "next/image"
import Link from "next/link"
import { Gem } from "lucide-react"

import { cn } from "@/lib/utils"
import { CATEGORY_LABELS, formatPrice, STATUS_LABELS, type Product } from "@/lib/types"

const IMAGE_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"

/**
 * Карточка товара: вся карточка — одна ссылка на страницу товара.
 * Показывает только данные, которые реально есть у товара.
 * Заказ оформляется на странице товара, а не в карточке.
 */
export function ProductCard({ product }: { product: Product }) {
  const [cover, hoverImage] = product.images
  const unavailable = product.status === "sold"
  const showStatus = product.status === "sold" || product.status === "reserved"

  const specs = [
    product.metal,
    product.sample ? `Проба ${product.sample}` : null,
    product.weight ? `${product.weight} г` : null,
  ].filter(Boolean)

  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory-200">
          {cover ? (
            <>
              <Image
                src={cover}
                alt={product.title}
                fill
                sizes={IMAGE_SIZES}
                className={cn(
                  "object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]",
                  unavailable && "opacity-60",
                )}
              />
              {hoverImage && !unavailable && (
                <Image
                  src={hoverImage}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes={IMAGE_SIZES}
                  className="object-cover opacity-0 transition-opacity duration-450 ease-luxe group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-ink-500">
              <Gem className="size-10" strokeWidth={1} aria-hidden="true" />
            </div>
          )}

          {showStatus && (
            <span className="type-caption absolute top-3 left-3 bg-background px-2.5 py-1 text-foreground">
              {STATUS_LABELS[product.status]}
            </span>
          )}
        </div>

        <p className="type-caption mt-4 text-muted-foreground">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="mt-1 line-clamp-2 text-[0.9375rem] leading-snug font-medium underline-offset-4 group-hover:underline">
          {product.title}
        </h3>
        {specs.length > 0 && <p className="type-caption mt-1 text-muted-foreground">{specs.join(" · ")}</p>}
        <p
          className={cn(
            product.price == null ? "type-body-sm text-muted-foreground" : "type-price",
            "mt-3",
            unavailable && "text-muted-foreground",
          )}
        >
          {formatPrice(product.price, product.currency)}
        </p>
      </Link>
    </article>
  )
}
