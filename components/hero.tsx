import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[88svh] overflow-hidden bg-secondary text-secondary-foreground">
      <Image src="/images/hero-jewelry.png" alt="Ювелірні прикраси 5 Карат" fill priority className="object-cover object-[68%_center] opacity-55" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0a09_8%,rgba(11,10,9,.9)_42%,rgba(11,10,9,.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(214,160,46,.12),transparent_34%)]" />
      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl items-end px-5 pb-16 pt-28 sm:px-8 lg:items-center lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="hero-enter hero-enter-1 mb-6 text-[10px] uppercase tracking-[.32em] text-[#e7c56a] sm:text-xs">Ювелірний дім · Одеса</p>
          <h1 className="hero-enter hero-enter-2 max-w-3xl font-serif text-[clamp(3.4rem,8vw,7.5rem)] leading-[.92] font-medium tracking-[-.045em] text-balance">
            Прикраси,<br /><span className="text-[#e7c56a]">що залишаються</span><br />поза часом.
          </h1>
          <p className="hero-enter hero-enter-3 mt-8 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">Золото та срібло, обрані з увагою до деталей. Вироби від виробника та перевірені прикраси для важливих моментів.</p>
          <div className="hero-enter hero-enter-4 mt-9 flex flex-wrap items-center gap-5">
            <Link href="/catalog" className="premium-button inline-flex items-center gap-3 bg-[#d6a02e] px-6 py-3.5 text-sm font-semibold text-[#15120f]">Переглянути колекцію <ArrowRight className="size-4" /></Link>
            <Link href="/catalog?category=manufacturer" className="link-light inline-flex items-center gap-2 text-sm text-white/80">Від виробника <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-[.25em] text-white/45 lg:flex"><ArrowDown className="size-4" /> Гортайте далі</div>
      </div>
    </section>
  )
}
