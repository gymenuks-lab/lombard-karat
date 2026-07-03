import { Gem } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
            <Gem className="size-5" />
          </span>
          <span className="font-serif text-lg font-semibold">5 Карат</span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          Ювелірний дім: золото та срібло з ломбардної вітрини та нові вироби від
          виробника. Офіційна ліцензована діяльність в Україні.
        </p>
        <a
          href="https://t.me/k5karat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Наш Telegram-канал: @k5karat
        </a>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} 5 Карат. Усі права захищено.
        </p>
      </div>
    </footer>
  )
}
