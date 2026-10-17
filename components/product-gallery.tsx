"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Gem, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Галерея товару. Один горизонтальний scroll-snap контейнер: на mobile — свайп,
 * на desktop — мініатюри зліва та стрілки. Клік по фото відкриває повноекранний перегляд.
 */
export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const count = images.length

  const goTo = useCallback((index: number, instant = false) => {
    const el = scrollerRef.current
    if (!el) return
    setActive(index)
    el.scrollTo({ left: index * el.clientWidth, behavior: instant || prefersReducedMotion() ? "auto" : "smooth" })
  }, [])

  function handleScroll() {
    const el = scrollerRef.current
    if (!el || el.clientWidth === 0) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    if (index !== active) setActive(Math.min(Math.max(index, 0), count - 1))
  }

  function closeLightbox() {
    if (lightbox !== null) goTo(lightbox, true)
    setLightbox(null)
  }

  const step = useCallback(
    (direction: 1 | -1) => setLightbox((current) => (current === null ? current : (current + direction + count) % count)),
    [count],
  )

  useEffect(() => {
    if (lightbox === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [lightbox, step])

  if (count === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-ivory-200 text-ink-500">
        <Gem className="size-12" strokeWidth={1} aria-hidden="true" />
        <span className="sr-only">Фото відсутнє</span>
      </div>
    )
  }

  return (
    <div className="lg:grid lg:grid-cols-[5rem_minmax(0,1fr)] lg:gap-4">
      {count > 1 && (
        <ul className="hidden flex-col gap-3 lg:flex" aria-label="Мініатюри">
          {images.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Фото ${index + 1} з ${count}`}
                aria-current={active === index ? "true" : undefined}
                className={cn(
                  "relative block aspect-[4/5] w-full overflow-hidden bg-ivory-200 outline-offset-2 transition-opacity duration-250",
                  active === index ? "opacity-100 outline outline-1 outline-primary" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="group relative">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setLightbox(index)}
              aria-label={`Збільшити фото ${index + 1} з ${count}`}
              className="relative aspect-[4/5] w-full shrink-0 cursor-zoom-in snap-center overflow-hidden bg-ivory-200"
            >
              <Image
                src={src}
                alt={index === 0 ? title : `${title} — фото ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {count > 1 && (
          <>
            <p className="type-caption pointer-events-none absolute bottom-3 left-3 bg-background px-2.5 py-1 text-foreground lg:hidden">
              {active + 1} / {count}
            </p>
            {(["prev", "next"] as const).map((side) => {
              const target = side === "prev" ? active - 1 : active + 1
              if (target < 0 || target >= count) return null
              return (
                <Button
                  key={side}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => goTo(target)}
                  aria-label={side === "prev" ? "Попереднє фото" : "Наступне фото"}
                  className={cn(
                    "absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-background text-foreground opacity-0 transition-opacity duration-250 group-hover:opacity-100 focus-visible:opacity-100 lg:flex",
                    side === "prev" ? "left-3" : "right-3",
                  )}
                >
                  {side === "prev" ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
                </Button>
              )
            })}
          </>
        )}
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent
          showCloseButton={false}
          className="surface-ink top-0 left-0 block h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none bg-ink-950 p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {lightbox !== null && (
            <div className="relative h-full w-full">
              <Image
                src={images[lightbox]}
                alt={`${title} — фото ${lightbox + 1}`}
                fill
                sizes="100vw"
                className="object-contain p-4 pt-16 pb-16 lg:p-16"
              />
            </div>
          )}
          <p className="type-caption absolute top-5 left-5 text-muted-foreground" aria-live="polite">
            {lightbox !== null ? lightbox + 1 : 0} / {count}
          </p>
          <DialogClose
            render={<Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full" />}
            aria-label="Закрити перегляд"
          >
            <X aria-hidden="true" />
          </DialogClose>
          {count > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => step(-1)}
                aria-label="Попереднє фото"
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full lg:left-6"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => step(1)}
                aria-label="Наступне фото"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full lg:right-6"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
