import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteCopy } from "@/lib/copy"

export function Hero() {
  return (
    <section id="top" className="surface-ink">
      <div className="relative isolate overflow-hidden bg-ink-950">
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[62%]">
          <Image
            src="/images/web/hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="animate-hero-drift object-cover object-[70%_50%] opacity-60 lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]"
          />
          {/* Мягкая виньетка: уводит края в глубокий чёрный и держит читаемость текста */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_35%,rgb(10_9_8/0.55)_100%)]"
          />
        </div>

        <div className="container-site flex min-h-[34rem] flex-col justify-center py-24 lg:min-h-[44rem]">
          <div className="max-w-2xl animate-in duration-700 ease-luxe fade-in-0 slide-in-from-bottom-2">
            <p className="type-eyebrow text-gold!">{siteCopy.heroEyebrow}</p>
            <h1 className="mt-6 font-heading text-[clamp(2.5rem,1.6rem+3vw,4.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              Прикраси з історією.
              <br />
              Цінність поза часом.
            </h1>
            <p className="type-body-lg mt-6 max-w-md text-muted-foreground">
              {siteCopy.heroText}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalog" className={buttonVariants({ size: "lg" })}>
                Дивитися каталог
              </Link>
              <Link href="/catalog?category=manufacturer" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Новинки від виробника
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
