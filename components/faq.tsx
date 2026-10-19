"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { faqItems as faqs } from "@/lib/copy"
import { cn } from "@/lib/utils"

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-y bg-background">
      <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <p className="type-eyebrow">Часті питання</p>
          <h2 className="type-h2 mt-4">Відповіді на головне</h2>
        </div>

        <div className="border-t border-border">
          {faqs.map((item, index) => {
            const isOpen = open === index
            return (
              <div key={item.q} className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium"
                  >
                    {item.q}
                    <Plus
                      aria-hidden="true"
                      className={cn("size-5 shrink-0 text-muted-foreground transition-transform duration-250 ease-luxe", isOpen && "rotate-45")}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  className={cn("grid transition-[grid-template-rows] duration-250 ease-luxe", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="type-body-sm max-w-xl pb-6 text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
