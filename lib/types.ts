export type ProductCategory = "lombard" | "manufacturer"
export type ProductStatus = "available" | "reserved" | "sold" | "hidden"
export type OrderStatus = "new" | "processing" | "done" | "cancelled"

export interface Product {
  id: string
  title: string
  description: string
  price: number | null
  currency: string
  category: ProductCategory
  metal: string | null
  sample: string | null
  weight: number | null
  item_type: string | null
  images: string[]
  telegram_message_id: number | null
  telegram_post_url: string | null
  status: ProductStatus
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  product_id: string | null
  product_title: string | null
  product_price: number | null
  customer_name: string
  customer_phone: string
  customer_contact: string | null
  comment: string | null
  status: OrderStatus
  created_at: string
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  lombard: "Ломбардна вітрина",
  manufacturer: "Від виробника",
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  available: "В наявності",
  reserved: "Зарезервовано",
  sold: "Продано",
  hidden: "Приховано",
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нове",
  processing: "В обробці",
  done: "Виконано",
  cancelled: "Скасовано",
}

export function formatPrice(price: number | null, currency = "UAH"): string {
  if (price == null) return "Ціну уточнюйте"
  const symbol = currency === "UAH" ? "₴" : currency
  return `${new Intl.NumberFormat("uk-UA").format(price)} ${symbol}`
}
