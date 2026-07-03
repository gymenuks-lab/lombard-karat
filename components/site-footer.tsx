import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo-5karat.png"
            alt="5 Карат — ювелірний магазин золота та срібла"
            width={96}
            height={96}
            className="h-12 w-12 rounded-md object-cover"
          />
          <span className="font-serif text-lg font-semibold">5 Карат</span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          Ювелірний магазин: золото та срібло від виробника та перевірені вживані
          вироби. Доставка по всій Україні, гарантія та сертифікати на кожен виріб.
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
