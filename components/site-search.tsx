"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

/** Пошук за назвою: веде в каталог з параметром q, який каталог уже підтримує. */
export function SiteSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Пошук" />}>
        <Search aria-hidden="true" className="size-5" />
      </DialogTrigger>
      <DialogContent className="top-24 -translate-y-0 sm:max-w-xl">
        <DialogTitle>Пошук за назвою</DialogTitle>
        <DialogDescription className="sr-only">Введіть назву виробу та натисніть Enter</DialogDescription>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            const q = String(new FormData(event.currentTarget).get("q") ?? "").trim()
            setOpen(false)
            router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog")
          }}
          className="flex gap-3"
        >
          <label htmlFor="site-search-q" className="sr-only">
            Назва виробу
          </label>
          <Input id="site-search-q" name="q" type="search" autoFocus placeholder="Наприклад: каблучка" />
          <Button type="submit" className="shrink-0">
            Шукати
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
