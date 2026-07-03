"use client"

import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { saveProduct, uploadProductImage, type ProductFormValues } from "@/app/actions/admin"
import { CATEGORY_LABELS, STATUS_LABELS, type Product, type ProductCategory, type ProductStatus } from "@/lib/types"

const emptyForm: ProductFormValues = {
  title: "",
  description: "",
  price: null,
  category: "lombard",
  metal: null,
  sample: null,
  weight: null,
  item_type: null,
  status: "available",
  is_published: true,
  images: [],
}

export function ProductEditDialog({
  open,
  product,
  onOpenChange,
}: {
  open: boolean
  product: Product | null
  onOpenChange: (v: boolean) => void
}) {
  const [form, setForm] = useState<ProductFormValues>(emptyForm)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              id: product.id,
              title: product.title,
              description: product.description ?? "",
              price: product.price,
              category: product.category,
              metal: product.metal,
              sample: product.sample,
              weight: product.weight,
              item_type: product.item_type,
              status: product.status,
              is_published: product.is_published,
              images: product.images ?? [],
            }
          : emptyForm,
      )
    }
  }, [open, product])

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.set("file", file)
      const res = await uploadProductImage(fd)
      if (res.ok && res.url) {
        setForm((f) => ({ ...f, images: [...f.images, res.url as string] }))
      } else {
        toast.error(res.error ?? "Не вдалося завантажити фото")
      }
    }
    setUploading(false)
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveProduct(form)
      if (res.ok) {
        toast.success(form.id ? "Товар оновлено" : "Товар додано")
        onOpenChange(false)
      } else {
        toast.error(res.error ?? "Помилка збереження")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{form.id ? "Редагувати товар" : "Новий товар"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Images */}
          <div className="flex flex-col gap-2">
            <Label>Фотографії</Label>
            <div className="flex flex-wrap gap-2">
              {form.images.map((img, i) => (
                <div key={img + i} className="relative size-20 overflow-hidden rounded-lg border border-border">
                  <Image src={img || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => update("images", form.images.filter((_, idx) => idx !== i))}
                    className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5"
                    aria-label="Видалити фото"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
                {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                <span className="text-[10px]">Додати</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Назва *</Label>
            <Input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Ціна (₴)</Label>
              <Input
                id="price"
                type="number"
                value={form.price ?? ""}
                onChange={(e) => update("price", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Категорія</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value as ProductCategory)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="metal">Метал</Label>
              <Input id="metal" value={form.metal ?? ""} onChange={(e) => update("metal", e.target.value || null)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="item_type">Тип виробу</Label>
              <Input
                id="item_type"
                value={form.item_type ?? ""}
                onChange={(e) => update("item_type", e.target.value || null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sample">Проба</Label>
              <Input id="sample" value={form.sample ?? ""} onChange={(e) => update("sample", e.target.value || null)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Вага (г)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={form.weight ?? ""}
                onChange={(e) => update("weight", e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as ProductStatus)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {(Object.keys(STATUS_LABELS) as ProductStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input
                id="is_published"
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => update("is_published", e.target.checked)}
                className="size-4"
              />
              <Label htmlFor="is_published">Опубліковано на сайті</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={isPending || uploading}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
