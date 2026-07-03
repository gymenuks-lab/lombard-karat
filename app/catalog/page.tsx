import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { CatalogFilters } from "@/components/catalog-filters"
import { CatalogPagination } from "@/components/catalog-pagination"
import { getProducts, getFilterOptions } from "@/lib/queries"
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types"
import { PackageSearch } from "lucide-react"

export const metadata: Metadata = {
  title: "Каталог — 5 Карат | Золото та срібло: вироби від виробника та вживані",
  description:
    "Каталог ювелірних виробів 5 Карат: нові вироби від виробника та перевірені вживані прикраси. Золото, срібло, каблучки, ланцюжки, сережки. Замовлення онлайн з доставкою по Україні.",
}

export const dynamic = "force-dynamic"

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string
    metal?: string
    type?: string
    q?: string
    sort?: string
    page?: string
  }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const sp = await searchParams
  const category = sp.category === "lombard" || sp.category === "manufacturer" ? (sp.category as ProductCategory) : undefined
  const page = Number.parseInt(sp.page ?? "1", 10) || 1

  const [{ products, total, pageSize }, filterOptions] = await Promise.all([
    getProducts({
      category,
      metal: sp.metal || undefined,
      itemType: sp.type || undefined,
      search: sp.q || undefined,
      sort: (sp.sort as "newest" | "price_asc" | "price_desc") || "newest",
      page,
    }),
    getFilterOptions(),
  ])

  const heading = category ? CATEGORY_LABELS[category] : "Каталог товарів"

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">5 Карат</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-balance sm:text-4xl">{heading}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
            Асортимент оновлюється автоматично з нашого Telegram-каналу. Оберіть виріб і залиште заявку — менеджер
            зв&apos;яжеться з вами.
          </p>
        </div>

        <div className="mb-8">
          <CatalogFilters metals={filterOptions.metals} itemTypes={filterOptions.itemTypes} />
        </div>

        <p className="mb-4 text-sm text-muted-foreground">Знайдено товарів: {total}</p>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
            <PackageSearch className="size-10 text-muted-foreground" />
            <p className="font-serif text-xl">Товарів не знайдено</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Спробуйте змінити фільтри або завітайте пізніше — каталог поповнюється щодня.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <CatalogPagination page={page} total={total} pageSize={pageSize} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
