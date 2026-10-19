import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Адмінка — 5 Карат",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
