"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  page: number
  total: number
  pageSize: number
}

export function CatalogPagination({ page, total, pageSize }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) return null

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (target <= 1) params.delete("page")
    else params.set("page", String(target))
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const linkClass = buttonVariants({ variant: "outline", size: "sm" })
  const disabledClass = cn(linkClass, "pointer-events-none opacity-40")

  return (
    <nav aria-label="Сторінки каталогу" className="flex items-center justify-center gap-6">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>
          <ChevronLeft aria-hidden="true" />
          Назад
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          <ChevronLeft aria-hidden="true" />
          Назад
        </span>
      )}
      <span className="type-body-sm text-muted-foreground">
        Сторінка {page} з {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={linkClass}>
          Далі
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Далі
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
