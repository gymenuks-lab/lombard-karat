import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { siteCopy } from "@/lib/copy"

/** Значення type/metal збігаються з тим, що записує імпорт із Telegram (lib/telegram/parser.ts). */
const filterHref = (key: "type" | "metal", value: string) => `/catalog?${key}=${encodeURIComponent(value)}`

const tiles = [
  { title: "Каблучки", href: filterHref("type", "Каблучка"), image: "/images/web/cat-ring.webp" },
  { title: "Ланцюжки", href: filterHref("type", "Ланцюжок"), image: "/images/web/cat-chain.webp" },
  { title: "Сережки", href: filterHref("type", "Сережки"), image: "/images/web/cat-earrings.webp" },
  { title: "Браслети", href: filterHref("type", "Браслет"), image: "/images/web/cat-bracelet.webp" },
]

const moreLinks = [
  { label: "Золото", href: filterHref("metal", "Золото") },
  { label: "Срібло", href: filterHref("metal", "Срібло") },
  { label: "Кулони", href: filterHref("type", "Кулон") },
  { label: "Годинники", href: filterHref("type", "Годинник") },
]

export function Categories() {
  return (
    <section id="categories" className="section-y bg-background">
      <div className="container-site">
        <div className="max-w-xl">
          <p className="type-eyebrow">Категорії</p>
          <h2 className="type-h2 mt-4">Оберіть свої прикраси</h2>
          <p className="type-body mt-5 text-muted-foreground">
            {siteCopy.categoriesText}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
          {tiles.map((tile) => (
            <li key={tile.title}>
              <Link href={tile.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-ivory-200">
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="font-heading text-xl">{tile.title}</h3>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform duration-250 ease-luxe group-hover:translate-x-1 group-hover:text-foreground"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
          {moreLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="link-nav type-nav inline-block py-1 text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
