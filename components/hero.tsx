'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function Hero() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!background || reduceMotion.matches) return

    let frame = 0
    const updateDepth = () => {
      const hero = background.parentElement
      if (!hero) return
      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / hero.offsetHeight, 0), 1)
      background.style.setProperty('--hero-depth', `${progress * 14}px`)
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDepth)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="top" className="hero-stage relative isolate min-h-[88svh] overflow-hidden bg-secondary text-secondary-foreground">
      <div ref={backgroundRef} className="hero-background absolute inset-[-12px]" aria-hidden="true">
        <Image src="/images/hero-jewelry.png" alt="Ювелірні прикраси 5 Карат" fill priority className="object-cover object-[68%_center] opacity-55" />
      </div>
      <div className="hero-light absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0a09_8%,rgba(11,10,9,.9)_42%,rgba(11,10,9,.28)_100%)]" />
      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl items-end px-5 pb-16 pt-28 sm:px-8 lg:items-center lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="hero-enter hero-enter-1 mb-6 text-[10px] uppercase tracking-[.32em] text-[#e7c56a] sm:text-xs">Ювелірний дім · Одеса</p>
          <h1 className="max-w-3xl font-serif text-[clamp(3.4rem,8vw,7.5rem)] leading-[.92] font-medium tracking-[-.045em] text-balance">
            <Reveal variant="mask" delay={180}>Прикраси,</Reveal>{' '}<Reveal variant="mask" delay={280}><span className="text-[#e7c56a]">що залишаються</span></Reveal>{' '}<Reveal variant="mask" delay={380}>поза часом.</Reveal>
          </h1>
          <p className="hero-enter hero-enter-3 mt-8 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">Золото та срібло, обрані з увагою до деталей. Вироби від виробника та перевірені прикраси для важливих моментів.</p>
          <div className="hero-enter hero-enter-4 mt-9 flex flex-wrap items-center gap-5">
            <Link href="/catalog" className="premium-button inline-flex items-center gap-3 bg-[#d6a02e] px-6 py-3.5 text-sm font-semibold text-[#15120f]">Переглянути колекцію <ArrowRight className="hero-arrow size-4" /></Link>
            <Link href="/catalog?category=manufacturer" className="link-light inline-flex items-center gap-2 text-sm text-white/80">Від виробника <ArrowRight className="hero-arrow size-4" /></Link>
          </div>
        </div>
        <div className="hero-scroll absolute bottom-8 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-[.25em] text-white/45 lg:flex"><ArrowDown className="size-4" /> Гортайте далі</div>
      </div>
    </section>
  )
}
