"use client"

import { useActionState } from "react"
import { Gem, Loader2 } from "lucide-react"
import { signInAdmin } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAdmin, null)

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-primary">
            <Gem className="size-6" />
          </span>
          <h1 className="font-serif text-2xl font-semibold">Адмін-панель 5 Карат</h1>
          <p className="text-sm text-muted-foreground">Увійдіть для керування каталогом</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="admin@5karat.ua" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Увійти
          </Button>
        </form>
      </div>
    </main>
  )
}
