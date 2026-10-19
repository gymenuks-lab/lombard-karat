import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { buttonVariants } from "@/components/ui/button"
import { CatalogSidebar, CatalogToolbar, CategoryTabs } from "@/components/catalog-filters"
import { CatalogPagination } from "@/components/catalog-pagination"
import { siteCopy } from "@/lib/copy"
import { demoMode } from "@/lib/site-config"
import { getProducts, getFilterOptions } from "@/lib/queries"
import { CATEGORY_LABELS, type ProductCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string
    metal?: string
    type?: string
    sample?: string
    price_min?: string
    price_max?: string
    available?: string
    q?: string
    sort?: string
    page?: string
  }>
}

const BASE_METADATA: Metadata = {
  title: demoMode ? "Каталог — 5 Карат" : "Каталог — 5 Карат | Золото та срібло: вироби від виробника та вживані",
  description: siteCopy.catalogDescription,
  alternates: { canonical: "/catalog" },
}

export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const sp = await searchParams
  const filtered = Object.values(sp).some(Boolean)
  // Відфільтровані, відсортовані та посторінкові варіанти не індексуємо, щоб не плодити дублі.
  return filtered ? { ...BASE_METADATA, robots: { index: false, follow: true } } : BASE_METADATA
}

const SORTS = ["newest", "price_asc", "price_desc"] as const

function parsePrice(raw: string | undefined): number | undefined {
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const sp = await searchParams
  const category = sp.category === "lombard" || sp.category === "manufacturer" ? (sp.category as ProductCategory) : undefined
  const page = Number.parseInt(sp.page ?? "1", 10) || 1
  const sort = SORTS.find((value) => value === sp.sort) ?? "newest"

  const [{ products, total, pageSize }, filterOptions] = await Promise.all([
    getProducts({
      category,
      metal: sp.metal || undefined,
      itemType: sp.type || undefined,
      sample: sp.sample || undefined,
      priceMin: parsePrice(sp.price_min),
      priceMax: parsePrice(sp.price_max),
      availableOnly: sp.available === "1",
      search: sp.q || undefined,
      sort,
      page,
    }),
    getFilterOptions(),
  ])

  const heading = category ? CATEGORY_LABELS[category] : "Каталог"
  const hasActiveFilters = Boolean(
    sp.metal || sp.type || sp.sample || sp.price_min || sp.price_max || sp.available === "1" || sp.q,
  )

  return (
    <>
      <SiteHeader />
      <main className="container-site pt-8 pb-20 lg:pb-28">
        <Breadcrumbs
          items={[
            { label: "Головна", href: "/" },
            ...(category ? [{ label: "Каталог", href: "/catalog" }, { label: heading }] : [{ label: "Каталог" }]),
          ]}
        />

        <header className="mt-8 max-w-2xl lg:mt-12">
          <h1 className="type-h1">{heading}</h1>
          <p className="type-body mt-4 text-pretty text-muted-foreground">
            {siteCopy.catalogLead}
          </p>
        </header>

        <div className="mt-8 lg:mt-10">
          <CategoryTabs />
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-12 lg:mt-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]">
          <aside aria-label="Фільтри" className="hidden lg:block">
            <div className="sticky top-28">
              <CatalogSidebar options={filterOptions} />
            </div>
          </aside>

          <div className="flex flex-col gap-8">
            <CatalogToolbar options={filterOptions} total={total} />

            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="type-h3">Нічого не знайдено</p>
                <p className="type-body-sm max-w-sm text-pretty text-muted-foreground">
                  {hasActiveFilters
                    ? "Спробуйте змінити або скинути фільтри."
                    : "Товари скоро з’являться тут."}
                </p>
                {hasActiveFilters && (
                  <Link href={category ? `/catalog?category=${category}` : "/catalog"} className={buttonVariants({ variant: "outline" })}>
                    Скинути фільтри
                  </Link>
                )}
              </div>
            ) : (
              <ProductGrid products={products} withSidebar />
            )}

            <CatalogPagination page={page} total={total} pageSize={pageSize} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
