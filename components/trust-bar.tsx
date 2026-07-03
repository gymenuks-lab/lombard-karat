import {
  Truck,
  BadgeCheck,
  CreditCard,
  RotateCcw,
  Headphones,
} from 'lucide-react'

const items = [
  { icon: Truck, title: 'Доставка по Україні', text: 'Нова Пошта та кур’єр' },
  { icon: BadgeCheck, title: 'Сертифіковані вироби', text: 'Проба та документи' },
  { icon: CreditCard, title: 'Безпечна оплата', text: 'Онлайн або при отриманні' },
  { icon: RotateCcw, title: 'Обмін та повернення', text: 'Протягом 14 днів' },
  { icon: Headphones, title: 'Підтримка щодня', text: 'Консультація 08:00–19:00' },
]

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:px-6 md:grid-cols-5 md:gap-6 md:py-12">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-2 px-2 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
              <item.icon className="size-5" />
            </span>
            <h3 className="text-sm font-semibold leading-tight">{item.title}</h3>
            <p className="text-xs leading-snug text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
