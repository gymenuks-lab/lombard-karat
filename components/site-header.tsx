"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Phone, X } from "lucide-react"

const navLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "Вживані", href: "/catalog?category=lombard" },
  { label: "Від виробника", href: "/catalog?category=manufacturer" },
  { label: "Контакти", href: "/#contacts" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="5 Карат — головна">
          <Image
            src="/images/logo-5karat.png"
            alt="5 Карат — ювелірний магазин золота та срібла"
            width={112}
            height={112}
            priority
            className="h-12 w-12 rounded-md object-cover sm:h-14 sm:w-14"
          />
          <span className="ml-3 flex flex-col leading-none sm:hidden lg:flex">
            <span className="font-serif text-lg font-semibold tracking-tight">5 Карат</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ювелірний дім</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+380441234567"
            className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
          >
            <Phone className="size-4" />
            Подзвонити
          </a>
          <button
            type="button"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-sm font-medium text-foreground last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+380441234567"
              className="mt-3 mb-2 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="size-4" />
              Подзвонити
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
