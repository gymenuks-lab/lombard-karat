import { Factory, ShieldCheck, Award, Tags } from 'lucide-react'

const points = [
  {
    icon: Factory,
    title: 'Напряму від виробника',
    text: 'Працюємо без посередників — тому ціни нижчі за ринкові.',
  },
  {
    icon: Award,
    title: 'Гарантована якість',
    text: 'Кожен виріб проходить контроль перед продажем.',
  },
  {
    icon: ShieldCheck,
    title: 'Сертифіковане золото та срібло',
    text: 'Усі вироби супроводжуються документами та пробою.',
  },
  {
    icon: Tags,
    title: 'Прозоре ціноутворення',
    text: 'Вартість за грамом без прихованих націнок.',
  },
]

export function BrandPositioning() {
  return (
    <section className="bg-secondary py-16 text-secondary-foreground sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Чому нам довіряють
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Якість і прозорість на кожному етапі
          </h2>
          <p className="mt-4 max-w-md text-secondary-foreground/70 text-pretty">
            «Карат» — прямий постачальник ювелірних виробів та надійний ломбард з
            багаторічною репутацією. Ми гарантуємо чесну оцінку та якість кожного
            виробу.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-primary/15 bg-card p-5 text-card-foreground"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
