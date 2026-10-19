import Image from "next/image"

import { brandCopy } from "@/lib/copy"

export function BrandPositioning() {
  return (
    <section className="surface-ink">
      <div className="section-y bg-ink-950">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-ink-900 lg:mx-0 lg:max-w-none">
            <Image
              src="/images/web/editorial-ring.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="type-eyebrow text-gold!">{brandCopy.eyebrow}</p>
            <h2 className="type-h2 mt-4 max-w-xl">{brandCopy.title}</h2>
            <p className="type-body mt-6 max-w-xl text-muted-foreground">
              {brandCopy.text}
            </p>

            <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {brandCopy.points.map((point) => (
                <div key={point.title} className="border-t border-border pt-5">
                  <dt className="font-heading text-lg">{point.title}</dt>
                  <dd className="type-body-sm mt-2 text-muted-foreground">{point.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
