import { NextResponse, type NextRequest } from "next/server"
import { runTelegramImport } from "@/lib/telegram/import"

export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // allow if not configured (dev)
  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true
  const qp = request.nextUrl.searchParams.get("secret")
  return qp === secret
}

async function handle(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  try {
    const summary = await runTelegramImport()
    return NextResponse.json({ ok: true, ...summary })
  } catch (err) {
    console.log("[v0] telegram-import route error:", (err as Error).message)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
