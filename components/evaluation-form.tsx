'use client'

import { useRef, useState } from 'react'
import {
  Crown,
  Coins,
  Gem,
  Smartphone,
  Car,
  Upload,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react'
import { submitLead } from '@/app/actions'

const categories = [
  { id: 'gold', label: 'Золото', icon: Crown },
  { id: 'silver', label: 'Срібло', icon: Coins },
  { id: 'jewelry', label: 'Ювелірні вироби', icon: Gem },
  { id: 'electronics', label: 'Техніка', icon: Smartphone },
  { id: 'vehicles', label: 'Авто / транспорт', icon: Car },
]

export function EvaluationForm() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [photoName, setPhotoName] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoName(file.name)
      setPreview(URL.createObjectURL(file))
    }
  }

  function clearPhoto() {
    setPhotoName('')
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await submitLead({
      phone,
      category: categories.find((c) => c.id === category)?.label,
      description,
      source: 'evaluation-form',
    })
    setStatus(res.ok ? 'done' : 'error')
    setMessage(res.message)
  }

  const totalSteps = 3

  return (
    <section id="evaluation" className="bg-secondary py-16 text-secondary-foreground sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Онлайн-оцінка
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
            Дізнайтеся вартість за 3 кроки
          </h2>
          <p className="mt-4 text-secondary-foreground/70 text-pretty">
            Заповніть форму менш ніж за хвилину — ми передзвонимо з оцінкою.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
          {status === 'done' ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="size-14 text-primary" />
              <h3 className="font-serif text-2xl font-semibold">
                Заявку відправлено!
              </h3>
              <p className="max-w-sm text-muted-foreground">{message}</p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-7 flex items-center gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        step >= i + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </span>
                    {i < totalSteps - 1 && (
                      <span
                        className={`h-0.5 flex-1 rounded-full ${
                          step > i + 1 ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: category */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold">Оберіть категорію</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCategory(c.id)
                          setStep(2)
                        }}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                          category === c.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        <c.icon className="size-7 text-primary" />
                        <span className="text-sm font-medium">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: photo + description */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold">Фото та опис виробу</h3>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="hidden"
                  />

                  {preview ? (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview || '/placeholder.svg'}
                        alt="Прев'ю виробу"
                        className="size-16 rounded-lg object-cover"
                      />
                      <span className="flex-1 truncate text-sm">{photoName}</span>
                      <button
                        type="button"
                        onClick={clearPhoto}
                        aria-label="Видалити фото"
                        className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="mt-4 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/60"
                    >
                      <Upload className="size-7 text-primary" />
                      <span className="text-sm font-medium">
                        Завантажити фото виробу
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG або PNG — необов&apos;язково
                      </span>
                    </button>
                  )}

                  <label
                    htmlFor="eval-desc"
                    className="mt-5 mb-1.5 block text-sm font-medium"
                  >
                    Опис
                  </label>
                  <textarea
                    id="eval-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Проба, вага, стан, бренд…"
                    className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ArrowLeft className="size-4" />
                      Назад
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Далі
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: phone */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold">Ваш контакт</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Передзвонимо протягом кількох хвилин з готовою оцінкою.
                  </p>

                  <label
                    htmlFor="eval-phone"
                    className="mt-5 mb-1.5 block text-sm font-medium"
                  >
                    Номер телефону
                  </label>
                  <input
                    id="eval-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 (__) ___-__-__"
                    className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />

                  {status === 'error' && (
                    <p className="mt-2 text-sm text-destructive">{message}</p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ArrowLeft className="size-4" />
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        'Отримати оцінку'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
