import type { ProductCategory } from "@/lib/types"

// Keywords that strongly indicate a "від виробника" (new / from manufacturer) item.
const MANUFACTURER_KEYWORDS = [
  "від виробника",
  "от производителя",
  "нове",
  "новое",
  "новий",
  "новый",
  "виробник",
  "производитель",
  "завод",
  "фабрик",
  "новинка",
  "колекція",
  "коллекция",
]

// Keywords that indicate a "ломбард" (pledged / second-hand) item.
const LOMBARD_KEYWORDS = [
  "ломбард",
  "застав",
  "залог",
  "б/у",
  "б.у",
  "бу ",
  "вживан",
  "бывш",
  "викуп",
  "выкуп",
  "невикуплен",
  "невыкуплен",
]

/**
 * Rule-based classification of a product into "lombard" or "manufacturer".
 * Defaults to "lombard" when nothing matches, since the channel is primarily a lombard.
 */
export function classifyCategory(text: string): ProductCategory {
  const t = (text || "").toLowerCase()

  const manufacturerHit = MANUFACTURER_KEYWORDS.some((k) => t.includes(k))
  const lombardHit = LOMBARD_KEYWORDS.some((k) => t.includes(k))

  if (manufacturerHit && !lombardHit) return "manufacturer"
  return "lombard"
}

const METAL_PATTERNS: { re: RegExp; value: string }[] = [
  { re: /(золот|gold|au\b|червоне золото|жовте золото|біле золото)/i, value: "Золото" },
  { re: /(серебр|срібл|silver|ag\b)/i, value: "Срібло" },
  { re: /(платин|platinum)/i, value: "Платина" },
]

const TYPE_PATTERNS: { re: RegExp; value: string }[] = [
  { re: /(каблучк|кольц|перстен|перстень)/i, value: "Каблучка" },
  { re: /(ланцюж|ланцюг|цепочк|цеп\b)/i, value: "Ланцюжок" },
  { re: /(сереж|серьг|пусет)/i, value: "Сережки" },
  { re: /(браслет)/i, value: "Браслет" },
  { re: /(кулон|підвіс|подвес)/i, value: "Кулон" },
  { re: /(хрест|крест)/i, value: "Хрестик" },
  { re: /(годинник|часы)/i, value: "Годинник" },
]

export interface ParsedPost {
  title: string
  description: string
  price: number | null
  metal: string | null
  sample: string | null
  weight: number | null
  item_type: string | null
  category: ProductCategory
}

/**
 * Parse a Telegram post caption/text into structured product fields.
 */
export function parsePost(rawText: string): ParsedPost {
  const text = (rawText || "").trim()
  const lower = text.toLowerCase()

  // Price: look for numbers near грн/₴/uah, or "ціна"/"цена"
  let price: number | null = null
  const priceMatch =
    text.match(/(?:ціна|цена|price|вартість)[^\d]{0,10}([\d\s.,]{2,})/i) ||
    text.match(/([\d][\d\s.,]{2,})\s*(?:грн|₴|uah|грива?н)/i)
  if (priceMatch) {
    const num = priceMatch[1].replace(/[^\d]/g, "")
    if (num) price = Number.parseInt(num, 10)
  }

  // Sample / проба: 585, 750, 925, 583, 375, 999
  let sample: string | null = null
  const sampleMatch = text.match(/\b(375|500|583|585|750|800|875|900|916|925|958|999)\b/)
  if (sampleMatch) sample = sampleMatch[1]

  // Weight in grams
  let weight: number | null = null
  const weightMatch = text.match(/([\d]+[.,]?[\d]*)\s*(?:г\b|гр\b|грам|g\b)/i)
  if (weightMatch) {
    const w = Number.parseFloat(weightMatch[1].replace(",", "."))
    if (!Number.isNaN(w) && w > 0 && w < 100000) weight = w
  }

  const metal = METAL_PATTERNS.find((p) => p.re.test(lower))?.value ?? null
  const item_type = TYPE_PATTERNS.find((p) => p.re.test(lower))?.value ?? null

  // Title: first non-empty line, trimmed to a reasonable length.
  const firstLine =
    text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0) || ""
  let title = firstLine.replace(/[#*_`]/g, "").trim()
  if (title.length > 90) title = title.slice(0, 87).trim() + "…"
  if (!title) {
    title = [item_type, metal].filter(Boolean).join(" ") || "Ювелірний виріб"
  }

  return {
    title,
    description: text,
    price,
    metal,
    sample,
    weight,
    item_type,
    category: classifyCategory(text),
  }
}
