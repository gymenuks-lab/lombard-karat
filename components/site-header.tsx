"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { Heart, Menu, Phone, Send, X } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { SiteSearch } from "@/components/site-search"
import { FAVORITES_KEY, useLocalList } from "@/lib/local-list"
import { cn } from "@/lib/utils"
import { mainNav, siteConfig, type NavItem } from "@/lib/site-config"

const MOBILE_MENU_ID = "mobile-menu"

function getActiveHref(pathname: string, category: string | null): string | null {
  if (pathname !== "/catalog") return null
  const match = mainNav.find((item) =>
    category === "lombard" || category === "manufacturer" ? item.category === category : item.category === "all",
  )
  return match?.href ?? null
}

interface NavListProps {
  activeHref: string | null
  variant: "desktop" | "mobile"
  onNavigate?: () => void
}

function NavList({ activeHref, variant, onNavigate }: NavListProps) {
  const isMobile = variant === "mobile"
  return (
    <ul className={cn(isMobile ? "flex flex-col" : "flex items-center gap-8 lg:gap-10")}>
      {mainNav.map((item: NavItem) => (
        <li key={item.href} className={cn(isMobile && "border-b border-border")}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={item.href === activeHref ? "page" : undefined}
            className={cn(
              isMobile
                ? "block py-5 font-heading text-3xl leading-tight text-foreground aria-[current=page]:text-gold-700"
                : "link-nav type-nav inline-block py-2 text-foreground/75 hover:text-foreground aria-[current=page]:text-foreground",
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Единственное место, читающее search params: оборачивается в Suspense, чтобы страницы оставались статичными. */
function ActiveNavList(props: Omit<NavListProps, "activeHref">) {
  const pathname = usePathname()
  const category = useSearchParams().get("category")
  return <NavList {...props} activeHref={getActiveHref(pathname, category)} />
}

function NavListWithActive(props: Omit<NavListProps, "activeHref">) {
  return (
    <Suspense fallback={<NavList {...props} activeHref={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const favoritesCount = useLocalList(FAVORITES_KEY).length

  // Закрываем меню при смене страницы.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc, блокировка прокрутки и автозакрытие при переходе на desktop-раскладку.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    mediaQuery.addEventListener("change", onChange)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95">
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3.5"
          aria-label={`${siteConfig.name} — головна`}
          onClick={() => setOpen(false)}
        >
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={256}
            height={256}
            priority
            className="size-11 rounded-sm object-cover lg:size-12"
          />
          <span className="flex flex-col gap-1.5 leading-none sm:hidden lg:flex">
            <span className="font-heading text-xl tracking-[0.14em] uppercase">{siteConfig.name}</span>
            <span className="type-caption hidden tracking-[0.2em] text-muted-foreground uppercase lg:block">{siteConfig.tagline}</span>
          </span>
        </Link>

        <nav aria-label="Основна навігація" className="hidden md:block">
          <NavListWithActive variant="desktop" />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SiteSearch />
          <Link
            href="/favorites"
            aria-label={favoritesCount > 0 ? `Обране: ${favoritesCount}` : "Обране"}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <Heart aria-hidden="true" strokeWidth={1.5} className="size-5" />
            {favoritesCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] leading-4 font-medium text-primary-foreground"
              >
                {favoritesCount}
              </span>
            )}
          </Link>
          <a
            href={siteConfig.phone.href}
            aria-label={`Подзвонити: ${siteConfig.phone.display}`}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "hidden md:inline-flex lg:hidden")}
          >
            <Phone aria-hidden="true" />
          </a>
          <a
            href={siteConfig.phone.href}
            className={cn(buttonVariants({ variant: "default" }), "hidden lg:inline-flex")}
          >
            <Phone aria-hidden="true" />
            Подзвонити
          </a>
          <button
            type="button"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setOpen((value) => !value)}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id={MOBILE_MENU_ID}
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background animate-in fade-in-0 duration-250 md:hidden"
        >
          <div className="container-site flex min-h-full flex-col justify-between gap-10 py-6">
            <nav aria-label="Мобільна навігація">
              <NavListWithActive variant="mobile" onNavigate={() => setOpen(false)} />
            </nav>

            <div className="flex flex-col gap-6 pb-4">
              <a
                href={siteConfig.phone.href}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
              >
                <Phone aria-hidden="true" />
                {siteConfig.phone.display}
              </a>
              <a
                href={siteConfig.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="type-body-sm inline-flex items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Send aria-hidden="true" className="size-4" />
                Telegram {siteConfig.telegram.handle}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
