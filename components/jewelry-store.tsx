'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

type Product = {
  name: string
  image: string
  material: 'Золото' | 'Срібло'
  weight: string
  price: string
}

const products: Product[] = [
  {
    name: 'Каблучка класична',
    image: '/images/gold-ring.png',
    material: 'Золото',
    weight: '2.4 г',
    price: '8 900 ₴',
  },
  {
    name: 'Ланцюжок плетіння «Бісмарк»',
    image: '/images/gold-chain.png',
    material: 'Золото',
    weight: '6.1 г',
    price: '22 400 ₴',
  },
  {
    name: 'Браслет жіночий',
    image: '/images/gold-bracelet.png',
    material: 'Золото',
    weight: '4.8 г',
    price: '17 600 ₴',
  },
  {
    name: 'Каблучка срібна',
    image: '/images/silver-ring.png',
    material: 'Срібло',
    weight: '3.2 г',
    price: '1 250 ₴',
  },
  {
    name: 'Сережки срібні',
    image: '/images/silver-earrings.png',
    material: 'Срібло',
    weight: '2.7 г',
    price: '1 480 ₴',
  },
  {
    name: 'Ланцюжок срібний',
    image: '/images/silver-chain.png',
    material: 'Срібло',
    weight: '5.5 г',
    price: '2 100 ₴',
  },
]

export function JewelryStore() {
  return (
    <section id="store" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Ювелірний магазин
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Нові ювелірні вироби від виробника
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Золоті та срібні прикраси напряму від виробника за чесними цінами.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={p.image || '/placeholder.svg'}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {p.material}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Вага: {p.weight}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {p.price}
                  </span>
                  <a
                    href="#contacts"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ShoppingBag className="size-4" />
                    Купити
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
