import type { Metadata } from "next"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { FavoritesList } from "@/components/favorites-list"

export const metadata: Metadata = {
  title: "Обране — 5 Карат",
  robots: { index: false, follow: true },
}

export default function FavoritesPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-site min-h-[60vh] pt-8 pb-20 lg:pb-28">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Обране" }]} />
        <h1 className="type-h1 mt-8 lg:mt-12">Обране</h1>
        <p className="type-body mt-4 max-w-xl text-muted-foreground">
          Вироби, які ви зберегли. Список зберігається в цьому браузері.
        </p>
        <div className="mt-12 lg:mt-16">
          <FavoritesList
            emptyAction={
              <Link href="/catalog" className="link-inline text-foreground">
                Перейти до каталогу
              </Link>
            }
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
