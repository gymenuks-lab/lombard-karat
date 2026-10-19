"use client"

import { useCallback, useOptimistic, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CATEGORY_LABELS } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  metals: string[]
  itemTypes: string[]
  samples: string[]
}

const SORT_OPTIONS = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
]

const CATEGORY_TABS = [
  { value: "", label: "Усі" },
  { value: "lombard", label: CATEGORY_LABELS.lombard },
  { value: "manufacturer", label: CATEGORY_LABELS.manufacturer },
]

/** Ключі фільтрів у URL, що рахуються як «активні» (без категорії, сортування й сторінки). */
const FILTER_KEYS = ["metal", "type", "sample", "price_min", "price_max", "available", "q"] as const

function pluralizeItems(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} виріб`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} вироби`
  return `${count} виробів`
}

/**
 * Єдина логіка зміни параметрів каталогу в URL (стан живе в адресі — сторінкою можна ділитись).
 * useOptimistic дає миттєвий відгук: контрол перемикається одразу, поки сервер віддає новий результат.
 */
function useCatalogParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useOptimistic(searchParams.toString())

  const buildQuery = useCallback(
    (updates: Record<string, string | null>, options: { keepPage?: boolean } = {}) => {
      const params = new URLSearchParams(query)
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }
      if (!options.keepPage) params.delete("page")
      return params.toString()
    },
    [query],
  )

  const hrefWith = useCallback(
    (updates: Record<string, string | null>) => {
      const next = buildQuery(updates)
      return next ? `${pathname}?${next}` : pathname
    },
    [pathname, buildQuery],
  )

  const update = useCallback(
    (updates: Record<string, string | null>) => {
      const next = buildQuery(updates)
      startTransition(() => {
        setQuery(next)
        router.push(next ? `${pathname}?${next}` : pathname, { scroll: false })
      })
    },
    [router, pathname, buildQuery, setQuery],
  )

  const resetFilters = useCallback(() => {
    update(Object.fromEntries(FILTER_KEYS.map((key) => [key, null])))
  }, [update])

  const params = new URLSearchParams(query)
  const get = (key: string) => params.get(key) ?? ""
  const activeCount = FILTER_KEYS.filter((key) => key !== "q" && params.get(key)).length

  return { get, update, resetFilters, hrefWith, isPending, activeCount }
}

/* ---------- Категорії ---------- */

