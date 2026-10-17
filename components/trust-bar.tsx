const items = [
  { title: "Доставка по Україні", text: "Нова Пошта та кур’єр" },
  { title: "Сертифіковані вироби", text: "Проба та документи" },
  { title: "Підтримка щодня", text: "Консультація 08:00–19:00" },
]

export function TrustBar() {
  return (
    <section aria-label="Переваги магазину" className="border-b border-border bg-background">
      <ul className="container-site grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <li key={item.title} className="py-7 sm:px-8 sm:py-9 sm:first:pl-0 sm:last:pr-0">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="type-body-sm mt-1.5 text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
