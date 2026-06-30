'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CheckCircle2,
  Loader2,
  Send,
  Clock,
  ShieldCheck,
  Phone,
} from 'lucide-react'
import { submitLead } from '@/app/actions'

export function Hero() {
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await submitLead({
      phone,
      description,
      source: 'hero-quick-form',
    })
    if (res.ok) {
      setStatus('done')
    } else {
      setStatus('error')
    }
    setMessage(res.message)
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-secondary text-secondary-foreground"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-jewelry.png"
          alt=""
          fill
          priority
          className="object-cover object-right opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/40" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary">
            <ShieldCheck className="size-3.5" />
            Офіційний ломбард в Україні
          </span>

          <h1 className="mt-5 font-serif text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-6xl">
            Швидка оцінка та видача грошей за{' '}
            <span className="text-primary">5 хвилин</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary-foreground/75 text-pretty">
            Золото, срібло, техніка та ювелірні вироби — отримайте гроші під
            заставу або купуйте прикраси напряму від виробника.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary-foreground/70">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Гроші за 10–15 хвилин
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Повна конфіденційність
            </span>
          </div>
        </div>

        {/* Quick lead form */}
        <div className="rounded-2xl border border-primary/20 bg-card p-5 text-card-foreground shadow-2xl sm:p-7">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="size-12 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Заявку прийнято</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl font-semibold">
                Отримати оцінку онлайн
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Залиште номер — передзвонимо за кілька хвилин.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label
                    htmlFor="hero-phone"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Номер телефону
                  </label>
                  <input
                    id="hero-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 (__) ___-__-__"
                    className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hero-desc"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Опис виробу{' '}
                    <span className="text-muted-foreground">(необов&apos;язково)</span>
                  </label>
                  <textarea
                    id="hero-desc"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Напр.: золота каблучка 585, 3 г"
                    className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>Отримати оцінку</>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-sm text-destructive">{message}</p>
                )}
              </form>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Send className="size-4 text-primary" />
                  Telegram
                </a>
                <a
                  href="https://wa.me/380441234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Phone className="size-4 text-primary" />
                  WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