export function CategoryTabs() {
  const { get, hrefWith } = useCatalogParams()
  const current = get("category")

  return (
    <nav aria-label="Категорії каталогу" className="flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-8">
      {CATEGORY_TABS.map((tab) => (
        <Link
          key={tab.value}
          href={hrefWith({ category: tab.value || null })}
          scroll={false}
          aria-current={current === tab.value ? "page" : undefined}
          className="link-nav type-nav inline-block py-2 text-muted-foreground transition-colors duration-250 hover:text-foreground aria-[current=page]:text-foreground"
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

/* ---------- Поля фільтрів ---------- */

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  if (options.length === 0) return null
  const items = [{ value: "", label: "Усі" }, ...options.map((option) => ({ value: option, label: option }))]

  return (
    <fieldset>
      <legend className="type-eyebrow">{legend}</legend>
      <div className="mt-3 flex flex-col">
        {items.map((item) => (
          <label key={item.value || "all"} className="type-body-sm flex min-h-9 cursor-pointer items-center gap-3">
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={() => onChange(item.value)}
              className="size-4 shrink-0 accent-primary"
            />
            <span className={cn(value === item.value ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function PriceRange({ idPrefix }: { idPrefix: string }) {
  const { get, update } = useCatalogParams()
  const min = get("price_min")
  const max = get("price_max")

  return (
    <form
      key={`${min}-${max}`}
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const clean = (raw: FormDataEntryValue | null) => {
          const value = Number(String(raw ?? "").trim())
          return Number.isFinite(value) && value > 0 ? String(Math.floor(value)) : null
        }
        update({ price_min: clean(data.get("price_min")), price_max: clean(data.get("price_max")) })
      }}
    >
      <fieldset>
        <legend className="type-eyebrow">Ціна, ₴</legend>
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor={`${idPrefix}-min`} className="sr-only">
            Ціна від
          </label>
          <Input id={`${idPrefix}-min`} name="price_min" type="number" inputMode="numeric" min={0} placeholder="від" defaultValue={min} />
          <span aria-hidden="true" className="text-muted-foreground">
            –
          </span>
          <label htmlFor={`${idPrefix}-max`} className="sr-only">
            Ціна до
          </label>
          <Input id={`${idPrefix}-max`} name="price_max" type="number" inputMode="numeric" min={0} placeholder="до" defaultValue={max} />
        </div>
        <Button type="submit" variant="ghost" size="sm" className="mt-2 -ml-4">
          Застосувати
        </Button>
      </fieldset>
    </form>
  )
}

function SearchField({ idPrefix }: { idPrefix: string }) {
  const { get, update } = useCatalogParams()
  const q = get("q")

  return (
    <form
      key={q}
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault()
        const value = String(new FormData(event.currentTarget).get("q") ?? "").trim()
        update({ q: value || null })
      }}
    >
      <label htmlFor={`${idPrefix}-q`} className="sr-only">
        Пошук за назвою
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input id={`${idPrefix}-q`} name="q" type="search" defaultValue={q} placeholder="Пошук за назвою" className="pl-10" />
    </form>
  )
}

function FilterFields({ options, idPrefix }: { options: FilterOptions; idPrefix: string }) {
  const { get, update } = useCatalogParams()

  return (
    <div className="flex flex-col gap-9">
      <RadioGroup legend="Метал" name={`${idPrefix}-metal`} options={options.metals} value={get("metal")} onChange={(value) => update({ metal: value || null })} />
      <RadioGroup legend="Тип виробу" name={`${idPrefix}-type`} options={options.itemTypes} value={get("type")} onChange={(value) => update({ type: value || null })} />
      <RadioGroup legend="Проба" name={`${idPrefix}-sample`} options={options.samples} value={get("sample")} onChange={(value) => update({ sample: value || null })} />
      <PriceRange idPrefix={idPrefix} />
      <label className="type-body-sm flex min-h-9 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={get("available") === "1"}
          onChange={(event) => update({ available: event.target.checked ? "1" : null })}
          className="size-4 shrink-0 accent-primary"
        />
        Лише в наявності
      </label>
    </div>
  )
}

/* ---------- Бічна панель (desktop) ---------- */

export function CatalogSidebar({ options }: { options: FilterOptions }) {
  const { resetFilters, activeCount } = useCatalogParams()

  return (
    <div className="flex flex-col gap-9">
      <SearchField idPrefix="side" />
      <FilterFields options={options} idPrefix="side" />
      {activeCount > 0 && (
        <Button variant="link" size="sm" className="self-start" onClick={resetFilters}>
          Скинути фільтри
        </Button>
      )}
    </div>
  )
}

/* ---------- Панель над сіткою ---------- */

function ActiveFilters() {
  const { get, update, resetFilters } = useCatalogParams()

  const chips: { key: string; label: string; clear: Record<string, string | null> }[] = []
  if (get("metal")) chips.push({ key: "metal", label: get("metal"), clear: { metal: null } })
  if (get("type")) chips.push({ key: "type", label: get("type"), clear: { type: null } })
  if (get("sample")) chips.push({ key: "sample", label: `Проба ${get("sample")}`, clear: { sample: null } })
  if (get("price_min") || get("price_max")) {
    const label = [get("price_min") && `від ${get("price_min")}`, get("price_max") && `до ${get("price_max")}`].filter(Boolean).join(" ")
    chips.push({ key: "price", label: `${label} ₴`, clear: { price_min: null, price_max: null } })
  }
  if (get("available") === "1") chips.push({ key: "available", label: "В наявності", clear: { available: null } })
  if (get("q")) chips.push({ key: "q", label: `«${get("q")}»`, clear: { q: null } })

  if (chips.length === 0) return null

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Активні фільтри">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => update(chip.clear)}
            className="type-caption inline-flex h-8 items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-foreground transition-colors duration-250 hover:border-primary"
          >
            {chip.label}
            <X aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Прибрати фільтр</span>
          </button>
        </li>
      ))}
      {chips.length > 1 && (
        <li>
          <Button variant="link" size="xs" onClick={resetFilters}>
            Скинути все
          </Button>
        </li>
      )}
    </ul>
  )
}

function SortSelect() {
  const { get, update } = useCatalogParams()
  const sort = get("sort") || "newest"

  return (
    <div>
      <label htmlFor="catalog-sort" className="sr-only">
        Сортування
      </label>
      <select
        id="catalog-sort"
        value={sort}
        onChange={(event) => update({ sort: event.target.value === "newest" ? null : event.target.value })}
        className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground transition-colors duration-250 hover:border-ring"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function MobileFilters({ options, total }: { options: FilterOptions; total: number }) {
  const [open, setOpen] = useState(false)
  const { resetFilters, activeCount } = useCatalogParams()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full lg:hidden")}>
        <SlidersHorizontal aria-hidden="true" />
        Фільтри{activeCount > 0 ? ` · ${activeCount}` : ""}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Фільтри</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <FilterFields options={options} idPrefix="sheet" />
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={resetFilters} disabled={activeCount === 0}>
            Скинути
          </Button>
          <SheetClose render={<Button className="flex-1" />}>Показати · {total}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function CatalogToolbar({ options, total }: { options: FilterOptions; total: number }) {
  const { isPending } = useCatalogParams()

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:hidden">
        <SearchField idPrefix="top" />
      </div>
      <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-3 lg:order-2 lg:flex lg:items-center">
          <MobileFilters options={options} total={total} />
          <SortSelect />
        </div>
        <p
          aria-live="polite"
          aria-busy={isPending}
          className={cn("type-body-sm whitespace-nowrap text-muted-foreground transition-opacity duration-250 lg:order-1", isPending && "opacity-50")}
        >
          {pluralizeItems(total)}
        </p>
      </div>
      <ActiveFilters />
    </div>
  )
}
