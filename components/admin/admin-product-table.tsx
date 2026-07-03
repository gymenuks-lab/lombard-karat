"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { deleteProduct, setProductStatus, toggleProductPublished } from "@/app/actions/admin"
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  formatPrice,
  type Product,
  type ProductStatus,
} from "@/lib/types"

const STATUS_VALUES: ProductStatus[] = ["available", "reserved", "sold", "hidden"]

export function AdminProductTable({ products, onEdit }: { products: Product[]; onEdit: (p: Product) => void }) {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))

  function run(id: string, fn: () => Promise<{ ok: boolean; error?: string }>, successMsg: string) {
    setBusyId(id)
    startTransition(async () => {
      const res = await fn()
      if (res.ok) toast.success(successMsg)
      else toast.error(res.error ?? "Помилка")
      setBusyId(null)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Пошук за назвою…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium">Товар</th>
              <th className="p-3 font-medium">Категорія</th>
              <th className="p-3 font-medium">Ціна</th>
              <th className="p-3 font-medium">Статус</th>
              <th className="p-3 font-medium">Показ</th>
              <th className="p-3 font-medium text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={p.images[0] || "/placeholder.svg?height=48&width=48"}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <span className="line-clamp-2 max-w-[220px] font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{CATEGORY_LABELS[p.category]}</td>
                <td className="p-3">{formatPrice(p.price, p.currency)}</td>
                <td className="p-3">
                  <select
                    value={p.status}
                    disabled={isPending && busyId === p.id}
                    onChange={(e) =>
                      run(p.id, () => setProductStatus(p.id, e.target.value as ProductStatus), "Статус оновлено")
                    }
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUS_VALUES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={p.is_published ? "Опубліковано" : "Приховано"}
                    onClick={() =>
                      run(
                        p.id,
                        () => toggleProductPublished(p.id, !p.is_published),
                        p.is_published ? "Знято з публікації" : "Опубліковано",
                      )
                    }
                  >
                    {p.is_published ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
                  </Button>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(p)} title="Редагувати">
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Видалити"
                      onClick={() => {
                        if (confirm(`Видалити «${p.title}»?`)) {
                          run(p.id, () => deleteProduct(p.id), "Товар видалено")
                        }
                      }}
                    >
                      {isPending && busyId === p.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Товарів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
