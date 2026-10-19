import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { TrustBar } from '@/components/trust-bar'
import { Categories } from '@/components/categories'
import { FeaturedProducts } from '@/components/featured-products'
import { BrandPositioning } from '@/components/brand-positioning'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <FeaturedProducts />
        <BrandPositioning />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
