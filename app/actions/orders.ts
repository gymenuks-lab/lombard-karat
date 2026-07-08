"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { sendMessage } from "@/lib/telegram/api"
import { formatPrice } from "@/lib/types"

export interface OrderInput {
  productId: string
  name: string
  phone: string
  contact?: string
  comment?: string
  variantId?: string
  size?: string
}

export interface OrderResult {
  ok: boolean
  error?: string
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 9 && digits.length <= 15
}

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const name = input.name?.trim()
  const phone = input.phone?.trim()

  if (!name || name.length < 2) return { ok: false, error: "Вкажіть ваше ім'я" }
  if (!phone || !isValidPhone(phone)) return { ok: false, error: "Вкажіть коректний номер телефону" }

  const supabase = createAdminClient()

  // Fetch product snapshot
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, price, currency, category, status, telegram_post_url")
    .eq("id", input.productId)
    .maybeSingle()

  if (productError || !product) {
    console.log("[v0] createOrder: product not found", productError?.message)
    return { ok: false, error: "Товар не знайдено" }
  }

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      product_id: product.id,
      product_title: product.title,
      product_price: product.price,
      customer_name: name,
      customer_phone: phone,
      customer_contact: input.contact?.trim() || null,
      comment: input.comment?.trim() || null,
    })
    .select("id")
    .single()

  if (insertError) {
    console.log("[v0] createOrder insert error:", insertError.message)
    return { ok: false, error: "Не вдалося оформити замовлення. Спробуйте ще раз." }
  }

  // Notify Telegram bot (best-effort, non-blocking for the user)
  try {
    const chatId = process.env.TELEGRAM_ORDER_CHAT_ID
    if (chatId) {
      const lines = [
        "🛒 <b>Нове замовлення — 5 Карат</b>",
        "",
        `<b>Товар:</b> ${escapeHtml(product.title)}`,
        `<b>Ціна:</b> ${formatPrice(product.price, product.currency)}`,
        `<b>Ім'я:</b> ${escapeHtml(name)}`,
        `<b>Телефон:</b> ${escapeHtml(phone)}`,
      ]
      if (input.contact?.trim()) lines.push(`<b>Контакт:</b> ${escapeHtml(input.contact.trim())}`)
      if (input.comment?.trim()) lines.push(`<b>Коментар:</b> ${escapeHtml(input.comment.trim())}`)
      if (product.telegram_post_url) lines.push(`<b>Пост:</b> ${product.telegram_post_url}`)
      lines.push("", `<i>№ ${order.id}</i>`)
      await sendMessage(chatId, lines.join("\n"))
    }
  } catch (err) {
    console.log("[v0] createOrder telegram notify error:", (err as Error).message)
  }

  return { ok: true }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
