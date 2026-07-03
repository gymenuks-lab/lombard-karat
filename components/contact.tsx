import { Phone, Send, MapPin, Clock } from 'lucide-react'

export function Contact() {
  return (
    <section id="contacts" className="bg-secondary py-16 text-secondary-foreground sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Контакти
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Завітайте або напишіть нам
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <a
              href="tel:+380938205448"
              className="flex items-center gap-4 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Телефон</span>
                <span className="text-lg font-semibold">+380 93 820 54 48</span>
              </span>
            </a>

            <a
              href="https://t.me/k5karat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground transition-colors hover:border-primary/50"
            >
              <Send className="size-6 text-primary" />
              <span className="text-sm font-medium">Telegram</span>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <MapPin className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Адреса</span>
                <span className="font-semibold">
                  м. Одеса, вул. Пантелеймонівська, 122
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Щодня 08:00 — 19:00
                </span>
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/15">
            <iframe
              title="Карта розташування 5 Карат"
              src="https://www.google.com/maps?q=%D0%B2%D1%83%D0%BB.+%D0%9F%D0%B0%D0%BD%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%D0%BC%D0%BE%D0%BD%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+122+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&output=embed"
              className="h-full min-h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
