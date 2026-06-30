import { Crown, Coins, Gem, Smartphone, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Crown,
    title: 'Золото під заставу',
    text: 'Каблучки, ланцюжки, монети та злитки. Висока оцінка за грамом.',
  },
  {
    icon: Coins,
    title: 'Срібло під заставу',
    text: 'Столове срібло, прикраси та вироби 925 проби.',
  },
  {
    icon: Gem,
    title: 'Ювелірні вироби',
    text: 'Вироби з камінням та брендові прикраси за вигідною ціною.',
  },
  {
    icon: Smartphone,
    title: 'Техніка під заставу',
    text: 'Смартфони, ноутбуки, фото- та аудіотехніка відомих марок.',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Послуги ломбарду
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Що ми беремо під заставу
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Чесна оцінка та миттєва видача грошей під будь-яку з категорій.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <a
              key={s.title}
              href="#evaluation"
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <s.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Отримати оцінку
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
