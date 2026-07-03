import { Phone, Send, MessageCircle, MapPin, Clock } from 'lucide-react'

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
              href="tel:+380441234567"
              className="flex items-center gap-4 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Телефон</span>
                <span className="text-lg font-semibold">+380 (44) 123-45-67</span>
              </span>
            </a>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://t.me/k5karat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground transition-colors hover:border-primary/50"
              >
                <Send className="size-6 text-primary" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
              <a
                href="https://wa.me/380441234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground transition-colors hover:border-primary/50"
              >
                <MessageCircle className="size-6 text-primary" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <MapPin className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Адреса</span>
                <span className="font-semibold">
                  м. Київ, вул. Хрещатик, 1
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  Щодня 09:00 — 20:00
                </span>
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/15">
            <iframe
              title="Карта розташування 5 Карат"
              src="https://www.google.com/maps?q=Khreshchatyk+1+Kyiv&output=embed"
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
