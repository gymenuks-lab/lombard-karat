import { Clock, MapPin, Phone, Send } from "lucide-react"

import Link from "next/link"

import { contacts } from "@/lib/site-config"

const MAP_SRC =
  "https://www.google.com/maps?q=%D0%B2%D1%83%D0%BB.+%D0%9F%D0%B0%D0%BD%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%D0%BC%D0%BE%D0%BD%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+122+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0&output=embed"

const rowClass = "flex items-start gap-5 border-b border-border py-6"
const iconClass = "mt-1 size-5 shrink-0 text-gold-700"

export function Contact() {
  if (!contacts) return <DemoContact />
  return (
    <section id="contacts" className="section-y bg-muted">
      <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <p className="type-eyebrow">Контакти</p>
          <h2 className="type-h2 mt-4">Завітайте або напишіть нам</h2>

          <div className="mt-10 border-t border-border">
            <a href={contacts.phone.href} className={`${rowClass} group`}>
              <Phone aria-hidden="true" strokeWidth={1.5} className={iconClass} />
              <span>
                <span className="type-caption block text-muted-foreground">Телефон</span>
                <span className="mt-1 block text-lg font-medium underline-offset-4 group-hover:underline">{contacts.phone.display}</span>
              </span>
            </a>

            <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className={`${rowClass} group`}>
              <Send aria-hidden="true" strokeWidth={1.5} className={iconClass} />
              <span>
                <span className="type-caption block text-muted-foreground">Telegram</span>
                <span className="mt-1 block text-lg font-medium underline-offset-4 group-hover:underline">{contacts.telegram.handle}</span>
              </span>
            </a>

            <div className={rowClass}>
              <MapPin aria-hidden="true" strokeWidth={1.5} className={iconClass} />
              <span>
                <span className="type-caption block text-muted-foreground">Адреса</span>
                <span className="mt-1 block text-lg font-medium">{contacts.address}</span>
                <span className="type-body-sm mt-2 flex items-center gap-2 text-muted-foreground">
                  <Clock aria-hidden="true" className="size-4" />
                  {contacts.hours}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-80 overflow-hidden bg-ivory-200 lg:min-h-full">
          <iframe
            title="Карта розташування 5 Карат"
            src={MAP_SRC}
            className="h-full min-h-80 w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

/** Demo-режим: реальні контакти й карта не показуються. */
function DemoContact() {
  return (
    <section id="contacts" className="section-y bg-muted">
      <div className="container-site max-w-3xl">
        <p className="type-eyebrow">Контакти</p>
        <h2 className="type-h2 mt-4">Демонстраційний проєкт</h2>
        <p className="type-body mt-6 text-pretty text-muted-foreground">
          Це портфоліо-версія інтернет-магазину. Контактні дані, адреса та форма замовлення тут не активні: заявки не
          зберігаються й нікуди не надсилаються.
        </p>
        <Link href="/catalog" className="link-inline type-body-sm mt-8 inline-block font-medium">
          Перейти до каталогу
        </Link>
      </div>
    </section>
  )
}
