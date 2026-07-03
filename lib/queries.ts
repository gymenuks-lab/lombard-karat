import { createClient } from "@/lib/supabase/server"
import type { Product, ProductCategory } from "@/lib/types"

export interface ProductFilters {
  category?: ProductCategory
  metal?: string
  itemType?: string
  search?: string
  sort?: "newest" | "price_asc" | "price_desc"
  page?: number
  pageSize?: number
}

export interface ProductListResult {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  const supabase = await createClient()
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = filters.pageSize ?? 12
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .neq("status", "hidden")

  if (filters.category) query = query.eq("category", filters.category)
  if (filters.metal) query = query.eq("metal", filters.metal)
  if (filters.itemType) query = query.eq("item_type", filters.itemType)
  if (filters.search) query = query.ilike("title", `%${filters.search}%`)

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true, nullsFirst: false })
      break
    case "price_desc":
      query = query.order("price", { ascending: false, nullsFirst: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data, count, error } = await query.range(from, to)
  if (error) {
    console.log("[v0] getProducts error:", error.message)
    return { products: [], total: 0, page, pageSize }
  }

  return { products: (data ?? []) as Product[], total: count ?? 0, page, pageSize }
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .neq("status", "hidden")
    .maybeSingle()

  if (error) {
    console.log("[v0] getProductById error:", error.message)
    return null
  }
  return data as Product | null
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .neq("status", "hidden")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return (data ?? []) as Product[]
}

export async function getFilterOptions(): Promise<{ metals: string[]; itemTypes: string[] }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("metal, item_type")
    .eq("is_published", true)
    .neq("status", "hidden")

  const metals = new Set<string>()
  const itemTypes = new Set<string>()
  for (const row of data ?? []) {
    if (row.metal) metals.add(row.metal)
    if (row.item_type) itemTypes.add(row.item_type)
  }
  return {
    metals: Array.from(metals).sort(),
    itemTypes: Array.from(itemTypes).sort(),
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await getProducts({ pageSize: limit, sort: "newest" })
  return products
}
