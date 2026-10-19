/**
 * Базовый адрес сайта для canonical, sitemap и Open Graph.
 * Задаётся переменной NEXT_PUBLIC_SITE_URL; на Vercel используется адрес production-деплоя.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}
