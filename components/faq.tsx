'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Як швидко я отримаю гроші?',
    a: 'Після оцінки виробу гроші видаємо готівкою за 10–15 хвилин. Заявку онлайн опрацьовуємо протягом кількох хвилин.',
  },
  {
    q: 'Які документи потрібні?',
    a: 'Достатньо лише паспорта або ID-картки та ідентифікаційного коду. Більше нічого не потрібно.',
  },
  {
    q: 'Чи можу я викупити виріб раніше?',
    a: 'Так, ви можете викупити виріб у будь-який момент до завершення строку — відсотки нараховуються лише за фактичні дні.',
  },
  {
    q: 'Що буде, якщо я не поверну гроші?',
    a: 'Ви можете продовжити заставу, сплативши відсотки. Якщо строк завершився — виріб реалізується, додаткових боргів не виникає.',
  },
  {
    q: 'Чи справжні ювелірні вироби в магазині?',
    a: 'Так. Усі вироби сертифіковані, мають пробу та супровідні документи від виробника.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Часті питання
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Відповіді на головне
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium">{item.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-primary transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
