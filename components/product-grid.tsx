import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

/** Единая сетка карточек: каталог, главная, «Схожі товари». */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
