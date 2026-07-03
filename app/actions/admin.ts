"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { runTelegramImport } from "@/lib/telegram/import"
import type { OrderStatus, ProductCategory, ProductStatus } from "@/lib/types"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Не авторизовано")
  return user
}

export interface ProductFormValues {
  id?: string
  title: string
  description: string
  price: number | null
  category: ProductCategory
  metal: string | null
  sample: string | null
  weight: number | null
  item_type: string | null
  status: ProductStatus
  is_published: boolean
  images: string[]
}

export async function saveProduct(values: ProductFormValues) {
  await requireAdmin()
  const supabase = createAdminClient()

  const payload = {
    title: values.title.trim(),
    description: values.description ?? "",
    price: values.price,
    category: values.category,
    metal: values.metal || null,
    sample: values.sample || null,
    weight: values.weight,
    item_type: values.item_type || null,
    status: values.status,
    is_published: values.is_published,
    images: values.images ?? [],
  }

  if (!payload.title) return { ok: false, error: "Вкажіть назву товару" }

  if (values.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", values.id)
    if (error) return { ok: false, error: error.message }
  } else {
    const { error } = await supabase.from("products").insert(payload)
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/catalog")
  return { ok: true }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/admin")
  revalidatePath("/catalog")
  return { ok: true }
}

export async function setProductStatus(id: string, status: ProductStatus) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from("products").update({ status }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/admin")
  revalidatePath("/catalog")
  return { ok: true }
}

export async function toggleProductPublished(id: string, is_published: boolean) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from("products").update({ is_published }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/admin")
  revalidatePath("/catalog")
  return { ok: true }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin()
  const supabase = createAdminClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/admin")
  return { ok: true }
}

export async function triggerImport() {
  await requireAdmin()
  try {
    const summary = await runTelegramImport()
    revalidatePath("/admin")
    revalidatePath("/catalog")
    return { ok: true, summary }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin()
  const file = formData.get("file") as File | null
  if (!file) return { ok: false, error: "Файл не знайдено" }

  const supabase = createAdminClient()
  const ext = file.name.split(".").pop() || "jpg"
  const path = `manual/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabase.storage.from("product-images").upload(path, arrayBuffer, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  })
  if (error) return { ok: false, error: error.message }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}
