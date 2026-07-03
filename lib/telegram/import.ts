import { createAdminClient } from "@/lib/supabase/admin"
import { getUpdates, getFileUrl, type TelegramMessage, type TelegramPhotoSize } from "@/lib/telegram/api"
import { parsePost } from "@/lib/telegram/parser"

const OFFSET_KEY = "telegram_update_offset"
const BUCKET = "product-images"

interface ImportSummary {
  processedUpdates: number
  importedProducts: number
  updatedProducts: number
  newOffset: number | null
  errors: string[]
}

async function getOffset(supabase: ReturnType<typeof createAdminClient>): Promise<number> {
  const { data } = await supabase.from("app_settings").select("value").eq("key", OFFSET_KEY).maybeSingle()
  return data?.value ? Number.parseInt(data.value, 10) || 0 : 0
}

async function setOffset(supabase: ReturnType<typeof createAdminClient>, offset: number) {
  await supabase.from("app_settings").upsert({ key: OFFSET_KEY, value: String(offset), updated_at: new Date().toISOString() })
}

function largestPhoto(photos: TelegramPhotoSize[]): TelegramPhotoSize {
  return [...photos].sort((a, b) => b.width * b.height - a.width * a.height)[0]
}

function channelUsername(msg: TelegramMessage): string | null {
  return msg.chat.username ?? null
}

function postUrl(msg: TelegramMessage): string | null {
  const username = channelUsername(msg)
  if (username) return `https://t.me/${username}/${msg.message_id}`
  return null
}

async function uploadPhoto(
  supabase: ReturnType<typeof createAdminClient>,
  fileId: string,
  keyPrefix: string,
): Promise<string | null> {
  try {
    const url = await getFileUrl(fileId)
    const res = await fetch(url)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const path = `${keyPrefix}/${fileId}.jpg`
    const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    })
    if (error) {
      console.log("[v0] uploadPhoto error:", error.message)
      return null
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  } catch (err) {
    console.log("[v0] uploadPhoto exception:", (err as Error).message)
    return null
  }
}

interface GroupedPost {
  anchorMessageId: number
  message: TelegramMessage
  photoFileIds: string[]
  text: string
}

/**
 * Group channel posts. Albums (media groups) arrive as separate posts sharing
 * the same media_group_id; only one carries the caption.
 */
function groupPosts(messages: TelegramMessage[]): GroupedPost[] {
  const byGroup = new Map<string, GroupedPost>()
  const singles: GroupedPost[] = []

  for (const msg of messages) {
    const text = msg.caption ?? msg.text ?? ""
    const photoId = msg.photo && msg.photo.length ? largestPhoto(msg.photo).file_id : null

    if (msg.media_group_id) {
      const existing = byGroup.get(msg.media_group_id)
      if (existing) {
        if (photoId) existing.photoFileIds.push(photoId)
        if (text && !existing.text) existing.text = text
        existing.anchorMessageId = Math.min(existing.anchorMessageId, msg.message_id)
      } else {
        byGroup.set(msg.media_group_id, {
          anchorMessageId: msg.message_id,
          message: msg,
          photoFileIds: photoId ? [photoId] : [],
          text,
        })
      }
    } else {
      singles.push({
        anchorMessageId: msg.message_id,
        message: msg,
        photoFileIds: photoId ? [photoId] : [],
        text,
      })
    }
  }

  return [...byGroup.values(), ...singles]
}

export async function runTelegramImport(): Promise<ImportSummary> {
  const supabase = createAdminClient()
  const summary: ImportSummary = {
    processedUpdates: 0,
    importedProducts: 0,
    updatedProducts: 0,
    newOffset: null,
    errors: [],
  }

  const offset = await getOffset(supabase)
  const updates = await getUpdates(offset)
  summary.processedUpdates = updates.length

  if (updates.length === 0) return summary

  let maxUpdateId = offset
  const messages: TelegramMessage[] = []
  const configuredChannel = process.env.TELEGRAM_CHANNEL_ID?.replace(/^@/, "").toLowerCase()

  for (const update of updates) {
    maxUpdateId = Math.max(maxUpdateId, update.update_id)
    const post = update.channel_post ?? update.edited_channel_post
    if (!post) continue
    // If a specific channel is configured by username, filter to it.
    if (configuredChannel && !/^-?\d+$/.test(configuredChannel)) {
      if ((post.chat.username ?? "").toLowerCase() !== configuredChannel) continue
    }
    messages.push(post)
  }

  const groups = groupPosts(messages)

  for (const group of groups) {
    // Skip posts without any photo (likely announcements)
    if (group.photoFileIds.length === 0 && !group.text) continue

    try {
      const parsed = parsePost(group.text)
      const images: string[] = []
      for (const fileId of group.photoFileIds.slice(0, 8)) {
        const publicUrl = await uploadPhoto(supabase, fileId, String(group.anchorMessageId))
        if (publicUrl) images.push(publicUrl)
      }

      // Skip if no image and no meaningful text
      if (images.length === 0 && parsed.description.trim().length < 5) continue

      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("telegram_message_id", group.anchorMessageId)
        .maybeSingle()

      const payload = {
        title: parsed.title,
        description: parsed.description,
        price: parsed.price,
        category: parsed.category,
        metal: parsed.metal,
        sample: parsed.sample,
        weight: parsed.weight,
        item_type: parsed.item_type,
        images,
        telegram_message_id: group.anchorMessageId,
        telegram_post_url: postUrl(group.message),
      }

      if (existing) {
        // Only refresh editable fields; keep manual admin overrides for status/publish.
        const { error } = await supabase
          .from("products")
          .update({
            title: payload.title,
            description: payload.description,
            price: payload.price,
            category: payload.category,
            metal: payload.metal,
            sample: payload.sample,
            weight: payload.weight,
            item_type: payload.item_type,
            ...(images.length ? { images } : {}),
            telegram_post_url: payload.telegram_post_url,
          })
          .eq("id", existing.id)
        if (error) summary.errors.push(`update ${group.anchorMessageId}: ${error.message}`)
        else summary.updatedProducts++
      } else {
        const { error } = await supabase.from("products").insert(payload)
        if (error) summary.errors.push(`insert ${group.anchorMessageId}: ${error.message}`)
        else summary.importedProducts++
      }
    } catch (err) {
      summary.errors.push(`group ${group.anchorMessageId}: ${(err as Error).message}`)
    }
  }

  const nextOffset = maxUpdateId + 1
  await setOffset(supabase, nextOffset)
  summary.newOffset = nextOffset

  return summary
}
