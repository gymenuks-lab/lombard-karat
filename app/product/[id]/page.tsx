import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductGrid } from "@/components/product-grid"
import { OrderButton } from "@/components/order-button"
import { getProductById, getRelatedProducts } from "@/lib/queries"
import { CATEGORY_LABELS, formatPrice, STATUS_LABELS } from "@/lib/types"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return { title: "Товар не знайдено — 5 Карат" }
  return {
    title: `${product.title} — 5 Карат`,
    description: product.description?.slice(0, 160) || `${product.title}. ${formatPrice(product.price, product.currency)}`,
    openGraph: {
      title: `${product.title} — 5 Карат`,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  }
}

const attributes: { key: "metal" | "sample" | "weight" | "item_type"; label: string; suffix?: string }[] = [
  { key: "item_type", label: "Тип виробу" },
  { key: "metal", label: "Метал" },
  { key: "sample", label: "Проба" },
  { key: "weight", label: "Вага", suffix: " г" },
]

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const soldOut = product.status === "sold"

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Головна
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/catalog" className="hover:text-foreground">
            Каталог
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/catalog?category=${product.category}`} className="hover:text-foreground">
            {CATEGORY_LABELS[product.category]}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} title={product.title} />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                {CATEGORY_LABELS[product.category]}
              </span>
              {product.status !== "available" && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {STATUS_LABELS[product.status]}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-serif text-2xl font-semibold text-balance sm:text-3xl">{product.title}</h1>

            <p className="mt-4 font-serif text-3xl font-semibold text-foreground">
              {formatPrice(product.price, product.currency)}
            </p>

            {/* Attributes */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border bg-card p-5">
              {attributes.map((attr) => {
                const value = product[attr.key]
                if (!value) return null
                return (
                  <div key={attr.key} className="flex flex-col">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{attr.label}</dt>
                    <dd className="text-sm font-medium">
                      {value}
                      {attr.suffix ?? ""}
                    </dd>
                  </div>
                )
              })}
            </dl>

            <div className="mt-6">
              <OrderButton product={product} size="lg" disabled={soldOut} fullWidth />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Залиште заявку — менеджер зв&apos;яжеться з вами для підтвердження та деталей оплати.
              </p>
            </div>

            {/* Trust points */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-primary" />
                Перевірена якість
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Гарантія проби
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="size-4 text-primary" />
                Доставка по Україні
              </div>
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="font-serif text-lg font-semibold">Опис</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold">Схожі товари</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
