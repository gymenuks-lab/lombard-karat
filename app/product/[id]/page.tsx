import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { FavoriteButton } from "@/components/favorite-button"
import { RecentlyViewed } from "@/components/recently-viewed"
import { ProductGallery } from "@/components/product-gallery"
import { ProductGrid } from "@/components/product-grid"
import { OrderButton } from "@/components/order-button"
import { getProductById, getRelatedProducts } from "@/lib/queries"
import { contacts, demoMode } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { CATEGORY_LABELS, formatPrice, STATUS_LABELS, type Product } from "@/lib/types"

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
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: `${product.title} — 5 Карат`,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  }
}

const CONDITION_LABELS: Record<Product["category"], string> = {
  manufacturer: "Нове",
  lombard: "Вживане",
}

const trustPoints = [
  { icon: BadgeCheck, label: "Перевірена якість" },
  { icon: ShieldCheck, label: "Гарантія проби" },
  { icon: Truck, label: "Доставка по Україні" },
]

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const soldOut = product.status === "sold"

  // Показуємо лише ті характеристики, які реально є в даних.
  const specs: { label: string; value: string }[] = [
    product.item_type && { label: "Тип виробу", value: product.item_type },
    product.metal && { label: "Метал", value: product.metal },
    product.sample && { label: "Проба", value: product.sample },
    product.weight ? { label: "Вага", value: `${product.weight} г` } : null,
    { label: "Стан", value: CONDITION_LABELS[product.category] },
    { label: "Наявність", value: STATUS_LABELS[product.status] },
  ].filter((spec): spec is { label: string; value: string } => Boolean(spec))

  return (
    <>
      <SiteHeader />
      <main className="container-site pt-8 pb-20 lg:pb-28">
        <Breadcrumbs
          items={[
            { label: "Головна", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: CATEGORY_LABELS[product.category], href: `/catalog?category=${product.category}` },
            { label: product.title },
          ]}
        />

        <div className="mt-8 grid gap-x-16 gap-y-10 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="type-eyebrow">{CATEGORY_LABELS[product.category]}</p>
            <h1 className="type-h2 mt-3">{product.title}</h1>
            <p
              className={cn(
                "mt-5",
                product.price == null ? "type-body text-muted-foreground" : "type-price-lg",
                soldOut && "text-muted-foreground",
              )}
            >
              {formatPrice(product.price, product.currency)}
            </p>

            <dl className="mt-8 border-t border-border">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-6 border-b border-border py-3.5">
                  <dt className="type-body-sm text-muted-foreground">{spec.label}</dt>
                  <dd className="type-body-sm text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 hidden lg:block">
              <OrderButton product={product} size="lg" disabled={soldOut} fullWidth />
            </div>
            <p className="type-caption mt-3 text-muted-foreground lg:text-center">
              {demoMode
                ? "Демонстраційна форма: заявку не буде збережено й надіслано."
                : "Залиште заявку — менеджер зв'яжеться з вами для підтвердження та деталей оплати."}
            </p>

            <FavoriteButton productId={product.id} title={product.title} variant="inline" className="mt-6" />

            {contacts && (
              <p className="type-body-sm mt-6 text-muted-foreground">
                Є питання щодо виробу?{" "}
                <a href={contacts.phone.href} className="link-inline text-foreground">
                  {contacts.phone.display}
                </a>{" "}
                або{" "}
                <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="link-inline text-foreground">
                  Telegram
                </a>
              </p>
            )}

            <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-8">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="type-body-sm flex items-center gap-3 text-muted-foreground">
                  <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-gold-700" />
                  {label}
                </li>
              ))}
            </ul>

            {product.description && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="type-eyebrow">Опис</h2>
                <p className="type-body-sm mt-4 whitespace-pre-line text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: панель замовлення прилипає до низу екрана й зупиняється в кінці блоку товару. */}
        <div className="sticky bottom-0 z-30 -mx-(--gutter) mt-10 flex items-center justify-between gap-4 border-t border-border bg-background px-(--gutter) py-3 lg:hidden">
          <p className={cn(product.price == null ? "type-body-sm text-muted-foreground" : "type-price-lg", soldOut && "text-muted-foreground")}>
            {formatPrice(product.price, product.currency)}
          </p>
          <OrderButton product={product} disabled={soldOut} className="min-w-40" />
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-16 lg:mt-28">
            <h2 className="type-h2 mb-10">Схожі товари</h2>
            <ProductGrid products={related} />
          </section>
        )}

        <RecentlyViewed currentId={product.id} />
      </main>
      <SiteFooter />
    </>
  )
}
