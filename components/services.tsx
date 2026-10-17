import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  { title: 'Каблучки', href: '/catalog?type=ring', image: '/images/gold-ring.png', className: 'md:row-span-2' },
  { title: 'Ланцюжки', href: '/catalog?type=chain', image: '/images/gold-chain.png', className: '' },
  { title: 'Сережки', href: '/catalog?type=earrings', image: '/images/silver-earrings.png', className: '' },
  { title: 'Браслети', href: '/catalog?type=bracelet', image: '/images/gold-bracelet.png', className: 'md:col-span-2' },
]

export function Services() {
  return <section id="categories" className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-36"><div className="mx-auto max-w-7xl"><div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Колекції</p><h2 className="mt-4 max-w-xl font-serif text-4xl leading-[.98] sm:text-6xl">Знайдіть своє<br /><i className="font-normal text-primary">поза часом.</i></h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Класичні форми та сучасні силуети, створені для щоденних історій.</p></div><div className="grid auto-rows-[250px] gap-3 md:grid-cols-3 md:auto-rows-[220px]">{categories.map((c) => <Link key={c.title} href={c.href} className={`group relative overflow-hidden bg-muted ${c.className}`}><Image src={c.image} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white"><span className="font-serif text-2xl">{c.title}</span><span className="flex size-9 items-center justify-center border border-white/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"><ArrowUpRight className="size-4" /></span></div></Link>)}</div></div></section>
}
