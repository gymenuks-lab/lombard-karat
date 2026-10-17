"use client"

import { useState, useTransition } from "react"
import { ShoppingBag, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOrder } from "@/app/actions/orders"
import { demoMode } from "@/lib/site-config"
import { formatPrice, type Product } from "@/lib/types"

interface OrderButtonProps {
  product: Product
  size?: "sm" | "default" | "lg"
  className?: string
  disabled?: boolean
  fullWidth?: boolean
}

export function OrderButton({ product, size = "default", className, disabled, fullWidth }: OrderButtonProps) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [isDemoResult, setIsDemoResult] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createOrder({
        productId: product.id,
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        contact: String(formData.get("contact") || ""),
        comment: String(formData.get("comment") || ""),
      })
      if (result.ok) {
        setIsDemoResult(Boolean(result.demo))
        setDone(true)
      } else {
        setError(result.error ?? "Сталася помилка")
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setDone(false)
          setError(null)
        }
      }}
    >
      <DialogTrigger
        render={<Button size={size} disabled={disabled} className={`${fullWidth ? "w-full" : ""} ${className ?? ""}`} />}
      >
        <ShoppingBag className="size-4" />
        {disabled ? "Продано" : "Замовити"}
      </DialogTrigger>
      <DialogContent>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <DialogTitle className="font-serif text-xl">
              {isDemoResult ? "Демонстраційний режим" : "Замовлення прийнято!"}
            </DialogTitle>
            <DialogDescription>
              {isDemoResult
                ? "Це портфоліо-проєкт: заявку не збережено й нікому не надіслано. У бойовому режимі тут з’являється підтвердження."
                : "Дякуємо. Наш менеджер зв'яжеться з вами найближчим часом для підтвердження."}
            </DialogDescription>
            <Button className="mt-2" onClick={() => setOpen(false)}>
              Готово
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Оформлення замовлення</DialogTitle>
              <DialogDescription>
                {product.title} — {formatPrice(product.price, product.currency)}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Ваше ім&apos;я *</Label>
                <Input id="name" name="name" required placeholder="Олександр" autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  placeholder="+380 67 123 45 67"
                  autoComplete="tel"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact">Telegram / Viber (необов&apos;язково)</Label>
                <Input id="contact" name="contact" placeholder="@username" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="comment">Коментар (необов&apos;язково)</Label>
                <Textarea id="comment" name="comment" rows={2} placeholder="Побажання до замовлення" />
              </div>
              {demoMode && (
                <p className="type-caption text-muted-foreground">
                  Демонстраційна форма: введені дані нікуди не надсилаються.
                </p>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <ShoppingBag className="size-4" />}
                  Підтвердити замовлення
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
