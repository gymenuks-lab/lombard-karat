import Link from 'next/link'
import {
  Gem,
  LinkIcon,
  Sparkles,
  CircleDot,
  Diamond,
  Layers,
  Droplet,
  Circle,
  Watch,
  ArrowRight,
} from 'lucide-react'

const categories = [
  {
    icon: Gem,
    title: 'Каблучки',
    text: 'Обручки, заручини та каблучки з камінням.',
    href: '/catalog?type=ring',
  },
  {
    icon: LinkIcon,
    title: 'Ланцюжки',
    text: 'Золоті та срібні ланцюжки різного плетіння.',
    href: '/catalog?type=chain',
  },
  {
    icon: Sparkles,
    title: 'Сережки',
    text: 'Пусети, кільця та підвіски для будь-якого образу.',
    href: '/catalog?type=earrings',
  },
  {
    icon: CircleDot,
    title: 'Браслети',
    text: 'Вишукані браслети із золота та срібла 925 проби.',
    href: '/catalog?type=bracelet',
  },
  {
    icon: Diamond,
    title: 'Кольє',
    text: 'Елегантні кольє із золота та срібла для особливих подій.',
    href: '/catalog?type=necklace',
  },
  {
    icon: Layers,
    title: 'Комплекти',
    text: 'Гармонійні ювелірні набори в єдиному стилі.',
    href: '/catalog?type=set',
  },
  {
    icon: Droplet,
    title: 'Кулони',
    text: 'Підвіски та кулони на будь-який смак.',
    href: '/catalog?type=pendant',
  },
  {
    icon: Circle,
    title: 'Пірсинг',
    text: 'Прикраси для пірсингу із золота та медичної сталі.',
    href: '/catalog?type=piercing',
  },
  {
    icon: Watch,
    title: 'Годинники',
    text: 'Наручні годинники та аксесуари відомих брендів.',
    href: '/catalog?type=watch',
  },
]

export function Services() {
  return (
    <section id="categories" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Категорії
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Оберіть свої прикраси
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Золото та срібло на будь-який смак — нові вироби від виробника та
            перевірені вживані прикраси.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {c.text}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Дивитися товари
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
