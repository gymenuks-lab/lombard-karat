import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProducts } from "@/lib/queries"
import { ProductCard } from "@/components/product-card"

export async function FeaturedProducts() {
  const { items } = await getProducts({ limit: 6, sort: "newest" })

  return (
    <section id="store" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Каталог 5 Карат</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">Прикраси в наявності</h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Ювелірні вироби з ломбарду та нові прикраси від виробника. Асортимент оновлюється щодня з нашого Telegram-каналу.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-muted-foreground text-pretty">
              Товари скоро з&apos;являться тут. Стежте за оновленнями в нашому{" "}
              <a
                href="https://t.me/k5karat"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                Telegram-каналі
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/catalog"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Переглянути весь каталог
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
