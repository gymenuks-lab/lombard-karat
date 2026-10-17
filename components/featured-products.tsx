import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import { getProducts } from "@/lib/queries"
import { siteConfig } from "@/lib/site-config"

export async function FeaturedProducts() {
  const { products: items } = await getProducts({ pageSize: 4, sort: "newest" })

  return (
    <section id="store" className="pb-(--section-y) bg-background">
      <div className="container-site">
        <div className="flex flex-col gap-6 border-t border-border pt-(--section-y) sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="type-eyebrow">Каталог</p>
            <h2 className="type-h2 mt-4">Нові надходження</h2>
            <p className="type-body mt-5 text-muted-foreground">
              Нові прикраси від виробника та перевірені вживані вироби.
            </p>
          </div>
          <Link href="/catalog" className="link-inline type-body-sm inline-flex items-center gap-2 self-start font-medium sm:self-auto">
            Весь каталог
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-12 lg:mt-16">
          {items.length === 0 ? (
            <p className="type-body-sm max-w-md text-muted-foreground">
              Товари скоро з&apos;являться тут. Стежте за оновленнями в нашому{" "}
              <a href={siteConfig.telegram.href} target="_blank" rel="noopener noreferrer" className="link-inline text-foreground">
                Telegram-каналі
              </a>
              .
            </p>
          ) : (
            <ProductGrid products={items} />
          )}
        </div>
      </div>
    </section>
  )
}
