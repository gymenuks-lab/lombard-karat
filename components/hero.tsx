import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Truck, ShieldCheck, Gem } from 'lucide-react'

const quickLinks = [
  { label: 'Золото', href: '/catalog?metal=gold' },
  { label: 'Срібло', href: '/catalog?metal=silver' },
  { label: 'Каблучки', href: '/catalog?type=ring' },
  { label: 'Ланцюжки', href: '/catalog?type=chain' },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-secondary text-secondary-foreground"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-jewelry.png"
          alt=""
          fill
          priority
          className="object-cover object-right opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/40" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium tracking-wide text-gold">
            <Sparkles className="size-3.5" />
            Ювелірний магазин · золото та срібло
          </span>

          <h1 className="mt-5 font-serif text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-6xl">
            Вишукані прикраси із золота та{' '}
            <span className="text-gold">срібла</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary-foreground/75 text-pretty">
            Купуйте сертифіковані ювелірні вироби онлайн: каблучки, ланцюжки,
            сережки та браслети. Нові прикраси від виробника та перевірені вживані
            вироби за вигідними цінами.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-secondary-foreground px-6 text-base font-semibold text-secondary transition-colors hover:bg-secondary-foreground/90"
            >
              Переглянути каталог
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/catalog?category=manufacturer"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-secondary-foreground/30 bg-background/10 px-6 text-base font-semibold text-secondary-foreground backdrop-blur-sm transition-colors hover:bg-background/20"
            >
              Новинки від виробника
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary-foreground/70">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-gold" />
              Доставка по всій Україні
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              Гарантія та сертифікати
            </span>
          </div>
        </div>

        {/* Quick category card */}
        <div className="rounded-2xl border border-primary/20 bg-card p-5 text-card-foreground shadow-2xl sm:p-7">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-gold">
              <Gem className="size-5" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold">Обрати категорію</h2>
              <p className="text-sm text-muted-foreground">
                Перейдіть одразу до потрібних виробів
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-4 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted"
              >
                {link.label}
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          <Link
            href="/catalog"
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Увесь каталог
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
