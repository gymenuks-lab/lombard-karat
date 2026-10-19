"use client"

import { useEffect, useRef } from "react"

/** Максимальное смещение фото от курсора, px. */
const PARALLAX_PX = 5
/** Доля пути к цели за кадр: чем меньше, тем плавнее и «тяжелее» реакция. */
const SMOOTHING = 0.06

/**
 * Фон hero: слои анимации вокруг уже существующего фото (передаётся как children).
 *  1. parallax-слой: translate по CSS-переменным --hero-px/--hero-py (только мышь с точным указателем);
 *  2. drift-слой: очень медленный «кинематографичный» дрейф (CSS, см. .hero-drift в globals.css);
 *  3. light-sweep: широкий размытый тёплый блик, только lg+, вне зоны текста.
 * Всё анимируется только через transform/opacity. Без React state: parallax пишет CSS-переменные в rAF.
 */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const noMotionPref = window.matchMedia("(prefers-reduced-motion: no-preference)")
    const root = rootRef.current
    const layer = parallaxRef.current
    if (!root || !layer || !finePointer.matches || !noMotionPref.matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0

    const tick = () => {
      current.x += (target.x - current.x) * SMOOTHING
      current.y += (target.y - current.y) * SMOOTHING
      layer.style.setProperty("--hero-px", `${(-current.x * PARALLAX_PX).toFixed(2)}px`)
      layer.style.setProperty("--hero-py", `${(-current.y * PARALLAX_PX).toFixed(2)}px`)
      const settled = Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      if (root.getBoundingClientRect().bottom < 0) return // hero вне экрана: не считаем
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={rootRef} className="absolute inset-y-0 right-0 -z-10 w-full overflow-hidden lg:w-[62%]">
      <div ref={parallaxRef} className="hero-parallax absolute inset-0">
        <div className="hero-drift absolute inset-0">{children}</div>
      </div>
      <div aria-hidden="true" className="hero-sweep-mask pointer-events-none absolute inset-0 hidden lg:block">
        <div className="hero-sweep" />
      </div>
    </div>
  )
}
