'use server'

export type LeadResult = { ok: boolean; message: string }

export async function submitLead(data: {
  phone: string
  category?: string
  description?: string
  source: string
}): Promise<LeadResult> {
  // Basic server-side validation
  const phone = (data.phone || '').trim()
  const digits = phone.replace(/\D/g, '')

  if (digits.length < 9) {
    return {
      ok: false,
      message: 'Будь ласка, вкажіть коректний номер телефону.',
    }
  }

  // In a real deployment this would send the lead to a CRM / Telegram bot / email.
  console.log('[v0] New lead received:', {
    phone,
    category: data.category ?? '—',
    description: data.description ?? '—',
    source: data.source,
  })

  // Simulate small processing delay
  await new Promise((r) => setTimeout(r, 600))

  return {
    ok: true,
    message: 'Дякуємо! Наш спеціаліст зателефонує вам протягом кількох хвилин.',
  }
}
