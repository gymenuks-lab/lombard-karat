"use client"

import Image from "next/image"
import { useState } from "react"

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const list = images.length > 0 ? images : ["/placeholder.svg?height=800&width=800"]
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={list[active] || "/placeholder.svg"}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {list.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative size-16 overflow-hidden rounded-lg border-2 transition-colors sm:size-20 ${
                active === i ? "border-primary" : "border-border"
              }`}
              aria-label={`Фото ${i + 1}`}
            >
              <Image src={img || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
