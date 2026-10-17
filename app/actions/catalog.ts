"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

const ID_PATTERN = /^[0-9a-f-]{36}$/i

/**
 * Публічне читання опублікованих товарів за списком id (обране, нещодавно переглянуті).
 * Нічого не записує; повертає лише те, що й так видно в каталозі.
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const safeIds = Array.from(new Set(ids.filter((id) => ID_PATTERN.test(id)))).slice(0, 24)
  if (safeIds.length === 0) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", safeIds)
    .eq("is_published", true)
    .neq("status", "hidden")

  if (error) return []
  const byId = new Map((data as Product[]).map((product) => [product.id, product]))
  return safeIds.flatMap((id) => byId.get(id) ?? [])
}
