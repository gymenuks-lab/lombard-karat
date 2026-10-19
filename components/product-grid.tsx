import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  /** Каталог з бічною панеллю фільтрів: менше колонок на lg. */
  withSidebar?: boolean
}

/** Єдина сітка карток: каталог, головна, «Схожі товари». */
export function ProductGrid({ products, withSidebar = false }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-x-8",
        withSidebar ? "2xl:grid-cols-4" : "lg:grid-cols-4",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
