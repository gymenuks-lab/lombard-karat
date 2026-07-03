"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS } from "@/lib/types"

interface CatalogFiltersProps {
  metals: string[]
  itemTypes: string[]
}

const CATEGORY_TABS = [
  { value: "", label: "Усі" },
  { value: "lombard", label: CATEGORY_LABELS.lombard },
  { value: "manufacturer", label: CATEGORY_LABELS.manufacturer },
]

const SORT_OPTIONS = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price_asc", label: "Дешевші спочатку" },
  { value: "price_desc", label: "Дорожчі спочатку" },
]

export function CatalogFilters({ metals, itemTypes }: CatalogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const category = searchParams.get("category") ?? ""
  const metal = searchParams.get("metal") ?? ""
  const itemType = searchParams.get("type") ?? ""
  const sort = searchParams.get("sort") ?? "newest"
  const search = searchParams.get("q") ?? ""

  const hasFilters = category || metal || itemType || search || sort !== "newest"

  return (
    <div className="flex flex-col gap-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setParam("category", tab.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              category === tab.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + selects */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault()
            const value = new FormData(e.currentTarget).get("q") as string
            setParam("q", value?.trim() ?? "")
          }}
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={search} placeholder="Пошук за назвою…" className="pl-9" />
        </form>

        <div className="flex flex-wrap gap-3">
          {metals.length > 0 && (
            <select
              value={metal}
              onChange={(e) => setParam("metal", e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Метал"
            >
              <option value="">Метал: усі</option>
              {metals.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
          {itemTypes.length > 0 && (
            <select
              value={itemType}
              onChange={(e) => setParam("type", e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Тип виробу"
            >
              <option value="">Тип: усі</option>
              {itemTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Сортування"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
              <X className="size-4" />
              Скинути
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
