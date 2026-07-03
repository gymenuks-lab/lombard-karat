"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  page: number
  total: number
  pageSize: number
}

export function CatalogPagination({ page, total, pageSize }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) return null

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(p))
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
        <ChevronLeft className="size-4" />
        Назад
      </Button>
      <span className="px-3 text-sm text-muted-foreground">
        Сторінка {page} з {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Далі
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
