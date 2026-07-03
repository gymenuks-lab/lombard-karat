"use client"

import { useMemo, useState, useTransition } from "react"
import { Gem, LogOut, RefreshCw, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { signOutAdmin } from "@/app/actions/auth"
import { triggerImport } from "@/app/actions/admin"
import { AdminProductTable } from "@/components/admin/admin-product-table"
import { AdminOrderTable } from "@/components/admin/admin-order-table"
import { ProductEditDialog } from "@/components/admin/product-edit-dialog"
import type { Order, Product } from "@/lib/types"

export function AdminDashboard({
  initialProducts,
  initialOrders,
}: {
  initialProducts: Product[]
  initialOrders: Order[]
}) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [isImporting, startImport] = useTransition()

  const newOrders = useMemo(() => initialOrders.filter((o) => o.status === "new").length, [initialOrders])
  const stats = useMemo(
    () => ({
      total: initialProducts.length,
      available: initialProducts.filter((p) => p.status === "available").length,
      lombard: initialProducts.filter((p) => p.category === "lombard").length,
      manufacturer: initialProducts.filter((p) => p.category === "manufacturer").length,
    }),
    [initialProducts],
  )

  function handleImport() {
    startImport(async () => {
      const res = await triggerImport()
      if (res.ok && res.summary) {
        toast.success(
          `Імпорт завершено: +${res.summary.importedProducts} нових, ${res.summary.updatedProducts} оновлено`,
        )
      } else {
        toast.error(res.error ?? "Помилка імпорту")
      }
    })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Toaster position="top-center" richColors />
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
              <Gem className="size-5" />
            </span>
            <span className="font-serif text-lg font-semibold">5 Карат · Адмін</span>
          </div>
          <form action={signOutAdmin}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="size-4" />
              Вийти
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Усього товарів" value={stats.total} />
          <StatCard label="В наявності" value={stats.available} />
          <StatCard label="Ломбард" value={stats.lombard} />
          <StatCard label="Від виробника" value={stats.manufacturer} />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-2xl font-semibold">Керування</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport} disabled={isImporting}>
              {isImporting ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Імпорт з Telegram
            </Button>
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              Додати товар
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Товари ({stats.total})</TabsTrigger>
            <TabsTrigger value="orders">
              Замовлення {newOrders > 0 ? `(${newOrders} нових)` : `(${initialOrders.length})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <AdminProductTable products={initialProducts} onEdit={(p) => setEditing(p)} />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <AdminOrderTable orders={initialOrders} />
          </TabsContent>
        </Tabs>
      </main>

      <ProductEditDialog
        open={creating || editing !== null}
        product={editing}
        onOpenChange={(v) => {
          if (!v) {
            setEditing(null)
            setCreating(false)
          }
        }}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold">{value}</p>
    </div>
  )
}
