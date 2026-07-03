"use client"

import { useTransition, useState } from "react"
import { toast } from "sonner"
import { updateOrderStatus } from "@/app/actions/admin"
import { ORDER_STATUS_LABELS, formatPrice, type Order, type OrderStatus } from "@/lib/types"

const STATUS_VALUES: OrderStatus[] = ["new", "processing", "done", "cancelled"]

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-primary/15 text-primary",
  processing: "bg-accent text-accent-foreground",
  done: "bg-secondary text-secondary-foreground",
  cancelled: "bg-muted text-muted-foreground",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" })
}

export function AdminOrderTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  function change(id: string, status: OrderStatus) {
    setBusyId(id)
    startTransition(async () => {
      const res = await updateOrderStatus(id, status)
      if (res.ok) toast.success("Статус замовлення оновлено")
      else toast.error(res.error ?? "Помилка")
      setBusyId(null)
    })
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Замовлень поки немає
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="border-b border-border bg-muted/50 text-left">
          <tr>
            <th className="p-3 font-medium">Дата</th>
            <th className="p-3 font-medium">Товар</th>
            <th className="p-3 font-medium">Клієнт</th>
            <th className="p-3 font-medium">Контакти</th>
            <th className="p-3 font-medium">Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border align-top last:border-0">
              <td className="whitespace-nowrap p-3 text-muted-foreground">{formatDate(o.created_at)}</td>
              <td className="p-3">
                <span className="line-clamp-2 max-w-[220px] font-medium">{o.product_title ?? "—"}</span>
                <span className="text-xs text-muted-foreground">{formatPrice(o.product_price)}</span>
              </td>
              <td className="p-3">{o.customer_name}</td>
              <td className="p-3">
                <div className="flex flex-col">
                  <a href={`tel:${o.customer_phone}`} className="text-primary hover:underline">
                    {o.customer_phone}
                  </a>
                  {o.customer_contact && <span className="text-xs text-muted-foreground">{o.customer_contact}</span>}
                  {o.comment && <span className="mt-1 text-xs text-muted-foreground">«{o.comment}»</span>}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}
                  >
                    {ORDER_STATUS_LABELS[o.status]}
                  </span>
                  <select
                    value={o.status}
                    disabled={isPending && busyId === o.id}
                    onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUS_VALUES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
