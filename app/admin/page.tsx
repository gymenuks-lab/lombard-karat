import { createAdminClient } from "@/lib/supabase/admin"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Order, Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = createAdminClient()

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500),
  ])

  const products = (productsRes.data ?? []) as Product[]
  const orders = (ordersRes.data ?? []) as Order[]

  return <AdminDashboard initialProducts={products} initialOrders={orders} />
}
