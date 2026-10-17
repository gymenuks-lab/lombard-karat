import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const categories = [
  { title: 'Каблучки', href: '/catalog?type=ring', image: '/images/gold-ring.png', className: 'md:row-span-2' },
  { title: 'Ланцюжки', href: '/catalog?type=chain', image: '/images/gold-chain.png', className: '' },
  { title: 'Сережки', href: '/catalog?type=earrings', image: '/images/silver-earrings.png', className: '' },
  { title: 'Браслети', href: '/catalog?type=bracelet', image: '/images/gold-bracelet.png', className: 'md:col-span-2' },
]

export function Services() {
  return <section id="categories" className="bg-background px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Reveal className="reveal-soft"><p className="eyebrow">Колекції</p></Reveal><h2 className="mt-4 max-w-xl font-serif text-4xl leading-[.98] sm:text-6xl"><Reveal variant="mask">Знайдіть своє</Reveal><br /><Reveal variant="mask" delay={100}><i className="font-normal text-primary">поза часом.</i></Reveal></h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Класичні форми та сучасні силуети, створені для щоденних історій.</p></div><div className="grid auto-rows-[250px] gap-3 md:grid-cols-3 md:auto-rows-[220px]">{categories.map((c, index) => <Reveal key={c.title} delay={index * 80} className={c.className}><Link href={c.href} className="group relative block h-full overflow-hidden bg-muted"><Image src={c.image} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition-opacity duration-700 group-hover:from-black/75" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white"><span className="font-serif text-2xl transition-transform duration-700 group-hover:-translate-y-1">{c.title}</span><span className="flex size-9 items-center justify-center border border-white/40 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"><ArrowUpRight className="size-4" /></span></div></Link></Reveal>)}</div></div></section>
}
