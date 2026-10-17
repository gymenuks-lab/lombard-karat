import Link from "next/link"
import { getProducts } from "@/lib/queries"
import { ProductShowcase } from "@/components/product-showcase"
export async function FeaturedProducts() { const { products: items } = await getProducts({ pageSize: 8, sort: "newest" }); return <section id="store" className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-36"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">В наявності</p><h2 className="mt-4 font-serif text-4xl sm:text-6xl">Обрані прикраси</h2></div><p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Добірка прикрас із золота та срібла.</p></div><ProductShowcase products={items} /></div></section> }
