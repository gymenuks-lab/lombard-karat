import { createClient } from "@/lib/supabase/server"
import type { Product, ProductCategory, ProductVariant } from "@/lib/types"

export interface ProductFilters {
  category?: ProductCategory
  metal?: string
  itemType?: string
  sample?: string
  priceMin?: number
  priceMax?: number
  availableOnly?: boolean
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
  if (filters.sample) query = query.eq("sample", filters.sample)
  if (filters.priceMin != null) query = query.gte("price", filters.priceMin)
  if (filters.priceMax != null) query = query.lte("price", filters.priceMax)
  if (filters.availableOnly) query = query.eq("status", "available")
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

export async function getFilterOptions(): Promise<{ metals: string[]; itemTypes: string[]; samples: string[] }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("metal, item_type, sample")
    .eq("is_published", true)
    .neq("status", "hidden")

  const metals = new Set<string>()
  const itemTypes = new Set<string>()
  const samples = new Set<string>()
  for (const row of data ?? []) {
    if (row.metal) metals.add(row.metal)
    if (row.item_type) itemTypes.add(row.item_type)
    if (row.sample) samples.add(row.sample)
  }
  return {
    metals: Array.from(metals).sort(),
    itemTypes: Array.from(itemTypes).sort(),
    samples: Array.from(samples).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)),
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await getProducts({ pageSize: limit, sort: "newest" })
  return products
}

export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("size", { ascending: true })

  if (error) {
    console.log("[v0] getProductVariants error:", error.message)
    return []
  }
  return (data ?? []) as ProductVariant[]
}
