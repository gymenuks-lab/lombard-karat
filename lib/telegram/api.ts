const TELEGRAM_API = "https://api.telegram.org"

function botToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set")
  return token
}

async function callTelegram<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${TELEGRAM_API}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description ?? res.status}`)
  }
  return data.result as T
}

/** Send a plain-text message to a chat (used for order notifications). */
export async function sendMessage(chatId: string, text: string) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  })
}

export interface TelegramUpdate {
  update_id: number
  channel_post?: TelegramMessage
  edited_channel_post?: TelegramMessage
}

export interface TelegramPhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
}

export interface TelegramMessage {
  message_id: number
  media_group_id?: string
  date: number
  chat: { id: number; username?: string; title?: string }
  text?: string
  caption?: string
  photo?: TelegramPhotoSize[]
}

/** Poll updates via long-ish polling. Returns channel posts only. */
export async function getUpdates(offset: number): Promise<TelegramUpdate[]> {
  return callTelegram<TelegramUpdate[]>("getUpdates", {
    offset,
    timeout: 0,
    allowed_updates: ["channel_post", "edited_channel_post"],
    limit: 100,
  })
}

/** Resolve a Telegram file_id to a temporary download URL. */
export async function getFileUrl(fileId: string): Promise<string> {
  const file = await callTelegram<{ file_path: string }>("getFile", { file_id: fileId })
  return `${TELEGRAM_API}/file/bot${botToken()}/${file.file_path}`
}
