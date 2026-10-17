import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/lib/site-config"
import { CATEGORY_LABELS } from "@/lib/types"

const catalogLinks = [
  { label: "Усі товари", href: "/catalog" },
  { label: CATEGORY_LABELS.lombard, href: "/catalog?category=lombard" },
  { label: CATEGORY_LABELS.manufacturer, href: "/catalog?category=manufacturer" },
]

const linkClass = "type-body-sm text-muted-foreground transition-colors duration-250 hover:text-foreground"

export function SiteFooter() {
  return (
    <footer className="surface-ink">
      <div className="bg-ink-950">
        <div className="container-site py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-3.5" aria-label={`${siteConfig.name} — головна`}>
                <Image
                  src={siteConfig.logo.src}
                  alt={siteConfig.logo.alt}
                  width={256}
                  height={256}
                  className="size-14 rounded-sm object-cover"
                />
                <span className="flex flex-col gap-1.5 leading-none">
                  <span className="font-heading text-2xl tracking-[0.14em] uppercase">{siteConfig.name}</span>
                  <span className="type-caption tracking-[0.2em] text-muted-foreground uppercase">{siteConfig.tagline}</span>
                </span>
              </Link>
              <p className="type-body-sm mt-6 max-w-sm text-pretty text-muted-foreground">
                Ювелірний магазин: золото та срібло від виробника та перевірені вживані вироби. Доставка по всій
                Україні, гарантія та сертифікати на кожен виріб.
              </p>
            </div>

            <nav aria-label="Каталог" className="lg:col-span-3 lg:col-start-7">
              <h2 className="type-eyebrow">Каталог</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {catalogLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <h2 className="type-eyebrow">Контакти</h2>
              <ul className="mt-5 flex flex-col gap-3">
                <li>
                  <a href={siteConfig.phone.href} className={linkClass}>
                    {siteConfig.phone.display}
                  </a>
                </li>
                <li>
                  <a href={siteConfig.telegram.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Telegram {siteConfig.telegram.handle}
                  </a>
                </li>
                <li className="type-body-sm text-muted-foreground">{siteConfig.address}</li>
                <li className="type-body-sm text-muted-foreground">{siteConfig.hours}</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-6 lg:mt-20">
            <p className="type-caption text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. Усі права захищено.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
