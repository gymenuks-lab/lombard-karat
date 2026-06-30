import { Gem } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
            <Gem className="size-5" />
          </span>
          <span className="font-serif text-lg font-semibold">Ломбард Карат</span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          Золото та срібло під заставу, ювелірні вироби від виробника. Офіційна
          ліцензована діяльність в Україні.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ломбард Карат. Усі права захищено.
        </p>
      </div>
    </footer>
  )
}
