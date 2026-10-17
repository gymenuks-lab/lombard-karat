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
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
      <Link href="/" className="flex items-center" aria-label="5 Карат — головна">
        <Image src="/images/logo-5karat.png" alt="5 Карат" width={96} height={96} priority className="h-14 w-14 object-cover" />
      </Link>
      <nav className="hidden items-center gap-8 md:flex">{navLinks.map((link) => <Link key={link.href} href={link.href} className="nav-link text-xs uppercase tracking-[.16em] text-muted-foreground">{link.label}</Link>)}</nav>
      <div className="flex items-center gap-3"><a href="tel:+380938205448" className="premium-button hidden items-center gap-2 border border-foreground/15 px-4 py-2.5 text-xs font-semibold sm:inline-flex"><Phone className="size-3.5" /> Подзвонити</a><button type="button" aria-label="Меню" onClick={() => setOpen(!open)} className="flex size-10 items-center justify-center border border-border md:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
    </div>
    {open && <nav className="border-t border-border bg-background px-5 py-3 md:hidden">{navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-4 text-xs uppercase tracking-[.16em] last:border-0">{link.label}</Link>)}<a href="tel:+380938205448" className="mt-3 flex items-center justify-center gap-2 bg-secondary px-4 py-3 text-sm text-secondary-foreground"><Phone className="size-4" /> Подзвонити</a></nav>}
  </header>
}
